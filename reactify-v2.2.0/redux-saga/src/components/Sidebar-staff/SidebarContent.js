/**
 * Sidebar Content
 */
import React, { Component } from 'react';
import List from '@material-ui/core/List';
import ListSubheader from '@material-ui/core/ListSubheader';
import { withRouter,Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import IntlMessages from 'Util/IntlMessages';

import NavMenuItem from './NavMenuItem';
import ModuleOperation from 'Assets/data/moduleoperation';

import {cloneDeep} from 'Helpers/helpers';

// redux actions
import { onToggleMenu } from 'Actions';
import { NotificationManager } from 'react-notifications';
import Auth from '../../Auth/Auth';
const authObject = new Auth();

class SidebarContent extends Component {

    toggleMenu(menu, stateCategory) {
        let data = {
            menu,
            stateCategory
        }
        this.props.onToggleMenu(data);
    }

    render() {
        const {menus, packtypeId,clienttypeId,professionaltypeId, serviceprovidedId, gymaccessslot, biometric, iscovid19memberdisclaimerenable,iscovid19staffdisclaimerenable,ishavemutliplebranch, sidebarMenus} = this.props;
        let isbiometricenable = biometric && biometric.isbiometricenable;


    if(clienttypeId)
    {
      sidebarMenus.category1 = sidebarMenus.category1.filter(x => x.clientType.includes(clienttypeId)
      && x.packType.includes(packtypeId)
      && x.professionalType.includes(professionaltypeId)
      && x.serviceProvided.includes(serviceprovidedId));
     }

          sidebarMenus.category1.forEach(x => {

                 let  module  = menus ? menus.filter(y => y.alias == x.alias)[0] : null;

                 if(module && !x.child_routes)
                 {
                     ModuleOperation.map((z, key) => {
                       x[z.short] = module[z.short];
                     })
                 }
                 else if(x.child_routes){

				 if(clienttypeId)
                  {
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
                    else if(x.alias == "covid19disclaimer")
                    {
                      if(iscovid19staffdisclaimerenable == 0)
                      {
                        x.child_routes = x.child_routes.filter(z => z.alias != "covid19staffdisclaimer");
                      }
                      if(iscovid19memberdisclaimerenable == 0)
                      {
                        x.child_routes = x.child_routes.filter(z => z.alias != "covid19memberdisclaimer");
                      }
                    }
 }

                     if(!isbiometricenable){
                        x.child_routes = x.child_routes.filter(x => x.alias != "biometric" && x.alias != "userbiometric");
                      }
                    if(!gymaccessslot){
                      x.child_routes = x.child_routes.filter(x => x.alias != "gymaccessslot" && x.alias != "gymaccessslotreport");
                     }


                   x.child_routes.forEach(cx => {
                         let  ch_module  = module && module.child_routes ?  module.child_routes.filter(cy => cy.alias == cx.alias)[0] : null;
                         if (ch_module) {
                           ModuleOperation.map((z, key) => {
                             cx[z.short] = ch_module[z.short];
                           })
                         }
                   }) ;
                 }
        }) ;

        let allowedMenu = sidebarMenus.category1.filter(x =>  (x.child_routes &&  x.child_routes.filter(y => y.view == true).length > 0) || x.view);

        let redirectPath = '';
        let pathname = location.pathname;

                        if(menus && allowedMenu && allowedMenu.length <= 0 )
                        {
                            return (<Redirect to={'/signin'} />);
                        }

        if(allowedMenu && allowedMenu.length > 0 && allowedMenu.filter(x => (x.path == pathname || (x.extrapath && x.extrapath.filter(z => z == pathname).length > 0)) || (x.child_routes && x.child_routes.filter(y => y.path == pathname || (y.extrapath && y.extrapath.filter(z => z == pathname).length > 0)  ).length > 0)).length == 0)
        {
          let firstMenu = allowedMenu[0];

            if(firstMenu && !(pathname == "/app/users/user-profile-1" || pathname == "/app/users/feedback" || pathname == "/app/about-us" || pathname == "/app/covid19staffdisclaimerform" || pathname == "/app/terms-condition"))
            {
              if(firstMenu.child_routes)
              {
                redirectPath  = firstMenu.child_routes.filter(y => y.view == true)[0].path;
              }
              else {
                redirectPath  = firstMenu.path;
              }


            }
        }

        if(redirectPath)
        {
          return (<Redirect to={redirectPath} />);
        }

        return (
            <div className="rct-sidebar-nav">
                <nav className="navigation">
                    <List
                        className="rct-mainMenu p-0 m-0 pb-40 list-unstyled"

                      >
                        {allowedMenu.map((menu, key) =>(
                            ((menu.child_routes && menu.child_routes.filter(y => y.view == true).length > 0 ) ||   menu.view ) &&
                            <NavMenuItem
                                menu={menu}
                                key={key}
                                onToggleMenu={() =>{ menu.child_routes = menu.child_routes ? menu.child_routes.filter(y => y.view == true) : null;
                                          this.toggleMenu(menu, 'category1');}}
                            />

                        ))}
                    </List>
                </nav>
            </div>
        );
    }
}

// map state to props
const mapStateToProps = ({ sidebar }) => {
    const { sidebarMenus } = sidebar;
    return { sidebarMenus };
};

export default withRouter(connect(mapStateToProps, {
    onToggleMenu
})(SidebarContent));
