/**
 * Checkout Form Component
 */
import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import ReactTable from "react-table";
import Fab from '@material-ui/core/Fab';
//Component
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';
import FormGroup from 'reactstrap/lib/FormGroup';
import {cloneDeep } from 'Helpers/helpers';
import LinkedCamera from '@material-ui/icons/LinkedCamera';
import Camera from '@material-ui/icons/Camera';
import CameraFront from '@material-ui/icons/CameraFront';
import CameraRear from '@material-ui/icons/CameraRear';
import {isMobile,isIOS,isSafari} from 'react-device-detect';

import CloseIcon from '@material-ui/icons/Close';

import Webcam, { FACING_MODES, IMAGE_TYPES } from "react-html5-camera-photo";
import 'react-html5-camera-photo/build/css/index.css';
// intl messages
import IntlMessages from 'Util/IntlMessages';
import Button from '@material-ui/core/Button';
import DeleteConfirmationDialog from 'Components/DeleteConfirmationDialog/DeleteConfirmationDialog';

class CapturePhoto extends Component {
  constructor(props) {
     super(props);
     this.state = this.getInitialState();
  }
  getInitialState()
  {
    this.initialState = {
                          open: false,
                          facingMode : "user" ? FACING_MODES.USER :  FACING_MODES.ENVIRONMENT,
                          isImageMirror : "user" ? true : false,
                          safaribrowserConfirmationDialog : false,
                      }
                  return cloneDeep(this.initialState);
    }

    setRef = webcam => {
        this.webcam = webcam;
      };

    handleClickOpen = () => {
             this.setState({ open: true });
             if(isIOS && !isSafari)
             {
               this.setState({safaribrowserConfirmationDialog : true})
             }
           };


  handleClose = () => {
       this.setState(this.getInitialState());
    };

    capture = (imageSrc) => {

        if(imageSrc)
        {
          this.props.onCapture(imageSrc);
          this.setState({ open: false });
        }
  };

  onCameraError (error) {
    console.error('onCameraError', error);
  }


   onCameraStart (stream) {
       console.log('onCameraStart');
   }

   onCameraStop () {
        console.log('onCameraStop');
   }



   render() {
     const {facingMode,  open, isImageMirror,safaribrowserConfirmationDialog} = this.state;
        return (
         <div>
         <Fab className="btn-white text-primary" variant="round" mini= "true" onClick={() => this.handleClickOpen()}>
            <LinkedCamera/>
         </Fab>

        <Dialog open={open} fullWidth fullScreen = {isMobile ? true : false} onClose={this.handleClose} aria-labelledby="form-dialog-title">
        <DialogTitle >
            { facingMode == "user"  ?  <CameraRear className = {" pointer"} onClick = {() => this.setState({ facingMode : "environment", isImageMirror : false })} />
                                      :    <CameraFront className = {" pointer"} onClick = {() => this.setState({ facingMode: "user" , isImageMirror : true })} />
                   }
                  <CloseIcon onClick={this.handleClose} className = {"pull-right pointer"}/>

          </DialogTitle>

          <DialogContent>
          <div className="row" >
          <div className="col-12">
              <Webcam
              onTakePhoto = { (dataUri) => { this.capture(dataUri); } }
              onCameraError = { (error) => { this.onCameraError(error); } }
              idealFacingMode = {facingMode}
              idealResolution = {{width: '100%', height: 'auto'}}
              imageType = {IMAGE_TYPES.JPG}
              imageCompression = {0.97}
              isMaxResolution = {true}
              isImageMirror = {isImageMirror}
              isDisplayStartCameraError = {true}
              sizeFactor = {1}
              onCameraStart = { (stream) => { this.onCameraStart(stream); } }
              onCameraStop = { () => { this.onCameraStop(); } }

              />


           </div>
          </div>

          </DialogContent>
              </Dialog>

              {
                safaribrowserConfirmationDialog &&
                <DeleteConfirmationDialog
                  openProps = {safaribrowserConfirmationDialog}
                  title=""
                  message={"In non-safari browser, camera access is not allowed so switch to safari browser to get camera access"}
                  onConfirm={() => this.setState({safaribrowserConfirmationDialog : false})}
                   showcancel = {false}
                   confirmlabel = {"Ok"}
                />
              }

         </div>
      );
   }
}


export default (CapturePhoto);
