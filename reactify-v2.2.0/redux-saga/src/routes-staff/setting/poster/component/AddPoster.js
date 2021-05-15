/**
 * Employee Management Page
 */
import React, { Component, PureComponent } from 'react';
// Import React Table
import { connect } from 'react-redux';

import RctSectionLoader from 'Components/RctSectionLoader/RctSectionLoader';
import { clsAddNewPosterModel, savePoster } from 'Actions';

import Weekdays from 'Assets/data/weekdays';
import Ownership  from 'Assets/data/ownership';

import {  checkError, cloneDeep ,getLocalTime,getFormtedFromTime} from 'Helpers/helpers';
import Dialog from '@material-ui/core/Dialog';
import Dropzone from 'react-dropzone';

import AppBar from '@material-ui/core/AppBar';
import PerfectScrollbar from 'Components/PerfectScrollbar';

import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';

import CloseIcon from '@material-ui/icons/Close';
import SaveIcon from '@material-ui/icons/Save';

import Button from '@material-ui/core/Button';
import {required,email,checkLength,checkMobileNo,checkPincode,checkAlpha,restrictLength} from 'Validations';
import { NotificationManager } from 'react-notifications';
import { push } from 'connected-react-router';

import {isMobile} from 'react-device-detect';
import ImageCompressor from 'Components/ImageCompressor';
import RctCollapsibleCard from 'Components/RctCollapsibleCard/RctCollapsibleCard';
import { RctCard } from 'Components/RctCard';


function TabContainer({ children }) {
    return (
        <Typography component="div" style={{ padding: isMobile ? 0 : 8 * 3 }}>
            {children}
        </Typography>
    );
}

class AddPoster extends PureComponent {
	constructor(props) {
     super(props);
		   this.state = this.getInitialState();
   }

   getInitialState()
   {
     this.initialState = {
             activeIndex : 0,
             posterData :
             {
               fields : {
                   id : 0,
                   posterImageCompressed : null,
                   posterimageFiles: [],
                   imageHeightWidth : {},
                },
                errors : { },
               validated : false,
           },
    };
      return cloneDeep(this.initialState);
   }

   componentWillUpdate(nextProps, nextState)
   {
     if((nextState.posterData.fields.id != 0) || (this.props.addNewPosterModal && !nextProps.addNewPosterModal))
     {
        this.setState(this.getInitialState());
     }
   }


   onChangePoster(key,value, isRequired)
   {
     let error= isRequired ? required(value) : '';

       this.setState({
         posterData: {
           ...this.state.posterData,
           fields : {...this.state.posterData.fields,
             [key] : value,
           },
           errors : {...this.state.posterData.errors,
             [key] : error
           }
         }
       });
   }

	 	onSavePoster()
	 	{
      const {posterData} = this.state;
      if(posterData.fields.posterimageFiles.length > 0)
      {
             const posterdetail  = posterData.fields;

             this.props.savePoster({posterdetail});

	 		}
      else {
        NotificationManager.error("Please upload an image");
      }
  }

    onClose()
	 	{
      this.setState(this.getInitialState());
	 		this.props.clsAddNewPosterModel();
      this.props.push('/app/setting/poster');
	 	}

    onChangeImageToCompress(key,value)
    {
        this.setState({
          posterData: {
            ...this.state.posterData,
            fields : {...this.state.posterData.fields,
              posterImageCompressed : value[0],
              imageHeightWidth : {width : 500 ,height : 500 , size : 0.3}
            },
          }
        });
    }

    onChangeCompressedImage(compressedimage)
       {
           if(compressedimage)
           {
             this.setState({
               posterData: {
                 ...this.state.posterData,
                 fields : {...this.state.posterData.fields,
                   'posterimageFiles' : [compressedimage],
                   'posterImageCompressed' : null,
                 },
               }
             });
           }
       }


     onRemove()
       {
         if(this.state.posterData.fields.posterimageFiles.length > 0)
         {
           this.setState({
             posterData: {
               ...this.state.posterData,
               fields : {...this.state.posterData.fields,
                   'posterimageFiles' : ''
               },
             }
           });
         }
       }

