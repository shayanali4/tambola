
import React, { Fragment, Component } from "react";
import Button from '@material-ui/core/Button';

export default class CodeVerification extends React.Component {
	constructor() {
     super();
     this.state = { time: {}, seconds: 30 };
     this.timer = 0;
     this.startTimer = this.startTimer.bind(this);
     this.countDown = this.countDown.bind(this);
   }
	 secondsToTime(secs){
    let hours = Math.floor(secs / (60 * 60));

    let divisor_for_minutes = secs % (60 * 60);
    let minutes = Math.floor(divisor_for_minutes / 60);

    let divisor_for_seconds = divisor_for_minutes % 60;
    let seconds = Math.ceil(divisor_for_seconds);

    let obj = {
      "h": hours,
      "m": minutes,
      "s": seconds
    };
    return obj;
  }

  componentDidMount() {
    let timeLeftVar = this.secondsToTime(this.state.seconds);
    this.setState({ time: timeLeftVar });
  }

  startTimer(timer,seconds) {
		timer = timer == undefined ? this.timer : timer;
		seconds = seconds == undefined ? this.state.seconds : seconds;

    if (timer == 0 && seconds > 0) {
      this.timer = setInterval(this.countDown, 1000);
    }
  }

  countDown() {
    // Remove one second, set state so a re-render happens.
    let seconds = this.state.seconds - 1;
    this.setState({
      time: this.secondsToTime(seconds),
      seconds: seconds,
    });

    // Check if we're at zero.
    if (seconds == 0) {
      clearInterval(this.timer);
    }
  }

componentWillMount(){
  this.startTimer()
}
componentWillReceiveProps(newProps){
	if((newProps.emailVerificationCode != this.props.emailVerificationCode) || newProps.mobileVerificationCode != this.props.mobileVerificationCode){
		let	timer = 0;
    let seconds = 30;
		this.setState({
			time: {},
			seconds: seconds,
			timer : timer
		});
		this.startTimer(timer,seconds);

	}
}
	render() {
    const {emailVerificationCode,disabled,onClickEnterVerificationCode,mobileVerificationCode} = this.props;
	return (

    <div>
			    { this.state.time.s != 0 ?
			      		  <div>{this.state.time.s} secs remaining</div>
			            :
			              <Button id ="resendOTPbutton"  disabled ={disabled} variant="contained"  onClick={() => onClickEnterVerificationCode(emailVerificationCode != '' ? 1 : 0)}  className="text-white btn-primary">
			                    Resend OTP
			              </Button>
			    }
    </div>
		);
	}
}
