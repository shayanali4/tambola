/**
 * Employee Management Page
 */
import React, { Component } from 'react';

import FormControl from '@material-ui/core/FormControl';
import ReactTable from "react-table";

import Checkbox from '@material-ui/core/Checkbox';
import TimePicker from 'Routes/advance-ui-components/dateTime-picker/components/TimePicker';
import FormHelperText from '@material-ui/core/FormHelperText';

import TextField  from '@material-ui/core/TextField';
import AddCircleIcon from '@material-ui/icons/AddCircleOutline';
import RctCollapsibleCard from 'Components/RctCollapsibleCard/RctCollapsibleCard';
import Shifttype  from 'Assets/data/shifttype';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';

export default class Shiftdetail extends Component {

  handleChangeSchedule = (id, key, value , isRequired, index) => {
        this.props.onChange('schedule', {id , key , value} , isRequired , index);
  };

	render() {
   const {fields, errors, onChange , onAdd , onRemove} = this.props;
			return (
      <div className="textfields-wrapper">
         <RctCollapsibleCard >
         <form noValidate autoComplete="off">

             <div className="row">
               <div className="col-sm-12 col-md-8 col-xl-6">
                 <div  className= "row" >
                   <label className="professionaldetail_padding" > Shift Type </label>
                     <RadioGroup row aria-label="shifttype"  name="shifttype" value={fields.shifttype} className ={'pl-15'} onChange={(e) => onChange( 'shifttype', e.target.value)}>
                     {
                       Shifttype.map((shifttype, key) => ( <FormControlLabel value={shifttype.value} key= {'shifttypeOption' + key} control={<Radio />} label={shifttype.name} />))
                     }
                     </RadioGroup>
                     <FormHelperText  error>{errors.shifttype}</FormHelperText>
                 </div>
               </div>
             </div>

              <div className="row">
                <div className="col-12 col-sm-12 col-md-6 col-xl-4">
		               <FormControl fullWidth>

                      <TextField required inputProps={{maxLength:100}} id="shiftname"  fullWidth label="Shift Name" value={fields.shiftname} onChange={(e) => onChange('shiftname', e.target.value,true,0)}/>
                      <FormHelperText  error>{errors.shiftname}</FormHelperText>

		               </FormControl>
                 </div>
              </div>

              <div className="row">
					      <div className="col-12 col-md-12">
                  {fields.duration.map((x,key) =>  (
                   <div className="col-12 col-sm-12 col-md-6 col-xl-6 d-flex pl-0 pt-5" key = {"list-duration" + key}>
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
                     <a href="#" className= "mt-25" onClick={(e) =>{e.preventDefault(); onRemove(x);}} ><i className="ti-close"></i></a>
								</div>
                ))
              }
              <div className="pt-10">

                <a className="btn-outline-default mr-10 fw-bold" onClick = {() => { onAdd(); }}>
                  <i className="ti-plus"></i>Add Shift</a>

              </div>
						</div>
                <div className="col-12 col-md-8 col-xl-6 d-inline">
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
                                    <label className="professionaldetail_padding" > { data.original.short  && data.original.short } </label>
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

         </form>
                  </RctCollapsibleCard>
                  </div>

	);
  }
  }
