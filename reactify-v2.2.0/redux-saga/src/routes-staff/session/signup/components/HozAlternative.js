import React from 'react';
import { connect } from 'react-redux';

import Form from 'reactstrap/lib/Form';

import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import Button from '@material-ui/core/Button';
import CodeVerification from './emailconfirmation';
import EstablishmentForm from './establishment-info';
import OrganizationForm from './organization-info';
import Customurl from './url-creation';
import GetStarted from './GetStarted'
import {required,email,compare,checkLength,checkMobileNo,checkPincode,checkURL,restrictNumeric,restrictLength,allowAlphaNumeric} from 'Validations';
import {clientSignUpRequest,onClientSignupVerification,onSaveClientEstablishmentInfo,onSaveClientOrganizationInfo,onSaveClientURL,onClientSignupBack} from 'Actions';
import {strengthObject , strengthIndicator} from './strength-password';
import {cloneDeep} from 'Helpers/helpers';
import {isMobile} from 'react-device-detect';
import StepContent from '@material-ui/core/StepContent';
import api from 'Api';

// rct section loader
import RctSectionLoader from 'Components/RctSectionLoader/RctSectionLoader';
import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng,
} from 'react-places-autocomplete';


function getSteps() {
  return [ 'Get Started','Code Verification', 'Establishment Info', 'Organization Info' , 'URL Creation'];
}

