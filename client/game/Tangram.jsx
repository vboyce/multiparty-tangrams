import React from "react";

export default class Tangram extends React.Component {
  state = { clicked: false };

  handleClick = e => {
    e.preventDefault();
    this.setState({ clicked: true });
  };
  
  render() {
    const { tangram, tangram_num, stage, ...rest } = this.props;
    const { clicked } = this.state;
    const row = 1 + Math.floor(tangram_num / 2)
    const column = 1 + tangram_num % 2
    const mystyle = {
      "background" : "url(" + tangram + ")",
      "background-size": "cover",
      "width" : "25vh",
      "height" : "25vh",
      "gridRow": row,
      "gridColumn": column
    };
    const target = stage.get("target");
    return (
      <div
        onClick={this.handleClick}
        className={`tangram`}
        style={mystyle}
        >
      </div>
    );
  }
}
