
/**
 * Page Title Bar Component
 * Used To Display Page Title & Breadcrumbs
 */
import React from 'react';
import Breadcrumb from 'reactstrap/lib/Breadcrumb';
import BreadcrumbItem from 'reactstrap/lib/BreadcrumbItem';


import {isMobile} from 'react-device-detect';

// intl messages
import IntlMessages from 'Util/IntlMessages';
import ExpireNotiFication from 'Components/ExpireNotiFication/ExpireNotification';

// get display string
const getDisplayString = (sub) => {
    const arr = sub.split("-");
    if (arr.length > 1) {
        return <IntlMessages id={`sidebar.${arr[0].charAt(0) + arr[0].slice(1) + arr[1].charAt(0).toUpperCase() + arr[1].slice(1)}`} />
    } else {
        return <IntlMessages id={`sidebar.${sub.charAt(0) + sub.slice(1)}`} />
    }

};

// get url string
const getUrlString = (path, sub, index) => {
    if (index === 0) {
        return '/';
    } else {
        return '/' + path.split(sub)[0] + sub;
    }
};

const PageTitleBar = ({ title, match, enableBreadCrumb , customClasses,clientProfileDetail}) => {

    let path = match.path.substr(1);
    if(path.indexOf('/:') > 0)
    {
      path = path.substring(0, path.indexOf('/:'));
    }
    const subPath = path.split('/');


    return (
      <div>
        <ExpireNotiFication/>
        <div className= {"page-title d-flex justify-content-between align-items-center" + (customClasses ? customClasses : "")}>
            {title &&
                <div className="page-title-wrap">
                    	<a href="#" onClick={(e) => {e.preventDefault();   window.history.back(); }} className="mr-10"><i className="ti-angle-double-left fs-18"></i></a>
                    <h2 className="align-top">{title}</h2>
                </div>
            }
            {enableBreadCrumb && !isMobile && !(path.indexOf("member-app") > -1) &&
                <Breadcrumb className="mb-0 tour-step-7 px-0" tag="nav">
                    {subPath.map((sub, index) => {
                        return <BreadcrumbItem active={subPath.length === index + 1}
                            tag={subPath.length === index + 1 ? "span" : "a"} key={index}
                            href={getUrlString(path, sub, index)}>{getDisplayString(sub)}</BreadcrumbItem>
                    }
                    )}
                </Breadcrumb>
            }
        </div>
          </div>
    )
};

// default props value
PageTitleBar.defaultProps = {
    enableBreadCrumb: true
}

export default PageTitleBar;
