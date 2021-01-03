import React from "react";

import SocialInteractions from "./SocialInteractions.jsx";
import Task from "./Task.jsx";
import Transition from "./Transition.jsx";

const roundSound = new Audio("experiment/round-sound.mp3");
const gameSound = new Audio("experiment/bell.mp3");

export default class Round extends React.Component {
  componentDidMount() {
    const { game } = this.props;
    if (game.get("justStarted")) {
      //play the bell sound only once when the game starts
      gameSound.play();
      game.set("justStarted", false);
    } else {
      roundSound.play();
    }
  }

  render() {
    const {round, stage, player, game } = this.props;
    if(stage.name == 'transition') {
      return (
        <div className="round">
          <Transition game={game} round={round} stage={stage} player={player} />
        </div>
      );
    } else {
      return (
        <div className="round">
          <SocialInteractions game={game} round={round} stage={stage} player={player} />
          <Task game={game} round={round} stage={stage} player={player} />
        </div>
      );
    }
  }
}
