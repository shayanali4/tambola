/**
 * Employee Management Page
 */
import React, { Component, PureComponent } from 'react';
// Import React Table
import { connect } from 'react-redux';

import RctSectionLoader from 'Components/RctSectionLoader/RctSectionLoader';

import { checkError, cloneDeep ,getLocalDate} from 'Helpers/helpers';
import Dialog from '@material-ui/core/Dialog';
import AppBar from '@material-ui/core/AppBar';
import PerfectScrollbar from 'Components/PerfectScrollbar';

import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';

import {clsDisclaimerModel, saveStaffDisclaimer ,getStaffDisclaimerSavedForm} from 'Actions';

import CloseIcon from '@material-ui/icons/Close';
import SaveIcon from '@material-ui/icons/Save';

import {required,checkMobileNo} from 'Validations';

import {isMobile} from 'react-device-detect';
import { NotificationManager } from 'react-notifications';

import DisclaimerDetail from 'Routes/members/member-profile/component/DisclaimerForm/DisclaimerDetail';

import Button from '@material-ui/core/Button';

function TabContainer({ children }) {
    return (
        <Typography component="div" style={{ padding: isMobile ? 0 : 8 * 3 }}>
            {children}
        </Typography>
    );
}

class DisclaimerForm extends PureComponent {
	constructor(props) {
     super(props);
		   this.state = this.getInitialState();
   }

   getInitialState()
   {
     let clientProfile = this.props.clientProfileDetail || {};

     this.initialState = {
             activeIndex : 0,
             disclaimerDetail:
             {
               fields : {
                           id : 0,
                           date : getLocalDate(new Date()),
                           fullName: '' ,
                           firstName : '' ,
                           lastName : '' ,
                           address :  '' ,
                           city:  '',
                           state:  '',
                           personalemailid :  '',
                           mobile: '',
                           age :  '',
                           gender :  '',
                           height :  '',
                           weight :  '',
                           framesize : '',
                           membercode : '',
                           clientlogo : clientProfile.logo ? clientProfile.logo : '',
                           clientname : clientProfile.organizationname ? clientProfile.organizationname : '',
                           clientaddress1 : clientProfile.address1 ? clientProfile.address1 : '',
                           clientaddress2 : clientProfile.address2 ? clientProfile.address2 : '',
                           clientcity : clientProfile.city ? clientProfile.city : '',
                           clientstate : clientProfile.state ? clientProfile.state : '',
                           clientcountry : clientProfile.country ? clientProfile.country : '',
                           clientemail : clientProfile.useremail ? clientProfile.useremail : '',
                           clientpincode : clientProfile.pincode ? clientProfile.pincode : '',
                           clientphoneno : clientProfile.mobile ? clientProfile.mobile : '',
                           othercontactdetails :  [{
                             name : '',
                             relation : '',
                             mobile : '',
                             area : '',
                           }],
                       },
              errors : { },
               validated : false
           },
     };

      return cloneDeep(this.initialState);
   }

    componentWillReceiveProps(newProps)
    {
      const	{emergencydetail,disclaimermemberdetails} = newProps;
      let {disclaimerDetail} = this.state;

      disclaimerDetail = disclaimerDetail.fields;

      if((emergencydetail && JSON.stringify(emergencydetail) != JSON.stringify(disclaimerDetail.othercontactdetails)))
      {
        disclaimerDetail.othercontactdetails = emergencydetail ? emergencydetail : disclaimerDetail.othercontactdetails;
      }

	  if(disclaimermemberdetails)
	  {
		  let memberProfile = this.props.disclaimermemberdetails && this.props.disclaimermemberdetails.memberid ? this.props.disclaimermemberdetails
		  : (newProps.disclaimermemberdetails.memberid ? newProps.disclaimermemberdetails : {});

		  this.getMemberDetails(memberProfile);
	  }
      
    }

    getMemberDetails(memberProfile)
    {
           this.setState({
             disclaimerDetail: {
               ...this.state.disclaimerDetail,
               fields : {...this.state.disclaimerDetail.fields,
                     id :memberProfile.memberid,
                     fullName: memberProfile.firstname + ' ' + memberProfile.lastname,
                     firstName : memberProfile.firstname ,
                     lastName : memberProfile.lastname ,
                     address : (memberProfile.address1 || '') + ' ' + (memberProfile.address2 || '') ,
                     city:  memberProfile.city || '',
                     state: memberProfile.state,
                     personalemailid : memberProfile.personalemailid ,
                     mobile:memberProfile.encryptmobile ||  memberProfile.mobile ,
                     age : memberProfile.age ,
                     gender : memberProfile.gender ,
                     height : memberProfile.height ,
                     weight : memberProfile.weight ,
                     framesize : '',
                     membercode : memberProfile.membercode,
                     date : memberProfile.submiteddate ? getLocalDate(memberProfile.submiteddate) : getLocalDate(new Date()),
                  },
                }
              })
      }

