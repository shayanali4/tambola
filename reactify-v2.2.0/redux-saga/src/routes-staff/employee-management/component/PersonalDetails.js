import React , {PureComponent} from 'react';
import FormControl  from '@material-ui/core/FormControl';
import TextField  from '@material-ui/core/TextField';
import FormHelperText from '@material-ui/core/FormHelperText';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import AutoSuggest from 'Routes/advance-ui-components/autoComplete/component/AutoSuggest';
import Form from 'reactstrap/lib/Form';import FormGroup from 'reactstrap/lib/FormGroup';
import RctCollapsibleCard from 'Components/RctCollapsibleCard/RctCollapsibleCard';
import DatePicker from 'Routes/advance-ui-components/dateTime-picker/components/DatePicker';
import Bloodgroup  from 'Assets/data/bloodgroup';
import api from 'Api';
import TimePicker from 'Routes/advance-ui-components/dateTime-picker/components/TimePicker';
import ReactTable from "react-table";
import   Checkbox  from '@material-ui/core/Checkbox';
import {isMobile} from 'react-device-detect';

export default class PersonalDetail extends PureComponent {

    getCountry = (value) =>
    {
            api.post('country-suggestion', {value})
            .then(response => {
              this.props.onChange('countryArray', response.data[0]);
            }).catch(error => console.log(error) )
    }

