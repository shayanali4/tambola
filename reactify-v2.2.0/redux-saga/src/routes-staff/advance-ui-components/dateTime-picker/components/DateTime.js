// Date Time Picker
import React, { Fragment, PureComponent } from 'react';
import  { DateTimePicker } from '@material-ui/pickers';
import CustomConfig from 'Constants/custom-config';


export default class DefaultDateAndTimePickers extends PureComponent {

	state ={
	  selectedDate:null,
	}

	    handleDateChange = (date) => {
	        this.props.onChange(date);
	        this.setState({selectedDate : date});
	    };
	    render() {
	         var { label, value ,disabled, style, keyboard,disablePast,disableFuture,minDate,maxDate} = this.props;
	         const { selectedDate } = this.state;

	         value = value === undefined ? selectedDate : value;
	         style = style || {};


	        return (
	            <Fragment>
	                <div className="rct-picker">
	                    <DateTimePicker
	                        placeholder={CustomConfig.dateFormat}
	                        label= {label}
	                        keyboard = {keyboard.toString()}
	                        value={value}
	                        disabled ={disabled}
	                        disablePast = {disablePast}
	                        disableFuture = {disableFuture}
	                        minDate={minDate}
													maxDate={maxDate}
	                        format={CustomConfig.dateFormat+ ' ' + CustomConfig.timeFormat}
	                        onChange={this.handleDateChange}
	                        animateYearScrolling={false}
	                        leftArrowIcon={<i className="zmdi zmdi-arrow-back" />}
	                        rightArrowIcon={<i className="zmdi zmdi-arrow-forward" />}
	                        fullWidth
	                        clearable = {true}
	                        autoOk = {true}
	                        style={style}
	                    />
	                </div>
	            </Fragment>
	        )

	    }
	}

	DefaultDateAndTimePickers.defaultProps = { minDate: '1900-01-01' ,disableFuture :false ,disablePast : false ,keyboard:true };
