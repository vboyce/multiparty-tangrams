import React from "react";

import {AlertToaster, Centered} from "meteor/empirica:core";

import {
  Button,
  Classes,
  FormGroup,
  RadioGroup,
  TextArea,
  Intent,
  Radio,
} from "@blueprintjs/core";

export default class GroupPostTest extends React.Component {
  static stepName = "PostTest";
  state = {
    blueA: "",
    blueB: "",
    blueC: "",
    blueD: "",
    redA: "",
    redB: "",
    redC: "",
    redD: "",
  };

  handleChange = (event) => {
    const el = event.currentTarget;
    this.setState({ [el.name]: el.value });
  };

  handleSubmit = (event) => {
    event.preventDefault();
    if (
        this.state.blueA === "" ||
        this.state.blueB === "" ||
        this.state.blueC === "" ||
        this.state.blueD === "" || //only this one is correct
        this.state.redA === "" ||
        this.state.redB === "" ||
        this.state.redC === "" ||
        this.state.redD === ""
    ) {
      AlertToaster.show({
        message:
            "Sorry, you have not completed one or more of the questions above. Please answer all of the questions before submitting!",
      });
    } else {
      this.props.onSubmit(this.state);
    }
  };

  exitMessage = (player, game) => {
    return (
      <div>
        {" "}
        <h1> Hypothetical Games </h1>
        <br />
        <p>
          For the final part of this experiment, please answer the following questions about how you
          would describe tangrams to different players.
        </p>
      </div>
    );
  };

