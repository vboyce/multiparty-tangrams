import { relativeTimeRounding } from "moment";
import React from "react";


export default class Tangram extends React.Component {
    
  handleClick = e => {
    const { game, tangram, tangram_num, stage, player, round } = this.props;
    const speakerMsgs = _.filter(round.get("chat"), msg => {
      return msg.role == 'speaker'    })
    const partner1 = _.find(game.players, p => p._id === player.get('partner1'));
    const partner2 = _.find(game.players, p => p._id === player.get('partner2'));
    // only register click for listener and only after the speaker has sent a message
    if (stage.name == 'selection' &
        speakerMsgs.length > 0 &
        player.get('clicked') === false &
        player.get('role') == 'listener') {
      player.set("clicked", tangram)
    if ((partner1.get('clicked') !="" || partner1.get('role') == 'speaker') &
    (partner2.get('clicked') !="" || partner2.get('role') == 'speaker')){
      player.set('done', true);
      partner1.set('done', true);
      partner2.set('done', true);
      const target = round.get("target")
      if (partner1.get("clicked")==target){
        round.set("roundbonus", round.get("roundbonus")+.02)
      }
      if (partner2.get("clicked")==target){
        round.set("roundbonus", round.get("roundbonus")+.02)
      }
      if (player.get("clicked")==target){
        round.set("roundbonus", round.get("roundbonus")+.02)
      }
      Meteor.setTimeout(() => player.stage.submit(), 3000);
      Meteor.setTimeout(() => partner1.stage.submit(), 3000);
      Meteor.setTimeout(() => partner2.stage.submit(), 3000);
    }
    }
  };

  render() {
    const { game, tangram, tangram_num, round, stage, player, ...rest } = this.props;
    const partner1 = _.find(game.players, p => p._id === player.get('partner1'));
    const partner2 = _.find(game.players, p => p._id === player.get('partner2'));
    const target = round.get("target")
    const row = 1 + Math.floor(tangram_num / 4)
    const column = 1 + tangram_num % 4
    const mystyle = {
      "background" : "url(" + tangram + ")",
      "backgroundSize": "cover",
      "width" : "25vh",
      "height" : "25vh",
      "gridRow": row,
      "gridColumn": column
    };

    // Highlight target object for speaker at selection stage
    // Show it to both players at feedback stage.
    if(target == tangram & player.get('role') == 'speaker') {
      _.extend(mystyle, {
        "outline" :  "10px solid #000",
        "zIndex" : "9"
      })
    }

    // Highlight clicked object in green if correct; red if incorrect
    if(player.get('done') === true & (tangram == player.get('clicked') ||
     (player.get('role')== "speaker" & 
          (tangram == partner1.get('clicked') || tangram == partner2.get('clicked'))))) {
      const color = tangram == target ? 'green' : 'red';
      _.extend(mystyle, {
        "outline" :  `10px solid ${color}`,
        "zIndex" : "9"
      })
    }
    let feedback = (
      player.get('role') == 'listener' ? '' :
      player.get('done') == false ? "" :
          partner1.get("clicked")==tangram ? (partner2.get("clicked")==tangram ?
          partner1.get("name")+" "+partner2.get("name") : partner1.get("name") ):
          partner2.get("clicked")==tangram ? partner2.get("name"): ""
         
    )
    
    return (
      <div
        onClick={this.handleClick}
        style={mystyle}
        >
          <div className="feedback"> {feedback}</div>
      </div>
    );
  }
}
