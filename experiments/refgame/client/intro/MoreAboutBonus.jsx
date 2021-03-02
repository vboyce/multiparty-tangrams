import React from "react";

import {Centered} from "meteor/empirica:core";

export default class MoreAboutBonus extends React.Component {
  render() {
    const { hasPrev, hasNext, onNext, onPrev, treatment } = this.props;
    const social = treatment.playerCount > 1;
    return (
      <Centered>
        <div className="instructions">
          <h1 className={"bp3-heading"}> Scores and Bonuses</h1>

          <p>
            In each task, we use "score" to evaluate the quality of the selections that you and your
            partners make. Your total score will be calculated as the sum of your scores on each round.
          </p>

        <p>Each time a <strong>Listener</strong> makes a correct selection, they get <strong> 4 points</strong>.</p>
        <p>The <strong>Speaker</strong> gets <strong>2 points</strong> for each correct selection a Listener makes. </p>

        <p> Incorrect selection and no selection (timing out) earn no points. </p>
        
        <p>For instance, if there are two Listeners and both make a correct selection, they each get 4 points, and the Speaker gets 2+2=4 points.
        If one Listener chooses correctly and one doesn't, the correct Listener gets 4 points, the other Listener gets 0 points, and the Speaker gets 2 points. </p>

          <p>
            Your performance bonus will be based on your score at the end of the experiment.
          </p>

          <p>
            <strong>
              {social ? "Remember, free riding is not permitted." : ""} If we
              detect that you are inactive during a task, you will not receive a
              bonus for that task.
            </strong>
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
            <span className="bp3-icon-standard bp3-icon-double-chevron-right bp3-align-right" />
          </button>
        </div>
      </Centered>
    );
  }
}
