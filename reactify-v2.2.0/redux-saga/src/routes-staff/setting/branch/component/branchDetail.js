import React, { Fragment, PureComponent,Component } from 'react';
import Form from 'reactstrap/lib/Form';

import RctCollapsibleCard from 'Components/RctCollapsibleCard/RctCollapsibleCard';
import TextField  from '@material-ui/core/TextField';
import FormHelperText from '@material-ui/core/FormHelperText';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import TimePicker from 'Routes/advance-ui-components/dateTime-picker/components/TimePicker';
import ReactTable from "react-table";
import Checkbox from '@material-ui/core/Checkbox';
import {isMobile} from 'react-device-detect';

import Ownership  from 'Assets/data/ownership';
import PlacesAutocomplete from 'react-places-autocomplete';

import InputAdornment from '@material-ui/core/InputAdornment';
import CloseIcon from '@material-ui/icons/Close';
import IconButton from '@material-ui/core/IconButton';
import Switch from '@material-ui/core/Switch';
import FormGroup from 'reactstrap/lib/FormGroup';
import SlotDuration from 'Assets/data/slotduration';
import api from 'Api';
import AutoSuggest from 'Routes/advance-ui-components/autoComplete/component/AutoSuggest';
import Label from 'reactstrap/lib/Label';
import RestDuration from 'Assets/data/restduration';

export default class BranchDetail extends Component {
  handleChangeSchedule = (id, key, value , isRequired, index) => {
    this.props.onChange('schedule', {id , key , value} , isRequired, index);
  };

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