   onRemove = (data) => {
        let {othercontactdetails} = this.state.disclaimerDetail.fields;
        if(othercontactdetails.length > 1)
        {
          othercontactdetails.splice( othercontactdetails.indexOf(data), 1 );

          this.setState({
            disclaimerDetail: {
              ...this.state.disclaimerDetail,
              fields : {...this.state.disclaimerDetail.fields,
                othercontactdetails : othercontactdetails,
              }}});
        }
      }

    onChangeDisclaimerDetail(key,value, isRequired)
     {
       let error= isRequired ? required(value) : '';

       this.setState({
         disclaimerDetail: {
           ...this.state.disclaimerDetail,
           fields : {...this.state.disclaimerDetail.fields,
             [key] : value
           },
           errors : {...this.state.disclaimerDetail.errors,
             [key] : error
           }
         }
       });
       }

       validate()
       {
         const {othercontactdetails} = this.state.disclaimerDetail.fields;

          let errors = {};

         if(othercontactdetails.filter(x => (x.name == '') || ( x.relation == '')
          || (x.mobile == '') || ( x.area == '')).length > 0)
          {
             NotificationManager.error("Please enter contact detail");
             errors.othercontactdetails = "Please enter contact detail";
          }

          let validated = checkError(errors);

          return validated;
       }

       onSave()
       {
         const {othercontactdetails,id} = this.state.disclaimerDetail.fields;
         let memberid = id;
         let disclaimerform = {};

          if(this.validate())
          {
            this.props.saveStaffDisclaimer({disclaimerform,othercontactdetails,memberid});
          }

       }

       onClose()
      {
         this.setState(this.getInitialState());
         this.props.clsDisclaimerModel();
      }

	render() {

 	 const {activeIndex ,disclaimerDetail} = this.state;
   const {opndisclaimerModal,id,dialogLoading,disclaimermemberdetails} = this.props;
		return (

			<Dialog fullScreen open={opndisclaimerModal}  onClose={() =>this.onClose()} >
      {opndisclaimerModal &&
					<AppBar position="static" className="bg-primary">
							<Toolbar>
									<IconButton color="inherit" onClick={() =>this.onClose()} aria-label="Close">
												<CloseIcon />
									</IconButton>
									<h5 className="w-50 mb-0 "> DISCLAIMER</h5>
									<div className="w-50 mb-0">
                  <Tabs
                        value = {activeIndex}
                        variant="fullWidth"
                        indicatorColor="secondary" >
                  </Tabs>
             </div>

             {disclaimermemberdetails && disclaimermemberdetails.isSubmitedDisclaimer == 0 &&

               <Button onClick={() =>this.onSave()} variant="text" mini= "true" ><SaveIcon /><span className ="pl-5">SAVE</span> </Button>

             }

						</Toolbar>
				</AppBar>
        }
        { dialogLoading  &&
					<RctSectionLoader />
				}
        {opndisclaimerModal && !dialogLoading &&
				<PerfectScrollbar style={{ height: 'calc(100vh - 5px)' }}>

        <TabContainer>
          <DisclaimerDetail fields = {disclaimerDetail.fields} errors ={disclaimerDetail.errors}
           onChange = {this.onChangeDisclaimerDetail.bind(this)}
           onRemove = {this.onRemove.bind(this)} onSave = {this.onSave.bind(this)}/>
         </TabContainer>

        </PerfectScrollbar>
      }
    			</Dialog>
	);
  }
  }

  const mapStateToProps = ({ disclaimerReducer ,settings}) => {
  	const { opndisclaimerModal, disabled, dialogLoading ,emergencydetail,disclaimermemberdetails} =  disclaimerReducer;
    const { clientProfileDetail} = settings;
    return { opndisclaimerModal, disabled , dialogLoading , emergencydetail,clientProfileDetail,disclaimermemberdetails}
  }

  export default connect(mapStateToProps,{
  	clsDisclaimerModel, saveStaffDisclaimer,getStaffDisclaimerSavedForm})(DisclaimerForm);
