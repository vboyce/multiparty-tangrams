import Empirica from "meteor/empirica:core";
import {names, avatarNames, nameColor} from './constants.js';
import _ from "lodash";

function addToSchedule(schedule, first, second, numTrials) {
  var newValue1 = _.fromPairs([[
    _.toString(first),
    schedule[first].concat(_.times(numTrials, _.constant(second)))
  ]]);
  _.extend(schedule, newValue1);
}

function addToRoles(roles, player, role, numTrials) {
  var seq = role == 'speaker' ? ['speaker', 'listener'] : ['listener', 'speaker'];
  var newValue1 = _.fromPairs([[
    player.toString(),
    roles[player].concat(..._.times(numTrials/2, _.constant(seq)))
  ]]);
  _.extend(roles, newValue1);
}

function createSchedule(players, numTrialsPerPartner) {
  // Create a schedule for all players to play all others using 'circle' method
  // (en.wikipedia.org/wiki/Round-robin_tournament#Scheduling_algorithm)
  // assert(self.num_players % 2 == 0)
  const l = _.clone(players);
  const schedule = _.zipObject(l, _.times(l.length, _.constant([])));
  const roles = _.zipObject(l, _.times(l.length, _.constant([])));
  const roomAssignments = [];
  _.forEach(_.range(l.length - 1), function(round) {
    const mid = parseInt(l.length / 2);
    const l1 = l.slice(0, mid);
    const l2 = _.reverse(l.slice(mid, l.length));
    const zipped = _.zip(l1, l2);
    roomAssignments.push(..._.times(numTrialsPerPartner, _.constant(zipped)));
    _.forEach(_.range(mid), function(player) {
      addToSchedule(schedule, l1[player], l2[player], numTrialsPerPartner);
      addToSchedule(schedule, l2[player], l1[player], numTrialsPerPartner);
      addToRoles(roles, l1[player], 'speaker', numTrialsPerPartner);
      addToRoles(roles, l2[player], 'listener', numTrialsPerPartner);      
    });
    // rotate around fixed point
    l.splice(1, 0, l.pop());
  });
  return {roomAssignments, schedule, roles};
}

// //// Avatar stuff //////

// onGameStart is triggered opnce per game before the game starts, and before
// the first onRoundStart. It receives the game and list of all the players in
// the game.
Empirica.onGameStart((game) => {
  const players = game.players;
  console.debug("game ", game._id, " started");

  const scheduleObj = createSchedule(_.map(players, '_id'), 4);
  game.set('rooms', scheduleObj.roomAssignments);
  players.forEach((player, i) => {
    player.set("tangramURLs", _.shuffle([
      "/experiment/tangram_A.png",
      "/experiment/tangram_B.png",
      "/experiment/tangram_C.png",
      "/experiment/tangram_D.png"
    ]));
    console.log(scheduleObj);
    player.set("partnerList", scheduleObj.schedule[player._id]);
    player.set("roleList", scheduleObj.roles[player._id]);    
    player.set("name", names[i]);
    player.set("avatar", `/avatars/jdenticon/${avatarNames[i]}`);
    player.set("nameColor", nameColor[i]);
    player.set("cumulativeScore", 0);
    player.set("bonus", 0);
  });
});

// onRoundStart is triggered before each round starts, and before onStageStart.
// It receives the same options as onGameStart, and the round that is starting.
Empirica.onRoundStart((game, round) => {
  const players = game.players;
  round.set("chat", []); 

  players.forEach(player => {
    player.set('partner', player.get('partnerList')[round.index]),
    player.set('role', player.get('roleList')[round.index])
    player.set('clicked', false);
  });
});

// onRoundStart is triggered before each stage starts.
// It receives the same options as onRoundStart, and the stage that is starting.
Empirica.onStageStart((game, round, stage) => {
  const players = game.players;
  console.debug("Round ", stage.name, "game", game._id, " started");
  stage.set("log", [
    {
      verb: stage.name + "Started",
      roundId: stage.name,
      at: new Date(),
    },
  ]);
});

// onStageEnd is triggered after each stage.
// It receives the same options as onRoundEnd, and the stage that just ended.
Empirica.onStageEnd((game, round, stage) => {});

