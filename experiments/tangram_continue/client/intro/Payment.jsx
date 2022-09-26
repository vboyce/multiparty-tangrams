import React from "react";

import { Centered } from "meteor/empirica:core";
import { Button } from "@blueprintjs/core";

export default class Overview extends React.Component {
  render() {
    const { hasPrev, hasNext, onNext, onPrev, treatment } = this.props;
    const social = treatment.playerCount > 1;
    return (
      <Centered>
        <div className="instructions">
       
          <h1 className={"bp3-heading"}> Important Payment Information </h1>

          <p>In this task, you will be assigned to a team with {treatment.playerCount -1} other {treatment.playerCount>2 ? "people ": "person "} 
            (<strong>{treatment.playerCount} people including yourself!</strong>).
            You will play a series of communication games with people on your team.</p>

            <p>You should expect this {treatment.playerCount}-player game will take roughly  
            <strong>{treatment.playerCount==2 ? " 40 minutes. " : treatment.playerCount==3? " 50 minutes. ": " 60 minutes. "}
            {treatment.playerCount==3 ? "You will recieve a $1.50 bonus for being in a 3 player game, in addition to $7 base pay. ": 
            treatment.playerCount==4 ? "You will recieve a $3 bonus for being in a 4 player game, in addition to $7 base pay. " : 
            treatment.playerCount==5 ? "You will receive $11 base pay.":
            treatment.playerCount==6 ? "You will receive $11 base pay.":
            "You will recieve $7 base pay. "}  </strong> </p><p>
            <strong> {(treatment.rotateSpeaker==false && treatment.playerCount==6) ? "If you are randomly assigned to the speaker role, you will receive a $2 bonus for your extra effort.": ""} </strong>
            Regardless of the role you are assigned, you will be able to earn up to <strong> $2.88</strong> in additional bonuses depending on your performance in the game. </p>

            <p>Please only do this study if you will be available for the given amount of time, otherwise please return it. In this study, you will be interacting with other participants via a chat box. 
                If you have concerns about the behavior of other participants or any other issues, please contact us via Prolific. </p>
          <button
            type="button"
            className="bp3-button bp3-intent-nope bp3-icon-double-chevron-left"
            onClick={onPrev}
            disabled={!hasPrev}
          >
            Previous
          </button>
          <button
            type="button"
            className="bp3-button bp3-intent-primary"
            onClick={onNext}
            disabled={!hasNext}
          >
            Next
            <span className="bp3-icon-standard bp3-icon-double-chevron-right bp3-align-right"/>
          </button>
        </div>
      </Centered>
    );
  }
}