  exitForm = () => {
    const {
      blueA,
      blueB,
      blueC,
      blueD,
      redA,
      redB,
      redC,
      redD,
    } = this.state;

    return (
      <div>
        {" "}
        <form onSubmit={this.handleSubmit}>

          <h3>
            You have been paired with a <em style={{ color: "blue" }}>new partner from the blue community</em>.
          </h3>

          <div className="image">
            <center><img src="/experiment/tangram_A.png" /></center>
          </div>

          <div className="pt-form-group">
            <div className="pt-form-content">
              <FormGroup
                  className={"form-group"}
                  inline={false}
                  label={"How would you describe the tangram above to another member of the blue community?"}
                  labelFor={"blueA"}
                  //className={"form-group"}
              >
                <TextArea
                    id="blueA"
                    large={true}
                    intent={Intent.PRIMARY}
                    onChange={this.handleChange}
                    value={blueA}
                    fill={true}
                    name="blueA"
                />
              </FormGroup>
            </div>
          </div>

          <div className="image">
            <center><img src="/experiment/tangram_B.png" /></center>
          </div>

          <div className="pt-form-group">
            <div className="pt-form-content">
              <FormGroup
                  className={"form-group"}
                  inline={false}
                  label={"How would you describe the tangram above to another member of the blue community?"}
                  labelFor={"blueB"}
                  //className={"form-group"}
              >
                <TextArea
                    id="blueA"
                    large={true}
                    intent={Intent.PRIMARY}
                    onChange={this.handleChange}
                    value={blueB}
                    fill={true}
                    name="blueB"
                />
              </FormGroup>
            </div>
          </div>

          <div className="image">
            <center><img src="/experiment/tangram_C.png" /></center>
          </div>

          <div className="pt-form-group">
            <div className="pt-form-content">
              <FormGroup
                  className={"form-group"}
                  inline={false}
                  label={"How would you describe the tangram above to another member of the blue community?"}
                  labelFor={"blueC"}
                  //className={"form-group"}
              >
                <TextArea
                    id="blueA"
                    large={true}
                    intent={Intent.PRIMARY}
                    onChange={this.handleChange}
                    value={blueC}
                    fill={true}
                    name="blueC"
                />
              </FormGroup>
            </div>
          </div>

          <div className="image">
            <center><img src="/experiment/tangram_D.png" /></center>
          </div>

          <div className="pt-form-group">
            <div className="pt-form-content">
              <FormGroup
                  className={"form-group"}
                  inline={false}
                  label={"How would you describe the tangram above to another member of the blue community?"}
                  labelFor={"blueD"}
                  //className={"form-group"}
              >
                <TextArea
                    id="blueD"
                    large={true}
                    intent={Intent.PRIMARY}
                    onChange={this.handleChange}
                    value={blueD}
                    fill={true}
                    name="blueD"
                />
              </FormGroup>
            </div>
          </div>

          <hr />

          <h3>
            You have been paired with a <em style={{ color: "red" }}>new partner from the red community</em>.
          </h3>

          <div className="image">
            <center><img src="/experiment/tangram_A.png" /></center>
          </div>

          <div className="pt-form-group">
            <div className="pt-form-content">
              <FormGroup
                  className={"form-group"}
                  inline={false}
                  label={"How would you describe the tangram above to an unknown member of the red community?"}
                  labelFor={"redA"}
                  //className={"form-group"}
              >
                <TextArea
                    id="redA"
                    large={true}
                    intent={Intent.PRIMARY}
                    onChange={this.handleChange}
                    value={redA}
                    fill={true}
                    name="redA"
                />
              </FormGroup>
            </div>
          </div>

          <div className="image">
            <center><img src="/experiment/tangram_B.png" /></center>
          </div>

          <div className="pt-form-group">
            <div className="pt-form-content">
              <FormGroup
                  className={"form-group"}
                  inline={false}
                  label={"How would you describe the tangram above to an unknown member of the red community?"}
                  labelFor={"redB"}
                  //className={"form-group"}
              >
                <TextArea
                    id="redB"
                    large={true}
                    intent={Intent.PRIMARY}
                    onChange={this.handleChange}
                    value={redB}
                    fill={true}
                    name="redB"
                />
              </FormGroup>
            </div>
          </div>

          <div className="image">
            <center><img src="/experiment/tangram_C.png" /></center>
          </div>

          <div className="pt-form-group">
            <div className="pt-form-content">
              <FormGroup
                  className={"form-group"}
                  inline={false}
                  label={"How would you describe the tangram above to an unknown member of the red community?"}
                  labelFor={"redC"}
                  //className={"form-group"}
              >
                <TextArea
                    id="redC"
                    large={true}
                    intent={Intent.PRIMARY}
                    onChange={this.handleChange}
                    value={redC}
                    fill={true}
                    name="redC"
                />
              </FormGroup>
            </div>
          </div>

          <div className="image">
            <center><img src="/experiment/tangram_D.png" /></center>
          </div>

          <div className="pt-form-group">
            <div className="pt-form-content">
              <FormGroup
                  className={"form-group"}
                  inline={false}
                  label={"How would you describe the tangram above to an unknown member of the red community?"}
                  labelFor={"redD"}
                  //className={"form-group"}
              >
                <TextArea
                    id="redD"
                    large={true}
                    intent={Intent.PRIMARY}
                    onChange={this.handleChange}
                    value={redD}
                    fill={true}
                    name="redD"
                />
              </FormGroup>
            </div>
          </div>



          {/*<div className="pt-form-group">*/}
          {/*  <div className="pt-form-content">*/}
          {/*    <RadioGroup*/}
          {/*      name="chatComfort"*/}
          {/*      label="How comfortable were you in sharing your perspective with the team through the chat?"*/}
          {/*      onChange={this.handleChange}*/}
          {/*      selectedValue={chatComfort}*/}
          {/*    >*/}
          {/*      <Radio*/}
          {/*        label="Very comfortable"*/}
          {/*        value="extremelyValuable"*/}
          {/*        className={"pt-inline"}*/}
          {/*      />*/}
          {/*      <Radio*/}
          {/*        label="Comfortable"*/}
          {/*        value="comfortable"*/}
          {/*        className={"pt-inline"}*/}
          {/*      />*/}
          {/*      <Radio*/}
          {/*        label="Neutral"*/}
          {/*        value="neutral"*/}
          {/*        className={"pt-inline"}*/}
          {/*      />*/}

          {/*      <Radio*/}
          {/*        label="Uncomfortable"*/}
          {/*        value="uncomfortable"*/}
          {/*        className={"pt-inline"}*/}
          {/*      />*/}

          {/*      <Radio*/}
          {/*        label="Very uncomfortable"*/}
          {/*        value="veryUncomfortable"*/}
          {/*        className={"pt-inline"}*/}
          {/*      />*/}
          {/*    </RadioGroup>*/}
          {/*  </div>*/}
          {/*</div>*/}

          {/*<div className="form-line thirds">*/}
          {/*  <FormGroup*/}
          {/*    className={"form-group"}*/}
          {/*    inline={false}*/}
          {/*    label={"How would you describe your strategy in the game?"}*/}
          {/*    labelFor={"strategy"}*/}
          {/*    //className={"form-group"}*/}
          {/*  >*/}
          {/*    <TextArea*/}
          {/*      id="strategy"*/}
          {/*      large={true}*/}
          {/*      intent={Intent.PRIMARY}*/}
          {/*      onChange={this.handleChange}*/}
          {/*      value={strategy}*/}
          {/*      fill={true}*/}
          {/*      name="strategy"*/}
          {/*    />*/}
          {/*  </FormGroup>*/}

          {/*  <FormGroup*/}
          {/*    className={"form-group"}*/}
          {/*    inline={false}*/}
          {/*    label={"Do you feel the pay was fair?"}*/}
          {/*    labelFor={"fair"}*/}
          {/*    //className={"form-group"}*/}
          {/*  >*/}
          {/*    <TextArea*/}
          {/*      id="fair"*/}
          {/*      name="fair"*/}
          {/*      large={true}*/}
          {/*      intent={Intent.PRIMARY}*/}
          {/*      onChange={this.handleChange}*/}
          {/*      value={fair}*/}
          {/*      fill={true}*/}
          {/*    />*/}
          {/*  </FormGroup>*/}

          {/*  <FormGroup*/}
          {/*    className={"form-group"}*/}
          {/*    inline={false}*/}
          {/*    label={"Feedback, including problems you encountered."}*/}
          {/*    labelFor={"feedback"}*/}
          {/*    //className={"form-group"}*/}
          {/*  >*/}
          {/*    <TextArea*/}
          {/*      id="feedback"*/}
          {/*      name="feedback"*/}
          {/*      large={true}*/}
          {/*      intent={Intent.PRIMARY}*/}
          {/*      onChange={this.handleChange}*/}
          {/*      value={feedback}*/}
          {/*      fill={true}*/}
          {/*    />*/}
          {/*  </FormGroup>*/}
          {/*</div>*/}

          {/*<div className="form-line thirds">*/}
          {/*  <FormGroup*/}
          {/*    className={"form-group"}*/}
          {/*    inline={false}*/}
          {/*    label={"Was the in-game chat feature useful?"}*/}
          {/*    labelFor={"chatUseful"}*/}
          {/*    //className={"form-group"}*/}
          {/*  >*/}
          {/*    <TextArea*/}
          {/*      id="chatUseful"*/}
          {/*      name="chatUseful"*/}
          {/*      large={true}*/}
          {/*      intent={Intent.PRIMARY}*/}
          {/*      onChange={this.handleChange}*/}
          {/*      value={chatUseful}*/}
          {/*      fill={true}*/}
          {/*    />*/}
          {/*  </FormGroup>*/}

          {/*  <FormGroup*/}
          {/*    className={"form-group"}*/}
          {/*    inline={false}*/}
          {/*    label={"Was the events log feature useful?"}*/}
          {/*    labelFor={"events"}*/}
          {/*    //className={"form-group"}*/}
          {/*  >*/}
          {/*    <TextArea*/}
          {/*      id="events"*/}
          {/*      name="events"*/}
          {/*      large={true}*/}
          {/*      intent={Intent.PRIMARY}*/}
          {/*      onChange={this.handleChange}*/}
          {/*      value={events}*/}
          {/*      fill={true}*/}
          {/*    />*/}
          {/*  </FormGroup>*/}
          {/*</div>*/}

          <button type="submit" className="pt-button pt-intent-primary">
            Submit
            <span className="pt-icon-standard pt-icon-key-enter pt-align-right" />
          </button>
        </form>{" "}
      </div>
    );
  };

  componentWillMount() {}

  render() {
    const { player, game } = this.props;
    return (
      <Centered>
        <div className="post-test">
          {this.exitMessage(player, game)}
          <hr />
          {this.exitForm()}
        </div>
      </Centered>
    );
  }
}