	render() {

	 const	{ addNewPosterModal, disabled , dialogLoading} = this.props;
 	 const {activeIndex} = this.state;
   let {fields} = this.state.posterData;
   let  dropzoneRef;
		return (
			<Dialog fullWidth open={addNewPosterModal} onClose={() =>this.onClose()} >
					<AppBar position="static" className="bg-primary">
							<Toolbar>
									<IconButton color="inherit" onClick={() =>this.onClose()} aria-label="Close">
												<CloseIcon />
									</IconButton>
									<h5 className="w-50 mb-0 ">ADD POSTER</h5>
									<div className="w-50 mb-0">
											<Tabs
														value={activeIndex}
														onChange={(e, value) => this.changeActiveIndex(value)}
														variant = "fullWidth"
														indicatorColor="secondary" >


											</Tabs>
								 </div>

                 <Button onClick={() =>this.onSavePoster()} disabled = {disabled} variant="text" mini= "true" ><SaveIcon /><span className ="pl-5">SAVE</span> </Button>

						</Toolbar>
				</AppBar>
				{(dialogLoading ) &&
					<RctSectionLoader />
				}
	<PerfectScrollbar style={{ height: 'calc(100vh - 5px)' }}>
        {activeIndex === 0 &&
          <TabContainer>
            <div className="textfields-wrapper">
              <RctCollapsibleCard >
                <form noValidate autoComplete="off">
                  <div className="row">
                    <div className="col-sm-12 col-md-12 col-xl-12">
                       <div className = "row" style={{display: 'flex', justifyContent: 'center'}}>
                         <div className="col-sm-8 col-md-12 col-xl-8">
                            <a href="javascript:void(0)" className="bg-primary  text-center cart-link text-white py-2 mb-2 pl-4" onClick={(e) => { dropzoneRef.open() } }>
                              Click here to upload image
                            </a>
                          </ div>
                        </div>

                       <Dropzone onDrop={(imageFiles) =>this.onChangeImageToCompress('imageFiles',imageFiles)} accept="image/jpeg, image/png" multiple={false}
                        ref={(node) => { dropzoneRef = node; }}>
                          {({getRootProps, getInputProps}) => (
                            <section >
                              <div
                                {...getRootProps({
                                  className: 'dropzone'
                                })}
                              >
                                <input {...getInputProps()} />
                                <div className = "row">


                             <div className="col-12 p-3" >
                               <RctCard customClasses="d-flex  mb-0 flex-column justify-content-between overflow-hidden">
                                {((fields.posterimageFiles && fields.posterimageFiles.length > 0) )  &&
                                 <div className="overlay-wrap overflow-hidden" >
                                   <div className="text-center p-4">

                                       {fields.posterimageFiles.length > 0 &&
                                              <img src={fields.posterimageFiles[0].preview} alt="" type="file" name="imageFiles"  className="w-100  img-fluid"/>
                                       }

                                   </div>
                                   <div className="overlay-content d-flex align-items-end">
                                     <a href="javascript:void(0)" className="bg-primary text-center w-100 cart-link text-white py-2" onClick={(e) => {this.onRemove(); e.preventDefault(); }}>
                                       Remove
                                     </a>
                                   </div>
                               </div>
                             }
                             </RctCard>
                           </div>
                          </div>
                        </div>
                       </section>
                      )}
                    </Dropzone>
                  </div>
                 </div>
                </form>
              </RctCollapsibleCard>
              {fields.posterImageCompressed &&
               <ImageCompressor imageforcompress = {fields.posterImageCompressed}
                           onCompress ={(compressedimage) => this.onChangeCompressedImage(compressedimage)}
                           imageHeightWidth = {fields.imageHeightWidth}
                           />
              }
            </div>
          </TabContainer>}

				</PerfectScrollbar>
			</Dialog>

	);
  }
  }
const mapStateToProps = ({ posterReducer }) => {
	const { addNewPosterModal, disabled, dialogLoading } =  posterReducer;
  return { addNewPosterModal, disabled , dialogLoading}
}

export default connect(mapStateToProps,{
	 clsAddNewPosterModel, savePoster,push})(AddPoster);
