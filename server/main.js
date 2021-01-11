import Empirica from "meteor/empirica:core";

import "./callbacks.js";
import "./bots.js";
import { taskData } from "./constants";

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
    _.pluck(game.players, "id")
  );

  // I use this to play the sound on the UI when the game starts
  game.set("justStarted", true);

  // Sample whether on the blue team or red team
  // TODO: use treatment variable
  game.set("teamColor", treatment.teamColor);
  game.set("team", game.players.length > 1);

  _.times(game.players.length - 1, partnerNum => {

    // Loop through trials with partner
    _.times(4, trialNum => {
      const round = game.addRound();
      round.set("task", taskData[trialNum]);

      // add 'partner swap' slide as first trial
      if(partnerNum > 0 & trialNum == 0) {
        round.addStage({
          name: "transition",
          displayName: "Partner Swap!",
          durationInSeconds: 10
        });
      }
      
      round.addStage({
        name: "selection",
        displayName: "Selection",
        durationInSeconds: 60
      });
    });
  });
});

