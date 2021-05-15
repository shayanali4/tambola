/**
 * Members Routes
 */
/* eslint-disable */
import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';

// async components
import {
    AsyncfitnesscenterComponent,
    // AsyncZoneComponent,
    // AsyncbranchComponent,
    // AsynctemplateconfigurationComponent,
    AsyncRoleComponent,
    AsyncBrandingComponent,
    // AsyncDisclaimerComponent,
    // AsyncBudgetComponent,
    // AsyncIntegrationComponent,
    // AsyncAdvertisementComponent,
    // AsyncPosterComponent,
    // AsyncResultAndTestimonialComponent,
  } from 'Components/AsyncComponent/AsyncComponent';

const Forms1 = ({ match }) => (
    <div className="content-wrapper">
        <Switch>
          <Redirect exact from={`${match.url}/`} to={`${match.url}/zone`} />

               <Route path={`${match.url}/organization/:tab`} component={AsyncfitnesscenterComponent} />
               <Route path={`${match.url}/role`} component={AsyncRoleComponent} />
               <Route path={`${match.url}/branding`} component={AsyncBrandingComponent} />

{/*
  <Route path={`${match.url}/zone`} component={AsyncZoneComponent} />

  <Route path={`${match.url}/branch`} component={AsyncbranchComponent} />
  <Route path={`${match.url}/template-configuration/:tab`} component={AsynctemplateconfigurationComponent} />
  <Route path={`${match.url}/integration`} component={AsyncIntegrationComponent} />
  <Route path={`${match.url}/disclaimer/:tab`} component={AsyncDisclaimerComponent} />
  <Route path={`${match.url}/budget`} component={AsyncBudgetComponent} />
  <Route path={`${match.url}/advertisement`} component={AsyncAdvertisementComponent} />
  <Route path={`${match.url}/poster`} component={AsyncPosterComponent} />
  <Route path={`${match.url}/resultandtestimonial`} component={AsyncResultAndTestimonialComponent} />

  */}
        </Switch>
    </div>
);

export default Forms1;
