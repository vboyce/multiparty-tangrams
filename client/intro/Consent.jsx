import React from "react";

import { Centered, ConsentButton } from "meteor/empirica:core";
import BrowserDetection from "react-browser-detection";

export default class Consent extends React.Component {
  static renderConsent() {
    console.log("this is not firefox");
    return (
      <Centered>
        <div className="consent bp3-ui-text">
          <h2 className="bp3-heading"> Microsoft Research Project Participation Consent Form </h2>
          <p>
            This research project has been reviewed and approved by the
            Microsoft Research Ethics Advisory Board.
          </p>
          <h5 className="bp3-heading">INTRODUCTION</h5>
          <p>
            Thank you for deciding to volunteer in this research project.
            This research is being conducted by Robert Hawkins, a postdoctoral
            research fellow, Irina Liu, an undergraduate student, and Tom Griffiths, a faculty member,
            at Princeton University. This study takes approximately 30 minutes to complete, but will
            vary depending on how long you must wait for other participants to join.

            Your participation in this research is voluntary. You are free to refuse to take part,
            and you may stop taking part at any time. You are free to discontinue participation
            in this study at any time with no penalty. Below is a description of the research project, and your
            consent to participate. Read this information carefully. If you
            agree to participate, click "I agree" to indicate that you have read
            and understood the information provided on this consent form.
          </p>
          <h5 className="bp3-heading">TITLE OF RESEARCH PROJECT</h5>
          <p>Code Switching Between Communities</p>

          <h5 className="bp3-heading">PROCEDURES</h5>
          <p>
            If you agree to take part in the research, you will play a series of communication games
            with other participants: one of you will describe a picture for the other to choose out of
            a lineup of other pictures. All of the information we obtain during the research will be
            kept confidential, and not associated with your name in any way. However, while the study
            is running it will be associated with your MTurk worker id. Once the study is complete
            we will replace your worker id with a random string.
          </p>

          <h5 className="bp3-heading">CONFIDENTIALITY</h5>
          <p>
            The research project and information you learn by participating in
            the project is confidential. Accordingly, you agree to
            keep it secret as you would your own confidential information and
            never disclose it to anyone else (unless you are required to do
            under judicial or other governmental order). However, you do not
            need to keep secret specific information that is general public
            knowledge or that you legally receive from another source that is
            not affiliated with Microsoft so long as that source was entitled to
            share the information with you and did not obligate you to keep it a
            secret. You agree not to disclose to Microsoft any non-public
            information, whether yours or a third party’s without notifying
            Microsoft in advance.
          </p>

          <h5 className="bp3-heading">Benefits and Risks</h5>
          <p>
            <strong>Benefits:</strong> The research team expects to learn about
            how humans solve complex problems from this project which we hope
            will result in one or more academic publications. You will receive
            payment after completing this session as well as any public benefit
            that may come these Research Results being shared with the greater
            scientific community.{" "}
          </p>
          <p>
            <strong>Risks: </strong> During your participation, you may
            experience frustration if you are unable to solve a particular
            problem. To help reduce such risks, research team has generated
            problems of different difficulty levels.
          </p>

          <h5 className="bp3-heading">YOUR AUTHORITY TO PARTICIPATE</h5>
          <p>
            You represent that you have the full right and authority to sign
            this form, and if you are a minor that you have the consent (as
            indicated below) of your legal guardian to sign and acknowledge this
            form. By signing this form, you confirm that you understand the
            purpose of the project and how it will be conducted and consent to
            participate on the terms set forth above.

            If you have any questions about this research, do not hesitate to contact Robert
            Hawkins at hawkrobe@gmail.com. If you have any questions about your rights or treatment
            as a participant in this research project, please contact the Princeton Office for
            Research Integrity and Assurance by phone at 609-258-0865 or by email at ria@princeton.edu.
          </p>

          <p>
            By consenting to participate, you acknowledge that you are 18 years or older,
            have read this consent form, agree to its contents, and agree to take part in this research.
            If you do not wish to consent, close this page and return the HIT on Mechanical Turk.
          </p>

          <ConsentButton text="I AGREE" />
        </div>
      </Centered>
    );
  }

  renderNoFirefox = () => {
    console.log("this is fire fox");
    return (
      <div className="consent">
        <h1 className="bp3-heading" style={{ textAlign: "center", color: "red" }}>
          DO NOT USE FIREFOX!!
        </h1>
        <p style={{ textAlign: "center" }}>
          Please, don't use firefox! It breaks our game and ruins the experience
          for your potential teammates!
        </p>
      </div>
    );
  };

  render() {
    const browserHandler = {
      default: browser =>
        browser === "firefox" ? this.renderNoFirefox() : Consent.renderConsent()
    };

    return (
      <Centered>
        <BrowserDetection>{browserHandler}</BrowserDetection>
      </Centered>
    );
  }
}
