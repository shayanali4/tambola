/**
 * Employee Management Page
 */
import React, { PureComponent } from 'react';
import RctSectionLoader from 'Components/RctSectionLoader/RctSectionLoader';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';

import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import {base64ToFile} from 'Helpers/helpers';
import { NotificationManager } from 'react-notifications';
import {isMobile} from 'react-device-detect';
import RotateLeft from '@material-ui/icons/RotateLeft';
import RotateRight from '@material-ui/icons/RotateRight';
import CloseIcon from '@material-ui/icons/Close';
import imageCompression from 'browser-image-compression';
import {readableBytes} from 'Helpers/helpers';
export default class ImageCropper extends PureComponent {

  constructor(props) {
     super(props);
   }

   state ={
     imageforcrop :null,
     sizeofimage : 0,
     croppedimage : null,
     crop: {
     x: 0,
     y: 0,
  //   aspect: 1,
     width: 100,
     height : 100
     }
   }



   componentWillMount() {

          const	{imageforcrop, imageHeightWidth, fixedRatio} = this.props;

          let {crop} = this.state;

            if(fixedRatio)
            {
              crop.aspect = 1;
            }
            this.setState({crop, sizeofimage : readableBytes(imageforcrop.size)});
              var that = this;
              var options = {
                maxSizeMB: imageHeightWidth.size,
                useWebWorker: true
              }

              if((imageforcrop.size/1024/1024) > imageHeightWidth.size)
              {
                options.maxWidthOrHeight = imageHeightWidth.width > imageHeightWidth.height ? imageHeightWidth.width :  imageHeightWidth.height;
              }

                imageCompression(imageforcrop, options)
                  .then(function (compressedFile) {
                    if(compressedFile instanceof Blob)
                    {
                        compressedFile = new File([compressedFile], compressedFile.name, {type : compressedFile.type })
                    }

                      compressedFile.preview = window.URL.createObjectURL(compressedFile)
                      that.setState({imageforcrop : compressedFile});
                  })
                  .catch(function (error) {
                  });
              }

   rotateImage90deg(isClockwise)
    {
      const	{imageforcrop} = this.state;

          var that = this;

          let offScreenCanvas = document.createElement('canvas');
            let offScreenCanvasCtx = offScreenCanvas.getContext('2d');
            // cteate Image
            let img = new Image();
            img.src = imageforcrop.preview;

            img.onload = function() {
              // set its dimension to rotated size
              offScreenCanvas.height = img.width;
              offScreenCanvas.width = img.height;

              // rotate and draw source image into the off-screen canvas:
              if (isClockwise) {
                  offScreenCanvasCtx.rotate(90 * Math.PI / 180);
                  offScreenCanvasCtx.translate(0, -offScreenCanvas.width);
              } else {
                  offScreenCanvasCtx.rotate(-90 * Math.PI / 180);
                  offScreenCanvasCtx.translate(-offScreenCanvas.height, 0);
              }
              offScreenCanvasCtx.drawImage(img, 0, 0 );

              // encode image to data-uri with base64
              let rotateData = offScreenCanvas.toDataURL(imageforcrop.type, 1);
              that.setState({imageforcrop : base64ToFile(rotateData)});
          };
    }

   onSaveCropImage()
   {

     const {croppedimage, imageforcrop}  = this.state;

      if(croppedimage)
      {
        let finalImage = new File([croppedimage], imageforcrop.name, {type : imageforcrop.type });

        finalImage.preview = URL.createObjectURL(finalImage);
        this.props.onCrop(finalImage);
      }
   }


