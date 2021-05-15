/**
 * Employee Management Page
 */
import React, { Component, PureComponent } from 'react';
// Import React Table
import { connect } from 'react-redux';

import RctSectionLoader from 'Components/RctSectionLoader/RctSectionLoader';
import { clsAddNewAdvertisementModel, saveAdvertisement } from 'Actions';

import {  checkError, cloneDeep , getLocalDate} from 'Helpers/helpers';
import Dialog from '@material-ui/core/Dialog';
import AdvertisementDetail from './AdvertisementDetail';
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

class AddAdvertisement extends PureComponent {
	constructor(props) {
     super(props);
		   this.state = this.getInitialState();
   }

   getInitialState()
   {
     this.initialState = {
             activeIndex : 0,
             advertisementDetail:
             {
               fields : {
                 id :0,
                 content:'',
                 imageFiles: [],
                 image:'',
                 link : '',
                 advertisementcategory : '1',
                 publishingstatus:'1',
                 publishstartdate : null,
                 publishenddate : null,
                 quotetype : '1',
                 title : '',
                },
               errors : { },
               validated : false
           },
     };

      return cloneDeep(this.initialState);
   }

   componentWillReceiveProps(newProps)
  {
    const	{editadvertisement, editMode} = newProps;
    let {advertisementDetail} = this.state;

     advertisementDetail = advertisementDetail.fields;
     if(editMode && editadvertisement && editadvertisement.id && editadvertisement.id != this.state.advertisementDetail.fields.id )
     {
         advertisementDetail.id = editadvertisement.id;
         advertisementDetail.content = editadvertisement.content ? editadvertisement.content : '';
         advertisementDetail.title = editadvertisement.title ? editadvertisement.title : '';
         advertisementDetail.link = editadvertisement.link || '';
         advertisementDetail.image = editadvertisement.image || [];
         advertisementDetail.advertisementcategory = editadvertisement.advertisementcategoryId ? editadvertisement.advertisementcategoryId.toString() : '1';
         advertisementDetail.publishingstatus = editadvertisement.publishingstatus;
         advertisementDetail.publishstartdate = getLocalDate(editadvertisement.publishstartdate);
         advertisementDetail.publishenddate = getLocalDate(editadvertisement.publishenddate);
         advertisementDetail.quotetype = editadvertisement.quotetypeId ? editadvertisement.quotetypeId.toString() : '';

         this.state.advertisement_old = cloneDeep(advertisementDetail);
    }
  }

   componentWillUpdate(nextProps, nextState)
   {
     if((!nextProps.editMode && nextState.advertisementDetail.fields.id != 0) || (this.props.addNewAdertisementModal && !nextProps.addNewAdertisementModal))
     {
        this.setState(this.getInitialState());
     }
   }

   onRemoveImage()
     {
           if(this.state.advertisementDetail.fields.imageFiles.length > 0)
           {
             this.setState({
               advertisementDetail: {
                 ...this.state.advertisementDetail,
                 fields : {...this.state.advertisementDetail.fields,
                     'imageFiles' : ''
                 },
               }
             });
           }
           else if(this.state.advertisementDetail.fields.image.length > 0)
           {
             this.setState({
               advertisementDetail: {
                 ...this.state.advertisementDetail,
                 fields : {...this.state.advertisementDetail.fields,
                     'image' : ''
                 },
               }
             });
           }
     }

