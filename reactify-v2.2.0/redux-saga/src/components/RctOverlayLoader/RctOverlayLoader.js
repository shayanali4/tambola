/**
 * Rct Section Loader
 */
import React from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';

const RctOverlayLoader = ({message}) => (
         <div className="dashboard-overlay p-4 d-none">
           <div className="dashboard-overlay-content mb-30">
             <Dialog maxWidth='xs'
                 open={true}
               >

               <DialogContent className = "pt-10">
                 <div className="d-flex justify-content-center p-20">
                     <CircularProgress />
                 </div>
               </DialogContent>
            </Dialog>
          </div>
        </div>

);

export default RctOverlayLoader;
