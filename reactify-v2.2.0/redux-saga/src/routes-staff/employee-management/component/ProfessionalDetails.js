import React, {PureComponent}  from 'react';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl  from '@material-ui/core/FormControl';
import TextField  from '@material-ui/core/TextField';
import Checkbox  from '@material-ui/core/Checkbox';
import FormHelperText from '@material-ui/core/FormHelperText';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import Form from 'reactstrap/lib/Form';import FormGroup from 'reactstrap/lib/FormGroup';
import RctCollapsibleCard from 'Components/RctCollapsibleCard/RctCollapsibleCard';
import DatePicker from 'Routes/advance-ui-components/dateTime-picker/components/DatePicker';
import Dropzone from 'react-dropzone';
import Title  from 'Assets/data/title';
import Gender  from 'Assets/data/gender';
import Status  from 'Assets/data/status';
import Branchassociate  from 'Assets/data/branchassociate';

import Specialization  from 'Assets/data/specialization';
import CustomConfig from 'Constants/custom-config';
import CapturePhoto from 'Components/CapturePhoto';
import {base64ToFile,getCurrency} from 'Helpers/helpers';
import ImageCropper from 'Components/ImageCropper';
import MultiSelect from 'Routes/advance-ui-components/autoComplete/component/MultiSelect';
import {isMobile} from 'react-device-detect';
import Fab from '@material-ui/core/Fab';
import Appaccess  from 'Assets/data/appaccess';
import InputAdornment from '@material-ui/core/InputAdornment';


import Switch from '@material-ui/core/Switch';
import { withStyles } from '@material-ui/core/styles';
import styles from 'Components/Switch-style/index';

import MultiCombobox from 'Routes/advance-ui-components/autoComplete/component/MultiCombobox';
import Tooltip from '@material-ui/core/Tooltip';
import CommissionType  from 'Assets/data/discounttype';

class ProfessionalDetail extends PureComponent {

  state ={
    staffProfileImageCropped :null,
      imageHeightWidth : {},
  }

  onChangeImageToCrop(key,value)
  {
        this.setState({staffProfileImageCropped : value[0],
                     imageHeightWidth : {width : 1000 ,height : 1000 , size : 0.1}});
  }

  onCloseImageCropperDialog()
     {
          this.setState({
              staffProfileImageCropped : null,
          });
     }

  onChangeCroppedImage(croppedimage)
     {
            this.props.onChange('imageFiles',[croppedimage]);
            this.onCloseImageCropperDialog();
     }

