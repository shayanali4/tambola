import React from 'react';
import { PropTypes } from 'prop-types';
import { Link } from 'react-router-dom';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import MicIcon from '@material-ui/icons/Mic';
import MicOffIcon from '@material-ui/icons/MicOff';
import VideoCallIcon from '@material-ui/icons/VideoCall';
import VideocamOffIcon from '@material-ui/icons/VideocamOff';
import CallEndIcon from '@material-ui/icons/CallEnd';
import RefreshIcon from '@material-ui/icons/Refresh';
import screenfull from 'Components/Screenfull';
import CameraFront from '@material-ui/icons/FlipCameraIos';

const Communication = props =>
{
 return (<div className="auth">
    <div className="media-controls">
      <a className="call-exit-button" onClick={(e) => {e.preventDefault();   window.history.back(); }}>
        <ArrowBackIcon className = "text-white"/>
      </a>
      <button onClick={props.toggleAudio} className={'audio-button-' + props.audio}>
          <MicIcon className="off text-white" />
          <MicOffIcon className="on text-white"  />
      </button>
      <button onClick={props.toggleVideo} className={'video-button-' + props.video}>
          <VideoCallIcon  className="off text-white"/>
          <VideocamOffIcon  className="on text-white" />
      </button>

        {/*
          <button onClick={props.toggleCamera} className={'video-button-camera'}>
          <CameraFront  className="text-white"/>
      </button> */}


      <button onClick={props.handleHangup} className="hangup-button">
        <CallEndIcon className = "text-white"/>
      </button>
      <button onClick={props.handleReconnect} className="reconnect-button">
        <RefreshIcon className = "text-white"/>
      </button>
      <button onClick={() => screenfull.toggle()} className="call-exit-button">
        <i className="zmdi zmdi-crop-free text-white"></i>
      </button>



    </div>
    <div className="request-access">
      <p className ="text-white"><span >You hung up.&nbsp;</span>Send an invitation to join the room.</p>
      <form onSubmit={props.send}>
        <input type="text" autoFocus onChange={props.handleInput} data-ref="message"  maxLength="30" required placeholder="Hi, I'm John Doe." />
        <button className="primary-button">Send</button>
      </form>
    </div>
    <div className="grant-access">
      <p className = "text-white">Please accept to join the room:</p>
      <div className = "text-white pl-5">{props.message}</div>
      <button onClick={props.handleInvitation} data-ref="reject" className="primary-button">Reject</button>
      <button onClick={props.handleInvitation} data-ref="accept" className="primary-button">Accept</button>
    </div>
    <div className="room-occupied">
      <p className="text-white">Please, try another room!</p>
      <Link  className="primary-button" to="/">OK</Link>
    </div>
    <div className="waiting">
      <p><span className = "text-white">Waiting for joining this room</span><br/>
      <span className="remote-left text-white">The remote side hung up.</span></p>
    </div>
  </div>
);

Communication.propTypes = {
  message: PropTypes.string.isRequired,
  audio: PropTypes.bool.isRequired,
  video: PropTypes.bool.isRequired,
  toggleVideo: PropTypes.func.isRequired,
  toggleAudio: PropTypes.func.isRequired,
  send: PropTypes.func.isRequired,
  handleHangup: PropTypes.func.isRequired,
  handleInput: PropTypes.func.isRequired,
  handleInvitation: PropTypes.func.isRequired
};
}
export default Communication;
