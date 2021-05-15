import React, { Component } from 'react';
import Form from 'reactstrap/lib/Form';
import FormGroup from 'reactstrap/lib/FormGroup';
import Input from 'reactstrap/lib/Input';
import Label from 'reactstrap/lib/Label';

import Button from '@material-ui/core/Button';
import FormHelperText from '@material-ui/core/FormHelperText';
import api from 'Api';
import {cloneDeep,checkError,getClientId,getCurrency} from 'Helpers/helpers';
import {required,email,checkMobileNo,checkAlpha,restrictLength, allowNumeric,checkDecimal,allowAlphaNumeric} from 'Validations';
import { NotificationManager } from 'react-notifications';
import { connect } from 'react-redux';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';
import {saveLoginEnquiryForm,clsLoginEnquiryForm,toggleThemePanelAction}from 'Actions';
import DropdownMenu from 'reactstrap/lib/DropdownMenu';
import Dropdown from 'reactstrap/lib/Dropdown';
import DropdownToggle from 'reactstrap/lib/DropdownToggle';
import { Link } from 'react-router-dom';
import Combobox from 'Routes/advance-ui-components/autoComplete/component/Combobox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import Gender  from 'Assets/data/gender';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import AutoSuggest from 'Routes/advance-ui-components/autoComplete/component/AutoSuggest';


class EnquiryForm  extends Component {

  constructor(props) {
     super(props);
		   this.state = this.getInitialState();
   }
   getInitialState()
    {
    this.initialState = {

                      fields : {
                            firstname:'',
                            lastname:'',
                            mobile:'',
                            servicePlan :'',
                            branchName :this.props.defaultbranchid || ''  ,
                            gender : "",
                            country:this.props.country ? {label : this.props.country,id : this.props.code} : {},
                            countryArray : [],
                          },
                          errors : { },
                          validated : false,

                          tableInfo : {
                            pageSize : 10,
                            pageIndex : 0,
                            pages : 1
                          }
                }
               return cloneDeep(this.initialState);
    }

  componentDidMount(){
      this.getBranchList();
      this.getServiceList();
    }

    getBranchList(){
         const {id}=this.props;
                api.post('login-branch-list',{id})
                .then(response => {
                  this.setState({branchList : response.data[0]});
                }).catch(error => console.log(error) )
        }
    getServiceList(state){
         let {id,defaultbranchid,ismultiplebranchid}=this.props;
         let{branchName}=this.state.fields;
         let branchid;
         let {tableInfo }  = this.state ;
         tableInfo.client_timezoneoffsetvalue = (localStorage.getItem('client_timezoneoffsetvalue') || 330);
         tableInfo.id=this.props.id;
         tableInfo.isExpressSale=true;
         tableInfo.branchid= branchName;

         if(state){
           tableInfo.pageIndex  = state.page;
           tableInfo.pageSize  = state.pageSize;
           tableInfo.sorted  = state.sorted;
           tableInfo.filtered = state.filtered;
         }
          api.post('login-servicehit',tableInfo)
          .then(response => {
            this.setState({servicePlanList : response.data[0]});
          }).catch(error => console.log(error) )
        }
        getCountry = (value) =>
        {
                api.post('country-suggestion', {value})
                .then(response => {
                  this.onChange('countryArray', response.data[0]);
                }).catch(error => console.log(error) )
        }
        componentWillUpdate(nextProps, nextState)
        {
          if(  (this.props.newenquirymodal && !nextProps.newenquirymodal))
          {
             this.setState(this.getInitialState());
          }
        }
 onSave(){
   let {id,defaultbranchid,ismultiplebranchid,newenquirymodal }=this.props;
   let{branchName,servicePlan}=this.state.fields;
   if(this.validate())
   {
     if (this.state.firstname !== '' && this.state.lastname !== '' && this.state.mobile != '')
      {
        const enquiry  =  this.state.fields;
        let price ;
         let serviceprice= this.state.servicePlanList.filter(x=>x.serviceId == servicePlan) ;
         serviceprice = serviceprice[0].price;
        {ismultiplebranchid==1 ? defaultbranchid=branchName : defaultbranchid}
            this.props.saveLoginEnquiryForm({enquiry,id,defaultbranchid,serviceprice});

      }
    }
	}

  toggleThemePanel() {
      this.props.toggleThemePanelAction();
    }

  onClose(){
      this.props.toggleThemePanelAction();
    }

  onChange(key,value,isRequired){
      let fields = this.state.fields;
      let error= isRequired ? required(value) : '';
      let branchName=this.state.fields;
      if(!error && value)
      {
          if(key == 'mobile')
          {
            value = allowNumeric(value);
            value = restrictLength(value,12);
            error = checkMobileNo(value);
            if(fields.country.id)
            {
              error = checkMobileNo(value, fields.country.id , fields.country.label , fields.country.languagecode);
            }
            else {
              error = checkMobileNo(value);
            }
          }
          else if(key == 'firstname' || key == 'lastname')
          {
            value = allowAlphaNumeric(value);
          }
        }
        if (key=='branchName'){

            this.getServiceList();
        }

        else if(key == 'country.label')
        {
          let country = this.state.fields.country;
          country.label = value;
          value = country;
          key = 'country';
        }
        else if(key == 'country')
        {
          if(fields.mobile)
          {
            this.state.errors.mobile = checkMobileNo(fields.mobile, value.id , value.label , );
          }
        }
      this.setState({
        fields: {
          ...this.state.fields,
            [key] : value,
          },
          errors : {...this.state.errors,
            [key] : error
          }
      })
    }

validate()
    {
        let errors = {};

          const fields = this.state.fields;

          errors.firstname = required(fields.firstname);

          errors.lastname = required(fields.lastname);

          errors.mobile = required(fields.mobile);
          errors.mobile = (errors.mobile != '' ? errors.mobile : (fields.country.id ? checkMobileNo(fields.mobile, fields.country.id , fields.country.label ) : checkMobileNo(fields.mobile)));
          errors.gender = required(fields.gender);

          let validated = checkError(errors);

           this.setState({
             fields: {	...this.state.fields,
               errors : errors,
               validated : validated
             }
           });
          return validated;
      }

