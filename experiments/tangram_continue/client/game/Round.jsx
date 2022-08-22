import React from "react";
import {  AlertToaster } from "meteor/empirica:core";

import SocialInteractions from "./SocialInteractions.jsx";
import Task from "./Task.jsx";

const roundSound = new Audio("experiment/round-sound.mp3");
const gameSound = new Audio("experiment/bell.mp3");
const setTimeout = function(player) {
  if(!player.get('exitTimeoutId')) {
    player.set('exitTimeoutId', Meteor.setTimeout(() => {
      
      if (player.get("role")=="speaker"){
        AlertToaster.show({
          message:
            "Oops, the speaker disconnected! The game will continue without them, but we're skipping to the next image!",
        });
      }
      else{AlertToaster.show({
        message:
          "Oops, one of the other players disconnected! The game will continue without them.",
      });}
      player.set('exited', true);
      player.exit("Oops, it looks like there was a connection problem, and you couldn't finish the experiment!")
      
    }, 15000)) //TODO longer
  }
}
const cancelTimeout = function(player) {
  const id = player.get('exitTimeoutId')
  if(id) {
    Meteor.clearTimeout(id)
    player.set('exitTimeoutId', null)
  }
}

export default class Round extends React.Component {
  componentDidMount() {
    const { game, player } = this.props;
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
      game.players.forEach(player => {
        if (!player.online)
        { setTimeout(player)
        console.log("warning")
      }
        else {
          cancelTimeout(player)
          //console.log("good")
        }
      })
    return (
      <div className="round">
        <SocialInteractions game={game} round={round} stage={stage} player={player} />
        <Task game={game} round={round} stage={stage} player={player} />
      </div>
    );
  }
}
