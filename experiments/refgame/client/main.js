import { render } from "react-dom";

import "@blueprintjs/icons/lib/css/blueprint-icons.css";
import "@blueprintjs/core/lib/css/blueprint.css";



import Empirica from "meteor/empirica:core";

//import Consent from "./intro/Consent.jsx";
//import Overview from "./intro/Overview.jsx";
//import TeamDetails from "./intro/TeamDetails.jsx";
//import SocialInteractionDetails from "./intro/SocialInteractionDetails.jsx";
//import MoreAboutBonus from "./intro/MoreAboutBonus.jsx";
//import UIOverview from "./intro/UIOverview.jsx";
//import GroupQuiz from "./intro/GroupQuiz.jsx";
// import IndividualQuiz from "./intro/IndividualQuiz.jsx";

import Round from "./game/Round.jsx";
import Thanks from "./exit/Thanks.jsx";
import Sorry from "./exit/Sorry";
//import ExitSurvey from "./exit/ExitSurvey";
// import { BlueA, BlueB, BlueC, BlueD, BlueE, BlueF, BlueG, BlueH,
//          RedA, RedB, RedC, RedD, RedE, RedF, RedG, RedH } from "./exit/GroupPostTest.jsx";
// import PostTestInstructions from "./exit/PostTestInstructions.jsx";
import customBreadcrumb from "./game/Breadcrumb.jsx";

// Set the Consent Component you want to present players (optional).
//Empirica.consent(Consent);

// Introduction pages to show before they play the game (optional).
// At this point they have been assigned a treatment. You can return
// different instruction steps depending on the assigned treatment.
Empirica.introSteps((game, treatment) => {
  //const steps = [Overview];
  // if (game.treatment.playerCount > 1) {
  //   steps.push(TeamDetails, SocialInteractionDetails);
  // }
  // steps.push(MoreAboutBonus, UIOverview);

  // if (game.treatment.playerCount > 1) {
  //   steps.push(GroupQuiz);
  // } else {
  //   steps.push(IndividualQuiz);
  // }

  //return steps;
  return [];
});

// The Round component containing the game UI logic.
// This is where you will be doing the most development.
// See client/game/Round.jsx to learn more.
Empirica.round(Round);

// End of Game pages. These may vary depending on player or game information.
// For example we can show the score of the user, or we can show them a
// different message if they actually could not participate the game (timed
// out), etc.
// The last step will be the last page shown to user and will be shown to the
// user if they come back to the website.
// If you don't return anything, or do not define this function, a default
// exit screen will be shown.
Empirica.exitSteps((game, player) => {
  if (player.exitStatus !== "finished") {
    return [Sorry];
  } else {
    const blues_setA = _.shuffle([BlueA, BlueB, BlueC, BlueD]);
    const reds_setA = _.shuffle([RedA, RedB, RedC, RedD]);
    const blues_setB = _.shuffle([BlueE, BlueF, BlueG, BlueH]);
    const reds_setB = _.shuffle([RedE, RedF, RedG, RedH]);
    const post_test = game.get('targetSet') == 'setA' ? [blues_setA, reds_setA] : [blues_setB, reds_setB];
    //return [PostTestInstructions].concat(_.flatten(_.shuffle(post_test))).concat(ExitSurvey, Thanks);
    return[Thanks];
  }
});

// Empirica.breadcrumb would probably go here
Empirica.breadcrumb(customBreadcrumb);

// Start the app render tree.
// NB: This must be called after any other Empirica calls (Empirica.round(),
// Empirica.introSteps(), ...).
// It is required and usually does not need changing.
Meteor.startup(() => {
  render(Empirica.routes(), document.getElementById("app"));
});
