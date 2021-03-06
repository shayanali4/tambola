/**
 * Nav Menu Item
 */
import React, { Fragment, PureComponent } from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import Collapse from '@material-ui/core/Collapse';
import { NavLink } from 'react-router-dom';
import classNames from 'classnames';

// intl messages
import IntlMessages from 'Util/IntlMessages';

class NavMenuItem extends PureComponent {

    state = {
        subMenuOpen: false
    }

    /**
     * On Toggle Collapse Menu
     */
    onToggleCollapseMenu() {
        this.setState({ subMenuOpen: !this.state.subMenuOpen });
    }

    render() {
        const { menu, onToggleMenu } = this.props;
        const { subMenuOpen } = this.state;



        if (menu.child_routes != null) {
            return (
                <Fragment>
                    <ListItem button component="li" onClick={onToggleMenu} className={classNames({ 'item-active': menu.open })}>
                        <ListItemIcon className="menu-icon">
                        {
                          menu.menu_icon && (
                            menu.menu_icon.indexOf('.') > 0  ?
                            <i className={menu.menu_icon.split('.')[0]}> {menu.menu_icon.split('.')[1] }</i>:
                                                    <i className={menu.menu_icon}></i>)
                        }
                        </ListItemIcon>
                        <span className="menu">
                            <IntlMessages id={menu.menu_title} />
                        </span>
                        <i className="ti-angle-right side-arrow"></i>
                    </ListItem>
                    <Collapse in={menu.open} timeout="auto">
                        <List className="sub-menu list-unstyled">
                            {menu.child_routes.map((subMenu, index) => {
                                if (!subMenu.child_routes) {
                                    return (
                                        <ListItem button component="li" key={index}>
                                            <NavLink activeClassName="item-active" to={subMenu.path}>
                                                <span className="menu">
                                                    <IntlMessages id={subMenu.menu_title} />
                                                </span>
                                            </NavLink>
                                        </ListItem>
                                    );
                                }
                                return (
                                    <Fragment key={index}>
                                        <ListItem button component="li" onClick={() => this.onToggleCollapseMenu()} className={classNames({ 'item-active': subMenuOpen })}>
                                            <span className="menu">
                                                <IntlMessages id={subMenu.menu_title} />
                                            </span>
                                            <i className="ti-angle-right side-arrow"></i>
                                        </ListItem>
                                        <Collapse in={subMenuOpen} timeout="auto">
                                            {subMenu.child_routes.map((nestedMenu, nestedKey) => (
                                                <ListItem button component="li" key={nestedKey}>
                                                    <NavLink activeClassName="item-active" to={nestedMenu.path}>
                                                        <span className="menu pl-20">
                                                            <IntlMessages id={nestedMenu.menu_title} />
                                                        </span>
                                                    </NavLink>
                                                </ListItem>
                                            ))}
                                        </Collapse>
                                    </Fragment>
                                )
                            })}
                        </List>
                    </Collapse>
                </Fragment>
            )
        }
        return (

         <ListItem button component="li">
                <NavLink activeClassName="item-active" to={menu.path}>
                    <ListItemIcon className="menu-icon">
                        <i className={menu.menu_icon}></i>
                    </ListItemIcon>
                    <span className="menu">
                        <IntlMessages id={menu.menu_title} />
                    </span>
                </NavLink>
            </ListItem>

        );
    }
}

export default NavMenuItem;
