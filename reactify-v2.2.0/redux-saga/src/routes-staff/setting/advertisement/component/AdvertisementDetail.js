import React, {PureComponent}  from 'react';
import  FormControl  from '@material-ui/core/FormControl';
 import TextField  from '@material-ui/core/TextField';
import FormHelperText from '@material-ui/core/FormHelperText';
 import InputLabel from '@material-ui/core/InputLabel';
import { RctCard } from 'Components/RctCard';

import Form from 'reactstrap/lib/Form';
import RctCollapsibleCard from 'Components/RctCollapsibleCard/RctCollapsibleCard';
import Dropzone from 'react-dropzone';
import CustomConfig from 'Constants/custom-config';

import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Advertisementcategory from 'Assets/data/advertisementcategory';
import Switch from '@material-ui/core/Switch';
import DatePicker from 'Routes/advance-ui-components/dateTime-picker/components/DatePicker';
import {isMobile} from 'react-device-detect';
import  Quoteofdaytype from 'Assets/data/quoteofdaytype';
import {getLocalDate} from 'Helpers/helpers';

import ImageCropper from 'Components/ImageCropper';

export default class AdvertisementDetail extends PureComponent {
  state ={
    advertisementImageCropped : null,
      imageHeightWidth : {},
  }

     onChangeImageToCrop(key,value)
     {
           this.setState({advertisementImageCropped : value[0],
                        imageHeightWidth : {width : 1000 ,height : 1000 , size : 0.1}});
     }

     onCloseImageCropperDialog()
        {
             this.setState({
                 advertisementImageCropped : null,
             });
        }

  onChangeCroppedImage(croppedimage)
     {
            this.props.onChange('imageFiles',[croppedimage]);
            this.onCloseImageCropperDialog();
     }


