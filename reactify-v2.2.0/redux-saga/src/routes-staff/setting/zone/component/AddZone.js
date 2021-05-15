/**
 * Employee Management Page
 */
import React, { Component, PureComponent } from 'react';
// Import React Table
import { connect } from 'react-redux';

import RctSectionLoader from 'Components/RctSectionLoader/RctSectionLoader';
import { clsAddNewZoneModel, saveZone } from 'Actions';

import { checkError, cloneDeep} from 'Helpers/helpers';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';

import Zonedetail from './zoneDetail';
import AppBar from '@material-ui/core/AppBar';

import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';

import CloseIcon from '@material-ui/icons/Close';
import SaveIcon from '@material-ui/icons/Save';

import Button from '@material-ui/core/Button';
import {required,email,checkLength,checkMobileNo,checkPincode,checkAlpha} from 'Validations';
import { push } from 'connected-react-router';

import {isMobile} from 'react-device-detect';
import { NotificationManager } from 'react-notifications';

function TabContainer({ children }) {
    return (
        <Typography component="div" style={{ padding: isMobile ? 0 : 8 * 3 }}>
            {children}
        </Typography>
    );
}

class AddZone extends PureComponent {
          constructor(props) {
           super(props);
           this.state = this.getInitialState();
        }
        getInitialState()
        {
           this.initialState = {
                 activeIndex : 0,
                 zoneData :
                 {
                   fields : {
                       id : 0,
                      name:'',
                      totalbranches: [],
                      selectedbranches: []
                    },
                    errors : { },
                   validated : false,
               },
        };
        return cloneDeep(this.initialState);
         }

	 componentWillReceiveProps(newProps)
	 {
		 const	{editzone,editMode} = newProps;
		 let {zoneData} = this.state;

     zoneData =zoneData. fields;

		 if(editMode && editzone && editzone.id && editzone.id != this.state.zoneData.fields.id)
		 {
          zoneData.id = editzone.id;
          zoneData.name =  editzone.zonename;
          zoneData.selectedbranches =  editzone.branchlist;
         this.state.zone_old = cloneDeep(zoneData);
     }
     if(newProps.branchList != this.props.branchList)
  		 {
         zoneData.totalbranches = newProps.branchList.filter(o => !zoneData.selectedbranches.find(o2 => o.id === o2.id));
         this.state.zone_old = cloneDeep(zoneData);
       }
	 }

   componentWillUpdate(nextProps, nextState)
   {
     if((!nextProps.editMode && nextState.zoneData.fields.id != 0) || (this.props.addNewZoneModal && !nextProps.addNewZoneModal))
     {
        this.setState(this.getInitialState());
     }
   }

   onChangeZone(key,value, isRequired)
    {
      let error= isRequired ? required(value) : '';

      if(key == 'branchesselected')
      {
        this.state.zoneData.fields.totalbranches = value.droppable;
        this.state.zoneData.fields.selectedbranches = value.droppable2;
      }

      this.setState({
        zoneData: {
          ...this.state.zoneData,
          fields : {...this.state.zoneData.fields,
            [key] : value
          },
          errors : {...this.state.zoneData.errors,
            [key] : error
          }
        }
      });
    }

	 	validate()
	 	{
         let errors = {};
         const fields = this.state.zoneData.fields;

         errors.name = required(fields.name);
         // errors.state = required(fields.state);
         // errors.country = required(fields.country);

         if(fields.selectedbranches.length == 0)
         {
           NotificationManager.error('Please select atleast 1 branch');
           errors.selectedbranches = 'Please select atleast 1 branch';
         }

         let validated = checkError(errors);

          this.setState({
            zoneData: {	...this.state.zoneData,
               errors : errors, validated : validated
            }
          });

          return validated;

	 }

	 	onSaveZone()
	 	{
        const {zoneData,zone_old} = this.state;
        const	{editzone , editMode} = this.props;

         if(this.validate())
         {
           if(!editMode || (editzone && (JSON.stringify(zone_old) != JSON.stringify(zoneData.fields))))
           {
             const zone  = cloneDeep(zoneData.fields);
             zone.selectedbranches = zone.selectedbranches.map(x => x.id.toString());

           this.props.saveZone({zone});
        }
        else {
          NotificationManager.error('No changes detected');
         }
	 		}
   }
    onClose()
	 	{
      this.setState(this.getInitialState());
	 		this.props.clsAddNewZoneModel();
      this.props.push('/app/setting/zone');
	 	}

	render() {

	 const	{ addNewZoneModal, disabled , dialogLoading , editMode , editzone,branchList} = this.props;
 	 const {zoneData,activeIndex} = this.state;

		return (
			<Dialog fullScreen open={addNewZoneModal} onClose={() =>this.onClose()} >
					<AppBar position="static" className="bg-primary">
							<Toolbar>
									<IconButton color="inherit"  onClick={() =>this.onClose()} aria-label="Close">
												<CloseIcon />
									</IconButton>
									<h5 className="w-50 mb-0 ">{ editMode || zoneData.fields.id != 0 ? 'UPDATE ' : 'ADD '  } ZONE</h5>
									<div className="w-50 mb-0">
											<Tabs
														value={activeIndex}
														variant = "fullWidth"
														indicatorColor="secondary" >
											</Tabs>
								 </div>

                 <Button onClick={() =>this.onSaveZone()} disabled = {disabled} variant="text" mini= "true" ><SaveIcon /><span className ="pl-5">SAVE</span> </Button>

						</Toolbar>
				</AppBar>
				{((editMode && !editzone) || dialogLoading ) &&
					<RctSectionLoader />
				}
            <TabContainer> <Zonedetail fields = {zoneData.fields} errors ={zoneData.errors} onChange = { this.onChangeZone.bind(this)} />  </TabContainer>
			</Dialog>

	);
  }
  }
const mapStateToProps = ({ zoneReducer }) => {
	const { addNewZoneModal, disabled, dialogLoading, editzone, editMode , branchList} =  zoneReducer;
  return { addNewZoneModal, disabled , dialogLoading, editzone, editMode , branchList}
}

export default connect(mapStateToProps,{
	 clsAddNewZoneModel, saveZone,push})(AddZone);
