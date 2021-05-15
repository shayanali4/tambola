/**
 * Signin Firebase
 */

import React, { Component } from 'react';
import { connect } from 'react-redux';
import Button from '@material-ui/core/Button';

import Toolbar from '@material-ui/core/Toolbar';
import { Link } from 'react-router-dom';
import Input from 'reactstrap/lib/Input';
import LinearProgress from '@material-ui/core/LinearProgress';
import QueueAnim from 'rc-queue-anim';
import api from 'Api';
import CustomConfig from 'Constants/custom-config';
import { withStyles } from '@material-ui/core/styles';
import compose from 'recompose/compose';
import { push } from 'connected-react-router';
import { getParams } from 'Helpers/helpers';

import Ryhmes from 'Assets/data/rhymes';
import RctCollapsibleCard from 'Components/RctCollapsibleCard/RctCollapsibleCard';
import {getLocalDate, getFormtedDate, getFormtedDateTime, getFormtedTime, cloneDeep} from 'Helpers/helpers';
import timer from 'Components/Timer';
const GameStartTimer = timer(1000)(GameStartTimerCountdown);
const GameStartedTimer = timer(13000)(GameStartedTimerCountdown);

const numberWords = require('number-words');

// components

/*import {
	SessionSlider
} from 'Components/Widgets';
*/
// app config

import AlarmOn from '@material-ui/icons/AlarmOn';
import Event from '@material-ui/icons/Event';
import AppConfig from 'Constants/AppConfig';
import {getClientId,checkError } from 'Helpers/helpers';
import {isMobile} from 'react-device-detect';
import FormHelperText from '@material-ui/core/FormHelperText';
import {required} from 'Validations';
import { NotificationManager } from 'react-notifications';
import {convertToSec ,convertSecToHour} from 'Helpers/unitconversion';
// redux action
import Gamestart from './component/gamestart';
import Gametickets from './component/gametickets';
import {Speak} from 'Helpers/Speech';

import {
	signinUserInFirebase,
} from 'Actions';

//Auth File
import Auth from '../Auth/Auth';

const auth = new Auth();


const styles = theme => ({
  error: {
    backgroundColor: theme.palette.error.dark,
  },
  icon: {
    fontSize: 20,
		paddingRight : 10
  },
  iconVariant: {
    opacity: 0.9,
    marginRight: theme.spacing(1),
  },
  message: {
    display: 'flex',
    alignItems: 'center',
		fontSize : "14px",
    fontWeight : "bold",
		fontStyle : "italic"
  },
	anchorOriginBottomCenter	: {bottom : 0}
});

function GameStartTimerCountdown({timer, that})
{
	let totaltime = 1;


	let currentdate = getLocalDate(that.state.currentdate);

	 currentdate.setSeconds(currentdate.getSeconds() + timer.tick);

	if(that.state && that.state.launchdate)
	{

		if(getLocalDate(that.state.launchdate) >  currentdate && !that.props.showwinners)
		{
			totaltime	= Math.abs((getLocalDate(that.state.launchdate).getTime() - currentdate.getTime()) / 1000);
		}
		else {

			timer.stop();

			let startedTime  = Math.abs((currentdate.getTime() - getLocalDate(that.state.launchdate).getTime()) / 1000)/13;
			startedTime  = Math.floor(startedTime);
			let called_numbers = cloneDeep(that.state.next_numbers);
			let next_numbers =	[];

			if(startedTime < that.state.next_numbers.length && !that.props.showwinners)
			{
					called_numbers =  cloneDeep(that.state.next_numbers.slice(0,startedTime));
			}

			let {temp_winners, winners} = that.state;

							called_numbers.map((calling_number , key) =>
							{
								let winning_type = Object.keys(temp_winners).filter(function(key) {return temp_winners[key] === calling_number})

								if(winning_type && winning_type.length > 0)
								{
									winning_type.map(type => {
										winners[type] = calling_number;
										winners[type+calling_number] = temp_winners[type+calling_number];
									})
								}
							});

							if(startedTime < that.state.next_numbers.length && !that.props.showwinners)
							{
									next_numbers = cloneDeep(that.state.next_numbers.slice(startedTime,that.state.next_numbers.length))
							}
							that.setState({gameStarted : true , called_numbers : called_numbers,
							next_numbers :cloneDeep(that.state.next_numbers.slice(startedTime,that.state.next_numbers.length)),
							winners: winners
							});


		}
	}

	totaltime = convertSecToHour(totaltime);

	return (<span>{ totaltime.hh + ":" + totaltime.mm + ":" + totaltime.ss}</span>)
}


