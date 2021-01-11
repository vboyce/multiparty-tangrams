import React from "react";

import { Centered } from "meteor/empirica:core";
// //// Avatar stuff //////
// const names = "abcdefghijklmnopqrstuvwxyz".toUpperCase().split(""); //for the players names (we will call them A, B, C etc)
const names = ["Kati", "Lepi", "Daru", "Soha"]; // for the players names to match avatar color
// const avatarNames = ["Colton", "Aaron", "Alex", "Tristan"]; // to do more go to https://jdenticon.com/#icon-D3
// const nameColor = ["#3D50B7", "#70A945", "#DE8AAB", "A59144"]; // similar to the color of the avatar

const avatarNames = {
  'blue' : [
    "Lincoln",
    "Leo",
    "Kayla",
    "Molly",
  ],
  'red' : [
    "Claire",
    "Jill",
    "Asher",
    "Wyatt",
  ]
}

const nameColor = {
  'blue' : [
    "#7A9CDC",
    "#5697C3",
    "#6DBCD2",
    "#2D7496",
  ],
  'red' : [
    "#A33C49",
    "#B55D42",
    "#BB786C",
    "#BB6C7C",
  ]
}

export default class TeamDetails extends React.Component {
  renderPlayer(player, self = false) {
    return (
      <div className="player" key={player._id}>
        <span className="image">
          <img src={player.avatar} />
        </span>
        {/* <span className="name" style={{ color: player.get("nameColor") }}> */}
        <span className="name" style={{ color: player.nameColor }}>
          {player.name}
          {self ? " (You)" : ""}
        </span>
      </div>
    );
  }

  render() {
    console.log(this.props)
    const {game, hasPrev, hasNext, onNext, onPrev, treatment } = this.props;
    const teamColor = treatment.teamColor
    const player = {
      _id: 0,
      name: names[0],
      nameColor: nameColor[teamColor][0],
      avatar: `/avatars/jdenticon/${avatarNames[teamColor][0]}`
    };

    const otherPlayers = [
      {
        _id: 1,
        name: names[1],
        nameColor: nameColor[teamColor][1],
        avatar: `/avatars/jdenticon/${avatarNames[teamColor][1]}`
      }
    ];
    return (
      <Centered>
        <div className="instructions">
          <h1 className={"bp3-heading"}>You will be part of a team</h1>
          <p>
            In this game, you will{" "}
            <strong>
              play together with {treatment.playerCount - 1} other participants
              (your community members)
            </strong>
            . They are other participants who are undertaking the same study
            simultaneously. Throughout all the tasks, you will be paired off with one
            of your community members at a time to complete the picture matching game described
            on the previous page. The listener's answer will reflect both the speaker's quality of
            description and the listener's comprehension, and therefore,{" "}
            <strong>both members of each pair will receive the same score for a given round</strong>
            . To help you identify yourself and differentiate each other in the
            team, we will assign a color to you when the game starts (as shown
            in the following example).
          </p>
          <br />
          <div className="social-interactions" style={{ margin: "auto" }}>
            <div className="status">
              <div className="players bp3-card">
                {this.renderPlayer(player, true)}
                {otherPlayers.map(p => this.renderPlayer(p))}
              </div>
              <div className="total-score bp3-card">
                <h6 className={"bp3-heading"}>Total Score</h6>

                <h2 className={"bp3-heading"}>{"$1.02"}</h2>
              </div>
            </div>
          </div>

          <br />
          <p>
            Note that the game allows for simultaneous and real-time actions.
            That means that you will be able to communicate in real time with your current partner.
          </p>

          <h1 className={"bp3-heading"}>Your team will be placed within a larger community.</h1>
          <p>
            There are two different communities playing this game, a red community and a blue community.
            You will only play this game with other participants who are in the same community as you.
            For example, someone in the red community will only play with other members of the red community.
          </p>

          <div style={{ textAlign: "center" }}>
            <p>
              <strong style={{ color: teamColor }}>
                You are a member of the {teamColor} community.
              </strong>
            </p>
          </div>

          <p>
            Each community has a different set of pictures, so remember which community you are in!
          </p>

          <button
            type="button"
            className="bp3-button bp3-intent-nope bp3-icon-double-chevron-left"
            onClick={onPrev}
            disabled={!hasPrev}
          >
            Previous
          </button>
          <button
            type="button"
            className="bp3-button bp3-intent-primary"
            onClick={onNext}
            disabled={!hasNext}
          >
            Next
            <span className="bp3-icon-standard bp3-icon-double-chevron-right bp3-icon-align-right" />
          </button>
        </div>
      </Centered>
    );
  }
}
