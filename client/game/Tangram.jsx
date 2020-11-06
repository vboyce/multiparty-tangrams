import React from "react";

import Student from "./Student.jsx";

export default class Tangram extends React.Component {
  state = { clicked: false };

  handleClick = e => {
    e.preventDefault();
    this.setState({ clicked: true });
  };
  
  render() {
    const { tangram, isDeck, stage, ...rest } = this.props;
    const { clicked } = this.state;
    const target = stage.get("target");
    return (
      <div
        onClick={this.handleClick}
        className={`bp3-card`}
        >
        <img src={tangram.url}></img>
      </div>
    );
  }
}