function getStepContent(stepIndex, thisObj) {

  const {getStarted , codeVerification , establishmentForm, organizationForm , customUrl} = thisObj.state;

  switch (stepIndex) {
    case 0:
      return   <GetStarted fields = {getStarted.fields} errors ={getStarted.errors} passwordchecker = {getStarted.passwordchecker} onChange= {(key,value) => thisObj.onChangeGetStarted(key,value)}/>;
    case 1:
      return   <CodeVerification emailid = {getStarted.fields.usermail} fields = {codeVerification.fields}  ref={ref => {
                  thisObj.codeVerificationRef = ref ?  ref : thisObj.codeVerificationRef;
                }}  errors ={codeVerification.errors} onChange= {(key,value) => thisObj.onChangeCodeVerification(key,value , stepIndex)} />;
    case 2:
      return   <EstablishmentForm  fields = {establishmentForm.fields} errors ={establishmentForm.errors} onChange= {(key,value) => thisObj.onChangeEstablishmentForm(key,value)} />;
    case 3:
      return    <OrganizationForm fields = {organizationForm.fields} errors ={organizationForm.errors} clienttype = {establishmentForm.fields.clienttype} onChange= {(key,value,isrequired) => thisObj.onChangeOrganizationForm(key,value ,isrequired)}
                  handleSelectAddress = {(value) =>  thisObj.handleSelectAddress(value)}/>;
      case 4:
        return  <Customurl fields = {customUrl.fields} errors ={customUrl.errors} clienttype = {establishmentForm.fields.clienttype} onChange= {(key,value) => thisObj.onChangeCustomUrl(key,value)}/>;
    default:
      return 'Unknown stepIndex';
  }
}

 class Horizontal extends React.Component {
   constructor(props) {
        super(props);
                this.state = this.getInitialState();
           }

    getInitialState()
     {
   		 	this.initialState = {
            getStarted: {
                      				fields : { usermail: '',
                      										userpassword:'',
                      										userconfirmpassword:'',
                      								},
                      				errors : {
                      				},
                      				validated : false,
                              passwordchecker : null,
                          },

            codeVerification : {
                                    fields : {
                                        verificationcode : '',
                                    },
                                    errors:{
                                    },
                                    validated:false
                                },

            establishmentForm : {
                                    fields :  {
                                              multiplebranches: 0,
                                              organizationtype: '',
                                              clienttype: '1',
                                              packtype : '1',
                                              branch: '',
                                              branchno:'',
                                              professionaltype : ''
                                            },
                                    errors : 	{
                                    },
                                    validated:false
                                },

           organizationForm : {
                                   fields : {
                                           organizationname: '',
                                           firstname:'',
                                           lastname:'',
                                           address1:'',
                                           address2:'',
                                           city:'',
                                           state:'',
                                           country:'',
                                           pincode:'',
                                           mobileno:'',
                                           gmapaddress : '',
                                           latitude:'',
                                           longitude:'',
                                           countryArray : [],
              	 												 	 stateArray : [],
                                           timeZoneList : [],
                                           selectedtimezone : '',
                                           isaddressSame : 0,
                                   },
                                   errors : {
                                   },
                                   validated : false
                              },

            customUrl : {
                              fields : {
                                  url:''
                              },
                              errors : {
                              },
                              validated: false
                        }
                      };
                return cloneDeep(this.initialState);
              }

  componentWillMount() {
  	    this.getSignupDetail();
        this.getTimeZone();
    }

    getTimeZone()
    {
            api.post('timezone-list')
            .then(response => {

              this.onChangeOrganizationForm('timeZoneList', response.data[0]);
            }).catch(error => console.log(error) )
    }

  handleNext = (activeStep) => {
      if(this.validate(activeStep))
      {
        this.goForNextStep(activeStep);
      }

  };

  handleBack = (activeStep) => {
        this.props.onClientSignupBack();
  };

  handleFinish = (activeStep) => {

    if(this.validate(activeStep))
    {
        this.goForFinishStep(activeStep);
    }
  };

  handleSelectAddress = address => {

    this.onChangeOrganizationForm('gmapaddress',address);

    geocodeByAddress(address)
      .then(results => getLatLng(results[0]))
      .then(({ lat, lng }) => {

        this.setState({
          organizationForm: {
            ...this.state.organizationForm,
            fields : {...this.state.organizationForm.fields,
                latitude : lat,longitude : lng}}
          });
      })
      .catch(error => console.error('Error', error));

  };


getAddressvalues(address,value)
{
  if(value)
  {
    let addressarray = address.split(', ');
    let arraylength = addressarray.length;
    let country = arraylength > 0 ? addressarray[arraylength - 1] : '';
    let state = arraylength > 1 ? addressarray[arraylength - 2] : '';
    let city = arraylength > 2 ? addressarray[arraylength - 3] : '';
    let newarray = arraylength > 3 ? addressarray.slice(0, -3) : [];
    let address1 = '';
    let address2 = '';

    if(newarray.length == 1)
    {
      address1 = newarray[newarray.length - 1];
    }
    else {
      address1 = newarray.slice(0, -1);
       address2 = newarray[newarray.length - 1];
    }
    this.setState({
      organizationForm: {
        ...this.state.organizationForm,
        fields : {...this.state.organizationForm.fields,
            city : city,state: state,country: country ,address1 : address1, address2 :address2 ,isaddressSame : 1}}
      });
  }
  else {
    this.setState({
      organizationForm: {
        ...this.state.organizationForm,
        fields : {...this.state.organizationForm.fields,
          isaddressSame : 0}}
      });
  }
}



  onChangeGetStarted(key,value)
  {

    let error=required(value);
    let passwordChecker = this.state.getStarted.passwordchecker;
      if(error == '' && key == 'usermail')
			{
				error = email(value);
			}
      else if(error == '' && key == 'userpassword')
  		{
  				passwordChecker = strengthObject(strengthIndicator(value));
  		}
			else if(error == '' && key == 'userconfirmpassword')
			{
				error =  compare(value,this.state.getStarted.fields.userpassword);
			}


    this.setState({
      getStarted: {
        ...this.state.getStarted,
        fields : {...this.state.getStarted.fields,
          [key] : value
        },
        errors : {...this.state.getStarted.errors,
          [key] :  error
        },
        passwordchecker : passwordChecker
      }
    });


  }

  onChangeCodeVerification(key,value, stepIndex)
  {
    let error=required(value);
     let lengthcheck=checkLength(value,{min:6,max:6});

    this.setState({
      codeVerification: {
        ...this.state.codeVerification,
        fields : {...this.state.codeVerification.fields,
          [key] : value
        },
        errors : {...this.state.codeVerification.errors,
          [key] : error
        }
      }
    });
  }


  onChangeEstablishmentForm(key,value)
  {
    let multiplebranches =  this.state.establishmentForm.fields.multiplebranches;
    let branch = this.state.establishmentForm.fields.branch;
    let branchno = this.state.establishmentForm.fields.branchno;
    let organizationtype = this.state.establishmentForm.fields.organizationtype;
    let organizationname = this.state.organizationForm.fields.organizationname;

    if(key == 'organizationtype')
    {
      organizationtype = value;
    }
    else if(key == 'clienttype' && value == 2)
    {
      multiplebranches = 0;
      branch = '';
      branchno = '';
    }
    else if(key == 'clienttype' && value == 3)
    {
      multiplebranches = 0;
      branch = '';
      branchno = '';
      organizationtype = '';
      organizationname = '';
    }
    else if(key == 'multiplebranches')
    {
      value = (value ? 1 : 0);
      multiplebranches = value;
    }
    else if(key == 'branch')
    {
      branch = value;
    }
    else if(key == 'branchno')
    {
      value = restrictLength(value,4);
      branchno = value;

    }
    this.setState({
      establishmentForm: {
        ...this.state.establishmentForm,
        fields : {...this.state.establishmentForm.fields,
          [key] : value,
          'multiplebranches' : multiplebranches,
          'branch'   : branch,
          'branchno'  : branchno,
          'organizationtype' : organizationtype,
        },
        errors : {...this.state.establishmentForm.errors,
          [key] :  required(value)
        }
      },
      organizationForm: {
        ...this.state.organizationForm,
        fields : {...this.state.organizationForm.fields,
          'organizationname' : organizationname
        }
      }
    });
  }

  onChangeOrganizationForm(key,value,isrequired)
  {
    let country = this.state.organizationForm.fields.countryArray.filter(x => x.label == this.state.organizationForm.fields.country)[0];
    let error = isrequired ? required(value) : "";

    if(key == 'isaddressSame')
    {
       value = value?1:0;
        this.getAddressvalues(this.state.organizationForm.fields.gmapaddress,value);
    }
    else {
      if(error == '' && (key == 'firstname' || key == 'lastname'))
        {
           value = restrictNumeric(value);
           value = allowAlphaNumeric(value);
        }
      if(error == '' && key == 'pincode')
        {
             if(country)
             {
                 error = checkPincode(value, country.id , country.label);
             }
            else {
                error = checkPincode(value);
            }
          value = restrictLength(value,7);
        }
        if(error == '' && key == 'mobileno')
        {
          if(country)
          {
            error = checkMobileNo(value, country.id , country.label,country.languagecode);
          }
          else {
            error = checkMobileNo(value);
          }
          value = restrictLength(value,12);
        }

      this.setState({
        organizationForm: {
          ...this.state.organizationForm,
          fields : {...this.state.organizationForm.fields,
            [key] : value
          },
          errors : {...this.state.organizationForm.errors,
            [key] :  error
          }
        }
      });
    }
  }

  onChangeCustomUrl(key,value)
  {
    let error=required(value);
      if(error == '' && key == 'url')
			{
				error = checkURL(value);
        if (error!="")
          return false;
			}

    this.setState({
      customUrl: {
        ...this.state.customUrl,
        fields : {...this.state.customUrl.fields,
          [key] : value
        },
        errors : {...this.state.customUrl.errors,
          [key] :  error
        }
      }
    });
  }

  setSignupDetail() {
      localStorage.setItem('signupdetail_state',  JSON.stringify(this.state));
      }

  getSignupDetail() {
      let signupdetail = localStorage.getItem('signupdetail_state');
      signupdetail = JSON.parse(signupdetail);
      if(signupdetail)
      {
        signupdetail.codeVerification.fields.verificationcode = '';
        this.setState(signupdetail);
      }
    }

  goForNextStep(activeStep)
  {
      this.setSignupDetail();
      const { getStarted, codeVerification ,establishmentForm ,organizationForm} = this.state;
    if(activeStep == 0)
		{
        this.props.clientSignUpRequest(getStarted.fields);
    }
    else if(activeStep == 1)
    {
      this.props.onClientSignupVerification({getStarted: getStarted.fields,codeVerification: codeVerification.fields , disabled:true});
    }
    else if(activeStep == 2)
    {
      this.props.onSaveClientEstablishmentInfo({getStarted: getStarted.fields,establishmentForm: establishmentForm.fields});
    }
    else if(activeStep == 3)
    {
      this.props.onSaveClientOrganizationInfo({getStarted: getStarted.fields,organizationForm: organizationForm.fields});
    }

  }


goForFinishStep(activeStep)
{
    const { getStarted, customUrl,organizationForm ,establishmentForm} = this.state;
    if(activeStep == 4)
    {
      this.props.onSaveClientURL({getStarted: getStarted.fields,organizationForm:organizationForm.fields,customUrl: customUrl.fields ,clientType : establishmentForm.fields.clienttype,packtype : establishmentForm.fields.packtype});
    }

}


  validate(activeStep)
	{
		let errors = {};

		if(activeStep == 0)
		{
			const fields = this.state.getStarted.fields;

      errors.usermail = required(fields.usermail);

      errors.usermail = (errors.usermail != '' ? errors.usermail : email(fields.usermail));

      errors.userpassword = required(fields.userpassword);

      errors.userpassword =errors.userpassword != '' ? errors.userpassword : '';

      errors.userconfirmpassword = required(fields.userconfirmpassword);

      errors.userconfirmpassword =errors.userconfirmpassword != '' ? errors.userconfirmpassword :  compare(fields.userconfirmpassword,fields.userpassword);


			let validated = this.checkError(errors);

      if (validated)
      {
        validated = this.state.getStarted.passwordchecker && this.state.getStarted.passwordchecker.count > 2 ? true : false;
      }

			 this.setState({
				 getStarted: {	...this.state.getStarted,
					 	errors : errors, validated : validated,
            passwordchecker : strengthObject(strengthIndicator(fields.userpassword))
				 }
			 });

			 return validated;
		}else if(activeStep == 1)
		{
      errors.verificationcode = required(this.codeVerificationRef.getVerificationCode());
      errors.verificationcode = (errors.verificationcode != '' ? errors.verificationcode : checkLength(this.codeVerificationRef.getVerificationCode(),{min:6, max:6}));

			let validated = this.checkError(errors);
			 this.setState({
				 codeVerification: {	...this.state.codeVerification,
					 errors : errors, validated : validated
				 }
			 });
			 			 return validated;
		}
		else if(activeStep == 2)
		{
			const fields = this.state.establishmentForm.fields;

      errors.clienttype = required(fields.clienttype);
      errors.packtype = required(fields.packtype);


        if (fields.multiplebranches)
        {
          errors.branch =required(fields.branch);
          errors.branchno = required(fields.branchno);
        }

        if (fields.clienttype == 1 || fields.clienttype == 2)
        {
            errors.organizationtype = required(fields.organizationtype);
        }
        if ( fields.clienttype == 2){
          errors.professionaltype = required(fields.professionaltype);
        }
      errors.multiplebranches = required(fields.multiplebranches);

			let validated = this.checkError(errors);
			 this.setState({
				 establishmentForm: {	...this.state.establishmentForm,
					 errors : errors, validated : this.checkError(errors)
				 }
			 });

			return validated;
		}

    else if(activeStep == 3)
		{
			const fields = this.state.organizationForm.fields;
      if(this.state.establishmentForm.fields.clienttype == 1 || this.state.establishmentForm.fields.clienttype == 2){
        errors.organizationname = required(fields.organizationname);
      }

      let country = this.state.organizationForm.fields.countryArray.filter(x => x.label == this.state.organizationForm.fields.country)[0];

      errors.firstname = required(fields.firstname);
      errors.lastname = required(fields.lastname);
  		errors.mobileno = required(fields.mobileno);
      errors.gmapaddress = required(fields.gmapaddress);
      errors.country = required(fields.country);
      errors.state = required(fields.state);
      errors.pincode = required(fields.pincode);
      errors.selectedtimezone = required(fields.selectedtimezone);

      if(errors.mobileno != '')
      {
          if(country)
          {
              error = checkMobileNo(fields.mobileno, country.id , country.label,country.languagecode);
          }
         else {
             error = checkMobileNo(fields.mobileno);
         }
      }

      if(errors.pincode != '')
      {
          if(country)
          {
              error = checkPincode(fields.pincode, country.id , country.label);
          }
         else {
             error = checkPincode(fields.pincode);
         }
      }

			let validated = this.checkError(errors);
			 this.setState({
				 organizationForm: {	...this.state.organizationForm,
					 errors : errors, validated : this.checkError(errors)
				 }
			 });

			return validated;
		}

    else if(activeStep == 4)
		{
			const fields = this.state.customUrl.fields;

      errors.url = required(fields.url);
      errors.url = (errors.url != '' ? errors.url : checkURL(fields.url));

			let validated = this.checkError(errors);
			 this.setState({
				 customUrl: {	...this.state.customUrl,
					 errors : errors, validated : this.checkError(errors)
				 }
			 });

			return validated;
		}

}

checkError(errors)
{
  let validated = true;
  for(let val in errors) {
      if(errors[val] != '')
      {
        validated = false;
      }
   }
 return validated;
}

onSubmit(e) {

  e.preventDefault();
}



  render() {
    const steps = getSteps();

    const { activeStep, loading, disabled } = this.props;
    const {getStarted , codeVerification , establishmentForm, organizationForm , customUrl} = this.state;

    return (
     <Form onSubmit={this.onSubmit}>
      <div>
      {loading &&
        <RctSectionLoader />
      }
        <Stepper activeStep={activeStep} style = {{"padding" : '0'}} alternativeLabel = {isMobile ? false : true} orientation = {isMobile ? 'vertical' : 'horizontal'}>
          {!isMobile && steps.map(label => {
            return (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            );
          })}

          {isMobile && steps.map(label => {
            return (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
                   <StepContent>
                        {getStepContent(activeStep, this)}

                       <Button  variant="contained" className="btn-danger text-white mr-10 mb-10" disabled={activeStep === 0 }
                          hidden={activeStep === 0 } onClick={() => this.handleBack(activeStep)}> BACK
                       </Button>

                       {activeStep === steps.length - 1 ?
                           (<Button type="submit" disabled = {disabled} variant="contained" className="btn-primary text-white mr-10 mb-10" onClick={() => this.handleFinish(activeStep)}>Finish</Button> ):
                           ( <Button type="submit" disabled = {disabled} variant="contained"  className="btn-primary text-white mr-10 mb-10" onClick={() => this.handleNext(activeStep)}>Next </Button>
                     )}

                   </StepContent>
              </Step>
            );
          })}


        </Stepper>

        <div>
          { !isMobile ?
            <div className="pl-40 pt-20">
            {getStepContent(activeStep, this)}

              {activeStep === steps.length - 1 ?
              (<Button type="submit" disabled = {disabled} variant="contained" color="primary" className="text-white mr-10 mb-10" onClick={() => this.handleFinish(activeStep)}> Finish</Button> ):
              (<Button type="submit" disabled = {disabled} variant="contained" color="primary" className="text-white mr-10 mb-10" onClick={() => this.handleNext(activeStep)}>Next </Button>
              )}

              <Button  variant="contained" className="btn-danger text-white mr-10 mb-10" disabled={activeStep === 0 }
                 hidden={activeStep === 0 } onClick={() => this.handleBack(activeStep)}>  BACK
              </Button>

          </div> : <div></div>
        }
        </div>
      </div>
      </Form>
    );
  }
}

const mapStateToProps = ({ signupReducer }) => {
	return  signupReducer;
}

export default connect(mapStateToProps,{
   clientSignUpRequest,
   onClientSignupVerification,
   onSaveClientEstablishmentInfo,
   onSaveClientOrganizationInfo,
   onSaveClientURL,
   onClientSignupBack})(Horizontal);
