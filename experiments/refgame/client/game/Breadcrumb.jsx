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
              text={"Block " + (1 + round.get('repNum')) +
                    " / " + round.get('reps')}
              className={Classes.BREADCRUMB_CURRENT}
            />
          </li>
          <li>
            <Crumb
              text={"Round " + (1 + round.get('targetNum')) +
                    " / " + round.get('numTargets')}
              className={Classes.BREADCRUMB_CURRENT}
            />
          </li>
        </ul>
      </nav>
    );
  }
}
