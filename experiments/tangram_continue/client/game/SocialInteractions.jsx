import React from "react";
import EventLog from "./EventLog";
import ChatLog from "./ChatLog";
import Timer from "./Timer";
import _ from "lodash";

export default class SocialInteractions extends React.Component {
  renderPlayer(player, self = false) {
    //console.log(player)
    return (
      <div className="player" key={player._id}>
        <span className="image"></span>
        <img src={player.get("avatar")} />
        <span className="name" style={{ color: player.get("nameColor") }}>
          {player.get("name")}
          {self ? " (You)" :  player.get("role")=="listener"? " (Listener)": " (Speaker)"}
        </span>
      </div>
    );
  }

  render() {
    const { game, round, stage, player } = this.props;
    const activePlayers= _.reject(game.players, p => p.get("exited"))
    const otherPlayers = _.reject(activePlayers, p => p._id === player._id);
    //console.log(activePlayers)
    const messages = round.get("chat")
          .map(({ text, playerId, type }) => ({
            text,
            subject: game.players.find(p => p._id === playerId),
            type:type
          }));
    const events = stage.get("log").map(({ subjectId, ...rest }) => ({
      subject: subjectId && game.players.find(p => p._id === subjectId),
      ...rest
    }));

    return (
      <div className="social-interactions">
        <div className="status">
          <div className="players bp3-card">
            {this.renderPlayer(player, true)}
            {otherPlayers.map(p => this.renderPlayer(p))}        
          </div>
      </div>
      <div className="status">

        <Timer stage={stage} />

        <div className="total-score bp3-card">

          <h5 className='bp3-heading'>Score</h5>

          <h2 className='bp3-heading'>${(player.get("bonus") || 0).toFixed(2)}</h2>
        </div>
        </div>
        
        
        <ChatLog messages={messages} round={round} stage={stage} player={player} game={game}/>
      </div>
    );
  }
}
