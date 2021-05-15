import React from 'react';
import PropTypes from 'prop-types';
import PlayCircleOutline from '@material-ui/icons/PlayCircleOutline';
import PauseCircleOutline from '@material-ui/icons/PauseCircleOutline';
import Restore from '@material-ui/icons/Restore';
import {convertSecToHour} from 'Helpers/unitconversion';
import RctSectionLoader from 'Components/RctSectionLoader/RctSectionLoader';
import CloseIcon from '@material-ui/icons/Close';

import Tooltip from '@material-ui/core/Tooltip';
import {isMobile} from 'react-device-detect';
import {Speak} from 'Helpers/Speech';
const numberWords = require('number-words');




class CircularProgressbar extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    if (this.props.initialAnimation) {
      this.initialTimeout = setTimeout(() => {
        this.requestAnimationFrame = window.requestAnimationFrame(() => {
        });
      }, 0);
    }
  }

  shouldComponentUpdate(nextProps, nextState)
  {
    return true;
  }

  componentWillUnmount() {
    clearTimeout(this.initialTimeout);
    window.cancelAnimationFrame(this.requestAnimationFrame);
  }


  render() {
    const { tickets ,gameStarted } = this.props;


    return (

      				<div className = "row mx-5 pb-30">
      				<div className = "col-12 ">


      						{!tickets &&
      							<RctSectionLoader />
      						}
      {!gameStarted &&
      						<div className="row" >
      					  {tickets && tickets.map((x, key) =>
      					     (<div className="col-12 col-lg-8 offset-lg-2" key = {"ticket-" + key}>
      					                <table className="table mt-2 ticket"><tbody><tr className="mh bg-secondary">
      					                <th colSpan="9"> TICKET : {key + 1} <span className = "text-warning"> {x.customer ? "( " + x.customer + " )" : ""} </span></th></tr>

      					                {
      					                  x.ticket && x.ticket.map((tr,ckey) => (
      					                    <tr key = {"tr-" + key + "-" + ckey }>
      					                    <td className = {"text-white fw-bold fs-16 px-5 " + (ckey == 1 ? "bg-danger" : "bg-primary") } style = {{"textAlign" : 'center',"border" : "1px solid #ffffff"}}>
      					                                      {tr[0] || ' '}
      					                                  </td><td className = {"text-white fw-bold fs-16 px-0 " + (ckey == 1 ? "bg-primary" : "bg-danger") } style = {{"textAlign" : 'center',"border" : "1px solid #ffffff"}}>
      					                                      {tr[1] || ' '}
      					                                  </td><td className = {"text-white fw-bold fs-16 px-0 " + (ckey == 1 ? "bg-danger" : "bg-primary") } style = {{"textAlign" : 'center',"border" : "1px solid #ffffff"}}>
      					                                  {tr[2] || ' '}
      					                                  </td><td className = {"text-white fw-bold fs-16 px-0 " + (ckey == 1 ? "bg-primary" : "bg-danger") } style = {{"textAlign" : 'center',"border" : "1px solid #ffffff"}}>
      					                                      {tr[3] || ' '}
      					                                  </td><td className = {"text-white fw-bold fs-16 px-0 " + (ckey == 1 ? "bg-danger" : "bg-primary") } style = {{"textAlign" : 'center',"border" : "1px solid #ffffff"}}>
      					                                    {tr[4] || ' '}
      					                                  </td><td className = {"text-white fw-bold fs-16 px-0 " + (ckey == 1 ? "bg-primary" : "bg-danger") } style = {{"textAlign" : 'center',"border" : "1px solid #ffffff"}}>
      					                                      {tr[5] || ' '}
      					                                  </td><td className = {"text-white fw-bold fs-16 px-0 " + (ckey == 1 ? "bg-danger" : "bg-primary") } style = {{"textAlign" : 'center',"border" : "1px solid #ffffff"}}>
      					                                      {tr[6] || ' '}
      					                                  </td><td className = {"text-white fw-bold fs-16 px-0 " + (ckey == 1 ? "bg-primary" : "bg-danger") } style = {{"textAlign" : 'center',"border" : "1px solid #ffffff"}}>
      					                                  {tr[7] || ' '}
      					                                  </td><td className = {"text-white fw-bold fs-16 px-0 " + (ckey == 1 ? "bg-danger" : "bg-primary") } style = {{"textAlign" : 'center',"border" : "1px solid #ffffff"}}>
      					                                  {tr[8] || ' '}
      					                                  </td></tr>
      					                  ))
      					                }

      					</tbody></table>
      					</div>))
      					}
      					    </div>
      }
      						</div>

      				</div>

    );
  }
}

CircularProgressbar.propTypes = {
  styles: PropTypes.objectOf(PropTypes.object),
  counterClockwise: PropTypes.bool,
};

CircularProgressbar.defaultProps = {

  styles: {
    root: {},
    trail: {},
    path: {},
    text: {},
    background: {},
  },
  counterClockwise: false,
};

export default CircularProgressbar;