// onRoundEnd is triggered after each round.
Empirica.onRoundEnd((game, round) => {
  const players = game.players;
  const rooms = game.get('rooms');
  
  // Update player scores
  const correctAnswer = round.get("task").target;
  players.forEach(player => {
    const selectedAnswer = player.get("clicked");
    const currScore = player.get("cumulativeScore") || 0;
    const scoreIncrement = selectedAnswer == correctAnswer ? 0.02 : 0;
    player.set("cumulativeScore", scoreIncrement + currScore);
  });

  // Save outcomes as property of round for later export/analysis
  rooms[round.index].forEach((room, i) => {
    const player1 = game.players.find(p => p._id == room[0]);
    const roomPacket = {
      room_num: i,
      room_members: room,
      room_clicked: player1.get('clicked'),
      room_correct: player1.get('clicked') == correctAnswer
    };
    round.set('room' + i, roomPacket);
  });
});

// onRoundEnd is triggered when the game ends.
// It receives the same options as onGameStart.
Empirica.onGameEnd((game) => {
  const players = game.players;
  console.debug("The game", game._id, "has ended");
  //computing the bonus for everyone (in this game, everyone will get the same value)
  const conversionRate = game.treatment.conversionRate
    ? game.treatment.conversionRate
    : 1;

  const optimalSolutionBonus = game.treatment.optimalSolutionBonus
    ? game.treatment.optimalSolutionBonus
    : 0;

  const bonus =
    game.get("cumulativeScore") > 0
      ? (
          game.get("cumulativeScore") * conversionRate +
          game.get("nOptimalSolutions") * optimalSolutionBonus
        ).toFixed(2)
      : 0;

  players.forEach((player) => {
    if (player.get("bonus") === 0) {
      //if we never computed their bonus
      player.set("bonus", bonus);
      player.set("cumulativeScore", game.get("cumulativeScore"));
    }
  });
});

// ===========================================================================
// => onSet, onAppend and onChanged ==========================================
// ===========================================================================

// onSet, onAppend and onChanged are called on every single update made by all
// players in each game, so they can rapidly become quite expensive and have
// the potential to slow down the app. Use wisely.
//
// It is very useful to be able to react to each update a user makes. Try
// nontheless to limit the amount of computations and database saves (.set)
// done in these callbacks. You can also try to limit the amount of calls to
// set() and append() you make (avoid calling them on a continuous drag of a
// slider for example) and inside these callbacks use the `key` argument at the
// very beginning of the callback to filter out which keys your need to run
// logic against.
//
// If you are not using these callbacks, comment them out so the system does
// not call them for nothing.

// // onSet is called when the experiment code call the .set() method
// // on games, rounds, stages, players, playerRounds or playerStages.
Empirica.onSet(
  (
    game,
    round,
    stage,
    player, // Player who made the change
    target, // Object on which the change was made (eg. player.set() => player)
    targetType, // Type of object on which the change was made (eg. player.set() => "player")
    key, // Key of changed value (e.g. player.set("score", 1) => "score")
    value, // New value
    prevValue // Previous value
  ) => {
    // Compute score after player clicks
    if (key === "clicked") {
    }
  }
);

// // onSet is called when the experiment code call the `.append()` method
// // on games, rounds, stages, players, playerRounds or playerStages.
// Empirica.onAppend((
//   game,
//   round,
//   stage,
//   players,
//   player, // Player who made the change
//   target, // Object on which the change was made (eg. player.set() => player)
//   targetType, // Type of object on which the change was made (eg. player.set() => "player")
//   key, // Key of changed value (e.g. player.set("score", 1) => "score")
//   value, // New value
//   prevValue // Previous value
// ) => {
//   // Note: `value` is the single last value (e.g 0.2), while `prevValue` will
//   //       be an array of the previsous valued (e.g. [0.3, 0.4, 0.65]).
// });

// // onChange is called when the experiment code call the `.set()` or the
// // `.append()` method on games, rounds, stages, players, playerRounds or
// // playerStages.
// Empirica.onChange((
//   game,
//   round,
//   stage,
//   players,
//   player, // Player who made the change
//   target, // Object on which the change was made (eg. player.set() => player)
//   targetType, // Type of object on which the change was made (eg. player.set() => "player")
//   key, // Key of changed value (e.g. player.set("score", 1) => "score")
//   value, // New value
//   prevValue, // Previous value
//   isAppend // True if the change was an append, false if it was a set
// ) => {
//   // `onChange` is useful to run server-side logic for any user interaction.
//   // Note the extra isAppend boolean that will allow to differenciate sets and
//   // appends.
// });
