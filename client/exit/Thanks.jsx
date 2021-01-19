import React from "react";

import {Centered} from "meteor/empirica:core";

export default class Thanks extends React.Component {
  static stepName = "Thanks";

  exitMessage = (player, game) => {
    return (
        <div>
          {" "}
          <h1> Experiment Completed </h1>
          <br />
          <h3>
            Please submit the following code to receive your bonus:{" "}
            <em>{game.treatment.submitCode}</em>.
          </h3>
          <p>
            Your final{" "}
            <strong>
              <em>performance bonus is ${player.get("bonus").toFixed(2) || 0}.</em>
            </strong>{" "}
          </p>
          <p>
            Thank you again for participating! If you were curious, you were always interacting in real time with real human partners.
            The aim of our study was to understand how new language spreads through a community, like slang and dialects do in the real world. Please email us at robertdh@princeton.edu if you have any questions or concerns.

          </p>
        </div>
    );
  };

  render() {
    const { player, game } = this.props;
    return (
      <Centered>
        <div className="game finished">
          {this.exitMessage(player, game)}
          <hr />
          <div className="pt-non-ideal-state-description">
          </div>
        </div>
      </Centered>
    );
  }
}