  render() {
      const {fields,errors,employeeList,onChange,handleChange,handleSelect,clientProfileDetail,onAdd, onRemove} = this.props;

      return (
    <div className="textfields-wrapper">
      <RctCollapsibleCard >
        <form noValidate autoComplete="off">
          <div className="row">
            <div className="col-sm-12 col-md-6 col-xl-7 d-inline">
              <div className="row">
                 <div className="col-sm-6 col-md-6 col-xl-6">
                        <TextField  required inputProps={{maxLength:50}} autoFocus = {true} id="branchname"  fullWidth label="Branch Name" value={fields.branchname} onChange={(e) => onChange('branchname',e.target.value , true)} onBlur = {(e) => onChange('branchname',e.target.value, true)}/>
                        <FormHelperText  error>{errors.branchname}</FormHelperText>
                  </div>
                  {/*
                  <div className="col-sm-6 col-md-6 col-xl-6">
                          <FormControl fullWidth>
                          <InputLabel   htmlFor="zonename">Zone Name</InputLabel>
                          <Select  value={fields.zonename} onChange={(e) => onChange(e.target.name,e.target.value )}
                            inputProps={{name: 'zonename' ,id: 'zonename',}}>
                            {
                              zonelist && zonelist.map((zonename, key) => ( <MenuItem value={zonename.id} key = {'zonenameOption' + key }>{zonename.label}</MenuItem> ))
                            }
                          </Select>
                          <FormHelperText  error>{errors.zonename}</FormHelperText>
                          </FormControl>
                   </div>
                 */}

                  <div className="col-sm-6 col-md-6 col-xl-6">
                         <TextField required inputProps={{maxLength:50}} id="phoneno" type = "number" fullWidth label="Phone No"  value={fields.phoneno} onChange={(e) => onChange('phoneno',e.target.value , true)} />
                         <FormHelperText  error>{errors.phoneno}</FormHelperText>
                  </div>
                  <div className="col-sm-12 col-md-12 col-xl-6">
                          <FormControl fullWidth>
                          <InputLabel  htmlFor="manager">Manager Name</InputLabel>
                          <Select  value={fields.manager} onChange={(e) => onChange(e.target.name,e.target.value )}
                            inputProps={{name: 'manager' ,id: 'manager',}}>
                            {
                              employeeList && employeeList.map((manager, key) => ( <MenuItem value={manager.id} key = {'managerrOption' + key }>{manager.label}</MenuItem> ))
                            }
                          </Select>
                          <FormHelperText  error>{errors.manager}</FormHelperText>
                          </FormControl>
                   </div>
               {
                  // <div className="col-sm-12 col-md-12 col-xl-12">
                  //           <TextField  inputProps={{maxLength:500}} id="description" fullWidth multiline rows={1} rowsMax={4} label="Description" value={fields.description} onChange={(e) => onChange('description',e.target.value)}/>
                  //           <FormHelperText  error>{errors.description}</FormHelperText>
                  //  </div>
                }
                   <div className="col-12 ">
                       <div className = "row" >
                           <label className="professionaldetail_padding" >Property OwnerShip </label>
                                     <RadioGroup row aria-label="ownership"  className ={'pl-15'} id="ownership" name="ownership" value={fields.ownership} onChange={(e) => onChange('ownership',e.target.value , true)} >
                                     {
                                       Ownership.map((ownership, key) => ( <FormControlLabel value={ownership.value} key= {'ownershipOption' + key} control={<Radio />} label={ownership.name} />))
                                     }
                                     </RadioGroup>
                       </div>
                   </div>
                   <div className="col-sm-6 col-md-6 col-xl-6">
                          <TextField  inputProps={{maxLength:50}} id="carpetarea" fullWidth label="Carpet Area" value={fields.carpetarea} onChange={(e) => onChange('carpetarea',e.target.value , false)} />
                          <FormHelperText  error>{errors.carpetarea}</FormHelperText>
                    </div>
      </div>

      <div className="row">
          {/*
            <div className="col-12 col-sm-12 col-md-12 col-xl-6 pb-5">
                <PlacesAutocomplete
                    value={fields.gmapaddress}
                    onChange={handleChange}
                    onSelect={handleSelect}
                    searchOptions={{
                          location: new window.google.maps.LatLng(fields.latitude,fields.longitude),
                          radius: 10000
                        }}
                  >
                    {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
                      <div>
                        <TextField required inputProps={{maxLength:500}} fullWidth label="Google Map Address" multiline rows={1} rowsMax={4}
                          {...getInputProps({
                            placeholder: 'Search Google Map Location ...',
                            className: 'location-search-input',
                          })}
                          InputProps={{
                              endAdornment: (
                                <InputAdornment position="end">
                                  <IconButton className = "p-5" onClick = {() => onChange('gmapaddress', '') }>
                                      <CloseIcon />
                                  </IconButton>
                                </InputAdornment>
                              )
                            }}
                        />
                         <FormHelperText  error>{errors.gmapaddress}</FormHelperText>
                        <div className="autocomplete-dropdown-container">
                          {loading && <div>Loading...</div>}
                          {suggestions.map(suggestion => {
                            const className = suggestion.active
                              ? 'suggestion-item--active'
                              : 'suggestion-item';
                            // inline style for demonstration purpose
                            const style = suggestion.active
                              ? { backgroundColor: '#d3d3d3', cursor: 'pointer' }
                              : { backgroundColor: '#ffffff', cursor: 'pointer' };
                            return (
                              <div
                                {...getSuggestionItemProps(suggestion, {
                                  className,
                                  style,
                                })}
                              >
                                <span>{suggestion.description}</span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </PlacesAutocomplete>
             </div>

            */}

           <div className="col-12 col-sm-12 col-md-8 col-xl-4">
              <FormControlLabel  control={
                <Checkbox color="primary" checked={fields.getcurrentlocation==0?false:true} onChange={(e) => onChange('getcurrentlocation', e.target.checked )} />
              }  label="Set current location"
              />
           </div>

           <div className="col-6 col-sm-12 col-md-6 col-xl-6">
               <TextField inputProps={{maxLength:20}}  id="latitude" disabled = {true} fullWidth label="Latitude" value={fields.latitude} onChange={(e) =>onChange( 'latitude' ,e.target.value)} />
                <FormHelperText  error></FormHelperText>
           </div>
           <div className="col-6 col-sm-12 col-md-6 col-xl-6">
               <TextField inputProps={{maxLength:20}}  id="longitude" disabled = {true} fullWidth label="Longitude" value={fields.longitude} onChange={(e) =>onChange( 'longitude' ,e.target.value)} />
                <FormHelperText  error></FormHelperText>
           </div>

           {fields.gmapaddress &&
             <div className="col-sm-12 col-md-12 col-xl-7">
                <FormControlLabel  control={
                  <Checkbox color="primary" checked={fields.isaddressSame==0?false:true} onChange={(e) => onChange('isaddressSame',e.target.checked )} />
                }  label="Same as Google Map Address"
                />
             </div>
           }
      </div>

      <div className="row">
          <div className="col-sm-6 col-md-6 col-xl-4">
                 <TextField  required  inputProps={{maxLength:100}} id="address1" fullWidth label="Address1"  value={fields.address1} onChange={(e) => onChange('address1',e.target.value , false)} onBlur = {(e) => onChange('address1',e.target.value, false)} />
                 <FormHelperText  error>{errors.address1}</FormHelperText>
          </div>
          <div className="col-sm-6 col-md-6 col-xl-4">
                  <TextField required inputProps={{maxLength:100}} id="address2" fullWidth label="Area" value={fields.address2} onChange={(e) => onChange('address2',e.target.value , false)} onBlur = {(e) => onChange('address2',e.target.value, false)} />
                  <FormHelperText  error>{errors.address2}</FormHelperText>
          </div>
          <div className="col-sm-4 col-md-6 col-xl-4">
                  <TextField required id="pincode" fullWidth label="ZIP/Postal code" value={fields.pincode}  onChange={(e) => onChange('pincode',e.target.value , false)} onBlur = {(e) => onChange('pincode',e.target.value, false)}/>
                  <FormHelperText  error>{errors.pincode}</FormHelperText>
          </div>

          <div className="col-6 col-sm-4 col-md-6 col-xl-4">
                 <TextField required inputProps={{maxLength:50}} id="city" fullWidth label="City" value={fields.city} onChange={(e) => onChange('city',e.target.value , false)}  />
                 <FormHelperText  error>{errors.city}</FormHelperText>
           </div>

           <div className="col-6 col-sm-4 col-md-6 col-xl-4">
                 <AutoSuggest  value = {fields.state}  suggestions = {fields.stateArray} getSuggetion= {(value) => this.getState(value)}  label = "State/Region *"
                 onChange= {(value) => onChange('state', value, true) }/>
                 <FormHelperText  error>{errors.state}</FormHelperText>
           </div>
           <div className="col-6 col-sm-4 col-md-6 col-xl-4">
                  <AutoSuggest  value = {fields.country} suggestions = {fields.countryArray} getSuggetion= {(value) => this.getCountry(value)}  label = "Country *"
                   onChange= {(value) => onChange('country', value , true) }/>
                 <FormHelperText  error>{errors.country}</FormHelperText>
           </div>
      </div>

            </div>
            <div className="col-sm-12 col-md-6 col-xl-5 d-inline">
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
                                  <div className="pt-10 pb-10">
                                    <a className="btn-outline-default mr-10 fw-bold" onClick = {() => { onAdd(); }}>
                                    <i className="ti-plus"></i>Add Shift</a>
                                  </div>
                       </div>
                  </div>

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

               {clientProfileDetail && clientProfileDetail.serviceprovidedId != 1 &&
               <div className="row">
                   <div className="col-sm-6 col-md-6 col-xl-3 d-inline mt-5">
                     <span className = "pr-10">Gym Access Slot</span>
                   </div>
                   <div className="col-sm-6 col-md-6 col-xl-6 d-inline">
                     <span className ={ fields.gymaccessslot == 0 ? 'fw-bold' : '' } >Disable</span>
                        <FormControlLabel
                          className="m-0"
                          control={
                              <Switch
                                  checked={fields.gymaccessslot==0?false:true}
                                  onClick={(e) => onChange('gymaccessslot', e.target.checked )}
                                  color="primary"
                                  className="switch-btn"
                              />
                               }
                         />
                     <span className ={ fields.gymaccessslot == 1 ? 'fw-bold' : '' } >Enable</span>
                   </div>
                </div>
              }
               {fields.gymaccessslot == 1 &&
                     <div className="row">
                       <div className="col-md-12 col-xl-4">
                            <FormGroup className="has-wrapper">
                               <FormControl fullWidth>
                                <InputLabel htmlFor="slotduration">Slot Duration In Min*</InputLabel>
                                      <Select value={fields.slotduration}  onChange={(e) => onChange('slotduration', e.target.value)}
                                        inputProps={{name: 'slotduration'}}>
                                        {
                                          SlotDuration.map((slotduration, key) => ( <MenuItem value={slotduration.value} key = {'slotdurationOption' + key }>{slotduration.name}</MenuItem> ))
                                        }
                                      </Select>
                                </FormControl>
                              {errors.slotduration && <FormHelperText  error>{errors.slotduration}</FormHelperText>}
                            </FormGroup>
                         </div>
                         <div className="col-md-12 col-xl-8">
                              <FormGroup className="has-wrapper">
                                 <FormControl fullWidth>
                                  <InputLabel htmlFor="gapbetweentwogymaccessslot">Gap Between two Gym access Slot In Min</InputLabel>
                                        <Select value={fields.gapbetweentwogymaccessslot}  onChange={(e) => onChange('gapbetweentwogymaccessslot', e.target.value)}
                                          inputProps={{name: 'gapbetweentwogymaccessslot'}}>
                                          {
                                            RestDuration.map((gapbetweentwogymaccessslot, key) => ( <MenuItem value={gapbetweentwogymaccessslot.value} key = {'gapbetweentwogymaccessslotOption' + key }>{gapbetweentwogymaccessslot.name}</MenuItem> ))
                                          }
                                        </Select>
                                  </FormControl>
                                {errors.gapbetweentwogymaccessslot && <FormHelperText  error>{errors.gapbetweentwogymaccessslot}</FormHelperText>}
                              </FormGroup>
                           </div>
                         <div className="col-md-12 col-xl-6">
                             <TextField required type = "number" inputProps={{maxLength:500}} id="slotmaxoccupancy" fullWidth label="Max Member Occupancy Per Slot"  value={fields.slotmaxoccupancy} onChange={(e) => onChange('slotmaxoccupancy',e.target.value < 500 ? parseInt(e.target.value) : 500)}/>
                             <FormHelperText  error>{errors.slotmaxoccupancy}</FormHelperText>
                         </div>
                         <div className="col-md-12 col-xl-6">
                             <TextField required type = "number" inputProps={{maxLength:30}} id="slotmaxdays" fullWidth label="Max Days to Book Gym Slot in Advance"  value={fields.slotmaxdays} onChange={(e) => onChange('slotmaxdays',e.target.value < 30 ? parseInt(e.target.value) : 30)}/>
                             <FormHelperText  error>{errors.slotmaxdays}</FormHelperText>
                         </div>
                     </div>
               }
                     <div className="row">
                       <div className="col-md-12 col-xl-4">
                            <FormGroup className="has-wrapper">
                                  <FormControl fullWidth>
                                  <InputLabel htmlFor="ptslotduration">PT Slot Duration In Min*</InputLabel>
                                      <Select value={fields.ptslotduration}  onChange={(e) => onChange('ptslotduration', e.target.value,true)}
                                        inputProps={{name: 'ptslotduration'}}>
                                        {
                                          SlotDuration.map((ptslotduration, key) => ( <MenuItem value={ptslotduration.value} key = {'ptslotdurationOption' + key }>{ptslotduration.name}</MenuItem> ))
                                        }
                                      </Select>
                                </FormControl>
                              {errors.slotduration && <FormHelperText  error>{errors.ptslotduration}</FormHelperText>}
                           </FormGroup>
                         </div>
                         <div className="col-md-12 col-xl-8">
                              <FormGroup className="has-wrapper">
                                 <FormControl fullWidth>
                                  <InputLabel htmlFor="restbetweentwoptslot">Rest Between two PT Slot In Min</InputLabel>
                                        <Select value={fields.restbetweentwoptslot}  onChange={(e) => onChange('restbetweentwoptslot', e.target.value)}
                                          inputProps={{name: 'restbetweentwoptslot'}}>
                                          {
                                            RestDuration.map((restbetweentwoptslot, key) => ( <MenuItem value={restbetweentwoptslot.value} key = {'restbetweentwoptslotOption' + key }>{restbetweentwoptslot.name}</MenuItem> ))
                                          }
                                        </Select>
                                  </FormControl>
                                {errors.restbetweentwoptslot && <FormHelperText  error>{errors.restbetweentwoptslot}</FormHelperText>}
                              </FormGroup>
                           </div>
                         {
                           //   <div className="col-sm-6 col-md-6 col-xl-6">
                           //               <TextField required type = "number" inputProps={{maxLength:500}} id="slotmaxoccupancy" fullWidth label="Max Member Occupancy Per PT Slot"  value={fields.ptslotmaxoccupancy} onChange={(e) => onChange('ptslotmaxoccupancy',e.target.value < 500 ? (e.target.value < 0 ? 0 : e.target.value ) : 500,true)}/>
                           //               <FormHelperText  error>{errors.ptslotmaxoccupancy}</FormHelperText>
                           // </div>
                       }
                       <div className="col-md-12 col-xl-6">
                                   <TextField required type = "number" inputProps={{maxLength:30}} id="ptslotmaxdays" fullWidth label="Max Days to Book PT Slot in Advance"  value={fields.ptslotmaxdays} onChange={(e) => onChange('ptslotmaxdays',e.target.value < 30 ? (e.target.value < 0 ? 0 : e.target.value ) : 30,true)}/>
                                   <FormHelperText  error>{errors.ptslotmaxdays}</FormHelperText>
                     </div>
                     </div>
                     <div className="row">
                       <div className="col-md-12 col-xl-6">
                         <TextField required type = "number" inputProps={{maxLength:30}} id="classmaxdays" fullWidth label="Max Days to Book Class in Advance"  value={fields.classmaxdays} onChange={(e) => onChange('classmaxdays',e.target.value < 30 ? (e.target.value < 0 ? 0 : e.target.value ) : 30,true)}/>
                         <FormHelperText  error>{errors.classmaxdays}</FormHelperText>
                       </div>
                     </div>
                     <h4 className ="pt-5"> Booking Cancel Policy Configuration In Member App :- </h4>
                     <div className="row">
                       <div className="col-md-12 col-xl-6">
                               <TextField  type = "number" inputProps={{maxLength:500}} id="cancelgymaccessslothour" fullWidth label="Gym Access Slot Before In Hours"  value={fields.cancelgymaccessslothour} onChange={(e) => onChange('cancelgymaccessslothour',e.target.value < 500 ? (e.target.value < 0 ? 0 : e.target.value ) : 500)}/>
                               <FormHelperText  error>{errors.cancelgymaccessslothour}</FormHelperText>

                         </div>
                         <div className="col-md-12 col-xl-6">
                               <TextField type = "number" inputProps={{maxLength:500}} id="cancelptslothour" fullWidth label="PT Slot Before In Hours"  value={fields.cancelptslothour} onChange={(e) => onChange('cancelptslothour',e.target.value < 500 ? (e.target.value < 0 ? 0 : e.target.value ) : 500)}/>
                               <FormHelperText  error>{errors.cancelptslothour}</FormHelperText>
                           </div>
                           <div className="col-md-12 col-xl-6">
                                   <TextField type = "number" inputProps={{maxLength:500}} id="cancelclassslothour" fullWidth label="Class Slot Before In Hours"  value={fields.cancelclassslothour} onChange={(e) => onChange('cancelclassslothour',e.target.value < 500 ? (e.target.value < 0 ? 0 : e.target.value ) : 500)}/>
                                   <FormHelperText  error>{errors.cancelclassslothour}</FormHelperText>
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
