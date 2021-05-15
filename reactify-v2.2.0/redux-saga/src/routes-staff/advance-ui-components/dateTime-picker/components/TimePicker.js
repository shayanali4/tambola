// Time Picker
import React, { Component } from 'react';
import { TimePicker } from '@material-ui/pickers';

export default class TimePickers extends Component {
  state ={
    selectedTime:null,
  }

    handleDateChange = (date) => {
        this.props.onChange(date);
        this.setState({selectedTime : date});
    };


    render() {
        var { label, value ,disabled} = this.props;
        const { selectedTime } = this.state;

        value = value === undefined ? selectedTime : value;

        return (
            <div className="rct-picker">
                <div className="picker">
                    <TimePicker
                        label={label}
                        clearable
                        value={value || null}
                        onChange={this.handleDateChange}
                        fullWidth
                        autoOk = {true}
                        disabled ={disabled || false}
                    />
                </div>
            </div>
        )
    }
}