      onImageLoaded = (image) => {
         this.imageRef = image;
         const	{imageforcrop, imageHeightWidth } = this.props;
         let	{ crop } = this.state;

         if(crop.aspect == 1)
         {
           crop.height = image.height * 3/4;
           crop.width = crop.height;
         }
         else if(imageHeightWidth.width > imageHeightWidth.height)
         {
           let aspect = imageHeightWidth.width / imageHeightWidth.height;

           crop.width = image.width * 4/5;
           crop.height = crop.width / aspect;
         }
         else if(imageHeightWidth.width < imageHeightWidth.height)
         {
           let aspect = imageHeightWidth.width / imageHeightWidth.height;

           crop.height = image.height * 4/5;
           crop.width = crop.height * aspect;
         }
         else {
           crop.height = image.height * 3/4;
           crop.width = image.width * 3/4;
         }
         this.setState({crop});
         this.forceUpdate();
         this.onCropImage(crop, imageforcrop.name, imageforcrop.type);
       };

       onCropComplete = (crop) => {
          const	{imageforcrop } = this.props;
          this.onCropImage(crop, imageforcrop.name, imageforcrop.type);
        };

        onCropChange = crop => {
          this.setState({ crop });
        };

        async onCropImage(crop, filename, filetype) {
          if (this.imageRef && crop.width && crop.height) {
            const croppedImageUrl = await this.getCroppedImg(
              this.imageRef,
              crop,
              filename,
              filetype
            );
              this.setState({croppedimage : croppedImageUrl});
          }
        }

        getCroppedImg(image, crop, fileName, filetype) {
           const canvas = document.createElement('canvas');
           const scaleX = image.naturalWidth / image.width;
           const scaleY = image.naturalHeight / image.height;


           canvas.width = crop.width * scaleX;
           canvas.height = crop.height * scaleY;
           const ctx = canvas.getContext("2d");

           ctx.drawImage(
           image,
           crop.x * scaleX,
           crop.y * scaleY,
           crop.width * scaleX,
           crop.height * scaleY,
           0,
           0,
           crop.width * scaleX,
           crop.height * scaleY
         );

           return new Promise((resolve) => {

             canvas.toBlob((blob) => {
               blob.name = fileName; // eslint-disable-line no-param-reassign
               resolve(blob);
             }, filetype);
           });
         }

	render() {

	 let	{onCancel ,imageHeightWidth} = this.props;
   let {imageforcrop ,crop, sizeofimage} = this.state;

		return (

                      <Dialog open={ true } onClose={this.props.onCancel} fullScreen = {isMobile ? true : false} aria-labelledby="form-dialog-title" fullWidth disableBackdropClick = {true}   disableEscapeKeyDown = {true}>
                        <DialogTitle id="form-dialog-title">
                          	<CloseIcon onClick={this.props.onCancel}  className = {"pull-right pointer"}/>
                        </DialogTitle>
                        <DialogContent>
                        {imageforcrop == null ?
                          <div>    <RctSectionLoader message = {'Processing image...'}/>
                             <span className="d-flex justify-content-center">  Size : {sizeofimage} </span>
                             <span className="text-danger ml-40"> Note : If file size is large, it will take some time. Please wait... </span>
                           </div>
                         :
                          <ReactCrop crop={crop} keepSelection = {true} src={imageforcrop.preview ? imageforcrop.preview : URL.createObjectURL(imageforcrop)}  onImageLoaded={this.onImageLoaded} onComplete={this.onCropComplete}  onChange={this.onCropChange}/>
                        }

                        </DialogContent>
                        <DialogActions>

                        {imageforcrop &&   <RotateLeft  className = " pointer " onClick={() => this.rotateImage90deg(false)} style={{"minWidth" : "24"}}/>}

                        {imageforcrop &&   <RotateRight  className = " pointer" onClick={() => this.rotateImage90deg(true)} style={{"minWidth" : "45"}}/>}
                          <Button variant="contained" onClick={() => this.onSaveCropImage()} className="btn-info text-white">
                            Crop
                          </Button>

                          <Button variant="contained" onClick={this.props.onCancel}  className="btn-danger text-white">
                            Cancel
                          </Button>
                        </DialogActions>
                      </Dialog>


	);
  }
  }

  ImageCropper.defaultProps = {imageHeightWidth : {width : 100 ,height : 100}};
