import React from "react";

import SocialInteractions from "./SocialInteractions.jsx";
import Task from "./Task.jsx";

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
    return (
      <div className="round">
        <SocialInteractions game={game} stage={stage} player={player} />
        <Task game={game} round={round} stage={stage} player={player} />
      </div>
    );
  }
}
