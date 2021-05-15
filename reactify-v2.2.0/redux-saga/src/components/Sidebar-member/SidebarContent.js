/**
 * Sidebar Content
 */
import React, { PureComponent } from 'react';
import List from '@material-ui/core/List';
import ListSubheader from '@material-ui/core/ListSubheader';
import { withRouter,Redirect } from 'react-router-dom';
import { connect } from 'react-redux';

import IntlMessages from 'Util/IntlMessages';

import NavMenuItem from './NavMenuItem';

// redux actions
import { onToggleMenu } from 'Actions';

class Content extends PureComponent
{
      render() {
      const  { category1,clienttypeId } =   this.props;

      return  category1.map((menu, key) => (
            <NavMenuItem
                menu={menu}
                key={key}
                onToggleMenu={() => this.toggleMenu(menu, 'category1')}
                clienttypeId = {clienttypeId}
            />
        ))
      }
}

class SidebarContent extends PureComponent {

    toggleMenu(menu, stateCategory) {
        let data = {
            menu,
            stateCategory
        }
        this.props.onToggleMenu(data);
    }

    render() {
        const { sidebarMenus,packtypeId,professionaltypeId, serviceprovidedId,clienttypeId,isgymaccessslot } = this.props;
        if(packtypeId) {
          sidebarMenus.category1 = sidebarMenus.category1.filter(x => x.packType.includes(packtypeId));
        }
        if(professionaltypeId){
          sidebarMenus.category1 = sidebarMenus.category1.filter(x => x.professionalType.includes(professionaltypeId));
        }
        if(clienttypeId) {
          sidebarMenus.category1 = sidebarMenus.category1.filter(x => x.clientType.includes(clienttypeId));
        }
        if(serviceprovidedId){
          sidebarMenus.category1 = sidebarMenus.category1.filter(x => x.serviceProvided.includes(serviceprovidedId));
        }
        if(isgymaccessslot != undefined && isgymaccessslot != 1){
         sidebarMenus.category1 = sidebarMenus.category1.filter(x => x.path != "/member-app/gym-accessslot");
       }

        sidebarMenus.category1.forEach(x => {

             if(x.child_routes){

               if(packtypeId)
               {
                  x.child_routes = x.child_routes.filter(z => z.packType.includes(packtypeId));
                }
                if(clienttypeId)
                {
                  x.child_routes = x.child_routes.filter(z => z.clientType.includes(clienttypeId));
              }
              }
      }) ;
      var allowedMenu =sidebarMenus.category1.filter(function (x) {
                return x.packType.includes(packtypeId);
              });

      let redirectPath = '';
      let pathname = location.pathname;

      if(allowedMenu.filter(x => (x.path == pathname || (x.extrapath && x.extrapath.filter(z => z == pathname).length > 0)) || (x.child_routes && x.child_routes.filter(y => y.path == pathname || (y.extrapath && y.extrapath.filter(z => z == pathname).length > 0)  ).length > 0)).length == 0)
      {
        let firstMenu = allowedMenu[0];

          if(firstMenu && !(pathname == "/member-app/member-feedback" || pathname == "/member-app/changepassword" || pathname == "/member-app/disclaimerform" || pathname == "/member-app/covid19disclaimerform"  || pathname.indexOf("/member-app/pt-room") > -1))
          {

                redirectPath  = firstMenu.path;
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
                        <Content  category1 = {sidebarMenus.category1} clienttypeId = {clienttypeId}/>
                    </List>
                </nav>
            </div>
        );
    }
}


// map state to props
const mapStateToProps = ({ memberSidebarReducer }) => {
    const { sidebarMenus } = memberSidebarReducer;
    return { sidebarMenus };
};


export default withRouter(connect(mapStateToProps, {
    onToggleMenu
})(SidebarContent));
