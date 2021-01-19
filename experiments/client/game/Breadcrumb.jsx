import React from "react";
import { Breadcrumb as Crumb, Classes } from "@blueprintjs/core";

export default class customBreadcrumb extends React.Component {
  render() {
    const { game, round, stage } = this.props;
    return (
      <nav className="round-nav">
        <ul className={Classes.BREADCRUMBS}>
          <li key={round.index}>
            <Crumb
              text={"Partner " + (1 + round.get('partnerNum')) +
                    " / " + round.get('numPartners')}
              className={Classes.BREADCRUMB_CURRENT}
            />
          </li>
          <li>
            <Crumb
              text={"Round " + (1 + round.get('trialNum')) +
                    " / " + round.get('numTrials')}
              className={Classes.BREADCRUMB_CURRENT}
            />
          </li>
        </ul>
      </nav>
    );
  }
}
