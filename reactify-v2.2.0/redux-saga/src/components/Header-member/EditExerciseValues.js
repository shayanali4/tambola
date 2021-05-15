/**
 * Cart Component
 */
import React, { Component, Fragment } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';

import {cloneDeep ,getFormtedDateTime, unique, getParams ,calculateSpeed} from 'Helpers/helpers';
import {convertToSec ,convertSecToHour,convertkgTolbs,convertlbsTokg,convertkmTomiles,convertmilesTokm,convertmphTokph,convertkphTomph} from 'Helpers/unitconversion';
import Unit from 'Components/Unit/unit';
import { push } from 'connected-react-router';
import {isMobile} from 'react-device-detect';
import Fab from '@material-ui/core/Fab';
import Col from 'reactstrap/lib/Col';
import AddBox from '@material-ui/icons/AddCircle';
import RemoveBox from '@material-ui/icons/RemoveCircle';
import Close from '@material-ui/icons/Close';
import Save from '@material-ui/icons/Save';
import InputGroup from 'reactstrap/lib/InputGroup';
import InputGroupAddon from 'reactstrap/lib/InputGroupAddon';
import Input from 'reactstrap/lib/Input';
import {required,checkDecimal,restrictLength} from 'Validations';


class EditExerciseValues extends Component {