   onChangeadvertisementDetail(key,value, isRequired)
         {
           let fields = this.state.advertisementDetail.fields;
           let error= isRequired ? required(value) : '';

           if(key == "advertisementcategory" && value != fields.advertisementcategory)
           {
             if(value == 2)
             {
               fields.publishenddate = null;
               fields.quotetype = 1;
             }
             if(value == 3)
             {
               fields.quotetype = '';
             }
           }
           else if (key == "quotetype" && value != fields.quotetype) {
             if(value == 2)
             {
               fields.image = '';
               fields.imageFiles = [];
             }
             else if(value == 1) {
               fields.link = '';
             }
           }
           else if (key == "publishingstatus") {
            value = value?1:0;
           }

           this.setState({
             advertisementDetail: {
               ...this.state.advertisementDetail,
               fields : {...this.state.advertisementDetail.fields,
                 [key] : value
               },
               errors : {...this.state.advertisementDetail.errors,
                 [key] : error
               }
             }
           });
         }
  validate()
    {
      let errors = {};
      const fields = this.state.advertisementDetail.fields;

      errors.advertisementcategory = required(fields.advertisementcategory);
      errors.title = required(fields.title);

      if(fields.advertisementcategory == 1)
      {
        errors.quotetype = required(fields.quotetype);
      }

      if(fields.quotetype == 1 && (!fields.image && !fields.imageFiles[0]))
      {
        NotificationManager.error("Please select image .");
        errors.image = "Please select image .";
      }
      else if (fields.quotetype == 2) {
        errors.link = required(fields.link);
      }
      if(fields.advertisementcategory == 1 || fields.advertisementcategory == 3)
      {
          errors.publishstartdate = required(fields.publishstartdate);
          errors.publishenddate = required(fields.publishenddate);
      }
      if(fields.advertisementcategory == 2)
      {
          errors.publishstartdate = required(fields.publishstartdate);
      }

      let validated = checkError(errors);
       this.setState({
         advertisementDetail: {	...this.state.advertisementDetail,
            errors : errors, validated : validated
         }
       });

       return validated;
   }


   onSaveAdvertisement()
   {
     const {advertisementDetail,advertisement_old} = this.state;
     const	{editadvertisement, editMode} = this.props;
     if(this.validate())
     {
       if(!editMode || (editadvertisement && (JSON.stringify(advertisement_old) != JSON.stringify(advertisementDetail.fields))))
        {
            const advertisementdetail  = advertisementDetail.fields;
            this.props.saveAdvertisement({advertisementdetail});
        }
      else {
             NotificationManager.error('No changes detected');
        }
     }
   }

    onClose()
	 	{
      this.setState(this.getInitialState());
	 		this.props.clsAddNewAdvertisementModel();
      this.props.push('/app/setting/advertisement');
	 	}

	render() {

	 const	{addNewAdertisementModal ,dialogLoading ,disabled,editadvertisement,editMode} = this.props;
 	 const {activeIndex ,advertisementDetail} = this.state;
		return (
			<Dialog fullScreen open={addNewAdertisementModal} onClose={() =>this.onClose()} >
    					<AppBar position="static" className="bg-primary">
        							<Toolbar>
          									<IconButton color="inherit" onClick={() =>this.onClose()} aria-label="Close">
          												<CloseIcon />
          									</IconButton>
        								  	<h5 className="w-50 mb-0 ">{ advertisementDetail.fields.id != 0 ? 'UPDATE ' : 'ADD '  } ADVERTISEMENT</h5>
          									<div className="w-50 mb-0">
                                  <Tabs
                                        value = {activeIndex}
                                        variant="fullWidth"
                                        indicatorColor="secondary" >

                                  </Tabs>
                           </div>
                         <Button onClick={() =>this.onSaveAdvertisement()} disabled = {disabled} variant="text" mini= "true" ><SaveIcon /><span className ="pl-5">SAVE</span> </Button>
        						</Toolbar>
    				</AppBar>
            {((editMode && !editadvertisement) || dialogLoading ) &&
    					<RctSectionLoader />
    				}
  				<PerfectScrollbar style={{ height: 'calc(100vh - 5px)' }}>
              <TabContainer> <AdvertisementDetail   fields = {advertisementDetail.fields} errors ={advertisementDetail.errors}
              onChange = {this.onChangeadvertisementDetail.bind(this)}/> </TabContainer>
          </PerfectScrollbar>
    </Dialog>
	);
  }
  }
const mapStateToProps = ({ advertisementReducer}) => {
	const { addNewAdertisementModal, disabled, dialogLoading,editMode,editadvertisement} =  advertisementReducer;
  return { addNewAdertisementModal, disabled , dialogLoading,editMode,editadvertisement}
}
export default connect(mapStateToProps,{
	clsAddNewAdvertisementModel, saveAdvertisement,push})(AddAdvertisement);
