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
Empirica.gameInit((game, treatment) => {
  console.log(
    "Game with a treatment: ",
    treatment,
    " will start, with workers",
    _.pluck(game.players, "id")
  );

  //initiate the cumulative score for this game (because everyone will have the same score, we can save it at the game object
  game.set("cumulativeScore", 0); // the total score at the end of the game
  game.set("nOptimalSolutions", 0); // will count how many times they've got the optimal answer
  game.set("justStarted", true); // I use this to play the sound on the UI when the game starts
  game.set("team", game.players.length > 1);

  //we don't know the sequence yet
  let taskSequence = taskData;
  
  //we'll have trialNum rounds, each task is one stage
  //TODO: need to figure out how to import variable numTrials into treatment
  //TODO: there is also an Empirica.breadcrumb(Component) component on the client side that replaces the default
  // Round/Stage progress indicator - UI that shows which are the current Round and Stage
  _.times(1, trialNum => {
    const round = game.addRound();
    round.set("task", taskSequence[trialNum]);

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
    let turn = (trialNum % 2) == 0 ? "Selection" : "Feedback";
    round.addStage({
      name: trialNum + "Selection",
      displayName: "Stage " + (trialNum+1) + ": " + "Selection",
      durationInSeconds: 30000000
    });

    round.addStage({
      name: trialNum + "Feedback",
      displayName: "Stage " + (trialNum+1) + ": " + "Feedback",
      durationInSeconds: 30000000
    });

    // TODO: I think one issue might be here where we use tangrams directly instead of task
    // round.addStage({
    //   name: trialNum + 'listener',
    //   displayName: "listener's turn",
    //   durationInSeconds: 30000000
    // });
    // round.addStage({
    //   name: trialNum + 'feedback',
    //   displayName: "feedback",
    //   durationInSeconds: 30000000
    // });
  });
});

// TODO: we only need to fix the first practice task at the very start, don't need one every round
// fix the first practice task and shuffle the rest
//to learn more:
//https://stackoverflow.com/questions/50536044/swapping-all-elements-of-an-array-except-for-first-and-last
function customShuffle(taskSequence) {
  // Find and remove first and last:
  const practiceTask = taskSequence[0];

  const firstIndex = taskSequence.indexOf(practiceTask);

  if (firstIndex !== -1) {
    taskSequence.splice(firstIndex, 1);
  }

  // Normal shuffle with the remaining elements using ES6:
  for (let i = taskSequence.length - 1; i > 0; --i) {
    const j = Math.floor(Math.random() * (i + 1));

    [taskSequence[i], taskSequence[j]] = [taskSequence[j], taskSequence[i]];
  }

  // Add them back in their new position:
  if (firstIndex !== -1) {
    taskSequence.unshift(practiceTask);
  }

  return taskSequence;
}
