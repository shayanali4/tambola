import React, {PureComponent}  from 'react';
import  FormControl  from '@material-ui/core/FormControl';
 import TextField  from '@material-ui/core/TextField';
import FormHelperText from '@material-ui/core/FormHelperText';
 import InputLabel from '@material-ui/core/InputLabel';
import   Select from '@material-ui/core/Select';
import   MenuItem from '@material-ui/core/MenuItem';
import { RctCard } from 'Components/RctCard';

import Form from 'reactstrap/lib/Form';
import RctCollapsibleCard from 'Components/RctCollapsibleCard/RctCollapsibleCard';
import Dropzone from 'react-dropzone';
import CustomConfig from 'Constants/custom-config';
import Workoutcategory from 'Assets/data/workoutcategory';

import WorkoutRecordType from 'Assets/data/exerciserecordtype';

import ExerciseType from 'Assets/data/exercisetype';
import WorkoutEquipment from 'Assets/data/exerciseequipment';
import MultiSelect from 'Routes/advance-ui-components/autoComplete/component/MultiSelect';
import ImageCompressor from 'Components/ImageCompressor';
import  Status from 'Assets/data/status';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Advertisementcategory from 'Assets/data/advertisementcategory';
import Switch from '@material-ui/core/Switch';
import DatePicker from 'Routes/advance-ui-components/dateTime-picker/components/DatePicker';
import {isMobile} from 'react-device-detect';
import  Quoteofdaytype from 'Assets/data/quoteofdaytype';
import Referby from 'Assets/data/referby';
import api from 'Api';
import AutoSuggest from 'Routes/advance-ui-components/autoComplete/component/AutoSuggest';
import InputAdornment from '@material-ui/core/InputAdornment';
import Combobox from 'Routes/advance-ui-components/autoComplete/component/Combobox';
import { cloneDeep,getLocalDate} from 'Helpers/helpers';

export default class ResultAndTestimonialDetail extends PureComponent {
  state ={
    resultImageCompressed :null,
    resultImageKey : null,
    imageHeightWidth : {},
  }

  onChangeImageToCompress(key,value)
  {
        this.setState({resultImageKey : key , resultImageCompressed : value[0],
                       imageHeightWidth : {width : 300 ,height : 300 , size : 0.1}
                     });
  }

  onChangeCompressedImage(compressedimage)
     {
       let {resultImageKey} = this.state;
         if(compressedimage)
         {
            this.props.onChange(resultImageKey,[compressedimage]);
         }
            this.setState({resultImageCompressed : null,resultImageKey : null});
     }

     getMember = (value) =>
     {
           let branchid = this.props.branchid;
             api.post('member-suggestion', {value,branchid})
             .then(response => {
               this.props.onChange('memberArray', response.data[0]);
             }).catch(error => console.log(error) )
     }

