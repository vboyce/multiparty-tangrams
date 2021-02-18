import React from "react";

import { Centered, AlertToaster } from "meteor/empirica:core";

import { Radio, RadioGroup } from "@blueprintjs/core";

import { Checkbox } from "@blueprintjs/core";

export default class GroupQuiz extends React.Component {
  state = {
    nParticipants: "",
    scoreOption: "",
    idle: "",
    largeError: "",
    mc_red: false,
    mc_yellow: false,
    mc_green: false,
    mc_blue: false,
    num_players: 0,
    teamColor: "",
    community: "",
  };

  componentDidMount() {
    const { game } = this.props;
    document.querySelector("main").scrollTo(0,0)
    this.state.num_players = game.treatment.playerCount + 2;
    this.state.teamColor = game.treatment.teamColor;
  }

  handleChange = (event) => {
    const el = event.currentTarget;
    this.setState({ [el.name]: el.value.trim().toLowerCase() });
  };

  handleRadioChange = (event) => {
    const el = event.currentTarget;
    console.log("el", el);
    console.log("ev", event);
    this.setState({ [el.name]: el.value });
  };

  handleEnabledChange = (event) => {
    const el = event.currentTarget;
    this.setState({ [el.name]: !this.state[el.name] });
  };

  handleSubmit = (event) => {
    event.preventDefault();

    //it should be this.state.nParticipants !== "3" but we don't have "treatment" in QUIZ
    if (
      this.state.nParticipants !== this.state.num_players.toString() ||
      this.state.scoreOption !== "all" ||
      // this.state.idle !== "100" ||
      this.state.largeError !== "0" ||
      !this.state.mc_red ||
      this.state.mc_yellow || //only this one is correct
      this.state.mc_green ||
      !this.state.mc_blue ||
      this.state.community !== this.state.teamColor
      // this.state.mc_2_101 ||
      // !this.state.mc_2_102 || //this one is correct
      // this.state.mc_2_103 ||
      // !this.state.mc_2_104 || //this one is correct
      // this.state.mc_2_105 ||
      // this.state.emptyOption !== "yes"
    ) {
      AlertToaster.show({
        message:
          "Sorry, you have one or more mistakes. Please ensure that you answer the questions correctly, or go back to the instructions",
      });
    } else {
      this.props.onNext();
    }
  };

  render() {
    const { hasPrev, onPrev, game, treatment } = this.props;
    return (
      <Centered>
        <div className="quiz">
          <h1 className={"bp3-heading"}> Quiz </h1>
          <form onSubmit={this.handleSubmit}>
            <div className="bp3-form-group">
              <label className="bp3-label" htmlFor="number-of-participants">
                How many participants will play at the same time on your team, including
                yourself?
              </label>
              <div className="bp3-form-content">
                <input
                  id="nParticipants"
                  className="bp3-input"
                  type="number"
                  min="0"
                  max="150"
                  step="1"
                  dir="auto"
                  name="nParticipants"
                  value={this.state.nParticipants}
                  onChange={this.handleChange}
                  required
                />
              </div>
            </div>

            <div className="bp3-form-group">
              <div className="bp3-form-content">
                <RadioGroup
                  label="Select the true statement about the score:"
                  onChange={this.handleRadioChange}
                  selectedValue={this.state.scoreOption}
                  name="scoreOption"
                  required
                >
                  <Radio
                    label="I will score points based only on what I do, no matter what my partner does."
                    value="single"
                  />
                  <Radio
                    label="My partner and I work together as a team and therefore we will both get the same score."
                    value="all"
                  />
                </RadioGroup>
              </div>
            </div>
            
            <div className="bp3-form-group">
              <label className="bp3-label" htmlFor="number-of-participants">
                If you do NOT choose a tangram before the time is up
                then your score in that task will be:
              </label>
              <div className="bp3-form-content">
                <input
                  id="nParticipants"
                  className="bp3-input"
                  type="number"
                  min="-10"
                  max="10"
                  step="1"
                  dir="auto"
                  name="largeError"
                  value={this.state.largeError}
                  onChange={this.handleChange}
                  required
                />
              </div>
            </div>
          
            <button
              type="button"
              className="bp3-button bp3-intent-nope bp3-icon-double-chevron-left"
              onClick={onPrev}
              disabled={!hasPrev}
            >
              Back to instructions
            </button>
            <button type="submit" className="bp3-button bp3-intent-primary">
              Submit
              <span className="bp3-icon-standard bp3-icon-key-enter bp3-align-right" />
            </button>
          </form>
        </div>
      </Centered>
    );
  }
}
