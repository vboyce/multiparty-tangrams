import React from "react";

export default class Task extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { game, round, stage, player } = this.props;
    const oldPartnerId = player.get('partnerList')[round.index - 1]
    const newPartnerId = player.get('partnerList')[round.index]
    const oldPartner = _.filter(game.players, p => p._id === oldPartnerId)[0];
    const newPartner = _.filter(game.players, p => p._id === newPartnerId)[0];
    
    return (
      <div className="transition">
        <h1>Time to switch partners!</h1>
        <h3>Nice work playing with</h3>
        <span className="image">
          <img src={oldPartner.get("avatar")} style={{height: "75px"}}/>
          <span className="name" style={{ color: oldPartner.get("nameColor") }}>
            {oldPartner.get("name")}
          </span>
        </span>
        <h3>
          Now you're going to play a game with someone else.
          Instead of <strong style={{ color: oldPartner.get("nameColor")}}>
                       {oldPartner.get("name")} 
                     </strong> your new partner will be
        </h3>
        <span className="image">
          <img src={newPartner.get("avatar")}  style={{height: "75px"}}/>
        </span>
        <span className="name" style={{ color: newPartner.get("nameColor") }}>
          {newPartner.get("name")}
        </span>
      </div>
    );
  }
}
