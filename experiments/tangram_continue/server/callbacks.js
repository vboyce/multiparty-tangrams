import Empirica from "meteor/empirica:core";
import {names, avatarNames, nameColors} from './constants.js';
import _ from "lodash";



// onGameStart is triggered opnce per game before the game starts, and before
// the first onRoundStart. It receives the game and list of all the players in
// the game.
Empirica.onGameStart((game) => {
  const players = game.players;
  console.debug("game ", game._id, " started");

  const roleList = game.get('roleList');
  const targets = game.get('context');

  players.forEach((player, i) => {
    player.set("tangramURLs", _.shuffle(targets));
    player.set("roleList", roleList[player._id]);
    player.set("name", names[i]);
    player.set("avatar", `/avatars/jdenticon/${avatarNames[i]}`);
    player.set("nameColor", nameColors[i]);
    player.set("bonus", 0);
  });
  game.set("activePlayerCount", game.players.length)

})

// onRoundStart is triggered before each round starts, and before onStageStart.
// It receives the same options as onGameStart, and the round that is starting.
Empirica.onRoundStart((game, round) => {
  const players = game.players;
  round.set("chat", []); 
  round.set("countCorrect",0);
  round.set('speaker', "")
  round.set('submitted', false);
  round.set("activePlayerCount", game.get("activePlayerCount"));
  const activePlayers=_.reject(game.players, p => p.get("exited"))
  //activePlayers.forEach(player => console.log(player._id));
  const speakerPlayer = _.sample(activePlayers)
  //console.log(speakerPlayer)
  activePlayers.forEach(player => {
    if (player._id==speakerPlayer._id){
      player.set("role", "speaker")
      round.set('speaker', player._id)
    }
    else { player.set("role", "listener")
    }
    player.set('clicked', false);
  });
});

// onRoundStart is triggered before each stage starts.
// It receives the same options as onRoundStart, and the stage that is starting.
Empirica.onStageStart((game, round, stage) => {
  const players = game.players;
  console.debug("Round ", stage.name, "game", game._id, " started");
  const inactivePlayers=_.filter(game.players, p => p.get("exited"))
  inactivePlayers.forEach(player => player.stage.submit())
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
Empirica.onStageEnd((game, round, stage) => {
  if (stage.name=="selection"){
    const players = game.players;
    let numcorrect=0
    players.forEach(player => {
      const currScore = player.get("bonus") || 0;
      if (player.get("role")=="speaker"){
      }
      else{
      const selectedAnswer = player.get("clicked");
      const target = round.get('target');
      const iscorrect=selectedAnswer==target ? 1 : 0
      numcorrect=numcorrect+iscorrect
      }
    })
    round.set("countCorrect",numcorrect)
    // Update player scores
    players.forEach(player => {
      const currScore = player.get("bonus") || 0;
      if (player.get("role")=="speaker"){
      player.set("bonus", round.get("countCorrect")*game.treatment.listenerBonus/(round.get("activePlayerCount")-1)*.01 + currScore);
      }
      else{
      const selectedAnswer = player.get("clicked");
      const target = round.get('target');
      const scoreIncrement = selectedAnswer == target ? game.treatment.listenerBonus*.01 : 0;
      player.set("bonus", scoreIncrement + currScore);
      }
    });
    //Save outcomes as property of round for later export/analysis
    players.forEach(player => {
      const correctAnswer = round.get('target');
      round.set('player_' + player._id + '_response', player.get('clicked'));
      round.set('player_' + player._id+ '_correct', correctAnswer == player.get('clicked')); 
      round.set('player_' + player._id + '_time', player.stage.submittedAt - stage.startTimeAt); 
    });
}
});

// onRoundEnd is triggered after each round.
Empirica.onRoundEnd((game, round) => {
  
});

// onRoundEnd is triggered when the game ends.
// It receives the same options as onGameStart.
Empirica.onGameEnd((game) => {
  console.debug("The game", game._id, "has ended");
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
    player,
    target, // Object on which the change was made (eg. player.set() => player)
    targetType, // Type of object on which the change was made (eg. player.set() => "player")
    key, // Key of changed value (e.g. player.set("score", 1) => "score")
    value, // New value
    prevValue // Previous value
  ) => {
    // Compute score after player clicks
    if (key === "exited") {
      const activePlayers=_.reject(game.players, p => p.get("exited"))
      game.set("activePlayerCount", activePlayers.length);
    if (game.get("activePlayerCount") < 2){
      activePlayers.forEach(player => {
        player.set('exited', true);
        player.exit("Oops, it looks like too many of your partners have disconnected, and you can't finish the experiment!");
      })
    }
    game.players.forEach(player =>player.stage.submit());
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
/*Empirica.onChange((
  game,
  round,
  stage,
  player, // Player who made the change
  target, // Object on which the change was made (eg. player.set() => player)
  targetType, // Type of object on which the change was made (eg. player.set() => "player")
  key, // Key of changed value (e.g. player.set("score", 1) => "score")
  value, // New value
  prevValue, // Previous value
  isAppend // True if the change was an append, false if it was a set
) => {
    // Compute score after player clicks
    const players=game.players
    //onsole.log("here "+typeof(new Date()))
    players.forEach(player => {
      const foo=new Date()
      //console.log (foo-new Date(player.get("lastSeen")))
      //console.log(new Date()-player.get("lastSeen"))
      //console.log(player.get("lastSeen"))
      //console.log(new Date(player.get("lastSeen")))
      const offline = (new Date() - new Date(player.get("lastSeen"))) > 15000
      if(offline) {
        //player.set('exited', true);
        //player.exit("Oops, it looks like there was a connection problem, and you couldn't finish the experiment!")
        console.log("someone left")
      } 
      })
//   // `onChange` is useful to run server-side logic for any user interaction.
//   // Note the extra isAppend boolean that will allow to differenciate sets and
//   // appends.
 });*/
