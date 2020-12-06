import React from "react";

export default class Tangram extends React.Component {
  state = { clicked: false };

  handleClick = e => {
    const { tangram, tangram_num, stage, player } = this.props;
    const speakerMsgs = _.filter(stage.get("chat"), msg => msg.role == 'speaker')

    // only register click if the 
    if (speakerMsgs.length > 0 & player.get('role') == 'listener') {
      this.setState({ clicked: true });
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
      _.extend(mystyle, {
        "outline" :  "10px solid #000",
        "z-index" : "9"
      })
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
