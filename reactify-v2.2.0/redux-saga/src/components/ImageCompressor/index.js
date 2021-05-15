/**
 * Employee Management Page
 */
import React, { PureComponent } from 'react';
import { NotificationManager } from 'react-notifications';
import imageCompression from 'browser-image-compression';
import RctSectionLoader from 'Components/RctSectionLoader/RctSectionLoader';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import {readableBytes} from 'Helpers/helpers';
import Button from '@material-ui/core/Button';

export default class ImageCompressor extends PureComponent {

  constructor(props) {
     super(props);
   }

   state ={
     imageforcompress :null,
     sizeofimage : 0,
     compressDialog : false
   }

   componentWillMount() {
     const	{imageforcompress, imageHeightWidth, quality} = this.props;
     let imagesize = readableBytes(imageforcompress.size);
     this.setState({sizeofimage : imagesize,compressDialog : true});

      var that = this;
        var options = {
            maxSizeMB: imageHeightWidth.size,
            useWebWorker: true
        }

     imageCompression(imageforcompress, options)
       .then(function (compressedFile) {
          if(compressedFile instanceof Blob)
          {
              compressedFile = new File([compressedFile], compressedFile.name, {type : compressedFile.type })
          }
           compressedFile.preview = window.URL.createObjectURL(compressedFile)

           if(that.state.compressDialog)
           {
             that.setState({imageforcompress : compressedFile,compressDialog : false});
             that.props.onCompress(compressedFile);
           }
           else {
             that.props.onCompress(null);
           }
       })
       .catch(function (error) {
       });
    }

	render() {
   let {imageforcompress,sizeofimage,compressDialog} = this.state;
		return (
                <div>
                  <Dialog open={ compressDialog } fullWidth disableBackdropClick = {true}   disableEscapeKeyDown = {true}>
                    <DialogContent className = "pt-20">
                       <RctSectionLoader message = {'Processing image...'}/>
                       <span className="d-flex justify-content-center">  Size : {sizeofimage} </span>
                       <span className="text-danger ml-40"> Note : If file size is large, it will take some time. Please wait... </span>
                    </DialogContent>
                    {
                    // <DialogActions>
                    //    <Button variant="contained" onClick={() => this.setState({compressDialog : false})} color="primary" className="text-white">
                    //      Cancel
                    //    </Button>
                    // </DialogActions>
                  }
                  </Dialog>
                </div>
	          );
        }
    }

  ImageCompressor.defaultProps = {imageHeightWidth :{width : 100 ,height : 100}};
