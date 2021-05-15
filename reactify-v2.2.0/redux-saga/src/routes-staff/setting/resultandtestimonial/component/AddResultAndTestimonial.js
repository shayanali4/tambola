/**
 * Employee Management Page
 */
import React, { Component, PureComponent } from 'react';
// Import React Table
import { connect } from 'react-redux';

import RctSectionLoader from 'Components/RctSectionLoader/RctSectionLoader';
import { clsAddNewResultAndTestimonialModel, saveResultAndTestimonial } from 'Actions';

import {  checkError, cloneDeep , getLocalDate} from 'Helpers/helpers';
import Dialog from '@material-ui/core/Dialog';
import ResultAndTestimonialDetail from './ResultAndTestimonialDetail';
import AppBar from '@material-ui/core/AppBar';
import PerfectScrollbar from 'Components/PerfectScrollbar';

import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Appaccess  from 'Assets/data/appaccess';

import CloseIcon from '@material-ui/icons/Close';
import SaveIcon from '@material-ui/icons/Save';

import {required } from 'Validations';
import { push } from 'connected-react-router';

import {isMobile} from 'react-device-detect';
import { NotificationManager } from 'react-notifications';
import Button from '@material-ui/core/Button';

function TabContainer({ children }) {
    return (
        <Typography component="div" style={{ padding: isMobile ? 0 : 8 * 3 }}>
            {children}
        </Typography>
    );
}

class AddResultAndTestimonial extends PureComponent {
	constructor(props) {
     super(props);
		   this.state = this.getInitialState();
   }

   getInitialState()
   {
     this.initialState = {
             activeIndex : 0,
             resultandtestimonialDetail:
             {
               fields : {
                 id :0,
                 resultof:'',
                 member: {},
                 memberArray:[],
                 employee:'',
                 beforeimageFiles: [],
                 beforeimage:'',
                 afterimageFiles: [],
                 afterimage:'',
                 resultachieveindays : '',
                 resulttype : '',
                 resultdata : '',
                 testimonialwords : '',
                 testimoniallink : '',
                 publishingstatus:'0',
                 publishstartdate : null,
                 publishenddate : null,
                },
               errors : { },
               validated : false
           },
     };

      return cloneDeep(this.initialState);
   }

   componentWillReceiveProps(newProps)
  {
    const	{editResultAndTestimonial, editMode} = newProps;
    let {resultandtestimonialDetail} = this.state;

     resultandtestimonialDetail = resultandtestimonialDetail.fields;
     if(editMode && editResultAndTestimonial && editResultAndTestimonial.id && editResultAndTestimonial.id != this.state.resultandtestimonialDetail.fields.id )
     {
         resultandtestimonialDetail.id = editResultAndTestimonial.id;
         resultandtestimonialDetail.resultof = editResultAndTestimonial.resultofId ? editResultAndTestimonial.resultofId.toString() : '';
         resultandtestimonialDetail.employee =  editResultAndTestimonial.res_employeeid ? parseInt(editResultAndTestimonial.res_employeeid) : '';

         resultandtestimonialDetail.beforeimage = editResultAndTestimonial.beforeimage || [];
         resultandtestimonialDetail.afterimage = editResultAndTestimonial.afterimage || [];

         resultandtestimonialDetail.resultachieveindays = editResultAndTestimonial.resultachieveindays ? editResultAndTestimonial.resultachieveindays : '';
         resultandtestimonialDetail.resulttype = editResultAndTestimonial.resulttype || '';
         resultandtestimonialDetail.resultdata = editResultAndTestimonial.resultdata || '';
         resultandtestimonialDetail.testimonialwords = editResultAndTestimonial.testimonialwords || '';
         resultandtestimonialDetail.testimoniallink = editResultAndTestimonial.testimoniallink || '';

         resultandtestimonialDetail.publishingstatus = editResultAndTestimonial.publishingstatus;
         resultandtestimonialDetail.publishstartdate = getLocalDate(editResultAndTestimonial.publishstartdate);
         resultandtestimonialDetail.publishenddate = getLocalDate(editResultAndTestimonial.publishenddate);

         if(resultandtestimonialDetail.resultof == 2)
         {
           resultandtestimonialDetail.member = {};
           resultandtestimonialDetail.member.id = editResultAndTestimonial.res_memberid;
           resultandtestimonialDetail.member.label = editResultAndTestimonial.membername;
         }

         this.state.resultandtestimonial_old = cloneDeep(resultandtestimonialDetail);
    }
  }

   componentWillUpdate(nextProps, nextState)
   {
     if((!nextProps.editMode && nextState.resultandtestimonialDetail.fields.id != 0) || (this.props.addNewResultAndTestimonialModal && !nextProps.addNewResultAndTestimonialModal))
     {
        this.setState(this.getInitialState());
     }
   }

