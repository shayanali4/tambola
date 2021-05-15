/**
 * Employee Management Page
 */
import React, { Component, PureComponent } from 'react';
// Import React Table
import { connect } from 'react-redux';

import RctSectionLoader from 'Components/RctSectionLoader/RctSectionLoader';
import { clsAddNewRoleModel ,saveRole} from 'Actions';

import {  checkError, cloneDeep } from 'Helpers/helpers';
import Dialog from '@material-ui/core/Dialog';
import RoleDetail from './RoleDetail';
import ModuleOperation from 'Assets/data/moduleoperation';
import AdditionalRights from 'Assets/data/additionalrights';

import AppBar from '@material-ui/core/AppBar';
import PerfectScrollbar from 'Components/PerfectScrollbar';

import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';

import CloseIcon from '@material-ui/icons/Close';
import SaveIcon from '@material-ui/icons/Save';

import {required} from 'Validations';
import { push } from 'connected-react-router';
import api from 'Api';
import {isMobile} from 'react-device-detect';
import { NotificationManager } from 'react-notifications';
import Button from '@material-ui/core/Button';
import navLinks from 'Components/Sidebar-staff/NavLinks';


function TabContainer({ children }) {
    return (
        <Typography component="div" style={{ padding: isMobile ? 0 : 8 * 3 }}>
            {children}
        </Typography>
    );
}

class AddRole extends PureComponent {
	constructor(props) {
     super(props);

		   this.state = this.getInitialState();
   }

   getInitialState()
   {
     let modules = cloneDeep(navLinks.category1);

    let {packtypeId,clienttypeId, serviceprovidedId,professionaltypeId, gymaccessslot, biometric, enablecovid19disclaimertomember,enablecovid19disclaimertostaff,ishavemutliplebranch}  = this.props.clientProfileDetail;
    let isbiometricenable = biometric && biometric.isbiometricenable;

   if( clienttypeId){
       modules = modules.filter(x => x.clientType.includes(clienttypeId)
       && x.packType.includes(packtypeId)
       && x.professionalType.includes(professionaltypeId)
       && x.serviceProvided.includes(serviceprovidedId));

       modules.forEach(x => {
        if(x.child_routes){

            x.child_routes = x.child_routes.filter(z =>  z.clientType.includes(clienttypeId)
            && z.packType.includes(packtypeId)
            && z.professionalType.includes(professionaltypeId)
            && z.serviceProvided.includes(serviceprovidedId));

            if(x.alias == "setting")
            {
              if(ishavemutliplebranch == 0)
              {
                x.old_child_routes =x.old_child_routes ? x.old_child_routes :  cloneDeep(x.child_routes.filter(z => z.clientType.includes(clienttypeId)));
                x.child_routes = x.child_routes.filter(z => z.clientType.includes(clienttypeId)).filter(x => x.alias != "zone" && x.alias != "branch");
              }
              else if(ishavemutliplebranch == 1)
              {
                x.child_routes = x.old_child_routes ? x.old_child_routes.filter(z => z.clientType.includes(clienttypeId)) : x.child_routes.filter(z => z.clientType.includes(clienttypeId));
              }
            }
            else if(x.alias == "expensemanagement" && packtypeId == 2)
             {
               x.menu_title = 'sidebar.expenses';
             }
             // else if(x.alias == "covid19disclaimer")
             // {
             //   if(enablecovid19disclaimertostaff == 0)
             //   {
             //     x.child_routes = x.child_routes.filter(z => z.alias != "covid19staffdisclaimer");
             //   }
             //   if(enablecovid19disclaimertomember == 0)
             //   {
             //     x.child_routes = x.child_routes.filter(z => z.alias != "covid19memberdisclaimer");
             //   }
             // }

             //  if(!isbiometricenable){
             //     x.child_routes = x.child_routes.filter(x => x.alias != "biometric" && x.alias != "userbiometric");
             //   }
             // if(!gymaccessslot){
             //   x.child_routes = x.child_routes.filter(x => x.alias != "gymaccessslot" && x.alias != "gymaccessslotreport");
             //  }

         }
       });
     }


     this.initialState = {
             activeIndex : 0,
             restoreloading : false,
             roleData :
             {
               fields : {
                   id : 0,
                   role:'',
                   modules:modules,
                   additionalrights : AdditionalRights,
                   alias :'',
                   restore : 0,
                   checkall : 0,
                },
                errors : { },
               validated : false,
           },
    };
      return cloneDeep(this.initialState);
   }

	 componentWillUpdate(nextProps, nextState)
   {
     if((!nextProps.editMode && nextState.roleData.fields.id != 0) || (this.props.addNewRoleModal && !nextProps.addNewRoleModal))
     {
        this.setState(this.getInitialState());
     }
   }

   componentWillReceiveProps(newProps)
   {
     const	{editrole, editMode} = newProps;
     let {roleData} = this.state;

     if(editMode && editrole && roleData.fields.id == 0)
     {
       let modules = JSON.parse(editrole.modules);
       let additionalrights = editrole.additionalrights ? JSON.parse(editrole.additionalrights) : null;

       roleData.fields.id = editrole.id;
       roleData.fields.role = editrole.role;
       roleData.fields.alias = editrole.alias;
       roleData.fields.additionalrights.forEach(x => {
           let  rights  = additionalrights ? additionalrights.filter(y => y.alias == x.alias)[0] : '';
             if(rights)
              {
                x['update'] = rights['update'];
              }
       }) ;
       roleData.fields.modules.forEach(x => {

                let  module  = modules.filter(y => y.alias == x.alias)[0];

                if(module)
                {
                    if(module && !x.child_routes)
                    {
                        ModuleOperation.map((z, key) => {
                          x[z.short] = module[z.short];
                        })
                    }
                    else if(x.child_routes && module.child_routes){
                      x.child_routes.forEach(cx => {
                            let  ch_module  = module.child_routes.filter(cy => cy.alias == cx.alias)[0];

                          if (ch_module) {
                            ModuleOperation.map((z, key) => {
                              cx[z.short] = ch_module[z.short];
                            })
                          }

                      }) ;
                    }
                }
       }) ;

         this.state.role_old = cloneDeep(roleData.fields);

     }
   }


