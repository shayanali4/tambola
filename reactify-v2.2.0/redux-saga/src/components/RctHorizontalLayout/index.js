/**
 * Rct Horizontal Menu Layout
 */
import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import PerfectScrollbar from 'Components/PerfectScrollbar';

// Components
import Header from 'Components/Header-staff/Header';
import Footer from 'Components/Footer-staff/Footer';
import HorizontalMenu from 'Components/HorizontalMenu/HorizontalMenu';

class RctHorizontalLayout extends Component {

    renderPage() {
        const { pathname } = this.props.location;
        const { children, match } = this.props;
        if (pathname === `${match.url}/chat` || pathname.startsWith(`${match.url}/mail`) || pathname === `${match.url}/todo`) {
            return (
                <div className="rct-page-content">
                    {children}
                </div>
            );
        }
        return (
          <PerfectScrollbar style={{ height: 'calc(100vh - 100px)' }}>
                <div className="rct-page-content">
                    {children}
                </div>
            </PerfectScrollbar>
        );
    }

    render() {
        return (
            <div className="app-horizontal collapsed-sidebar">
                <div className="app-container">
                    <div className="rct-page-wrapper">
                        <div className="rct-app-content">
                            <div className="app-header">
                                <Header horizontalMenu />
                            </div>
                            <div className="rct-page">
                                <HorizontalMenu />
                                {this.renderPage()}
                            </div>
                            <Footer />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default withRouter(RctHorizontalLayout);
