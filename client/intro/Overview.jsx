import React from "react";

import { Centered } from "meteor/empirica:core";
import { Button } from "@blueprintjs/core";

export default class Overview extends React.Component {
  render() {
    const { hasPrev, hasNext, onNext, onPrev, treatment } = this.props;
    const social = treatment.playerCount > 1;
    return (
      <Centered>
        <div className="instructions">
          <h1 className={"bp3-heading"}> Game Overview </h1>
          <p>
            In this game, you will play a series of communication games with other participants.
            All of you will see the same set of four pictures, which will look something like this:
          </p>

          <div className="image">
            <center><img src="/experiment/tangrams.PNG" /></center>
          </div>

          <p>
            Each time you are paired with a new partner, one of you will be
            randomly assigned the {" "}
            <strong>Speaker</strong> role and the other will be assigned the {" "}
            <strong>Listener</strong> role. If you are the speaker, you will see a black box
               secretly marking one of these four pictures as the {" "} <strong>target</strong>.
          </p>

          <div className="image">
            <center><img src="/experiment/target.PNG" /></center>
          </div>

          <p>
            The Speaker's job is to send a description of the target through the chatbox
            so that the Listener is able to pick it out of the set. You can write whatever
            description you think will best allow your partner to identify the target
            (this isn't a game of "Taboo" and there is no reason to give cryptic clues!)
            Please note that the order of the pictures on your screen is scrambled on each
            round, so descriptions like "the one on the left" or "the third one" will not
            work. Also, please limit your description to the current target picture: do not
            discuss previous trials or chat about any other topics!
          </p>

          <div className="image">
            <center><img src="/experiment/typing.PNG" /></center>
          </div>

          <p>
            After the Speaker sends a message, the Listener will read it and
            click the picture they believe is the target.  They are also
            allowed to respond by sending messages back through the chatbox
            until they are ready to make a selection. After the Listener clicks
            one of the pictures, both of you will be given feedback before
            advancing to the next round: the Speaker will see which picture
            the Listener clicked, and the Listener will see the true identity of
            the target. You will earn a {" "} <strong>4 cent bonus</strong> for each correct
            match, so pay attention!
          </p>

          <p>
            There are a total of <b>16 rounds</b> with each partner, so each
            picture will appear as the target multiple times with that
            partner. You will switch roles over 4 rounds, so both of you will
            get the chance to be Director and Matcher.  After the final round
            of your game with one partner, you will <b>switch partners</b> to
            someone you haven't talked to before!  Once you have played a game
            with <b>three different turkers</b>, you will fill out a quick 15
            second survey and be on your way.
          </p>

          <p>
            A few final notes before you begin. First, because multiple players
            must be connected simultaneously for the study to begin, you might
            briefly see a waiting room screen with a progress bar at the
            beginning while other participants join the game. Second, when you are
            ready to swap partners, your new partner may still be completing a
            game with someone else and you may see another brief waiting
            screen like this one:
          </p>

          <div className="image">
            <center><img src="/experiment/imageneeded.PNG" /></center>
          </div>

          <p>
            Just hold tight a moment while they catch up to you! We realize
            this waiting can make the completion time of the HIT more
            variable, but we are tracking the amount of time you spend in the
            waiting room; if you are waiting for more than 20 minutes and a
            game still has not started, or if you find your HIT close to
            expiration, please email us at rdhawkins@princeton.edu for
            compensation.
          </p>

          <p>
            Lastly, please DO NOT refresh the page or close the window; you
            will not be able to return to the study. Because the study
            requires the whole group to be present, if one of the other
            turkers in your group disconnects, you will be referred to a page
            where you will answer some questions and be able to submit your
            HIT. However, because such disconnections are disruptive and
            unfair to other participants, who will be prevented from receiving the
            total possible bonus for finishing the experiment, we ask you to
            please return the HIT if you believe you may not be able to complete
            the experiment. If you decide to disconnect during the experiment
            anyway, we would very much appreciate an email with your feedback,
            and we will try to help! Have fun!
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
            <span className="bp3-icon-standard bp3-icon-double-chevron-right bp3-align-right"/>
          </button>
        </div>
      </Centered>
    );
  }
}