function GameStartedTimerCountdown({timer, that})
{

	let {number_table, called_numbers, next_numbers, numbers , tickets, winners, temp_winners ,gameStarted ,viewWinners, viewWinnersType, gameprice} = that.state;
	let calling_number  = '';

	if(!(next_numbers.length == 0 || (winners["quick_five"] && winners["star"] && winners["top_line"]
&& winners["middle_line"] && winners["bottom_line"] && winners["box_bonus"] && winners["full_sheet_bonus"]
&& winners["first_full_house"] && winners["second_full_house"] && winners["third_full_house"])
))
	{


		calling_number = next_numbers.shift();

		that.state.calling_number = calling_number;

		let numberToWord = numberWords.convert(calling_number);
		if(called_numbers && called_numbers.length == 0)
		{
				Speak("Game Started.");
		}
		Speak(Ryhmes[calling_number] + " "+ numberToWord);


		if(called_numbers.indexOf(that.state.calling_number) == -1)
		{
			called_numbers.push(that.state.calling_number);
		}
		that.state.next_numbers = next_numbers;
		that.state.timer_tick = that.state.timer_tick + 1;


	}

	let winning_type = Object.keys(temp_winners).filter(function(key) {return temp_winners[key] === calling_number})

	if(winning_type && winning_type.length > 0)
	{
		winning_type.map(type => {
			winners[type] = calling_number;
			winners[type+calling_number] = temp_winners[type+calling_number];
		})
	}

	if( (!calling_number || (winners["quick_five"] && winners["star"] && winners["top_line"]
&& winners["middle_line"] && winners["bottom_line"] && winners["box_bonus"] && winners["full_sheet_bonus"]
&& winners["first_full_house"] && winners["second_full_house"] && winners["third_full_house"])))
	{
			timer.stop();
	}


	return (<Gamestart  customProps ={{number_table, calling_number, called_numbers, numbers, tickets, winners,viewWinners,viewWinnersType,gameprice,
	gameStarted}} onViewWinners = {(winners,type) => that.setState({viewWinners : winners, viewWinnersType : type})} />)
}


class Signin extends Component {
	constructor(props) {
    super(props);
	this.state = {
		tickets : null,
		number_table:[[1,2,3,4,5,6,7,8,9,10],
									[11,12,13,14,15,16,17,18,19,20],
									[21,22,23,24,25,26,27,28,29,30],
									[31,32,33,34,35,36,37,38,39,40],
									[41,42,43,44,45,46,47,48,49,50],
									[51,52,53,54,55,56,57,58,59,60],
									[61,62,63,64,65,66,67,68,69,70],
									[71,72,73,74,75,76,77,78,79,80],
									[81,82,83,84,85,86,87,88,89,90]],
		next_numbers:[],
		called_numbers: [],
		gameStarted : false,
		numbers : [0,1,2,3,4,5,6,7,8,9],
		winners : {},
		viewWinners : null,
		viewWinnersType : "",
		gameprice : [],
		timer_tick : 1
}
}


	componentWillMount()
	{

	}

	componentDidMount()
  {

		 let {clientId }  = this.state ;

		 // let localData  = localStorage.getItem("gamepage");
		 //
		 // if(localData)
		 // {
			//  	localData = JSON.parse(localData);
			// 	this.setState(localData);
		 // }


		api.post('view-gamepage',{clientId })
	 .then(response =>
		 {
			 let tickets = response.data[1];
			 let launchdate = response.data[0][0].launchdate;
			 let currentdate = response.data[0][0].currentdate;
			// let next_numbers = response.data[0][0].drawsequence;
		//	 next_numbers = JSON.parse(next_numbers);

			let called_numbers = JSON.parse(response.data[0][0].called_numbers);
			let winners = JSON.parse(response.data[0][0].winners);
			let gameprice = JSON.parse(response.data[0][0].gameprice);
			if(winners)
			{
			Object.entries(winners).forEach(([key, value]) => {
				if(value && typeof(value) == "number")
				{
					if(winners[key+value] && winners[key+value].length > 0 && typeof(winners[key+value][0]) == "number")
					{
							winners[key+value] = tickets.filter(x => winners[key+value].indexOf(x.ticketid) > -1);
					}
				}
			});
		}
			 tickets = tickets.map(x =>{ x.ticket  = JSON.parse(x.ticket);  return x; });

			 let data = {};
			 data.tickets = tickets;
			 data.launchdate = launchdate;
			 data.currentdate = currentdate;
			data.temp_winners = winners;
			 data.next_numbers = called_numbers;
			 data.gameprice = gameprice;
		//	 localStorage.setItem("gamepage" , JSON.stringify(data));
		 	 this.setState(data);

	 		}
	 ).catch(error => {
				 console.log(error);
				 let errorMessage = error.response.data.errorMessage;
				 if(errorMessage){

					NotificationManager.error(errorMessage);
				 }
	 })
   }







