import React from 'react';
import { PropTypes } from 'prop-types';;
import MediaContainer from './MediaContainer';
import Communication from './Communication';

import { connect } from 'react-redux';
import {setVideo, setAudio} from 'Actions';
class CommunicationContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      sid: '',
      message: '',
      audio: true,
      video: true
    };
    this.handleInvitation = this.handleInvitation.bind(this);
    this.handleHangup = this.handleHangup.bind(this);
    this.handleReconnect = this.handleReconnect.bind(this);

    this.handleInput = this.handleInput.bind(this);
    this.toggleVideo = this.toggleVideo.bind(this);
    this.toggleCamera = this.toggleCamera.bind(this);
    this.toggleAudio = this.toggleAudio.bind(this);
    this.send = this.send.bind(this);
  }
  hideAuth() {
    this.props.media.setState({bridge: 'connecting'});
  }
  full(that) {
      if(that.props.media)
      {
        that.props.media.setState({bridge: 'full'});
      }
  }
  componentWillReceiveProps(nextProps, nextState) {
    if(nextProps.facingMode != this.props.facingMode)
    {
      this.props.getUserMedia
        .then(stream => {
          if(stream)
          {
            this.localStream = stream;
            this.forceUpdate();
          }
        });
    }
  }
  componentDidMount() {
    const socket = this.props.socket;
    console.log('props', this.props)
    this.setState({video: this.props.video, audio: this.props.audio});

    socket.on('create', () =>
      this.props.media.setState({user: 'host', bridge: 'create'}));
    socket.on('full', this.full(this));
    socket.on('bridge', role => this.props.media.init());
    socket.on('join', () =>
      this.props.media.setState({user: 'guest', bridge: 'join'}));
    socket.on('approve', ({ message, sid }) => {
      this.props.media.setState({bridge: 'approve'});
      this.setState({ message, sid });
    });
    socket.emit('find');
    this.props.getUserMedia
      .then(stream => {
          this.localStream = stream;
          this.localStream.getVideoTracks()[0].enabled = this.state.video;
          this.localStream.getAudioTracks()[0].enabled = this.state.audio;
        });
  }
  handleInput(e) {
    this.setState({[e.target.dataset.ref]: e.target.value});
  }
  send(e) {
    e.preventDefault();
    this.props.socket.emit('auth', this.state);
    this.hideAuth();
  }
  handleInvitation(e) {
    e.preventDefault();
    this.props.socket.emit([e.target.dataset.ref], this.state.sid);
    this.hideAuth();
  }
  toggleVideo() {
    const video = this.localStream.getVideoTracks()[0].enabled = !this.state.video;
    this.setState({video: video});
    this.props.setVideo(video);
  }
  toggleCamera()
  {
    this.props.toggleCamera();
  }
  toggleAudio() {
    const audio = this.localStream.getAudioTracks()[0].enabled = !this.state.audio;
    this.setState({audio: audio});
    this.props.setAudio(audio);
  }
  handleHangup() {
    this.props.media.hangup();
  }

  handleReconnect() {
    const socket = this.props.socket;
    socket.emit('find');
  }
  render(){
    return (
      <Communication
        {...this.state}
        toggleVideo={this.toggleVideo}
        toggleCamera = {this.toggleCamera}
        toggleAudio={this.toggleAudio}
        send={this.send}
        handleHangup={this.handleHangup}
        handleReconnect ={this.handleReconnect}
        handleInput={this.handleInput}
        handleInvitation={this.handleInvitation}
        />
    );
  }
}

const mapStateToProps = ({ personaltrainingReducer  }) => {
  const { video,audio } =  personaltrainingReducer;
  return { video,audio }
}


CommunicationContainer.propTypes = {
  socket: PropTypes.object.isRequired,
  getUserMedia: PropTypes.object.isRequired,
  audio: PropTypes.bool.isRequired,
  video: PropTypes.bool.isRequired,
  setVideo: PropTypes.func.isRequired,
  setAudio: PropTypes.func.isRequired,
  toggleCamera : PropTypes.func.isRequired,
  media: PropTypes.instanceOf(MediaContainer)
};
export default connect(mapStateToProps, {setVideo, setAudio})(CommunicationContainer);
