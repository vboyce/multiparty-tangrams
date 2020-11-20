import React from "react";

export default class Tangram extends React.Component {
  state = { clicked: false };

  handleClick = e => {
    e.preventDefault();
    this.setState({ clicked: true });
  };
  
  render() {
    const { tangram, isDeck, stage, ...rest } = this.props;
    const { clicked } = this.state;
    const mystyle = {
      "background" : "url(" + tangram + ")",
      "background-size": "cover",
      "width" : "25%",
      'height': cw + 'px'
      
    };
    const target = stage.get("target");
    return (
      <div
        onClick={this.handleClick}
        className={`bp3-card`}
        style={mystyle}
        >
      </div>
    );
  }
}
