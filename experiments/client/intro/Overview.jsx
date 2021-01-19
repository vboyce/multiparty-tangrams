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
          <h1 className={"bp3-heading"}> Game Overview </h1>
          <p>
            In this task, you will be assigned to a team with {treatment.playerCount + 1} other people ({treatment.playerCount + 2} including yourself!)
            You will play a series of communication games with people on your team.
            Everyone on your team will see the same set of four pictures, which will look something like this:
          </p>

          <div className="image">
            <center><img width="300px" src="/experiment/tangrams.PNG" /></center>
          </div>

          <p>
            Throughout the game, you will be paired up with different partners from your team. 
            When you first meet a new partner, one of you will be randomly assigned the {" "}
            <strong>Speaker</strong> role and the other will be assigned the {" "}
            <strong>Listener</strong> role.
          </p>

          <p>
            If you are the Speaker, you will see a black box
            secretly marking one of these four pictures as the {" "} <strong>target</strong>.
          </p>

          <div className="image">
            <center><img width="300px" src="/experiment/target.PNG" /></center>
          </div>

          <p>
            The Speaker's job is to send a description of the target through the chatbox
            so that the Listener is able to pick it out of the set. You can write whatever
            description you think will best allow your partner to identify the target
            (this isn't a game of "Taboo" and there is no reason to give cryptic clues!)
            Please note that the order of the pictures on your screen is scrambled on each
            round, so descriptions like "the one on the left" or "the third one" will not
            work. Also, please limit your description to the current target picture: do not
            discuss previous trials or chat about any other topics!
          </p>

          <div className="image">
            <center><img width="250px" src="/experiment/typing.PNG" /></center>
            <br/>
          </div>

          <p>
            After the Speaker sends a message, the Listener will read it and
            click the picture they believe is the target.  They are also
            allowed to respond by sending messages back through the chatbox
            until they are ready to make a selection. After the Listener clicks
            one of the pictures, both of you will be given feedback: the Speaker will see which picture
            the Listener clicked, and the Listener will see the true identity of
            the target.
          </p>

          <p>
            The listener's answer will reflect both the speaker's quality of
            description and the listener's comprehension, and therefore,{" "}
            <strong>both members of each pair will receive the same score for a given round</strong>. 
            You will earn a {" "} <strong>3 cent bonus</strong> for each correct
            match, so pay attention!
          </p>

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
