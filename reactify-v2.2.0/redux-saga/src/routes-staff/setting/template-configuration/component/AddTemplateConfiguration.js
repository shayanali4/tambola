/**
 * Employee Management Page
 */
import React, { Component, PureComponent } from 'react';
// Import React Table
import { connect } from 'react-redux';

import RctSectionLoader from 'Components/RctSectionLoader/RctSectionLoader';
import { clsAddNewTemplateConfigurationModel ,saveTemplateConfiguration} from 'Actions';

import CustomConfig from 'Constants/custom-config';
import {getLocalDate, getFormtedDate, checkError, cloneDeep,getParams} from 'Helpers/helpers';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import TemplateConfigurationDetail from './TemplateConfigurationDetail';
import AppBar from '@material-ui/core/AppBar';
import PerfectScrollbar from 'Components/PerfectScrollbar';

import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';

import CloseIcon from '@material-ui/icons/Close';
import SaveIcon from '@material-ui/icons/Save';
import Button from '@material-ui/core/Button';
import {required,email,checkLength,checkMobileNo,checkPincode,checkAlpha ,restrictLength} from 'Validations';
import TemplateType  from 'Assets/data/templateType';
import { push } from 'connected-react-router';
import { NotificationManager } from 'react-notifications';
import {isMobile} from 'react-device-detect';

function TabContainer({ children }) {
    return (
        <Typography component="div" style={{ padding: isMobile ? 0 : 8 * 3 }}>
            {children}
        </Typography>
    );
}

class AddTemplateConfiguration extends PureComponent {
	constructor(props) {
     super(props);
		   this.state = this.getInitialState();
   }

   getInitialState()
   {
     this.initialState = {
             activeIndex : 0,
             templateDetail:
             {
               fields : {
                           id :0,
                           templatetype:'1',
                           templatetitle:'',
                           subject:'',
                           content : '',
                           notificationalias: '',
                           predefinedtags :''
                       },
              errors : { },
               validated : false
           },
     };

      return cloneDeep(this.initialState);
   }

   componentWillReceiveProps(newProps)
   {
     const	{editTemplate, editMode} = newProps;
     let {templateDetail} = this.state;

     templateDetail = templateDetail.fields;

     if(editMode && editTemplate && editTemplate.id && editTemplate.id != this.state.templateDetail.fields.id )
     {
       let templatetype = TemplateType.filter(value => value.name == editTemplate.templatetype)[0];

       templateDetail.id = editTemplate.id;
       templateDetail.templatetype =  templatetype ? templatetype.value : '1';
       templateDetail.templatetitle =  editTemplate.templatetitle;
       templateDetail.subject = editTemplate.subject;
       templateDetail.content = editTemplate.content;
       templateDetail.notificationalias = editTemplate.notificationalias;
       templateDetail.predefinedtags = editTemplate.predefinedtags;

     }
   }


   componentWillUpdate(nextProps, nextState)
   {
     if((!nextProps.editMode && nextState.templateDetail.fields.id != 0) || (this.props.addNewTemplateModal && !nextProps.addNewTemplateModal))
     {
        this.setState(this.getInitialState());
     }
   }


   onChangeTemplateDetail(key,value, isRequired)
   	{
   		let error= isRequired ? required(value) : '';
      let templatetype = this.state.templateDetail.fields.templatetype;
      if(key == 'content')
      {
        if(templatetype == 2)
        {
        value = restrictLength(value,300);
        if(value.length == 300)
              {
              error = "Maximum length for SMS is 300 characters";
            }
        }
      }

   		this.setState({
   			templateDetail: {
   				...this.state.templateDetail,
   				fields : {...this.state.templateDetail.fields,
   					[key] : value
   				},
   				errors : {...this.state.templateDetail.errors,
   					[key] : error
   				}
   			}
     	});
      }

      validate()
        {
            let errors = {};

      const fields = this.state.templateDetail.fields;
      errors.templatetitle = required(fields.templatetitle);
      errors.content = required(fields.content);

      let validated = checkError(errors);

       this.setState({
         templateDetail: {	...this.state.templateDetail,
            errors : errors, validated : validated
         }
       });

       return validated;
   }

   onSaveTemplate()
   {
     const {pathname, hash, search} = this.props.location;
     let params = getParams(search);
     let activeTab = params.tab;
     const {templateDetail} = this.state;
     if(this.validate())
     {
       let template  = templateDetail.fields;
          let { editTemplate } = this.props;
          if(editTemplate && ((JSON.stringify(template.content) !=  JSON.stringify(editTemplate.content)) || (JSON.stringify(template.subject) !=  JSON.stringify(editTemplate.subject)) ))
           {
                  template.activeTab = activeTab;
                  this.props.saveTemplateConfiguration({template});
           }
           else {
             NotificationManager.error('No changes detected');
            }
     }

   }


    onClose()
	 	{
      this.setState(this.getInitialState());
	 		this.props.clsAddNewTemplateConfigurationModel();
      this.props.push('/app/setting/template-configuration/0');

	 	}

	render() {

	 const	{addNewTemplateModal,editMode , editTemplate ,dialogLoading ,disabled} = this.props;
 	 const {activeIndex ,templateDetail} = this.state;
		return (
			<Dialog fullScreen open={addNewTemplateModal} onClose={() =>this.onClose()} >
					<AppBar position="static" className="bg-primary">
							<Toolbar>
									<IconButton color="inherit" onClick={() =>this.onClose()} aria-label="Close">
												<CloseIcon />
									</IconButton>
									<h5 className="w-50 mb-0 ">{ editMode || templateDetail.fields.id != 0 ? 'UPDATE ' : 'ADD '  } TEMPLATE</h5>
									<div className="w-50 mb-0">
                  <Tabs
                        value = {activeIndex}
                        variant = "fullWidth"
                        indicatorColor="secondary" >

                  </Tabs>
             </div>

             <Button onClick={() =>this.onSaveTemplate()} disabled = {disabled} variant="text" mini= "true" ><SaveIcon /><span className ="pl-5">SAVE</span> </Button>



						</Toolbar>
				</AppBar>
				{((editMode && !editTemplate) || dialogLoading ) &&
					<RctSectionLoader />
				}
		<PerfectScrollbar style={{ height: 'calc(100vh - 5px)' }}>
        <TabContainer> <TemplateConfigurationDetail fields = {templateDetail.fields} errors ={templateDetail.errors} onChange = {this.onChangeTemplateDetail.bind(this)} /> </TabContainer>

        </PerfectScrollbar>
    			</Dialog>
	);
  }
  }
const mapStateToProps = ({ templateconfigurationReducer}) => {
	const { addNewTemplateModal, disabled, dialogLoading,editMode ,editTemplate } =  templateconfigurationReducer;
  return { addNewTemplateModal, disabled , dialogLoading ,editMode ,editTemplate}
}

export default connect(mapStateToProps,{
	clsAddNewTemplateConfigurationModel,saveTemplateConfiguration,push})(AddTemplateConfiguration);
