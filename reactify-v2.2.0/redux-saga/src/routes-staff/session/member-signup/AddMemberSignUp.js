import React from 'react';
import { connect } from 'react-redux';

import Form from 'reactstrap/lib/Form';

import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import Button from '@material-ui/core/Button';
import MemberSignupDetail from './MemberSignupDetail';
import VerificationCode from './VerificationCode'
import {required,email,compare,checkLength,checkMobileNo,checkURL,restrictNumeric,restrictLength,allowAlphaNumeric} from 'Validations';
import {saveMemberSignUpDetail,opnAddNewEmailVerificationModel,saveVerificationCode,clsAddNewEmailVerificationModel} from 'Actions';
import {cloneDeep,calculateExpiryDate,checkError} from 'Helpers/helpers';
import {isMobile} from 'react-device-detect';
import StepContent from '@material-ui/core/StepContent';
import api from 'Api';
// rct section loader
import RctSectionLoader from 'Components/RctSectionLoader/RctSectionLoader';
import {getClientId } from 'Helpers/helpers';
import { NotificationManager } from 'react-notifications';

class MemberSignup extends React.Component {
   constructor(props) {
        super(props);
                this.state = this.getInitialState();
           }

    getInitialState()
     {
   		 	this.initialState = {
            memberSignUpDetail: {
                      				fields : { firstName:'',
                                          lastName : '',
                                          gender : "",
                                          dateOfBirth: null,
                                          personalemailid : '',
                                          mobile:'',
                                          city:''  ,
                                          state: '',
                                          country: {},
                                          countryArray : [],
                                          stateArray : [],
                                          service : '',
                                          clientId : getClientId(),
                                          expiryDate : null,
                                          startDate : new Date(),
                                          fitnessgoal : ''

                      								},
                      				errors : {
                      				},
                      				validated : false,
                          },
                      verificationDetail : {
                          serviceList: null,
                          verifyemailverificationcode  : '',
                          verifymobileverificationcode  : '',
                        }
                      };
                return cloneDeep(this.initialState);
              }

  componentWillMount() {
          this.getMemberSignupDetail();
          this.getServices();
    }

getServices()
{
  const {clientId} = this.state.memberSignUpDetail.fields;
  let {service} = this.state.memberSignUpDetail.fields;
       api.post('freeservice-list',{clientId})
       .then(response => {
         let serviceList = response.data[0];
         if(serviceList && serviceList.length > 0){
            service = serviceList[0].id;
         }
         this.setState({
           memberSignUpDetail: {
             ...this.state.memberSignUpDetail,
             fields : {...this.state.memberSignUpDetail.fields,
               service : service
             },
           serviceList : serviceList
         },
         });
       }).catch(error => console.log(error) )
}


