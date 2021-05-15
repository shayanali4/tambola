/**
 * Delete Confirmation Dialog
 */
import React, { Component } from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';

class DeleteConfirmationDialog extends Component {

   state = {
      open: false
   }

   // open dialog
   open() {
      this.setState({ open: true });
   }

   // close dialog
   close() {
      this.setState({ open: false });
      this.props.onCancel();
   }

   render() {
      const { title, message, onConfirm , openProps ,cancelabel ,confirmlabel,onContinue,continuelabel} = this.props;
      let {  showcancel ,confirmdisable} = this.props;


      showcancel = showcancel == undefined ? true : showcancel;
      confirmdisable = confirmdisable == undefined ? false : confirmdisable;
      return (
         <Dialog
            open={this.state.open || openProps}
            onClose={() => this.close()}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
         >
            <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
            <DialogContent>
               <DialogContentText id="alert-dialog-description">
                  {message}
               </DialogContentText>
            </DialogContent>
            <DialogActions>
              {showcancel && <Button onClick={() => this.close()} className="btn-danger text-white">
                  {cancelabel || "Cancel"}
               </Button>
              }
               {continuelabel &&
               <Button onClick={onContinue} className="btn-secondary text-white">
                  {continuelabel || "Continue"}
               </Button>
             }
               <Button onClick={onConfirm} disabled = {confirmdisable} className="btn-primary text-white" autoFocus>
                  {confirmlabel || "Yes"}
               </Button>
            </DialogActions>
         </Dialog>
      );
   }
}

export default DeleteConfirmationDialog;
