import React, { Fragment, PureComponent,Component } from 'react';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';

import Checkbox from '@material-ui/core/Checkbox';


import TextField from '@material-ui/core/TextField';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import DatePicker from 'Routes/advance-ui-components/dateTime-picker/components/DatePicker';

import Form from 'reactstrap/lib/Form';import FormGroup from 'reactstrap/lib/FormGroup';
import RctCollapsibleCard from 'Components/RctCollapsibleCard/RctCollapsibleCard';
import MenuItem from '@material-ui/core/MenuItem';
import  Questiontype from 'Assets/data/questiontype';
import { RctCard } from 'Components/RctCard';
import AddBox from '@material-ui/icons/AddCircle';
import RemoveBox from '@material-ui/icons/RemoveCircle';

export default class  QuestionDetail extends PureComponent {

render() {
    const {fields, errors, onChange ,onAddOption , onRemoveOption} = this.props;
return (
  <div className="textfields-wrapper">
    <RctCollapsibleCard >
      <form noValidate autoComplete="off">
         <div className="row">
            <div className="col-sm-12 col-md-4 col-xl-4">
               <FormGroup className="has-wrapper">
                  <FormControl fullWidth>
                    <InputLabel htmlFor="sessiontype">Question Type*</InputLabel>
                     <Select value={fields.questiontype} onChange={(e) => onChange('questiontype', e.target.value)}
                       inputProps={{name: 'questiontype'}}>
                       {
                         Questiontype.map((questiontype, key) => ( <MenuItem value={questiontype.value} key = {'questiontypeOption' + key }>{questiontype.name}</MenuItem> ))
                       }
                     </Select>
                    </FormControl>
                   {errors.questiontype && <FormHelperText  error>{errors.questiontype}</FormHelperText>}
                 </FormGroup>
               </div>
             </div>

             <div className="row">
                <div className="col-sm-12 col-md-8  col-xl-8">
                      <TextField  required inputProps={{maxLength:150}}  id="question" multiline rows={1} rowsMax={3} fullWidth label="Question" autoFocus = {true}  value={fields.question} onChange={(e) => onChange('question', e.target.value,true)} onBlur = {(e) => onChange( 'question',e.target.value,true)} />
                      <FormHelperText  error>{errors.question}</FormHelperText>
                </div>
            </div>

          {fields.questiontype != 3 &&
            <div className ="row">
               <label className="professionaldetail_padding" > Answer type  </label>
                     <RadioGroup row aria-label="optiontype" className ={'pl-15'}   name="optiontype"   value={fields.questionoption.optiontype} onChange={(e) => onChange('optiontype', e.target.value)}>

                       <FormControlLabel value={'1'}  control={<Radio />} label={'Multi Choice'} />
                       <FormControlLabel value={'2'}  control={<Radio />} label={'Free Text'} />
                       <FormControlLabel value={'3'}  control={<Radio />} label={'Date'} />

                   </RadioGroup>
            </div>
          }

          {fields.questiontype == 3 &&
            <div className ="row">
               <label className="professionaldetail_padding" > Answer type  </label>
                     <RadioGroup row aria-label="optiontype" className ={'pl-15'}   name="optiontype"   value={fields.questionoption.optiontype} onChange={(e) => onChange('optiontype', e.target.value)}>

                       <FormControlLabel value={'1'}  control={<Radio />} label={'Single Choice'} />
                       <FormControlLabel value={'2'}  control={<Radio />} label={'Date'} />

                   </RadioGroup>
                   <FormHelperText  error>{errors.questionoption}</FormHelperText>
            </div>
          }

          {fields.questiontype != 3 && fields.questionoption.optiontype == 1 &&
            <div className="row">
               {fields.questionoption && fields.questionoption.option.length > 0 && fields.questionoption.option.map((x,key) =>  (
                  <div className="col-sm-12 col-md-12 col-xl-12"  key = {'questionValue1' + key}>
                     <div className = "row ml-5" >
                        <div className="col-9 col-sm-9 col-md-6 col-xl-3">
                           <FormControlLabel  control={
                             <Checkbox color="primary"   disabled />
                           }  label={x} className = "mb-0"
                           />
                        </div>
                         <RemoveBox  className = " pointer size-22  text-primary ml-20 mt-10" onClick={() => onRemoveOption(x)}/>
                       </div>
                    </div>
                  ))
                  }

                 <div className="col-sm-12 col-md-12 col-xl-12">
                    <div className = "row ml-5 pl-15" >
                      <FormControlLabel  control={
                        <Checkbox color="primary" checked={fields.questionoption.isotherenabled==0?false:true} onChange={(e) => onChange('isotherenabled', e.target.checked )} />
                        }  label="OTHER" className = "mb-0"
                      />
                    </div>
                 </div>
                 <div className="col-sm-12 col-md-12 col-xl-12">
                    <div className = "row ml-5 pl-15" >
                      <FormControlLabel  control={
                        <Checkbox color="primary" checked={fields.questionoption.isnaenabled==0?false:true} onChange={(e) => onChange('isnaenabled', e.target.checked )} />
                      }  label="N/A" className = "mb-0"
                      />
                    </div>
                 </div>

                 <div className="col-sm-12 col-md-12 col-xl-12">
                    <div className = "row ml-5 mt-0" >
                       <div className="col-9 col-sm-9 col-md-6 col-xl-3">

                              <TextField  required  inputProps={{maxLength:150}}  id="question"  placeholder ={"Add Option "}  value={fields.optionname}
                              onChange={(e) => onChange('optionname', e.target.value,true)} />
                              <FormHelperText  error>{errors.optionname}</FormHelperText>

                          </div>

                            <AddBox  className = " pointer size-22  text-primary ml-20 mt-10" onClick={() => onAddOption()}/>

                         </div>
                      </div>
               </div>
             }

             {fields.questiontype != 3 && fields.questionoption.optiontype == 2 &&
               <div className ="row ml-20">
                   <TextField disabled  className = "pb-0" />
               </div>
             }

             {((fields.questiontype != 3 && fields.questionoption.optiontype == 3) || (fields.questiontype == 3 && fields.questionoption.optiontype == 2)) &&
               <div className ="row ml-20">
               <DatePicker disabled />

               </div>
             }

            {fields.questiontype == 3 && fields.questionoption.optiontype == 1 &&
              <div className = "row">
                <div className="col-8 col-sm-8 col-md-4 col-xl-2 d-inline">

                    <FormControlLabel  control={<Radio />}
                      disabled = {true}  label={'Yes'} className = "mb-0" />

                     <FormControlLabel  control={<Radio />}
                       disabled = {true}  label={'No'} className = "mb-0"/>

                </div>
                <div className="col-4 col-sm-4 col-md-4 col-xl-4">
                      <TextField disabled placeholder="Comments" className = "pb-0" />
                </div>


              </div>
            }
            {fields.questiontype == 3 && fields.questionoption.optiontype == 1 &&
            <span >
              <h5 >
                Note: In case of medical history structure of answer would be as shown above.
              </h5>
            </span>
          }

           </form>
       </RctCollapsibleCard>
     </div>
      );
     }
   }