  onChangeMemberSignUp(key,value)
  {
    let error=required(value);
    const fields = this.state.memberSignUpDetail.fields;
    let {expiryDate,startDate} = fields;
    let {serviceList} = this.state;
      if(error == '' && key == 'personalemailid')
			{
				error = email(value);
			}
      else if(key == 'country.label')
      {
        let country = this.state.memberSignUpDetail.fields.country;
        country.label = value;
        value = country;
        key = 'country';
      }

      else if(key == 'country')
      {
        if(fields.mobile)
        {
          this.state.memberSignUpDetail.errors.mobile = checkMobileNo(fields.mobile, value.id , value.label,value.languagecode);
        }
      }
      else if(key == 'mobile')
      {
        if(fields.country.id)
        {
          error = checkMobileNo(value, fields.country.id ,  fields.country.label,fields.country.languagecode);
        }
        else {
          error = checkMobileNo(value);
        }
        value = restrictLength(value,12);
      }
      else if(key == 'service' && value){
        let selectedservicelist = serviceList && serviceList.filter(x => x.id == value)[0];
        expiryDate = calculateExpiryDate(startDate,selectedservicelist.durationcount,selectedservicelist.duration);

      }

    this.setState({
      memberSignUpDetail: {
        ...this.state.memberSignUpDetail,
        fields : {...this.state.memberSignUpDetail.fields,
          [key] : value,
          expiryDate : expiryDate
        },
        errors : {...this.state.memberSignUpDetail.errors,
          [key] :  error
        },
      }
    });
    this.setMemberSignupDetail();

  }
  validate()
	{
		let errors = {};

			const fields = this.state.memberSignUpDetail.fields;

      errors.personalemailid = required(fields.personalemailid);
      errors.personalemailid = (errors.personalemailid != '' ? errors.personalemailid : email(fields.personalemailid));
      errors.firstName = required(fields.firstName);
      errors.lastName = required(fields.lastName);
      errors.mobile = required(fields.mobile);
      errors.mobile = (errors.mobile != '' ? errors.mobile : (fields.country.id ? checkMobileNo(fields.mobile, fields.country.id , fields.country.label,fields.country.languagecode) : checkMobileNo(fields.mobile)));
      errors.country = required(fields.country.id);
      errors.state = required(fields.state);
      errors.gender = required(fields.gender);
      errors.service = required(fields.service);

			let validated = checkError(errors);

			 this.setState({
				 memberSignUpDetail: {	...this.state.memberSignUpDetail,
					 	errors : errors, validated : validated,
				 }
			 });

			 return validated;
}


onSubmit(e) {

  e.preventDefault();
}

onSaveMember()
{
  const {memberSignUpDetail} = this.state;
  if(this.validate())
  {
         const membersignupdetail  = memberSignUpDetail.fields;
         this.props.saveMemberSignUpDetail({membersignupdetail});
  }
}
onClickEnterVerificationCode(isEmail){
  const membersignupdetail = cloneDeep(this.state.memberSignUpDetail.fields);
  membersignupdetail.isEmail = isEmail;
  if(membersignupdetail.isEmail == 1){
    membersignupdetail.mobile = ''
  }
  else{
    membersignupdetail.personalemailid = ''
  }
  this.props.opnAddNewEmailVerificationModel(membersignupdetail);
}


onChangeVerificationcode(key,value){
      this.setState({
        verificationDetail: {
          ...this.state.verificationDetail,
        [key] : value,
      }
     })
     this.setMemberSignupDetail();
}
OnsaveVerificationCode(){
  const {verifyemailverificationcode,verifymobileverificationcode} = this.state.verificationDetail;
  const {emailVerificationCode,mobileVerificationCode} = this.props;
      if(emailVerificationCode != ''){
          if(emailVerificationCode == verifyemailverificationcode){
            this.props.saveVerificationCode({isEmail : 1});
            this.setState({
              verificationDetail: {
                ...this.state.verificationDetail,
              verifyemailverificationcode : '',
            }
           })
          }
      else{
        NotificationManager.error('Please Enter Valid Code');
      }
    }
    else{
          if(mobileVerificationCode == verifymobileverificationcode){
            this.props.saveVerificationCode({isEmail : 0});
            this.setState({
              verificationDetail: {
                ...this.state.verificationDetail,
              verifymobileverificationcode : '',
            }
            })
      }
          else{
            NotificationManager.error('Please Enter Valid Code');
          }
    }
}
onCloserVerificationCodeDialog(){
     this.props.clsAddNewEmailVerificationModel();
}
setMemberSignupDetail() {
    localStorage.setItem('membersignupdetail_state',  JSON.stringify(this.state));
}
getMemberSignupDetail() {
    let membersignupdetail = localStorage.getItem('membersignupdetail_state');
    membersignupdetail = JSON.parse(membersignupdetail);
    if(membersignupdetail)
    {
      this.setState(membersignupdetail);
    }
  }


  render() {
    const {loading, disabled,addNewEmailVerificationModal,emailVerificationCode,verifymobile,verifyemail,mobileVerificationCode} = this.props;
    const {memberSignUpDetail,serviceList,verificationDetail} = this.state;
    return (
     <Form onSubmit={this.onSubmit}>
      <div>
      {loading &&
        <RctSectionLoader />
      }
       <MemberSignupDetail fields = {memberSignUpDetail.fields} errors ={memberSignUpDetail.errors} onChange= {(key,value) => this.onChangeMemberSignUp(key,value)}
       onClickverifymobileno = {() => this.onClickverifymobileno()} serviceList = {serviceList}
       onClickEnterVerificationCode = {this.onClickEnterVerificationCode.bind(this)} verificationDetail = {verificationDetail} verifyemail = {verifyemail} verifymobile = {verifymobile}/>

        <div>
              <Button type="submit" disabled = {(verifyemail  && verifymobile) ? false : true} variant="contained" color="primary" className="text-white mr-10 mb-10" onClick={() => this.onSaveMember()} > Sign Up</Button>
          </div>
      </div>
      {addNewEmailVerificationModal && (mobileVerificationCode != '' || emailVerificationCode != '' ) &&
      <VerificationCode open = {addNewEmailVerificationModal} emailid = {memberSignUpDetail.fields.personalemailid}
      onChangeVerificationcode = {(key,value) => this.onChangeVerificationcode(key,value)} OnsaveVerificationCode = {() => this.OnsaveVerificationCode()}
      onClose = {() => this.onCloserVerificationCodeDialog()} emailVerificationCode ={emailVerificationCode}  mobile = {memberSignUpDetail.fields.mobile}
       verificationDetail = {verificationDetail}  onClickEnterVerificationCode = {this.onClickEnterVerificationCode.bind(this)} disabled ={disabled} mobileVerificationCode= {mobileVerificationCode}/>
    }

      </Form>
    );
  }
}

const mapStateToProps = ({ memberSignUpReducer }) => {
	const { addNewEmailVerificationModal,loading, disabled,emailVerificationCode,mobileVerificationCode ,verifyemail,verifymobile} =  memberSignUpReducer;
  return { addNewEmailVerificationModal,loading, disabled,emailVerificationCode,mobileVerificationCode,verifymobile,verifyemail}
}


export default connect(mapStateToProps,{
   saveMemberSignUpDetail,opnAddNewEmailVerificationModel,saveVerificationCode,clsAddNewEmailVerificationModel})(MemberSignup);
