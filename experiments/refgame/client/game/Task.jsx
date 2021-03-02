import React from "react";

import Tangram from "./Tangram.jsx";
import Timer from "./Timer.jsx";
import { HTMLTable } from "@blueprintjs/core";
import { StageTimeWrapper } from "meteor/empirica:core";

export default class Task extends React.Component {
  constructor(props) {
    super(props);

    // We want each participant to see tangrams in a random but stable order
    // so we shuffle at the beginning and save in state
    this.state = {
      activeButton: false
    };
  }

  render() {
    const { game, round, stage, player } = this.props;
    //const room = player.get('roomId');
    const target = round.get("target");
    const tangramURLs = player.get('tangramURLs');
    const correct = player.get('clicked') == target
    let tangramsToRender;
    if (tangramURLs) {
      tangramsToRender = tangramURLs.map((tangram, i) => (
        <Tangram
          key={tangram}
          tangram={tangram}
          tangram_num={i}
          round={round}
          stage={stage}
          game={game}
          player={player}
          />
      ));
    }
    let feedback = (
      player.get('clicked') == '' ? '' :
      player.get('done') == false ? "Waiting for others to answer." :
          correct ? "" :
      ""
    )
    let role = (player.get('role')=="speaker"? "You are the speaker. Please describe the picture in the box to the other players.": 
    "You are a listener. Please click on the image that the speaker describes.")
    return (
      <div className="task">
        <div className="board">
          <h1 className="roleIndicator"> {role}</h1>
          <div className="all-tangrams">
            <div className="tangrams">
              {tangramsToRender}
            </div>
          </div>
          <h3 className="feedbackIndicator">
            {feedback}
            <br/>
          </h3>
        </div>
      </div>
    );
  }
}