	render() {

		const { tickets, launchdate, number_table , gameStarted , viewWinners, viewWinnersType ,winners } = this.state;
		const { loading ,disabled, classes} = this.props;


		// let potraitimage, landscapeimage;
		//
		// let image = isMobile ? {backgroundImage :  "url('"+require('Assets/img/signinbackground-potrait.jpg') + "')"} : {backgroundImage :  "url('"+require('Assets/img/signinbackground-landscape.jpg') + "')"}

		return (
			<QueueAnim type="bottom" duration={2000}>
				<div className="rct-session-wrapper pb-40" >
				<RctCollapsibleCard fullBlock>

					{!tickets &&
						<LinearProgress />
					}
					{open == true &&
								<div className="d-flex justify-content-between px-10 text-white rounded py-2 mb-20 bg-danger ">
												<div className ="pr-10">
																	<p> Dear Valued Customer , <br/><span className = "ml-10"> {"Your account was expired. Please contact on 8980906939 for your renewal."} </span></p>
												</div>
												<div>
														 <a href="#" className = "text-white pull-right" onClick={() => {this.setState({open : false})}}>  <i className="ti-close" ></i></a>
												</div>
							 </div>
				 }
				 {
			// 	 {isMobile &&
			//  				<button  className = "add-button addback-button text-white py-5"><i className = "fa fa-download pr-10"></i>{"Install " + (Organizationbrandname || Organizationname) }</button>
			// }
		}

			<div className = "row mx-5">
			<div className = "col-12 col-12 col-lg-8 offset-lg-2">
		<RctCollapsibleCard fullBlock customClasses = {"mb-10"} customStyles = {{backgroundColor : "#89393a"}}>
			<div className = "pt-20 pb-15" style = {{"fontSize" : "28px", fontWeight: "bold", "textAlign" : "center", fontFamily: 'Josefin Sans' , color : "#fbde36"}}>
			<u> JJMD Tambola </u> </div>

			</RctCollapsibleCard>
			</div>
			</div>




			<div className = "row mx-5">
			<div className = "col-12 col-lg-8 offset-lg-2 text-white" >
			{launchdate && !gameStarted &&

				<table class="table  ticket mb-0" style ={{backgroundColor : "#bd5741" , border : "grey" , borderStyle : "solid"}}>

            <tr class="sh">

                <th colSpan="3" className = "text-center" >

                    <span style={{float: "left"}}>

											{ getFormtedDate(launchdate)}
                    </span>

                    <GameStartTimer that = {this}  />

                    <span style={{float: "right"}}>

                      { getFormtedTime(launchdate)}
                    </span>

                </th>

            </tr>

        </table>
		 }

			</div>
			</div>


			<div className = "row mx-5">
			<div className = "col-12 col-lg-8 offset-lg-2 text-white" >
				<table class="table fs-16 ticket mb-15 mt-5" style ={{backgroundColor : "#d1c593" ,color : "#bd5741",fontFamily : "Reem Kufi" }}>

            {/* <tr class="sh">

                <th colSpan="3" className = "text-center" >

								JO JEETA WOHI SIKANDAR
                </th>

            </tr> */}

        </table>


			</div>
			</div>


{(gameStarted ) &&
	<GameStartedTimer that = {this}/>
}
<Gametickets tickets = {tickets} gameStarted = {gameStarted}  />
				</RctCollapsibleCard>

				</div>

			</QueueAnim>
		);
	}
}

// map state to props
const mapStateToProps = ({ authUser }) => {
	const { user, loading,disabled } = authUser;
	return { user, loading ,disabled}
}


export default compose (withStyles(styles), connect(mapStateToProps, {
	signinUserInFirebase,
	push
})) (Signin);
