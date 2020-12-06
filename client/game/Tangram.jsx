import React from "react";

export default class Tangram extends React.Component {
  state = { clicked: false };

  handleClick = e => {
    const { tangram, tangram_num, stage, player } = this.props;
    e.preventDefault();
    this.setState({ clicked: true });
    const chatlog = stage.get("chat");
    if (chatlog.length > 0) {
      player.set("submitted", tangram_num);
    }
  };
  
  render() {
    const { tangram, tangram_num, round, player, ...rest } = this.props;
    const { clicked } = this.state;
    const row = 1 + Math.floor(tangram_num / 2)
    const column = 1 + tangram_num % 2
    const target = round.get("task").target;
    const mystyle = {
      "background" : "url(" + tangram + ")",
      "background-size": "cover",
      "width" : "25vh",
      "height" : "25vh",
      "gridRow": row,
      "gridColumn": column
    };
    if(target == tangram & player.get('role') == 'speaker') {
      _.extend(mystyle, {"border" :  "10px solid #000"})
    }
    return (
      <div
        onClick={this.handleClick}
        style={mystyle}
        >
      </div>
    );
  }
}