  render() {

    const {fields, errors, onChange,onRemove} = this.props;
    const files = fields.imageFiles;
    let  dropzoneRef;
    let {imageHeightWidth,advertisementImageCropped} = this.state;

    return (
      <div className="textfields-wrapper">
        <RctCollapsibleCard >
          <form noValidate autoComplete="off">
            <div className="row">
               <div className="col-12 col-md-6">
                  <div className ="row">
                     <label className="professionaldetail_padding pl-10" > Category </label>
                           <RadioGroup row aria-label="advertisementcategory" className ={'pl-15'}   name="advertisementcategory"   value={fields.advertisementcategory} onChange={(e) => onChange('advertisementcategory', e.target.value)}>
                           {
                             Advertisementcategory.map((advertisementcategory, key) => ( <FormControlLabel value={advertisementcategory.value} key= {'advertisementcategoryOption' + key} control={<Radio />} label={advertisementcategory.name} />))
                           }
                         </RadioGroup>
                  </div>
                </div>
                  <div className="col-12 col-md-6 d-flex" style ={{alignItems : 'center'}}>

                  <label className={"professionaldetail_padding " + (isMobile ? "pl-0" : "pl-0")} >Publishing Status</label>
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
                  <div className="col-12 col-md-6 d-flex">

                                       <TextField  required id="content" inputProps={{maxLength:200}} fullWidth label={fields.advertisementcategory != 2 ? "Title" : "Author Name"}   value={fields.title} onChange={(e) => onChange('title',e.target.value, false)} />
                                       <FormHelperText  error>{errors.title}</FormHelperText>
                                       <FormHelperText  ></FormHelperText>

                   </div>
                <div className="col-12  col-md-3 ">
                  <div className="rct-picker">
                      <DatePicker  label ={fields.advertisementcategory == 2 ? "Quote Date *" : "Publishing Date *"} minDate = {fields.publishstartdate ? (fields.id != 0 ? fields.publishstartdate :  getLocalDate(new Date())) : ''}  value ={fields.publishstartdate} onChange = {(date) => onChange('publishstartdate',date ,true) }/>
                  </div>
                  <FormHelperText  error>{errors.publishstartdate}</FormHelperText>
                </div>

              {fields.advertisementcategory != 2 &&
                <div className="col-12 col-md-3">
                  <div className="rct-picker">
                      <DatePicker  label ={"Publishing Till Date *"} minDate = {fields.publishenddate ? (fields.id != 0 ? fields.publishenddate :  getLocalDate(new Date())) : ''} value ={fields.publishenddate} onChange = {(date) => onChange('publishenddate',date ,true) }/>
                  </div>
                  <FormHelperText  error>{errors.publishenddate}</FormHelperText>
                </div>
              }
            </div>



           <div className="row">
             <div className="col-sm-12 col-md-6">
                <TextField    id="content" inputProps={{maxLength:400}} multiline rows={3} rowsMax={3} fullWidth label="Content"   value={fields.content} onChange={(e) => onChange('content',e.target.value, false)} />
                <FormHelperText  error>{'Total characters : ' + fields.content.length + ' (Max. 400 characters allowed)'}</FormHelperText>
                <FormHelperText  error>{errors.content}</FormHelperText>
              </div>
           </div>

{fields.advertisementcategory == 1 &&
            <div className="row">
               <div className="col-12">
                  <div className ="row">
                     <label className="professionaldetail_padding" > Advertisement </label>
                        <RadioGroup row aria-label="quotetype" className ={'pl-15'}   name="quotetype"   value={fields.quotetype} onChange={(e) => onChange('quotetype', e.target.value)}>
                         {
                           Quoteofdaytype.map((quotetype, key) => ( <FormControlLabel value={quotetype.value} key= {'quotetypeOption' + key} control={<Radio />} label={quotetype.name} />))
                         }
                        </RadioGroup>
                        <FormHelperText  error>{errors.quotetype}</FormHelperText>
                  </div>
                </div>
              </div>
}

            {fields.advertisementcategory == 1 && fields.quotetype == 2 &&
             <div className="row">
                <div className="col-sm-12 col-md-6 col-xl-4">
                   <TextField id="link" inputProps={{maxLength:200}} fullWidth label=" Link"  value={fields.link} onChange={(e) => onChange('link',e.target.value , false)} />
                   <FormHelperText  error>{errors.link}</FormHelperText>
               </div>
             </div>
           }

         {fields.advertisementcategory != 3 && fields.quotetype == 1 &&
          <div className="row">
            <div className="col-sm-12 col-md-6 ">
               <div className = "row" style={{display: 'flex', justifyContent: 'center'}}>
                 <div className="col-sm-8 col-md-12 col-xl-8">
                   <a href="#" className="bg-primary  text-center cart-link text-white py-2 mb-2 pl-4" onClick={(e) => {e.preventDefault(); dropzoneRef.open(); } }>
                     Click here to upload image
                   </a>
                 </div>
               </div>

               <Dropzone onDrop={(imageFiles) =>this.onChangeImageToCrop('imageFiles',imageFiles)} accept="image/jpeg, image/png" multiple={false}
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
                     {((fields.imageFiles && fields.imageFiles.length > 0) || fields.image )  &&
                      <div className="overlay-wrap overflow-hidden" >
                        <div className="text-center p-4">
                          {fields.imageFiles.length > 0 ?
                                 <img src={fields.imageFiles[0].preview} alt="" type="file" name="imageFiles"  className="w-100  img-fluid"/>
                               : <img src={CustomConfig.serverUrl + fields.image}  alt="" type="file" name="imageFiles"/>
                          }
                         </div>
                         <div className="overlay-content d-flex align-items-end">
                          <a href="#" className="bg-primary text-center w-100 cart-link text-white py-2" onClick={(e) => {e.preventDefault(); onRemove(); }}>
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
            </div>

            <div className="col-sm-12 pt-5">
              <p className = "text-danger fs-12">{fields.advertisementcategory == 1 ? "Note : For better performance , image should be 400 x 250 pixels" : "Note : For better performance , image should be 300 x 300 pixels"}</p>
            </div>

          </div>
          }
      </form>
    </RctCollapsibleCard>

      {advertisementImageCropped &&
                   <ImageCropper onCancel = {this.onCloseImageCropperDialog.bind(this)}
                    imageforcrop = {advertisementImageCropped}
                    onCrop ={(croppedimage) => this.onChangeCroppedImage(croppedimage)}
                    imageHeightWidth = {imageHeightWidth}
                    />
     }
    </div>
   );
  }
}