  render() {

    const {fields, errors, onChange,onRemove,employeeList,onRemoveImage,clientProfileDetail} = this.props;
    let employeeNewList = employeeList ? cloneDeep(employeeList) : [];
    employeeNewList.map(x => { x.value = x.id;  x.label = x.label + " - " + x.employeecode; return x; });
    let  dropzoneRef;
    let  dropzone1Ref;
    let {resultImageCompressed,imageHeightWidth} = this.state;

    return (
      <div className="textfields-wrapper">
        <RctCollapsibleCard >
          <form noValidate autoComplete="off">
            <div className="row">
               <div className="col-sm-12 col-md-8 col-xl-3">

                    <FormControl fullWidth>
                       <label > </label>
                        <RadioGroup row aria-label="resultof" id="resultof" name="resultof" value={fields.resultof} onChange={(e) => onChange('resultof',e.target.value)} >
                        {
                          Referby.filter(x => clientProfileDetail && clientProfileDetail.clienttypeId == 2 ? x.value == 2 : ( x.value != 3 && x.value != 4)).map((resultof, key) => ( <FormControlLabel value={resultof.value} disabled = {fields.id != 0} key= {'resultofOption' + key} control={<Radio />} label={resultof.name} />))
                        }
                        </RadioGroup>
                        <FormHelperText  error>{errors.resultof}</FormHelperText>
                    </FormControl>
                </div>

                {
                  fields.resultof== "1" &&
                    <div className={"col-sm-12 col-md-8 col-xl-3"}>
                     <FormControl fullWidth>
                      <Combobox
                        onChange={(value) => onChange('employee',value)}
                        value={fields.employee} label = {"Select Employee"} options = {employeeNewList}
                        disabled = {fields.id != 0}/>
                      <FormHelperText  error>{errors.employee}</FormHelperText>
                     </FormControl>
                    </div>
                }

                {fields.resultof== "2" &&
                  <div className={"col-sm-12 col-md-8 col-xl-3"}>
                    <AutoSuggest  value = {fields.member.label ? fields.member.label : ''} suggestions = {fields.memberArray} getSuggetion= {(value) => this.getMember(value)}  label = "Member"
                    onChange= {(value) => onChange('member.label', value, true) }
                    onValueChange= {(value) => onChange('member', value) }
                    placeholder = {"Search by name or member code"}
                    disabled = {fields.id != 0}/>
                    <FormHelperText  error>{errors.member}</FormHelperText>
                  </div>
                }

              </div>


               <div className="row">
                 <div className = "col-sm-12 col-md-5 col-xl-3">
                    <TextField type="number"  id="resultachieveindays" fullWidth
                    label="Result achieved in days"  value={fields.resultachieveindays}
                    onChange = {(e) => onChange('resultachieveindays',e.target.value)}
                   />
                   <FormHelperText >{errors.resultachieveindays}</FormHelperText>
                 </div>

                 <div className = "col-sm-12 col-md-5 col-xl-3">
                    <TextField inputProps={{maxLength:200}}  id="resulttype" fullWidth
                    label="Result Type"  value={fields.resulttype}
                    onChange = {(e) => onChange('resulttype',e.target.value)}
                   />
                   <FormHelperText >{'Example : Fat Loss, Muscle Gain , etc. '}</FormHelperText>
                 </div>

                 <div className = "col-sm-12 col-md-5 col-xl-3">
                    <TextField inputProps={{maxLength:200}}  id="resultdata" fullWidth
                    label="Result Data"  value={fields.resultdata}
                    onChange = {(e) => onChange('resultdata',e.target.value)}
                   />
                   <FormHelperText >{'Example : 20 KG Weight Loss, 6 Pack Abs, etc. '}</FormHelperText>
                 </div>
               </div>


               <div className="row">
                 <div className = "col-sm-12 col-md-5 col-xl-3">
                    <TextField inputProps={{maxLength:200}}  id="testimoniallink" fullWidth
                    label="Testimonial Video Link"  value={fields.testimoniallink}
                    onChange = {(e) => onChange('testimoniallink',e.target.value)}
                   />
                   <FormHelperText >{errors.testimoniallink}</FormHelperText>
                   <FormHelperText > </FormHelperText>
                 </div>
               </div>

               <div className="row">
                 <div className = "col-sm-12 col-md-5 col-xl-3">
                    <TextField inputProps={{maxLength:300}}  id="testimonialwords" fullWidth
                    label="Testimonial Words"  value={fields.testimonialwords}
                    multiline rows={1} rowsMax={3}
                    onChange = {(e) => onChange('testimonialwords',e.target.value)}
                   />
                   <FormHelperText  error>{'Total characters : ' + fields.testimonialwords.length + ' (Max. 300 characters allowed)'}</FormHelperText>
                 </div>
               </div>

               <div className="row">
                  <div className="col-4 col-sm-4 col-md-4 col-xl-2">
                    <label className={"professionaldetail_padding " + (isMobile ? "pl-0" : "pl-0")} >Publishing Status</label>
                  </div>
                  <div className="col-8 col-sm-8 col-md-4 col-xl-3 d-flex">
                    <InputLabel className ={'my-auto pr-5 pl-10' + (fields.publishingstatus == 0 ? 'fw-bold ' : '') }  htmlFor="publishingstatus">No</InputLabel>
                       <FormControlLabel className ={'mr-0 pl-10 my-auto'}
                        control={
                            <Switch
                            checked={fields.publishingstatus == 0 ? false : true}
                            onChange={(e) => onChange('publishingstatus' , e.target.checked , true)}
                            />
                          } />
                     <InputLabel className ={'my-auto ' + (fields.publishingstatus == 1 ? 'fw-bold ' : '') }   htmlFor="publishingstatus">Yes</InputLabel>
                   </div>
               </div>


              <div className="row">
                <div className="col-12 col-sm-12 col-md-6 col-xl-2">
                  <div className="rct-picker">
                      <DatePicker  label ={"Publish Start Date *"} minDate = {fields.id != 0 ? fields.publishstartdate :  getLocalDate(new Date())} value ={fields.publishstartdate} onChange = {(date) => onChange('publishstartdate',date ,true) }/>
                  </div>
                  <FormHelperText  error>{errors.publishstartdate}</FormHelperText>
                </div>

                <div className="col-12 col-sm-12 col-md-6 col-xl-2">
                  <div className="rct-picker">
                      <DatePicker  label ={"Publish End Date *"} minDate = {fields.id != 0 ? fields.publishenddate :  getLocalDate(new Date())} value ={fields.publishenddate} onChange = {(date) => onChange('publishenddate',date ,true) }/>
                  </div>
                  <FormHelperText  error>{errors.publishenddate}</FormHelperText>
                </div>
              </div>


          <div className="row pt-10">
            <div className="col-sm-12 col-md-12 col-xl-12">
              <div className="row">
                 <div className="col-sm-12 col-md-6 col-xl-4">
                       <div className = "row" style={{display: 'flex', justifyContent: 'center'}}>
                         <div className="col-sm-8 col-md-12 col-xl-8">
                           <a href="javascript:void(0)" className="bg-primary  text-center cart-link text-white py-2 mb-2 pl-4" onClick={(e) => { dropzoneRef.open() } }>
                             Click here to upload before image
                           </a>
                         </div>
                       </div>

                       <Dropzone onDrop={(imageFiles) =>this.onChangeImageToCompress('beforeimageFiles',imageFiles)} accept="image/jpeg, image/png" multiple={false}
                        ref={(node) => { dropzoneRef = node; }}>
                       {({getRootProps, getInputProps}) => (
                         <section >
                           <div
                             {...getRootProps({
                               className: 'dropzone'
                             })}
                           >
                             <input {...getInputProps()} />
                             <div className = "row">


                          <div className="col-12 p-3" >
                            <RctCard customClasses="d-flex  mb-0 flex-column justify-content-between overflow-hidden">
                             {((fields.beforeimageFiles && fields.beforeimageFiles.length > 0) || fields.beforeimage )  &&
                              <div className="overlay-wrap overflow-hidden" >
                                <div className="text-center p-4">
                                  {fields.beforeimageFiles.length > 0 ?
                                         <img src={fields.beforeimageFiles[0].preview} alt="" type="file" name="beforeimageFiles"  className="w-100  img-fluid"/>
                                       : <img src={CustomConfig.serverUrl + fields.beforeimage}  alt="" type="file" name="beforeimageFiles"/>
                                  }
                                 </div>
                                 <div className="overlay-content d-flex align-items-end">
                                  <a href="javascript:void(0)" className="bg-primary text-center w-100 cart-link text-white py-2" onClick={(e) => { onRemoveImage('beforeimageFiles'); e.preventDefault(); }}>
                                    Remove
                                  </a>
                                 </div>
                               </div>
                              }
                             </RctCard>
                            </div>
                           </div>
                          </div>
                         </section>
                        )}
                      </Dropzone>


                        <p className = "text-danger pt-5 fs-12">Note : For better performance , image should be 350 x 400 pixels</p>

                </div>


                <div className="col-sm-12 col-md-6 col-xl-4">
                   <div className = "row" style={{display: 'flex', justifyContent: 'center'}}>
                     <div className="col-sm-8 col-md-12 col-xl-8">
                       <a href="javascript:void(0)" className="bg-primary  text-center cart-link text-white py-2 mb-2 pl-4" onClick={(e) => { dropzone1Ref.open() } }>
                         Click here to upload after image
                       </a>
                     </div>
                   </div>

                   <Dropzone onDrop={(imageFiles) =>this.onChangeImageToCompress('afterimageFiles',imageFiles)} accept="image/jpeg, image/png" multiple={false}
                    ref={(node) => { dropzone1Ref = node; }}>
                   {({getRootProps, getInputProps}) => (
                     <section >
                       <div
                         {...getRootProps({
                           className: 'dropzone'
                         })}
                       >
                         <input {...getInputProps()} />
                         <div className = "row">


                      <div className="col-12 p-3" >
                        <RctCard customClasses="d-flex  mb-0 flex-column justify-content-between overflow-hidden">
                         {((fields.afterimageFiles && fields.afterimageFiles.length > 0) || fields.afterimage )  &&
                          <div className="overlay-wrap overflow-hidden" >
                            <div className="text-center p-4">
                              {fields.afterimageFiles.length > 0 ?
                                     <img src={fields.afterimageFiles[0].preview} alt="" type="file" name="afterimageFiles"  className="w-100  img-fluid"/>
                                   : <img src={CustomConfig.serverUrl + fields.afterimage}  alt="" type="file" name="afterimageFiles"/>
                              }
                             </div>
                             <div className="overlay-content d-flex align-items-end">
                              <a href="javascript:void(0)" className="bg-primary text-center w-100 cart-link text-white py-2" onClick={(e) => { onRemoveImage('afterimageFiles'); e.preventDefault(); }}>
                                Remove
                              </a>
                             </div>
                           </div>
                          }
                         </RctCard>
                        </div>
                       </div>
                      </div>
                     </section>
                    )}
                  </Dropzone>
                      <p className = "text-danger pt-5 fs-12">Note : For better performance , image should be 350 x 400 pixels</p>
                </div>


            </div>
          </div>
        </div>
      </form>
    </RctCollapsibleCard>

     {resultImageCompressed &&
      <ImageCompressor imageforcompress = {resultImageCompressed}
                  onCompress ={(compressedimage) => this.onChangeCompressedImage(compressedimage)}
                  imageHeightWidth = {imageHeightWidth}
                  />
      }
    </div>
   );
  }
}