	render() {

    let {open,selectedexercise,weightunit,distanceunit,onCancel,onChange,onSaveExercise} = this.props;

  		return (
      <div className = "fixed-plugin w-100 py-5" style = {{ "top": "inherit",  "bottom": "0px",  "left" : "0%" , "right" : "unset", "borderRadius" : "inherit" , "paddingLeft" : "19%", "zIndex" : "2"}}>


    <Dialog  fullScreen = {isMobile ? true : false} fullWidth onClose={() => this.props.onCancel()}	open={open}  disableBackdropClick = {true}   disableEscapeKeyDown = {true}>
      <DialogTitle  className = {"pt-15 pb-0 "}>
               <span className="fw-bold text-capitalize  text-primary  mr-5 fs-14" >{selectedexercise.exercisename}</span>
      </DialogTitle>

    <DialogContent className = {"ml-10 pb-10"}>
        {selectedexercise.recordtypeId != 2 && selectedexercise.recordtypeId != 4 &&
           <div className="row mb-5 fs-12">
                <Col sm={2} className = {"col-2 pl-0"}>
                  <span className="fw-bold  text-uppercase">Sets</span>
                </Col>
                {(selectedexercise.recordtypeId == 3 || selectedexercise.recordtypeId == 1) &&
                   <Col sm={5} className = {"col-4"}>
                            <span className="fw-bold  text-uppercase">Reps*</span>
                  </Col>
                 }
                {selectedexercise.recordtypeId == 3 &&
                   <Col sm={5} className = {"col-4"}>
                          <span className="fw-bold ">{weightunit == 1 ? "WEIGHT(lbs)*" :  "WEIGHT(kg)*"}</span>
                 </Col>
                 }
          </div>
         }

          {selectedexercise.recordtypeId != 2 && selectedexercise.recordtypeId != 4 && selectedexercise.setList.map((x,key) =>  (
                <div className="row mb-5" key = {'execValue' + key}>
                      <div style ={{"height" : 35, "width" : 35 , "paddingTop" : 8}} className ={" rounded-circle text-center pt-5 "}>
                        <span className="fw-bold my-auto  text-uppercase">{key + 1}</span>
                      </div>

                     {(selectedexercise.recordtypeId == 1 || selectedexercise.recordtypeId == 3) &&
                      <Col sm={5} className = {"col-4 pl-30 pr-20 col-sm-5"}>
                        <InputGroup>
                          <Input type="number" placeholder = 'Reps' name="reps" id="reps" onChange = {(e) => { selectedexercise.setList[key].reps = (e.target.value > 100 ? 100 : parseInt(e.target.value)) ; onChange('setList',selectedexercise.setList); }}  className="input-sm" value={x.reps || ''}/>
                        </InputGroup>
                      </Col>
                     }

                     {selectedexercise.recordtypeId == 3 &&
                      <div className = {"w-5 mt-10 text-center"}>
                        <span>X</span>
                      </div>
                     }
                     { selectedexercise.recordtypeId == 3 &&
                        <Col sm={5} className= {"pr-30 pl-20 col-4 col-sm-5"}>
                          <InputGroup>
                              <Input type="number"  placeholder = 'Weights'
                                name="weight" id="weight"  onChange = {(e) => {
																	  e.target.value = (e.target.value > 1000 ? 1000 : (e.target.value && checkDecimal(e.target.value) ?  parseFloat(e.target.value).toFixed(2) :parseFloat(e.target.value) ));
																		if(weightunit == 1)
                                    {
                                      selectedexercise.setList[key].weight = e.target.value > 0 ? parseFloat(convertlbsTokg(e.target.value)).toFixed(2) : '';
                                      selectedexercise.setList[key].weight_lbs = e.target.value;
                                    }
                                    else
                                    {
                                      selectedexercise.setList[key].weight = e.target.value;
                                      selectedexercise.setList[key].weight_lbs = e.target.value > 0 ? parseFloat(convertkgTolbs(e.target.value)).toFixed(2) : '';
                                    }

																		onChange('setList',selectedexercise.setList);}}
                                    className="input-sm"
																		value={ weightunit == 1 && x.weight ? ((x.weight_lbs ? x.weight_lbs : parseFloat(convertkgTolbs(x.weight)).toFixed(2)) || '') : x.weight || ''}/>
                          </InputGroup>
                        </Col>
                     }

                  </div>
                  ))
             }

           {(selectedexercise.recordtypeId == 2 || selectedexercise.recordtypeId == 4) &&
                 <div className="row mb-5">
                       <Col sm={2} className = {"col-2 pl-0"}>
                         <span className="fw-bold  text-uppercase">Sets</span>
                       </Col>
                       <Col sm={5} className = {"col-5"}>
                         <span className="fw-bold  text-uppercase">Time(hh:mm:ss)</span>
                       </Col>
                  </div>
           }

                     {(selectedexercise.recordtypeId == 2 || selectedexercise.recordtypeId == 4) && selectedexercise.setList.map((x,key) =>  (
                           <div className="row mb-5" key = {'execValue1' + key}>

                             <div style ={{"height" : 35, "width" : 35, "paddingTop" : 8}} className ={"rounded-circle text-center mb-5 "} >
                               <span className="fw-bold my-auto  text-uppercase">{key + 1}</span>
                             </div>
                          <Col sm={5} className = {"col-10 pl-20 col-sm-5"}>
                               <div className="row "  style ={{"display" : "-webkit-box"}}  >
                                 <div className ={"col-4 pr-0"} >
                                  <InputGroup>
                                    <Input type="number" min="0" max="10" placeholder = 'Hrs' name="hh" id="hh"    onChange = {(e) => {selectedexercise.setList[key].hh = (e.target.value > 10 ? 10 :  e.target.value);  onChange('setList',selectedexercise.setList); }}  className="input-sm" value={selectedexercise.setList[key].hh || '' } />
                                  </InputGroup>
                                </div>
                                 <div className ={"col-4 pr-0"} >
                                   <InputGroup>
                                     <Input type="number" min="0" max="60" placeholder = 'Mins' name="mm" id="mm"  onChange = {(e) => {selectedexercise.setList[key].mm = (e.target.value > 59 ? 59 :  e.target.value);  onChange('setList',selectedexercise.setList);}}  className="input-sm" value={selectedexercise.setList[key].mm || ''} />
                                   </InputGroup>
                                 </div>
                                 <div className ={"col-4 pr-0"} >
                                   <InputGroup>
                                     <Input type="number" min="0" max="60" placeholder = 'Secs' name="ss" id="ss"   onChange = {(e) => {selectedexercise.setList[key].ss = (e.target.value > 59 ? 59 :  e.target.value);  onChange('setList',selectedexercise.setList);}}  className="input-sm" value={selectedexercise.setList[key].ss || ''} />
                                   </InputGroup>
                                 </div>
                               </div>
                           </Col>

                           <Col sm={6} className = {"col-12 col-sm-6"}>
                             <div className="row" >
                             <div className ={"col-6 pr-0 mb-5"} >
                                 <InputGroup>
                                 <Input type="number" placeholder = 'Distance' name="distance" id="distance"  onChange = {(e) => {
																	 e.target.value =  (e.target.value > 1000 ? 1000 : (e.target.value && parseFloat(e.target.value.toString().substring(0, 5))));
                                   if(distanceunit == 1 && e.target.value)
                                   {
                                     selectedexercise.setList[key].distance = convertmilesTokm(e.target.value);
                                     selectedexercise.setList[key].distance_miles = e.target.value;
                                   }
                                   else
                                   {
                                     selectedexercise.setList[key].distance = e.target.value;
                                     selectedexercise.setList[key].distance_miles = convertkmTomiles(e.target.value);
                                   }
                                   onChange('setList',selectedexercise.setList);}}
                                 value={(distanceunit == 1 ? selectedexercise.setList[key].distance_miles : selectedexercise.setList[key].distance)}  className="input-sm" />
                                <InputGroupAddon addonType="append" >{distanceunit == 1 ?"mile" : "km"}</InputGroupAddon>

                                 </InputGroup>
                               </div>
                               <div className ={"col-6 pr-0 mb-5"} >
                                 <InputGroup>
                                   <Input type="number" placeholder = 'Speed' name="speed" id="speed"  disabled = {true}  value={selectedexercise.setList[key].speed} className="input-sm"  />
                                   <InputGroupAddon addonType="append" size="sm" >{distanceunit == 1 ?"mph" : "kph"}</InputGroupAddon>
                                 </InputGroup>
                               </div>
                               <div className ={"col-6 pr-0 mb-5"} >
                                   <InputGroup>
                                     <Input type="number" placeholder = 'Calories' name="calorie" id="calorie"  onChange = {(e) => {selectedexercise.setList[key].calorie = e.target.value;  onChange('setList',selectedexercise.setList);}}  className="input-sm" value={selectedexercise.setList[key].calorie || ''} />

                                   </InputGroup>
                                 </div>

                               <div className ={"col-6 pr-0 mb-5"} >
                                 <InputGroup>
                                   <Input type="number" placeholder = 'Lap' name="laps" id="laps"  onChange = {(e) => {selectedexercise.setList[key].laps = e.target.value;  onChange('setList',selectedexercise.setList);}}  className="input-sm" value={selectedexercise.setList[key].laps  || ''}/>
                                 </InputGroup>
                               </div>
                             </div>
                           </Col>

                      </div>
                    )) }



                                    <div className="row mb-10 mt-10">

                                        <div className = {"w-10"}>
                                             <AddBox  className = " pointer size-35  text-primary " onClick = {() => { selectedexercise.setList.push(cloneDeep(selectedexercise.setList[selectedexercise.setList.length - 1]));  onChange('setList',selectedexercise.setList); }}/>
                                        </div>

                                          <Col sm={1} className= {"pl-10 col-1"}>
                                             <RemoveBox  className = "pointer ml-10 size-35  text-primary" onClick = {() => { if(selectedexercise.setList.length >1 ){ selectedexercise.setList.pop(selectedexercise.setList[selectedexercise.setList.length - 1]);}  onChange('setList',selectedexercise.setList); }}/>
                                          </Col>
                                    </div>

    </DialogContent>
    <DialogActions>


         <Button variant="contained"  onClick={() => this.props.onSaveExercise()}  className= {"text-white btn-primary py-5 " }  >
           <Save />
         </Button>
         <Button variant="contained" onClick={() => this.props.onCancel()} className={"btn-danger text-white py-5 " } >
          <Close />
        </Button>
    </DialogActions>

     </Dialog>


     </div>

  	)
	}
}

export default (EditExerciseValues);
