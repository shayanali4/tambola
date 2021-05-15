/**
 * Rct Section Loader
 */
import React from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';

const RctSectionLoader = ({message}) => (
    <div className="d-flex justify-content-center w-90 mx-auto p-20">
        <CircularProgress />
              <span className = "pl-10">  {message} </span>
    </div>
);

export default RctSectionLoader;
