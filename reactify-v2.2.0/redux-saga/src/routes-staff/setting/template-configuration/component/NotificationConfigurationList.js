/**
 * Employee Management Page
 */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import DeleteConfirmationDialog from 'Components/DeleteConfirmationDialog/DeleteConfirmationDialog';
import {NotificationConfiguration} from 'Constants/custom-config';
import { checkModuleRights,cloneDeep} from 'Helpers/helpers';
import RctCollapsibleCard from 'Components/RctCollapsibleCard/RctCollapsibleCard';
import Switch from '@material-ui/core/Switch';
import Checkbox from '@material-ui/core/Checkbox';
import Button from '@material-ui/core/Button';
import { saveNotificationConfiguration , viewNotificationConfiguration } from 'Actions';
import { NotificationManager } from 'react-notifications';

 class NotificationConfigurationList extends Component {
	constructor(props) {
     super(props);

		 	this.state = {
            NotificationConfiguration : NotificationConfiguration.filter(x =>
              this.props.clientProfileDetail && this.props.clientProfileDetail.packtypeId == 1 ? x.notificationAlias != 'prePTExpiring' : x).map(x =>
              {x.notificationthrough = x.notificationthrough.filter(y => y.value != 3); return x;}),
            confirmationDialog : false,
}
   }

   componentWillMount() {
     this.props.viewNotificationConfiguration();
   }

   componentWillReceiveProps(newProps)
   {
     const	{selectedNotification,editMode} = newProps;
     let {NotificationConfiguration } = this.state;

     if(selectedNotification && !editMode)
     {
            NotificationConfiguration.forEach(x =>  {

                let  notificationAlias =  selectedNotification.filter(y=> y.notificationAlias == x.notificationAlias)
                if(notificationAlias.length > 0)
                {
                    x.isEnable = notificationAlias[0].isEnable;
                    if(notificationAlias[0].days)
                    {
                      let days = JSON.parse(notificationAlias[0].days) ;
                       days.map(y => x.days &&  x.days.forEach(z => {if(z.value == y) {z.checked = true;} }))
                    }
                    x.notificationthrough = JSON.parse(notificationAlias[0].notificationthrough);
                    x.notificationthrough = x.notificationthrough.filter(y => y.value != 3);
                }
           });

           this.state.notificationconfiguration_old = cloneDeep(NotificationConfiguration);
     }
   }


	shouldComponentUpdate(nextProps, nextState) {

		if(this.state)
		{
			return true;
		}
		else {
			return false;
		}
	}

  validate()
    {
      const	{NotificationConfiguration} = this.state;
      let isvalidated = true;

      NotificationConfiguration.forEach(x =>{
        if(x.isEnable && x.notificationthrough.filter(x => x.checked).length == 0)
        {
            isvalidated = false;
        }
        if(x.isEnable && x.notificationthrough.filter(x => x.checked).length > 0)
        {
          if(x.days && x.days.filter(x => x.checked).length == 0)
          {
            isvalidated = false;
          }
        }
      });

      if(!isvalidated)
      {
        NotificationManager.error('Please select atleast one option');
      }
      return isvalidated;
     }

  confirmSave() {
      const	{selectedNotification} = this.props;
      const	{NotificationConfiguration,notificationconfiguration_old} = this.state;

      if(this.validate())
      {
        if(selectedNotification && (JSON.stringify(notificationconfiguration_old) !=  JSON.stringify(NotificationConfiguration) ))
         {
             this.setState({
               confirmationDialog : true,
             });
         }
         else {
           NotificationManager.error('No changes detected');
          }
      }
  }

  onConfirm()
  {
    const {NotificationConfiguration} = this.state;

    this.props.saveNotificationConfiguration({NotificationConfiguration});
    this.setState({
      confirmationDialog : false,
    });
  }

  cancelConfirmation()
  {
    this.setState({
     confirmationDialog : false,
   });
  }


  handleChange = (NotificationConfiguration) => {
		this.setState({NotificationConfiguration})
	};


	render() {

	const	{NotificationConfiguration , confirmationDialog } = this.state;
  const {selectedNotification , disabled ,userProfileDetail} = this.props;

  let updateRights = checkModuleRights(userProfileDetail.modules,"templateconfiguration","update");
   	return (
      <div>
        <RctCollapsibleCard>

        <div className="table-responsive">
            <table className="table table-hover">
                <thead>
                    <tr>
                        <th className="w-20" style = {{"minWidth"  : "130px"}}> Notification For </th>
                        <th className="w-20" >Disable\Enable</th>
                        <th style = {{"minWidth"  : "200px"}}>Notification On</th>
                    </tr>
                </thead>
                <tbody>

											 {NotificationConfiguration.map((notification, key) => (
                        <tr key={'notificationOption' + key}>
                          <td>
                              <h4>{notification.notificationType}</h4>
                          </td>
                           <td>
                           <div className = "row" >

                              <Switch
                                  checked={notification.isEnable == 1 ? true : false}
                                  onChange={(e) => {NotificationConfiguration[key].isEnable = e.target.checked ? 1 : 0 ; this.handleChange(NotificationConfiguration); } }
                                  color="primary"
                                  className="switch-btn"
                                />

                                </div>

                                {notification.isEnable == 1 && notification.notificationthrough && notification.notificationthrough.map((notificationfor, key2) => (
                                <div className = "row" key = {'notificationforOption' + key2 } >

                                        <Checkbox color="primary" checked={notificationfor.checked} onChange = {(e) => { NotificationConfiguration[key].notificationthrough[key2].checked = e.target.checked; this.handleChange(NotificationConfiguration);}}  value={notificationfor.value.toString()} />
                                        <label className="professionaldetail_padding" > {notificationfor.name}</label>

                                    </div>
                                      ))}


                            </td>
														<td>
                            <span className="d-block fw-normal">
           									{(notification.days  && notification.isEnable == 1 && (notification.notificationthrough.filter(x => x.checked).length > 0))  &&
														<div className="row" >

																		{notification.days.map((day,key1) => (
																				<div className = "col-12 col-sm-6 col-md-6 col-lg-4" key = {'daysOptionBefore' + key1 }>
																						<div className="row">
																								<Checkbox color="primary" checked={day.checked} onChange = {(e) => { NotificationConfiguration[key].days[key1].checked = e.target.checked; this.handleChange(NotificationConfiguration);}}  value={day.value.toString()} />
																								<label className="professionaldetail_padding" > {

																									(day.value > 0 ? 'After ' : (day.value < 0 ? 'Before ' : 'On day')) +
																									 (day.value != 0 ? Math.abs(day.value) + ' day' : '' ) }</label>
																							</div>
																						</div>
																		))
																	}
															</div>
														}
                              </span>
                             </td>
                        </tr>
											))
										}

              </tbody>

            </table>
						</div>
            {  updateRights &&   <Button variant="contained" size="large" color="primary"  onClick={() =>this.confirmSave()} className="text-white ml-4">
                Save
            </Button>}

				</RctCollapsibleCard>

        {
           confirmationDialog &&
         <DeleteConfirmationDialog
           openProps = {confirmationDialog}
           title="Are You Sure Want To Continue?"
           message="This will update your settings."
           onConfirm={() => this.onConfirm()}
            onCancel={() => this.cancelConfirmation()}
         />
         }
         </div>
	);
  }
  }

	const mapStateToProps = ({ templateconfigurationReducer , settings}) => {
		const {selectedNotification, disabled, dialogLoading,editMode ,editTemplate } =  templateconfigurationReducer;
    const {userProfileDetail , clientProfileDetail} = settings;
	  return {selectedNotification,disabled , dialogLoading ,editMode ,editTemplate,userProfileDetail,clientProfileDetail}
	}

	export default connect(mapStateToProps,{
	saveNotificationConfiguration , viewNotificationConfiguration})(NotificationConfigurationList);
