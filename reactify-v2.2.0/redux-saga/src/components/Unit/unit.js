/**
 * Employee Management Page
 */
import React, { Component,PureComponent } from 'react';
import { connect } from 'react-redux';

import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import RctSectionLoader from 'Components/RctSectionLoader/RctSectionLoader';

import Input from 'reactstrap/lib/Input';
import Col from 'reactstrap/lib/Col';
import api from 'Api';
import CloseIcon from '@material-ui/icons/Close';

import InputGroup from 'reactstrap/lib/InputGroup';
import InputGroupAddon from 'reactstrap/lib/InputGroupAddon';

import AddBox from '@material-ui/icons/AddCircle';
import InputAdornment from '@material-ui/core/InputAdornment';
import Button from '@material-ui/core/Button';
import RemoveBox from '@material-ui/icons/RemoveCircle';

import {cloneDeep } from 'Helpers/helpers';
import {convertToSec ,convertSecToHour,convertkgTolbs,convertlbsTokg,convertkmTomiles,convertmilesTokm,convertmphTokph,convertkphTomph} from 'Helpers/unitconversion';
import { opnMemberUnitModel ,clsMemberUnitModel,changeWeightUnit,changeDistanceUnit,changeLengthUnit,saveMemberUnit,changeTemperatureUnit} from 'Actions';
import { NotificationManager } from 'react-notifications';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import IconButton from '@material-ui/core/IconButton';
import { RctCard } from 'Components/RctCard';
import CustomConfig from 'Constants/custom-config';
import classnames from 'classnames';
import Switch from '@material-ui/core/Switch';
import { withStyles } from '@material-ui/core/styles';
import styles from 'Components/Switch-style/index';
import compose from 'recompose/compose';
import InputLabel from '@material-ui/core/InputLabel';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Assistant from '@material-ui/icons/Assistant';
 class Unit extends PureComponent {

	 constructor(props) {
	 		 super(props);
	 						 this.state = this.getInitialState();
	 				}

					getInitialState()
					 {
							 this.initialState = {
                  		};
						 	 return cloneDeep(this.initialState);
					 }


   onChange(key,value)
	 {
       let {weightunit,distanceunit,lengthunit,temperatureunit} = this.props;
       if(key == 'weightunit')
       {

         weightunit = value == true ? 1 : 0;
         this.props.changeWeightUnit({weightunit});

         this.props.onChange();

       }
       if(key == 'distanceunit')
       {
         distanceunit = value == true ? 1 : 0;
          this.props.changeDistanceUnit({distanceunit});
          this.props.onChange();
       }
       if(key == 'lengthunit')
       {
         lengthunit = value == true ? 1 : 0;
          this.props.changeLengthUnit({lengthunit});
          this.props.onChange();
       }
       if(key == 'temperatureunit')
       {
         temperatureunit = value == true ? 1 : 0;
          this.props.changeTemperatureUnit({temperatureunit});
          this.props.onChange();
       }
 }

     onOpn() {
      this.props.opnMemberUnitModel();
     }
    onCancel()
  	 {
        this.props.clsMemberUnitModel();
        this.setState(this.getInitialState());
   }

	render() {

      let {weightunit,distanceunit,lengthunit,opnunitDialog,temperatureunit} = this.props;
      return (
			<div className ="d-inline">
              { (weightunit != null || distanceunit != null || lengthunit != null || temperatureunit != null) &&
                <a href="javascript:void(0)" className = {"text-warning"}  onClick={() => this.onOpn()}><Assistant /></a>
              }


              <Dialog  onClose={this.props.clsMemberUnitModel}   open={opnunitDialog}>
                  <DialogTitle >
                    <span>Measurement Unit</span>
                    <CloseIcon onClick={this.props.clsMemberUnitModel} className = {"pull-right pointer"}/>
                  </DialogTitle>

                <DialogContent>

                <div className="clearfix d-flex">
                  <div className="media-body">
                  <div className="row">
                  <div className="col-12">
                       <InputLabel  className ={'pt-20'}  htmlFor="routinetype">How do you wish to enter/view weights in?</InputLabel>
                   </div>
                  <div className="col-12 d-flex">
                  <InputLabel className = {'pt-10 pr-5 ' + (weightunit == 0 ? 'fw-bold' : '') }  htmlFor="routinetype">kg</InputLabel>
                            <FormControlLabel className ={'mr-0 pl-10'}
                      control={
                        <Switch
                          checked={weightunit == 0 ? false : true}
                          onChange={(e) =>this.onChange('weightunit',e.target.checked)}

                          />
                      }
                    />
                    <InputLabel className ={'pt-10 ' + (weightunit == 1 ? 'fw-bold' : '') } htmlFor="routinetype">lbs</InputLabel>
                   </div>
                    </div>
                    <div className="row">
                           <div className="col-12">
                        <InputLabel  className ={'pt-20'}  htmlFor="routinetype">For cardio exercises, How do you wish to enter/view distance ?</InputLabel>
                    </div>
                   <div className="col-12 d-flex">
                   <InputLabel className ={'pt-10 pr-5 ' + (distanceunit == 0 ? 'fw-bold' : '') }    htmlFor="routinetype">km</InputLabel>
                             <FormControlLabel className ={'mr-0 pl-10'}
                       control={
                         <Switch
                           checked={ distanceunit == 0 ? false : true}
                           onChange={(e) =>this.onChange('distanceunit',e.target.checked)}
                           />
                       }
                       />

                     <InputLabel className ={'pt-10 ' + (distanceunit == 1 ? 'fw-bold' : '') }   htmlFor="routinetype">mile</InputLabel>
                    </div>
                    </div>

                    <div className="row">
                    <div className="col-12">
                         <InputLabel  className ={'pt-20'}  htmlFor="routinetype">How do you wish to enter/view body measurement ?</InputLabel>
                     </div>
                    <div className="col-12 d-flex">
                    <InputLabel className ={'pt-10 pr-5 ' + (lengthunit == 0 ? 'fw-bold' : '') }  htmlFor="routinetype">cm</InputLabel>
                              <FormControlLabel className ={'mr-0 pl-10'}
                        control={
                          <Switch
                            checked={lengthunit == 0 ? false : true}
                            onChange={(e) =>this.onChange('lengthunit',e.target.checked)}

                            />
                        }
                      />
                      <InputLabel className ={'pt-10 ' + (lengthunit == 1 ? 'fw-bold' : '') }   htmlFor="routinetype">inch</InputLabel>
                     </div>
                      </div>


                      <div className="row">
                      <div className="col-12">
                           <InputLabel  className ={'pt-20'}  htmlFor="routinetype">How do you wish to enter/view temperature ?</InputLabel>
                       </div>
                      <div className="col-12 d-flex">
                      <InputLabel className ={'pt-10 pr-5 ' + (temperatureunit == 0 ? 'fw-bold' : '') }  htmlFor="routinetype">°C</InputLabel>
                                <FormControlLabel className ={'mr-0 pl-10'}
                          control={
                            <Switch
                              checked={temperatureunit == 0 ? false : true}
                              onChange={(e) =>this.onChange('temperatureunit',e.target.checked)}

                              />
                          }
                        />
                        <InputLabel className ={'pt-10 ' + (temperatureunit == 1 ? 'fw-bold' : '') }   htmlFor="routinetype">°F</InputLabel>
                       </div>
                        </div>


                  </div>
                  </div>
                </DialogContent>

                  </Dialog>

	</div>
	);
  }
  }

	const mapStateToProps = ({ settings}) => {
		const { opnunitDialog,weightunit ,distanceunit,lengthunit,temperatureunit } =  settings;
	  return { opnunitDialog ,weightunit,distanceunit,lengthunit,temperatureunit}
	}

	export default compose (withStyles(styles),connect(mapStateToProps,{opnMemberUnitModel,clsMemberUnitModel,changeWeightUnit,
    changeDistanceUnit,changeLengthUnit,saveMemberUnit,changeTemperatureUnit}))(Unit);