   onRemoveImage(key)
     {
        if(key == 'beforeimageFiles' || key == 'beforeimage')
        {
          if(this.state.resultandtestimonialDetail.fields.beforeimageFiles.length > 0)
          {
            this.setState({
              resultandtestimonialDetail: {
                ...this.state.resultandtestimonialDetail,
                fields : {...this.state.resultandtestimonialDetail.fields,
                    'beforeimageFiles' : ''
                },
              }
            });
          }
          else if(this.state.resultandtestimonialDetail.fields.beforeimage.length > 0)
          {
            this.setState({
              resultandtestimonialDetail: {
                ...this.state.resultandtestimonialDetail,
                fields : {...this.state.resultandtestimonialDetail.fields,
                    'beforeimage' : ''
                },
              }
            });
          }
        }
        else if (key == 'afterimageFiles' || key == 'afterimage') {
          if(this.state.resultandtestimonialDetail.fields.afterimageFiles.length > 0)
          {
            this.setState({
              resultandtestimonialDetail: {
                ...this.state.resultandtestimonialDetail,
                fields : {...this.state.resultandtestimonialDetail.fields,
                    'afterimageFiles' : ''
                },
              }
            });
          }
          else if(this.state.resultandtestimonialDetail.fields.afterimage.length > 0)
          {
            this.setState({
              resultandtestimonialDetail: {
                ...this.state.resultandtestimonialDetail,
                fields : {...this.state.resultandtestimonialDetail.fields,
                    'afterimage' : ''
                },
              }
            });
          }
        }

     }
   onChangeresultandtestimonialDetail(key,value, isRequired)
         {
           let fields = this.state.resultandtestimonialDetail.fields;
           let error= isRequired ? required(value) : '';

           if(key == 'member.label')
           {
             let member = this.state.resultandtestimonialDetail.fields.member;
             member.label = value;
             value = member;
             key = 'member';
           }
           else if(key == "resultof" && value != fields.resultof)
           {
             if(value == 2)
             {
               fields.employee = '';
             }
             else if(value == 1) {
               fields.member = {};
               fields.memberArray = [];
             }
           }
           else if (key == "publishingstatus") {
            value = value?1:0;
           }

           this.setState({
             resultandtestimonialDetail: {
               ...this.state.resultandtestimonialDetail,
               fields : {...this.state.resultandtestimonialDetail.fields,
                 [key] : value
               },
               errors : {...this.state.resultandtestimonialDetail.errors,
                 [key] : error
               }
             }
           });
         }

  validate()
    {
      let errors = {};
      const fields = this.state.resultandtestimonialDetail.fields;

      errors.resultof = required(fields.resultof);
      if(fields.resultof == 1)
      {
          errors.employee = required(fields.employee);
      }
      else if (fields.resultof == 2) {
         errors.member = required(fields.member.id);
      }

        errors.publishstartdate = required(fields.publishstartdate);
        errors.publishenddate = required(fields.publishenddate);

      let validated = checkError(errors);
       this.setState({
         resultandtestimonialDetail: {	...this.state.resultandtestimonialDetail,
            errors : errors, validated : validated
         }
       });

       return validated;
   }


   onSaveResultAndTestimonial()
   {
     const {resultandtestimonialDetail,resultandtestimonial_old} = this.state;
     const	{editResultAndTestimonial, editMode} = this.props;
     if(this.validate())
     {
       if(!editMode || (editResultAndTestimonial && (JSON.stringify(resultandtestimonial_old) != JSON.stringify(resultandtestimonialDetail.fields))))
        {
            const resultandtestimonialdetail  = resultandtestimonialDetail.fields;
             this.props.saveResultAndTestimonial({resultandtestimonialdetail});
        }
     else {
             NotificationManager.error('No changes detected');
        }
     }
   }

    onClose()
	 	{
      this.setState(this.getInitialState());
	 		this.props.clsAddNewResultAndTestimonialModel();
      this.props.push('/app/setting/resultandtestimonial');
	 	}

	render() {

	 const	{addNewResultAndTestimonialModal ,dialogLoading ,disabled,editResultAndTestimonial,editMode,userProfileDetail,employeeList , clientProfileDetail} = this.props;
 	 const {activeIndex ,resultandtestimonialDetail} = this.state;
		return (
			<Dialog fullScreen open={addNewResultAndTestimonialModal} onClose={() =>this.onClose()} >
    					<AppBar position="static" className="bg-primary">
        							<Toolbar>
          									<IconButton color="inherit" onClick={() =>this.onClose()} aria-label="Close">
          												<CloseIcon />
          									</IconButton>
        								  	<h5 className="w-50 mb-0 ">{ resultandtestimonialDetail.fields.id != 0 ? 'UPDATE ' : 'ADD '  } RESULT AND TESTIMONIAL</h5>
          									<div className="w-50 mb-0">
                                  <Tabs
                                        value = {activeIndex}
                                        variant="fullWidth"
                                        indicatorColor="secondary" >

                                  </Tabs>
                           </div>
                         <Button onClick={() =>this.onSaveResultAndTestimonial()} disabled = {disabled} variant="text" mini= "true" ><SaveIcon /><span className ="pl-5">SAVE</span> </Button>
        						</Toolbar>
    				</AppBar>
            {((editMode && !editResultAndTestimonial) || dialogLoading ) &&
    					<RctSectionLoader />
    				}
  				<PerfectScrollbar style={{ height: 'calc(100vh - 5px)' }}>
              <TabContainer> <ResultAndTestimonialDetail   fields = {resultandtestimonialDetail.fields} errors ={resultandtestimonialDetail.errors}
              onChange = {this.onChangeresultandtestimonialDetail.bind(this)}  onRemoveImage = {this.onRemoveImage.bind(this)}
              branchid = {userProfileDetail.defaultbranchid} employeeList = {employeeList}
              clientProfileDetail = {clientProfileDetail}/> </TabContainer>
          </PerfectScrollbar>
    </Dialog>
	);
  }
  }
const mapStateToProps = ({ resultAndTestimonialReducer,settings}) => {
	const { addNewResultAndTestimonialModal, disabled, dialogLoading,editMode,editResultAndTestimonial,employeeList} =  resultAndTestimonialReducer;
  const { userProfileDetail , clientProfileDetail } = settings;
  return { addNewResultAndTestimonialModal, disabled , dialogLoading,editMode,editResultAndTestimonial,userProfileDetail,employeeList,clientProfileDetail}
}
export default connect(mapStateToProps,{
	clsAddNewResultAndTestimonialModel, saveResultAndTestimonial,push})(AddResultAndTestimonial);