  render() {

    const{dialogLoading,clientId,id,defaultbranchid,disabled,ismultiplebranchid,country,newenquirymodal} = this.props;
		const {fields,errors,branchList,servicePlanList} = this.state;
		return (
			<div className="fixed-plugin" style = {{position : "unset"}}>

              <Dropdown isOpen={newenquirymodal} toggle={() => this.toggleThemePanel()}>

              <DropdownToggle>

              <span>Are you interested to join our gym ?</span>
              <Button variant="contained" className="btn-light" toggle={() => this.toggleThemePanel()} >Click here</Button>

              </DropdownToggle>
		          <DropdownMenu className ="p-20 mt-20">
												 {
														 <div className="row">
                             <div className="col-12 col-md-12 col-xl-12">
                             <div className = " fs-18 fw-bold ">
                              ENQUIRY FORM
                              </div>
                             </div>

																 <div className="col-12 col-md-12 col-xl-12">
                                 <TextField  required inputProps={{maxLength:50}} fullWidth autoFocus = {true} id="firstname"  fullWidth label="First Name"  value={fields.firstname} onChange={(e) => this.onChange('firstname',e.target.value , true)}/>
                                 <FormHelperText  error>{errors.firstname}</FormHelperText>
																	 </div>

																	 <div className="col-12 col-md-12 col-xl-12">
                                   <TextField  required inputProps={{maxLength:50}}  id="lastname"  fullWidth label="Last Name"  value={fields.lastname} onChange={(e) => this.onChange('lastname',e.target.value , true)} />
                                   <FormHelperText  error>{errors.lastname}</FormHelperText>
																	 </div>

                                   <div className="col-sm-12 col-md-12 col-xl-12">
                                         <AutoSuggest required value = {fields.country.label ? fields.country.label : ''} suggestions = {fields.countryArray} getSuggetion= {(value) => this.getCountry(value)}  label = "Country *"
                                          onChange= {(value) => this.onChange('country.label', value , true) } onValueChange= {(value) => this.onChange('country', value , true) }/>
                                         <FormHelperText  error>{errors.country}</FormHelperText>
                                    </div>


                                    <div className="col-12 col-md-12 col-xl-12">
                                     <TextField required id="mobile" type="number"  label="Mobile Number"   value={fields.mobile} onChange={(e) => this.onChange('mobile',e.target.value, true)}/>
                                    <FormHelperText  error>{errors.mobile}</FormHelperText>
                                   </div>

                                   <div className="col-sm-6 col-md-6 col-xl-12">
                                   <div className = "row pt-1" >
                                        <label className="professionaldetail_padding" > Gender * </label>
                                         <RadioGroup row aria-label="gender" className ={'pl-15'} id="gender" name="gender" value={fields.gender} onChange={(e) => this.onChange('gender',e.target.value)} onBlur = {(e) => this.onChange('gender',e.target.value)}>
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

                                   <div className="col-sm-6 col-md-6 col-xl-12">
                                       <FormControl fullWidth>
                                       <Combobox
                     										onChange={(value) => this.onChange('servicePlan',value)}
                     										value={fields.servicePlan} label = {"Interested Service"} options = {servicePlanList && servicePlanList.map(x => {
                     											x.value = x.serviceId;
                     											x.label = x.servicename +" - " + x.price + " - " + x.durationcount + x.duration + " (" +(x.servicetypeId == 1 || x.servicetypeId == 3 ? x.servicetype : x.activity) +  ")"; return x; })}/>
                                         </FormControl>
                                         <FormHelperText  error>{errors.servicePlan}</FormHelperText>
                                     </div>


                          {ismultiplebranchid == 1 && <div className="col-sm-6 col-md-6 col-xl-12">
                                   <FormControl fullWidth>
                                   <Combobox onChange={(value) => this.onChange('branchName',value)}
                                      value={ismultiplebranchid==1?fields.branchName : defaultbranchid}
                                     label = {"Select Branch"} options = {branchList && branchList.map(y =>{
                                       y.value = y.id;
                                       y.label = y.label ; return y; })}/>

                                        <FormHelperText  error>{errors.branch}</FormHelperText>

                                     </FormControl>
                                   </div>}
																 </div>

															 }

		           <DialogActions>
		                  <Button variant="contained"    onClick={() => this.onSave()}  className="text-white btn-primary">
		                   Submit
		                  </Button>
		                  <Button variant="contained" className="btn-danger text-white"  onClick={() => this.onClose()}>
		                  Cancel
		                  </Button>
		           </DialogActions>
               </DropdownMenu>
		 				 </Dropdown>

  </div>
		)
	}
}




const mapStateToProps = ({ loginEnquiryFormReducer }) => {
	const { dialogLoading ,newenquirymodal,disabled} =  loginEnquiryFormReducer;

  return { dialogLoading ,newenquirymodal,disabled}
}

export default connect(mapStateToProps,{saveLoginEnquiryForm,clsLoginEnquiryForm,toggleThemePanelAction })(EnquiryForm)