  render() {
    let {staffProfileImageCropped,imageHeightWidth} = this.state;
    const {fields, errors, onChange,passwordchecker,rolelist,isMultipleBranch,zonelist,branchlist,sessiontypelist,userProfileDetail,clientProfileDetail,timezonelist} = this.props;

    let isgymowner = (rolelist && rolelist.filter(x => (x.rolealias == "gymowner") && x.id == fields.assignrole).length > 0) ? 1 : 0;
    // const isDisabled = 	fields.permentaddress1 = fields.address1;

    let gender = Gender.filter(value => value.value == fields.gender).map(x => x.value);
     gender = gender.length > 0 ? gender[0] : '1';
        return (
      <div className="textfields-wrapper">
   <RctCollapsibleCard >
   <form noValidate autoComplete="off">
   <div className="row">

<div className="col-sm-6 col-md-7 col-xl-6">
    <div className="row">
          <div className="col-sm-4 col-md-4 col-xl-3">
               <FormGroup className="has-wrapper">
                     <FormControl fullWidth>
               <InputLabel htmlFor="title">Title</InputLabel>
                         <Select value={fields.title} onChange={(e) => onChange(e.target.name,e.target.value)}
                           inputProps={{name: 'title', id: 'title', }}>

                           {
                             Title.map((title, key) => ( <MenuItem value={title.value} key= {'titleOption' + key}>{title.name}</MenuItem> ))
                            }
                         </Select>
                     </FormControl>
              </FormGroup>
          </div>
          <div className="col-sm-8 col-md-8 col-xl-9">
                 <TextField  required inputProps={{maxLength:50}}  id="firstname" autoFocus = {true} fullWidth label="First Name"   value={fields.firstname} onChange={(e) => onChange('firstname',e.target.value , true)} onBlur = {(e) => onChange('firstname',e.target.value, true)}/>
                 <FormHelperText  error>{errors.firstname}</FormHelperText>
           </div>
           <div className="col-sm-12 col-md-6 col-xl-6">
               <TextField id="fathername" inputProps={{maxLength:50}} fullWidth label="Middle Name"  value={fields.fathername} onChange={(e) => onChange('fathername', e.target.value)}  />
               <FormHelperText  error>{errors.fathername}</FormHelperText>
           </div>
           <div className="col-sm-12 col-md-6 col-xl-6">
               <TextField required inputProps={{maxLength:50}} id="lastname" fullWidth label="Last Name" value={fields.lastname} onChange={(e) => onChange('lastname', e.target.value, true)} onBlur = {(e) => onChange('lastname', e.target.value, true)}/>
               <FormHelperText  error>{errors.lastname}</FormHelperText>
           </div>
           <div className="col-sm-12 col-md-8 col-xl-6">
               <div  className= "row" >
               <label className={isMobile ? "professionaldetail_padding mt-5" : "professionaldetail_padding mt-5"} > Gender </label>
                         <RadioGroup row aria-label="gender"  id="gender" name="gender" value={fields.gender} onChange={(e) => onChange('gender', e.target.value)} onBlur = {(e) => onChange('gender', e.target.value)}>
                         {
                           Gender.map((gender, key) => ( <FormControlLabel value={gender.value}
                             key= {'genderOption' + key} control={<Radio />} label={

                             <img key = {'genderImgOPrion' + key} src={gender.value == '2' ? require('Assets/img/female-profile.png') : require('Assets/img/male-profile.png')}  alt = ""  className="rounded-circle mr-15" width="50" height="50"/>

                           } />))
                         }
                         </RadioGroup>
                         <FormHelperText  error>{errors.gender}</FormHelperText>

               </div>
           </div>
           {clientProfileDetail && clientProfileDetail.clienttypeId != 2 &&
           <div className="col-sm-12 col-md-8 col-xl-6">
               <div  className= "row" >
               <label className="professionaldetail_padding" > Status </label>
                         <RadioGroup row aria-label="status"  name="status" value={fields.status} className ={'pl-15'} onChange={(e) => onChange( 'status', e.target.value)} onBlur = {(e) => onChange('status', e.target.value)}>
                         {
                           Status.map((status, key) => ( <FormControlLabel value={status.value} key= {'statusOption' + key} control={<Radio />} label={status.name} />))
                         }
                         </RadioGroup>
               </div>
           </div>
           }
           {clientProfileDetail && clientProfileDetail.clienttypeId != 2 &&
           <div className="col-sm-12 col-md-12 col-xl-6">
              <div  className= "row" >
                <label className="professionaldetail_padding" > App Access </label>
                    <RadioGroup row aria-label="appaccess" className ={'pl-15'}  id="appaccess" name="appaccess" value={fields.appaccess} onChange={(e) => onChange('appaccess', e.target.value)} onBlur = {(e) => onChange('appaccess', e.target.value)}>
                    {
                      Appaccess.map((appaccess, key) => ( <FormControlLabel value={appaccess.value}
                         key= {'appaccessOption' + key} control={<Radio />} label={ appaccess.name } />))
                    }
                    </RadioGroup>
                    <FormHelperText className="pl-15 mt-0 pb-5"  error> {fields.appaccess == "1" ? "NOTE: User can login in app" : "NOTE: User can't login in app "}  </FormHelperText>
              </div>
          </div>
          }
       </div>
      </div>
       <div className="col-10 col-sm-6 col-md-4 col-xl-3 d-flex mt-10">
          <label className="professionaldetail_padding" > Profile Picture  </label>
          <Dropzone accept="image/jpeg, image/png"
     onDrop={(imageFiles) => this.onChangeImageToCrop('imageFiles',imageFiles)}>
                       {({getRootProps, getInputProps}) => (
                         <section >
                           <div
                             {...getRootProps({
                               className: 'rounded-circle border-primary center-block pointer '
                             })}
                           >
                             <input {...getInputProps()} />
                             <div >
              {fields.imageFiles.length > 0 ?
                     <img src={fields.imageFiles[0].preview} key= {'pro'} alt="" type="file" name="imageFiles" className="size-120 rounded-circle border-primary rct-notify" width="50" height="50" />
                   : <img src={fields.image ? CustomConfig.serverUrl + fields.image : (gender == '2' ? require('Assets/img/female-profile.png') : require('Assets/img/male-profile.png'))}  alt = ""  className="size-120 rounded-circle border-primary rct-notify" width="50" height="50"
                 													onError={(e)=>{
                 															e.target.src = (gender == '2' ? require('Assets/img/female-profile.png') : require('Assets/img/male-profile.png'))}}/>
               }
               </div>
               </div>
             </section>
           )}
       </Dropzone>

           <CapturePhoto onCapture= {(image) => {

            image = base64ToFile(image,fields.firstname +'.png');
            this.onChangeImageToCrop('imageCaptureFiles',[image]);
            }}/>

            {staffProfileImageCropped &&
               <ImageCropper onCancel = {this.onCloseImageCropperDialog.bind(this)}
                              imageforcrop = {staffProfileImageCropped}
                              onCrop ={(croppedimage) => this.onChangeCroppedImage(croppedimage)}
                              imageHeightWidth = {imageHeightWidth}
                              fixedRatio = {true}
                              />
             }

             {(fields.imageFiles.length > 0 || fields.image) &&
               <div>
                   <Fab className="btn-white text-primary ml-10" variant="round" mini= "true"
                      onClick={() =>
                        {
                          if(fields.imageFiles.length > 0)
                            {
                              onChange('imageFiles',[]);
                             }
                          else if(fields.image)
                             {
                               onChange('image','');
                             }
                          }
                        }>
                        <i className="zmdi zmdi-delete pointer fs-20"></i>
                      </Fab>
                    </div>
                    }

           </div>
 </div>
 <div className="row" >
     <div className="col-sm-6 col-md-6 col-xl-3">
      {/* please do not change in below two lines */}
            <input id="username" style={{display:'none'}} type="email" name="fakeusernameremembered" />
            <input id="password" style={{display:'none'}} type="password" name="fakepasswordremembered" />


            <TextField autoComplete = "nope" required inputProps={{maxLength:100}} fullWidth label="Email-Id/User Name"  value={fields.emailid} onChange={(e) => onChange('emailid', e.target.value,  true)} onBlur = {(e) => onChange('emailid',e.target.value , true)}/>
            <FormHelperText  error>{errors.emailid}</FormHelperText>
      </div>
      <div className="col-sm-6 col-md-6 col-xl-3">
             <TextField required autoComplete = "new-password" inputProps={{maxLength:50}} type="password" fullWidth label="Password" value={fields.password} onChange={(e) => onChange('password',e.target.value, true)} onBlur = {(e) => onChange( 'password',e.target.value, true)} ref = 'userpwd'/>
             {
               passwordchecker ? <FormHelperText style = {{color: passwordchecker.color}}>{passwordchecker.message}</FormHelperText> : <FormHelperText  error>{errors.password}</FormHelperText>
             }
       </div>

      {clientProfileDetail && clientProfileDetail.clienttypeId != 2 &&
       <div className="col-sm-6 col-md-6 col-xl-3">

           <FormControl fullWidth>
              <InputLabel required htmlFor="assignrole">Assign Role</InputLabel>
                    <Select value={fields.assignrole} onChange={(e) => {
                      onChange(e.target.name,e.target.value);
                     }}
                      inputProps={{name: 'assignrole', id: 'assignrole'}}>
                      {
                      rolelist && rolelist.map((assignrole, key) => ( <MenuItem value={assignrole.id} key = {'assignroleOption' + key }>{assignrole.label}</MenuItem> ))
                      }
                    </Select>
                    </FormControl>
                <FormHelperText error>{errors.assignrole}</FormHelperText>
       </div>
      }

    
   </div>

    <div className="row" >
      {isMultipleBranch == 1 &&
          <div className="col-sm-6 col-md-6 col-xl-3">

            <div  className= "row" >
              <label className="professionaldetail_padding pt-20" > Associate with </label>
                <RadioGroup row aria-label="associatewith"  name="associatewith" value={fields.associatewith} className ={'pl-15'} onChange={(e) => onChange( 'associatewith', e.target.value)} onBlur = {(e) => onChange('associatewith', e.target.value)}>
                  {
                    Branchassociate.map((associatewith, key) => ( <FormControlLabel value={associatewith.value} key= {'associatewithOption' + key} control={<Radio />} label={associatewith.name} />))
                  }
                </RadioGroup>
            </div>
          </div>
       }

       {isMultipleBranch == 1 && fields.associatewith == 1 &&
         <div className="col-sm-6 col-md-6 col-xl-3">

           <FormControl fullWidth>
             <InputLabel required htmlFor="selectedbranch">Select Branch</InputLabel>
               <Select value={fields.selectedbranch} onChange={(e) => {
                   onChange(e.target.name,e.target.value);
                  }}
                   inputProps={{name: 'selectedbranch', id: 'selectedbranch'}}>
                   {
                   branchlist && branchlist.map((branchlist, key) => ( <MenuItem value={branchlist.id} key = {'branchlistOption' + key }>{branchlist.label}</MenuItem> ))
                   }
                </Select>
            </FormControl>
            <FormHelperText error>{errors.selectedbranch}</FormHelperText>


         </div>
       }

       {isMultipleBranch == 1 && fields.associatewith == 2 &&
         <div className="col-sm-6 col-md-6 col-xl-3">
             <FormControl fullWidth>
               <InputLabel required htmlFor="selectedzone">Select Zone</InputLabel>
                 <Select value={fields.selectedzone} onChange={(e) => {
                     onChange(e.target.name,e.target.value);
                    }}
                     inputProps={{name: 'selectedzone', id: 'selectedzone'}}>
                     {
                     zonelist && zonelist.map((zonelist, key) => ( <MenuItem value={zonelist.id} key = {'zonelistOption' + key }>{zonelist.label}</MenuItem> ))
                     }
                  </Select>
              </FormControl>
              <FormHelperText error>{errors.selectedzone}</FormHelperText>
         </div>
       }

       <div className="col-12 col-md-12 col-xl-3">
           <FormControl fullWidth>
             <InputLabel htmlFor="selectedtimezone">Select Time Zone *</InputLabel>
               <Select displayEmpty value={fields.selectedtimezone} onChange={(e) => onChange( 'selectedtimezone' ,e.target.value,true)}
                   inputProps={{name: 'selectedtimezone', id: 'selectedtimezone', }}>
                     {
                       timezonelist &&
                       timezonelist.map((timezone, key) => ( <MenuItem value={timezone.offsetvalue} key = {'timezoneOption' + key }>{timezone.label}</MenuItem> ))
                     }
                 </Select>
               <FormHelperText  error>{errors.selectedtimezone}</FormHelperText>
           </FormControl>
         </div>
    </div>



        <div className="row">
          <div className="col-sm-6 col-md-6 col-xl-3">
            <TextField required id="mobile" type="number" fullWidth label="Mobile Number"   value={fields.mobile} onChange={(e) => onChange('mobile', e.target.value, true)} onBlur = {(e) => onChange('mobile', e.target.value, true)}/>
            <FormHelperText  error>{errors.mobile}</FormHelperText>
          </div>
          <div className="col-sm-6 col-md-6 col-xl-3">
              <TextField inputProps={{maxLength:12}} id="phone" type="number" fullWidth label="Phone Number"  value={fields.phone} onChange={(e) => onChange('phone', e.target.value)}/>
              <FormHelperText error>{errors.phone}</FormHelperText>
          </div>

          {clientProfileDetail && clientProfileDetail.clienttypeId != 2 &&
            <div className="col-sm-6 col-md-6 col-xl-3">
              <div className="rct-picker">
                  <DatePicker label = "Date of Joining" value ={fields.dateofjoining} onChange = {(date) => onChange('dateofjoining',date ,false) }/>
                  <FormHelperText error></FormHelperText>
              </div>
            </div>
          }
          {clientProfileDetail && clientProfileDetail.clienttypeId != 2 &&
            <div className="col-sm-6 col-md-6 col-xl-3">
                <div className="rct-picker">
                  <DatePicker  label  = "Date of Resign" value ={fields.dateofresigning} onChange = {(date) => onChange('dateofresigning',date , false) }/>
                  <FormHelperText error></FormHelperText>
                </div>
            </div>
          }

  </div>






      </form>
 </RctCollapsibleCard>
 </div>
);
}
}

export default withStyles(styles)(ProfessionalDetail);
