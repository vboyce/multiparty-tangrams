import Empirica from "meteor/empirica:core";

import "./callbacks.js";
import "./bots.js";
import { targets } from "./constants";
import _ from "lodash";

function addToSchedule(schedule, first, second, info) {
  var newValue1 = _.fromPairs([[
    _.toString(first),
    schedule[first].concat(_.times(info.numTrialsPerPartner, _.constant(second)))
  ]]);
  _.extend(schedule, newValue1);
}

function addToRoles(roles, player, role, info) {
  // swap roles every repetition
  var otherRole = role == 'speaker' ? 'listener' : 'speaker';
  var roleBlock = _.times(info.numTrialsPerBlock, _.constant(role));
  var otherRoleBlock = _.times(info.numTrialsPerBlock, _.constant(otherRole))  ;
  var newValue1 = _.fromPairs([[
    player.toString(),
    roles[player].concat(..._.flatten(_.times(
      info.numRepsPerPartner/2,
      _.constant([roleBlock, otherRoleBlock])
    )))
  ]]);
  _.extend(roles, newValue1);
}

function createSchedule(players, info) {
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
    roomAssignments.push(..._.times(info.numTrialsPerPartner, _.constant(zipped)));
    _.forEach(_.range(mid), function(player) {
      addToSchedule(schedule, l1[player], l2[player], info);
      addToSchedule(schedule, l2[player], l1[player], info);
      addToRoles(roles, l1[player], 'speaker', info);
      addToRoles(roles, l2[player], 'listener', info);      
    });
    // rotate around fixed point
    l.splice(1, 0, l.pop());
  });
  return {roomAssignments, schedule, roles};
}

// gameInit is where the structure of a game is defined.
// Just before every game starts, once all the players needed are ready, this
// function is called with the treatment and the list of players.
// You must then add rounds and stages to the game, depending on the treatment

// and the players. You can also get/set initial values on your game, players,
// rounds and stages (with get/set methods), that will be able to use later in
// the game.

// Game object contains
// index (auto-increment assigned to each Game in order),
// treatment (object representing Factors set on this game),
// players (array of player objects participating in this game),
// rounds (rounds composing this Game),
// createdAt (Date type, time at which the game was created approximates time at which the Game was started)

// Round object contains
// index (Object, the 0 based position of the current round in the ordered list of rounds in a game),
// stages (array of Stage objects, contains Stages composing this Round)
// const round = game.addRound();
// round.set('target', 'tangram_A.png');
// Stage object contains
// index (Object, the 0 based position of the current stage in the ordered list of all of the game's stages),
// name (String, programatic name of stage),
// displayName (String, Human name of the stage to be showed players),
// durationInSeconds (Integer, stage duration in seconds)
// startTimeAt (Date, time at which the stage started, only set if stage has already started)

Empirica.gameInit((game, treatment) => {
  console.log(
    "Game with a treatment: ",
    treatment,
    " will start, with workers",
    _.map(game.players, "id")
  );

  const reps = treatment.repetitionsWithPartner;
  const numTargets = targets.length;
  const numPartners = game.players.length - 1;
  const info = {
    numTrialsPerBlock : numTargets,
    numRepsPerPartner : reps,
    numTrialsPerPartner: reps * numTargets
  };
  
  // I use this to play the sound on the UI when the game starts
  game.set("justStarted", true);

  // Make partner schedule for the game
  const scheduleObj = createSchedule(_.map(game.players, '_id'), info);
  const roomIds = _.map(scheduleObj.roomAssignments[0], (room, i) => 'room' + i);
  game.set('rooms', scheduleObj.roomAssignments);
  game.set('schedule', scheduleObj.schedule);
  game.set('roleList', scheduleObj.roles);

  // Sample whether on the blue team or red team
  // TODO: use treatment variable
  game.set("teamColor", treatment.teamColor);
  game.set("team", game.players.length > 1);

  // Loop through trials with partner
  _.times(numPartners, partnerNum => {

    // Loop through repetition blocks
    _.times(reps, repNum => {
      const roomBlock = _.map(game.get('rooms'), room => _.shuffle(targets));

      // Loop through targets in block
      _.times(numTargets, targetNum => {      
        const round = game.addRound();
        const roomTargets = _.map(roomBlock, room => room[targetNum]);
        round.set('task', _.zipObject(roomIds, roomTargets));
        round.set('numTrials', reps * numTargets);
        round.set('trialNum', repNum * reps + targetNum);
        round.set('numPartners', numPartners);
        round.set('partnerNum', partnerNum);
        round.set('repNum', repNum);
        
        // add 'partner swap' slide as first trial w/ new partner
        if(partnerNum > 0 & repNum == 0 & targetNum == 0) {
          round.addStage({
            name: "transition",
            displayName: "Partner Swap!",
            durationInSeconds: 10
          });
        }
        
        round.addStage({
          name: "selection",
          displayName: "Selection",
          durationInSeconds: treatment.selectionDuration
        });
      });
    });
  });
});