   onChangeRole(key,value, isRequired)
   {
     let error= isRequired ? required(value) : '';
     let modules = this.state.roleData.fields.modules;
     let alias = this.state.roleData.fields.alias;

     if(key == 'restore')
     {
       value = (value ? 1 : 0);
       if(value == 1)
       {
         this.getRoleRestored();
       }
     }
     else if (key == 'checkall') {
      modules.forEach(x => {x.all = value,x.add = value,x.update = value,x.view = value ,x.delete = value,x.export = value;
      if(x.child_routes){
        x.child_routes.forEach(y => {y.all = value,y.add = value,y.update = value,y.view = value ,y.delete = value,y.export = value})
      }});
        value = (value ? 1 : 0);
    }

     this.setState({
       roleData: {
         ...this.state.roleData,
         fields : {...this.state.roleData.fields,
           [key] : value,
            modules : modules
         },
         errors : {...this.state.roleData.errors,
           [key] : error
         }
       }
     });
   }

   getRoleRestored()
   {
     let {roleData} = this.state;
     let alias = roleData.fields.alias;
     this.setState({ restoreloading : true })
     api.post('restore-role', {alias})
    .then(response =>
      {
         let modules = JSON.parse(response.data[0][0].modules);
         roleData.fields.modules.forEach(x => {

                  let  module  = modules.filter(y => y.alias == x.alias)[0];

                  if(module)
                  {
                      if(module && !x.child_routes)
                      {
                          ModuleOperation.map((z, key) => {
                            x[z.short] = module[z.short];
                          })
                      }
                      else if(x.child_routes){
                        x.child_routes.forEach(cx => {
                              let  ch_module  = module.child_routes.filter(cy => cy.alias == cx.alias)[0];

                            if (ch_module) {
                              ModuleOperation.map((z, key) => {
                                cx[z.short] = ch_module[z.short];
                              })
                            }

                        }) ;
                      }
                  }
         }) ;
         this.setState({ restoreloading : false });
       }
    ).catch(error => {console.log(error); this.setState({ restoreloading : false });})
   }

	 	validate()
	 	{
	 		let errors = {};

        const fields = this.state.roleData.fields;
        errors.role = required(fields.role);

         let validated = checkError(errors);

         this.setState({
           roleData: {	...this.state.roleData,
              errors : errors, validated : validated
           }
         });
	 			 return validated;

	 }
   onSaveRole()
   {
     const {roleData,role_old} = this.state;
     const {editrole,editMode} = this.props;

     if(this.validate())
     {
       if(!editMode || (editrole && (JSON.stringify(role_old) != JSON.stringify(roleData.fields))))
        {
            const role  = roleData.fields;
           this.props.saveRole({role});
        }
        else {
          NotificationManager.error('No changes detected');
         }
     }
   }

    onClose()
	 	{
      this.setState(this.getInitialState());
	 		this.props.clsAddNewRoleModel();
      this.props.push('/app/setting/role');
	 	}

	render() {
	 const	{ addNewRoleModal, disabled , dialogLoading , editMode , editrole,role, clientProfileDetail} = this.props;
 	 const {roleData,activeIndex,restoreloading} = this.state;

		return (
			<Dialog fullScreen open={addNewRoleModal} onClose={() =>this.onClose()} >
					<AppBar position="static" className="bg-primary">
							<Toolbar>
									<IconButton color="inherit" onClick={() =>this.onClose()} aria-label="Close">
												<CloseIcon />
									</IconButton>
									<h5 className="w-50 mb-0 ">{ editMode || roleData.fields.id != 0 ? 'UPDATE ' : 'ADD '  } ROLE</h5>
									<div className="w-50 mb-0">
											<Tabs
														value={activeIndex}
														onChange={(e, value) => this.changeActiveIndex(value)}
														variant = "fullWidth"
														indicatorColor="secondary" >


											</Tabs>
								 </div>

                 <Button onClick={() =>this.onSaveRole()} disabled = {disabled} variant="text" mini= "true" ><SaveIcon /><span className ="pl-5">SAVE</span> </Button>

						</Toolbar>
				</AppBar>
				{((editMode && !editrole) || dialogLoading || restoreloading ) &&
					<RctSectionLoader />
				}
		<PerfectScrollbar style={{ height: 'calc(100vh - 5px)' }}>
        {activeIndex === 0 && <TabContainer> <RoleDetail fields = {roleData.fields} isHaveMutliplebranch = {clientProfileDetail.ishavemutliplebranch} errors ={roleData.errors} onChange = { this.onChangeRole.bind(this)} packtypeId ={clientProfileDetail.packtypeId}/>  </TabContainer>}

				</PerfectScrollbar>
			</Dialog>

	);
  }
  }
const mapStateToProps = ({ roleReducer, settings}) => {
	const { addNewRoleModal, disabled, dialogLoading, editrole, editMode ,role} =  roleReducer;
  const {clientProfileDetail} = settings;
  return { addNewRoleModal, disabled , dialogLoading, editrole, editMode,role, clientProfileDetail}
}

export default connect(mapStateToProps,{
	 clsAddNewRoleModel,saveRole,push})(AddRole);
