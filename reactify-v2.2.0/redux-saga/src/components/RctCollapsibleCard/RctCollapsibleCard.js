/**
 * Rct Collapsible Card
 */
import React, { Component, Fragment } from 'react';

import Collapse from 'reactstrap/lib/Collapse';
import Badge from 'reactstrap/lib/Badge';

import classnames from 'classnames';

// rct section loader
import RctSectionLoader from '../RctSectionLoader/RctSectionLoader';
import Tooltip from '@material-ui/core/Tooltip';

class RctCollapsibleCard extends Component {

    state = {
        reload: false,
        collapse: true,
        close: false,
    }

    onCollapse() {
        this.setState({ collapse: !this.state.collapse });
    }

    // onReload() {
    //     this.setState({ reload: true });
    //     let self = this;
    //     setTimeout(() => {
    //         self.setState({ reload: false });
    //     }, 1500);
    // }

    onCloseSection() {
        this.setState({ close: true });
    }

    componentWillMount()
    {
      if(this.props.collapse != null)
      {
        this.setState({collapse :  this.props.collapse});
      }
    }

    render() {
        const { close, reload, collapse} = this.state;
        const { children, collapsible, closeable, reloadable, heading, fullBlock, colClasses, customClasses, headingCustomClasses, contentCustomClasses, badge, customStyles ,openoptions, handleOptionClick , onReload , reloadabletooltip , infotooltip} = this.props;
        return (
            <div className={classnames(colClasses ? colClasses : '', { 'd-block': !collapse })}  >
                <div className={classnames(`rct-block ${customClasses ? customClasses : ''}`, { 'd-none': close })}  style ={customStyles}>
                    {heading &&
                        <div className={`rct-block-title ${headingCustomClasses ? headingCustomClasses : ''}`}>
                            <h3 className = "fw-bold my-5">{heading} {badge && <Badge className="p-1 ml-10" color={badge.class}>{badge.name}</Badge>}</h3>
                            {(collapsible || reloadable || closeable || openoptions || infotooltip) &&
                                <div className="contextual-link">
                                    {collapsible && <a href="#" onClick={(e) => {e.preventDefault(); this.onCollapse()}}><i className="ti-minus"></i></a>}

                                    {openoptions && <a href="#" onClick={(e) => {e.preventDefault(); if(handleOptionClick) {handleOptionClick()}}}><i className="ti-menu"></i></a>}

                                    {
                                      infotooltip
                                      &&
                                       <Tooltip PopperProps={{ style: { pointerEvents: 'none' } }} id="tooltip-top" disableFocusListener disableTouchListener  title={infotooltip } placement="bottom-end">
                                       <i className="fa fa-info-circle mr-10 size-20" ></i>
                                      </Tooltip>
                                    }
                                    {reloadable &&
                                        <Tooltip title={reloadabletooltip} placement="bottom">
                                          <a href="#" onClick={(e) => {e.preventDefault(); if(onReload) {onReload()}}}><i className="ti-reload"></i></a>
                                        </Tooltip>
                                    }
                                    {closeable && <a href="#" onClick={(e) => {e.preventDefault(); this.onCloseSection()}}><i className="ti-close"></i></a>}

                                </div>
                            }
                        </div>
                    }
                    <Collapse isOpen={collapse}>
                        <div className={classnames(contentCustomClasses ? contentCustomClasses : '', { "rct-block-content": !fullBlock, 'rct-full-block': fullBlock })}>
                            {children}
                        </div>
                    </Collapse>
                    {reload && <RctSectionLoader />}
                </div>
            </div>
        );
    }
}

export default RctCollapsibleCard;
