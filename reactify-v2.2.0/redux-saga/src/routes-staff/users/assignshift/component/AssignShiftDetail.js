/**
 * Employee Management Page
 */
import React, { Component } from 'react';

import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import TextField  from '@material-ui/core/TextField';
import RctCollapsibleCard from 'Components/RctCollapsibleCard/RctCollapsibleCard';
import DatePicker from 'Routes/advance-ui-components/dateTime-picker/components/DatePicker';
import Combobox from 'Routes/advance-ui-components/autoComplete/component/Combobox';
import {cloneDeep} from 'Helpers/helpers';

export default class AssignShiftList extends Component {

	render() {
   const {fields, errors, onChange , employeeList , shiftList} = this.props;
   let employeeNewList = employeeList ? cloneDeep(employeeList) : [];
   employeeNewList.map(x => { x.value = x.id;  x.label = x.label + " - " + x.employeecode; return x; });

			return (
      <div className="textfields-wrapper">
        <RctCollapsibleCard >
           <form noValidate autoComplete="off">

              <div className="row">
                <div className="col-sm-12 col-md-4 col-xl-6">
                  <FormControl fullWidth>
                      <Combobox
                        onChange={(value) => onChange('employee',value)}
                        value={fields.employee} label = {"Select Employee"} options = {employeeNewList}/>
                        <FormHelperText  error>{errors.employee}</FormHelperText>

                  </FormControl>
                 </div>

                 <div className="col-sm-12 col-md-4 col-xl-6">
                   <FormControl fullWidth>
                       <Combobox
                         onChange={(value) => onChange('shift',value)}
                         value={fields.shift} label = {"Select Shift"} options = {shiftList}/>
                         <FormHelperText  error>{errors.shift}</FormHelperText>

                   </FormControl>
                  </div>

                 <div className="col-sm-12 col-md-4 col-xl-6">
                   <div className="rct-picker">
                       <DatePicker  label = "Start Date *" minDate = {fields.id != 0 ? (new Date(fields.startdate).getTime() > new Date().getTime() ? new Date() : fields.startdate) :  new Date()} value ={fields.startdate} onChange = {(date) => onChange('startdate',date ,true) }/>
                   </div>
                   <FormHelperText  error>{errors.startdate}</FormHelperText>
                 </div>

                 <div className="col-sm-12 col-md-4 col-xl-6">
                   <div className="rct-picker">
                       <DatePicker  label = "End Date *" minDate = {fields.id != 0 ? (new Date(fields.enddate).getTime() > new Date().getTime() ? new Date() : fields.enddate) :  new Date()} value ={fields.enddate} onChange = {(date) => onChange('enddate',date ,true) }/>
                   </div>
                   <FormHelperText  error>{errors.enddate}</FormHelperText>
                 </div>
              </div>

          </form>
        </RctCollapsibleCard>
      </div>

	);
  }
  }