    getState = (value) =>
    {
            api.post('state-suggestion', {value})
            .then(response => {
              this.props.onChange('stateArray', response.data[0]);
            }).catch(error => console.log(error) )
    }
    handleChangeSchedule = (id, key, value , isRequired, index) => {
        this.props.onChange('schedule', {id , key , value} , isRequired, index);
      };
  render() {

    const {fields, errors, onChange,onAdd, onRemove} = this.props;
    // const isDisabled = 	fields.permentaddress1 = fields.address1;

    return (
      <div className="textfields-wrapper">
      <RctCollapsibleCard >
      <form noValidate autoComplete="off">
      <div className="row">
      <div className="col-sm-12 col-md-6 col-xl-6 d-inline">
                  <div className="row">
                                  <div className="col-12 col-md-12">
                                          {fields.duration.map((x,key) =>  (
                                                   <div className="col-12 d-flex pl-0 pt-5" key = {"list-duration" + key}>
                                                         <div className="col-6 col-sm-6 col-xl-4 pl-0">
                                                               <div className="rct-picker">
                                                                 <TimePicker label = "Start Time" value ={x.starttime} onChange = {(date) => {onChange('starttime',date,true,key)} }/>
                                                                 {errors.starttime &&	<FormHelperText  error>{errors.starttime}</FormHelperText> }
                                                               </div>
                                                         </div>
                                                         <div className="col-6 col-sm-6 col-xl-4">
                                                                   <div className="rct-picker">
                                                                     <TimePicker label = "End Time" value ={x.endtime} onChange = {(date) => {onChange('endtime',date,true,key)} } />
                                                                     {errors.endtime &&	<FormHelperText  error>{errors.endtime}</FormHelperText>}
                                                                   </div>
                                                        </div>
                                                        <a href="#" className= "mt-20" onClick={(e) =>{e.preventDefault(); onRemove(x);}} ><i className="ti-close"></i></a>
                                                </div>
                                        ))}
                                        <div className="pt-10">
                                            <a className="btn-outline-default mr-10 fw-bold" onClick = {() => { onAdd(); }}>
                                            <i className="ti-plus"></i>Add Shift</a>
                                        </div>
                             </div>
                  </div>
              <div className="col-sm-12 col-md-8 col-xl-6 d-inline">
                    <h4 className = "pt-20 fw-bold">Schedule</h4>
                          <ReactTable
                                    columns={[
                                      {
                                        Header: "Days",
                                        accessor : 'name',
                                        Cell : data =>
                                        (
                                        <div className="row">
                                              <Checkbox color="primary"
                                              checked = {data.original.checked || false}

                                            onChange = {(e) => this.handleChangeSchedule(data.original.value, 'checked' , e.target.checked , true , 0) }
                                               />
                                               <label className="professionaldetail_padding" > {isMobile && data.original.short ? data.original.short : data.original.name } </label>
                                         </div>
                                       )},
                                       {
                                         Header: "SHIFT TIMING",
                                         accessor : 'duration',
                                         Cell : data =>
                                         (
                                           <div>
                                               {data.original.duration && data.original.duration.map((x,key) =>  (
                                                <div className="col-12 d-flex pl-0" key = {"table-duration" + key}>
                                                   <div className="col-6 pl-0">
                                                     <div className="rct-picker">
                                                       <TimePicker label = "Start Time" value ={x.starttime} onChange = {(date) => {this.handleChangeSchedule(data.original.value,'starttime',date,true,key)} }/>
                                                       <FormHelperText  error></FormHelperText>
                                                     </div>
                                                   </div>
                                                   <div className="col-6">
                                                     <div className="rct-picker">
                                                       <TimePicker label = "End Time" value ={x.endtime} onChange = {(date) => { this.handleChangeSchedule(data.original.value,'endtime',date,true,key)} } />
                                                       <FormHelperText  error></FormHelperText>
                                                     </div>
                                                  </div>
                                             </div>
                                             ))
                                           }
                                           </div>
                                           ),
                                           minWidth:140,
                                       },
                                    ]}
                                    filterable = { false}
                                    sortable = { false }
                                    data = {fields.schedule}
                                   // Forces table not to paginate or sort automatically, so we can handle it server-side
                                    showPagination= {false}
                                    showPaginationTop = {false}
                                    loading={false} // Display the loading overlay when we need it
                                    defaultPageSize={7}
                                    className=" -highlight"
                                    freezeWhenExpanded = {true}
                                    />
              </div>
      </div>
      <div className="col-sm-12 col-md-6 col-xl-6 d-inline">
      <div className="row">
        <div className="col-sm-6 col-md-6 col-xl-4">
            <TextField  id="contactnumber" type="number" autoFocus = {true} fullWidth label="Emergency Contact Number" value={fields.contactnumber} onChange={(e) => onChange( 'contactnumber' ,e.target.value)} onBlur = {(e) => onChange( 'contactnumber' ,e.target.value)}/>
            <FormHelperText  error>{errors.contactnumber}</FormHelperText>
        </div>
        <div className="col-sm-6 col-md-6 col-xl-4">
          <TextField id="personalemailid" inputProps={{maxLength:100}} fullWidth label="Personal Email-Id "  value={fields.personalemailid} onChange={(e) => onChange( 'personalemailid',e.target.value)} onBlur = {(e) => onChange( 'personalemailid',e.target.value)} />
          <FormHelperText  error>{errors.personalemailid}</FormHelperText>
      </div>
       <div className="col-sm-6 col-md-6 col-xl-4">
              <TextField type="text" inputProps={{maxLength:50}}  id="panno" fullWidth label="Tax Id Number" value={fields.panno} onChange={(e) => onChange( 'panno',e.target.value)}/>
        </div>
        <div className="col-sm-6 col-md-6 col-xl-4">
              <FormGroup className="has-wrapper">
                    <FormControl fullWidth>
            	<InputLabel htmlFor="bloodgroup">Blood Group</InputLabel>
                        <Select value={fields.bloodgroup} onChange={(e) => onChange(e.target.name,e.target.value)}
                          inputProps={{name: 'bloodgroup', id: 'bloodgroup', }}>
                          {
                            Bloodgroup.map((bloodgroup, key) => ( <MenuItem value={bloodgroup.value} key = {'bloodgroupOption' + key }>{bloodgroup.name}</MenuItem> ))
                          }
                        </Select>
                    </FormControl>
             </FormGroup>
       </div>
 <div className="col-sm-6 col-md-6 col-xl-4">
         <div className="form-group">
                       <div className="rct-picker">
                           <DatePicker
                           label="Date of Birth" disableFuture = {true} value ={fields.dateofbirth} onChange = {(date) => onChange('dateofbirth', date , false) }
                           />
                       </div>
        </div>
 </div>
 </div>
 <h4>Resident Address</h4>
 <div className="row" >
   <div className="col-sm-6 col-md-6 col-xl-4">
        <TextField    inputProps={{maxLength:100}} id="address1" fullWidth label="Address1"  value={fields.address1} onChange={(e) => onChange( 'address1',e.target.value)} onBlur = {(e) => onChange( 'address1',e.target.value)} />
        <FormHelperText  error>{errors.address1}</FormHelperText>
    </div>
   <div className="col-sm-6 col-md-6 col-xl-4">
         <TextField  inputProps={{maxLength:100}} id="address2" fullWidth label="Address2" value={fields.address2} onChange={(e) => onChange( 'address2',e.target.value)} onBlur = {(e) => onChange( 'address2',e.target.value)} />
         <FormHelperText  error>{errors.address2}</FormHelperText>
   </div>
   <div className="col-sm-6 col-md-6 col-xl-4">
         <AutoSuggest  value = {fields.state} suggestions = {fields.stateArray} getSuggetion= {(value) => this.getState(value)}  label = "State/Region" onChange= {(value) => onChange('state', value, true) }/>
   </div>
    <div className="col-sm-6 col-md-6 col-xl-4">
           <TextField  inputProps={{maxLength:50}} id="city" fullWidth label="City" value={fields.city} onChange={(e) => onChange( 'city',e.target.value)} onBlur = {(e) => onChange( 'city',e.target.value)} />
           <FormHelperText  error>{errors.city}</FormHelperText>
     </div>
     <div className="col-sm-6 col-md-6 col-xl-4">
          <div className="form-group ">
              <AutoSuggest  value = {fields.country.label ? fields.country.label : ''} suggestions = {fields.countryArray} getSuggetion= {(value) => this.getCountry(value)}  label = "Country"
              onChange= {(value) => onChange('country.label', value, true) } onValueChange= {(value) => onChange('country', value , true) }/>
          </div>
      </div>
      <div className="col-sm-6 col-md-6 col-xl-4">
             <TextField  id="pincode" fullWidth label="ZIP/Postal code" value={fields.pincode}  onChange={(e) => onChange( 'pincode',e.target.value)} onBlur = {(e) => onChange( 'pincode',e.target.value)}/>
             <FormHelperText  error>{errors.pincode}</FormHelperText>
       </div>
</div>
</div>
</div>
</form>
</RctCollapsibleCard>
</div>
);
}
}
