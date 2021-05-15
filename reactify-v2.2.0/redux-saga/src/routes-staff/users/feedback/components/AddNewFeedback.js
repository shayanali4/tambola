/**
 * Add New Feedback
 */
import React, { Component } from 'react';
import Form from 'reactstrap/lib/Form';
import FormGroup from 'reactstrap/lib/FormGroup';
import Input from 'reactstrap/lib/Input';
import Label from 'reactstrap/lib/Label';
import Col from 'reactstrap/lib/Col';
import Feedback  from 'Assets/data/feedback';
import Feedbackfor  from 'Assets/data/feedbackfor';
import FeedbackStatus  from 'Assets/data/feedbackstatus';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import RadioGroup from '@material-ui/core/RadioGroup';
import Radio from '@material-ui/core/Radio';
import Button from '@material-ui/core/Button';
import { connect } from 'react-redux';
import {isMobile} from 'react-device-detect';
import Rating from "react-rating";
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { NotificationManager } from 'react-notifications';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import Dropzone from 'react-dropzone';
import ImageCompressor from 'Components/ImageCompressor';
import { RctCard } from 'Components/RctCard';
import {checkError, cloneDeep} from 'Helpers/helpers';
import {required} from 'Validations';
import FormHelperText from '@material-ui/core/FormHelperText';
import RctSectionLoader from 'Components/RctSectionLoader/RctSectionLoader';
import Tooltip from '@material-ui/core/Tooltip';

// redux actions
import { addNewFeedback, showFeedbackLoadingIndicator ,saveFeedback} from 'Actions';

class AddNewFeedback extends Component {

    state = {
        newIdea: '3',
        description: '',
        feedbackfor : '1',
        opnratingdialog : false,
        average : 0,
        rating : {
          equipment : 0,
          facilities : 0,
          trainer : 0,
          vibe : 0,
          valueformoney : 0,
        },
        feedbackStatus : '1',
        imageFiles: [],
        serviceImageCompressed :null,
        imageHeightWidth : {},
        errors : { },
       validated : false
    }

    /**
     * Add New Feedback
     */
    addNewFeedback() {
        let { newIdea, description,feedbackfor,rating,average,feedbackStatus,imageFiles } = this.state;
        if(this.validate()){
        if (newIdea !== '' && description !== '') {
          if(newIdea == '5')
          {
            feedbackStatus = '2';
          }
            let feedback = {
                idea: newIdea,
                description,
                feedbackfor,
                rating,
                average,
                feedbackStatus,
                imageFiles
            }

            this.props.saveFeedback({feedback});

        }
      }
    }

    componentWillReceiveProps(nextProps){
      if(nextProps.isfeedbacksaved && nextProps.isfeedbacksaved != this.props.isfeedbacksaved){
          this.setState({ description: '',imageFiles : [],average : 0,
          rating : {
            equipment : 0,
            facilities : 0,
            trainer : 0,
            vibe : 0,
            valueformoney : 0,
          }});
      }
    }


    onChange(key,value){
      let {opnratingdialog,imageFiles,newIdea} = this.state;
      if(key == "newIdea"){
        if(value == 5){
          opnratingdialog = true;
        }
        newIdea = value;

      }
      else if(key == "imageFiles")
      {
        let totalimage = imageFiles.length + value.length;
        if(totalimage <= 4)
         {
           value = imageFiles.concat(value);
         }
         else {
                  NotificationManager.error("Maximum 4 images can be uploaded");
                  return false;
              }
      }
      else if(key == "feedbackfor") {
        newIdea =  '3';
      }
      this.setState({
        [key] : value,
        'opnratingdialog' : opnratingdialog,
        newIdea : newIdea
      })
    }
    onChangeRating(key,value){

      this.setState({
        rating: {
          ...this.state.rating,
           [key] : value,
        }
       })
    }

    handleClose = () => {
		this.setState({ opnratingdialog: false });
   	};
    onSave = () => {
      let {rating,average} = this.state;
          if(rating.equipment != 0 && rating.facilities != 0 && rating.trainer != 0 && rating.valueformoney != 0 && rating.vibe != 0){
          average = (rating.equipment + rating .facilities + rating.trainer + rating.valueformoney + rating.vibe) / 5;
    		  this.setState({ opnratingdialog: false,average : average });
        }
        else{
          NotificationManager.error('All ratings are required.');
        }
   	};
    onClickviewRatings(){
      this.setState({ opnratingdialog: true});
    }
    onChangeImageToCompress(key,value)
    {
          this.setState({serviceImageCompressed : value[0],
                         imageHeightWidth : {width : 300 ,height : 300 , size : 0.3}
                       });
    }

    onChangeCompressedImage(compressedimage)
       {
            if(compressedimage)
            {
              this.onChange('imageFiles',[compressedimage]);
            }
              this.setState({serviceImageCompressed : null});
       }

       onRemoveImage(key,data)
         {
             let imageFiles = this.state.imageFiles;
               imageFiles.splice( imageFiles.indexOf(data), 1 );

               this.setState({
                       [key] : imageFiles
               });
         }

         validate()
         	{
         		let errors = {};

            const {feedbackfor,newIdea,rating,description,average} = this.state;

         		errors.description = required(description);

            if(feedbackfor == 2 && newIdea == 5 && average == 0)
            {
                NotificationManager.error('All ratings are required.');
                errors.rating = 'All ratings are required.';
            }

         		let validated = checkError(errors);

         		this.setState({
         				errors : errors, validated : validated
         		});

         		return validated;
         		}


    render() {
      const { newIdea, description,feedbackfor,rating ,opnratingdialog,average,feedbackStatus,
        imageFiles,serviceImageCompressed,imageHeightWidth,errors} = this.state;
        let {disabled,dialogLoading,clientProfileDetail} = this.props;
      const files = imageFiles;
      let  dropzoneRef;

        return (
          <div>
          {dialogLoading &&
            <RctSectionLoader />
          }
            <div className="row">
                <div className="col-sm-12 col-md-10 col-lg-7">
                <div className="row">
                    <Col sm={12}>
                    <div  className= "row" >
                      <label className="professionaldetail_padding" > Feedback For </label>
                          <RadioGroup row aria-label="feedbackfor" id="feedbackfor" name="feedbackfor" value={feedbackfor}  onChange={(e) => this.onChange('feedbackfor',e.target.value)} >
                          {
                            Feedbackfor.filter(x => ((clientProfileDetail.serviceprovidedId == 1) || (clientProfileDetail.clienttypeId == 2)) ? x.value != 2 : x.value).map((feedbackfor, key) => ( <FormControlLabel value={feedbackfor.value} key= {'feedbackforOption' + key} control={<Radio />} label={feedbackfor.name} />))
                          }
                          </RadioGroup>
                  </div>
                    </Col>
                  </div>
                    <h2 className="heading mb-20">{feedbackfor == 1 ?  "We had love your feedback on how to improve our web app." : "We had love your feedback on how to improve our gym."} </h2>
                    <Form>

                    <div className="row">
                        <Col sm={12}>
                            <RadioGroup row aria-label="idea" id="idea" name="idea" value={newIdea}  onChange={(e) => this.onChange('newIdea',e.target.value)} >
                            {
                              Feedback.filter(x =>feedbackfor == 1 ?  x.value != 5 : x.value == 3 || x.value == 5).map((idea, key) => ( <FormControlLabel value={idea.value} key= {'ideaOption' + key} control={<Radio />} label={idea.name} />))
                            }
                            </RadioGroup>
                        </Col>
                      </div>


                      {feedbackfor == 2 && newIdea == 5 &&
                      <div className = "row">
                          <div className="col-sm-12 col-md-12 col-xl-3">
                          <span> Average Ratings </span>
                          </div>

                          <Tooltip  id="tooltip-top" disableFocusListener disableTouchListener  title={"Rating : " + average} placement="right-start">
                            <div className="col-sm-12 col-md-12 col-xl-4 "  onClick={() => this.onClickviewRatings()}>
                               <Rating
                                readonly
                                emptySymbol="fa fa-star-o fa-2x low"
                                fullSymbol="fa fa-star fa-2x low"
                                fractions={2}
                                initialRating={average}
                                />
                           </div>
                          </Tooltip>
                        </div>
                    }
                      { this.state.newIdea == 1 &&
                            <div className="row">
                                <Label for="description" sm={9}>What feature you want us to include for you?</Label>
                          </div>
                      }

                    { this.state.newIdea == 2 &&
                            <div className="row">
                                <Label for="description" sm={9}>What page/feature making you confuse?</Label>
                            </div>
                    }
                    { this.state.newIdea == 3 &&
                          <div className="row">
                              <Label for="description" sm={9}>{feedbackfor == 1 ? "Did you find any issue/bug in the page/feature" : "Did you find any issue in the gym"}</Label>
                          </div>
                    }
                      { this.state.newIdea == 4 &&
                        <div className="row">
                            <Label for="description" sm={9}>Any other suggestion you want to tell us?</Label>
                        </div>
                 }
                 { this.state.newIdea == 5 &&
                   <div className="row">
                       <Label for="description" sm={9}>Comment</Label>
                   </div>
            }

                 <div className="row">
                   <Col sm={9}>
                       <Input type="textarea" rows="3" maxLength="300" name="description" id="description" onChange={(e) => this.onChange('description',e.target.value)} value = {description}/>
                        { errors.description && <FormHelperText  error>{errors.description}</FormHelperText>}
                       <FormHelperText  error>{'Total characters : ' + description.length + ' (Max. 300 characters allowed)'}</FormHelperText>
                 </Col>
                 </div>


                 <div className="row mt-20">
                    <div className="col-12">
                        <div className = "row" style={{display: 'flex', justifyContent: 'center'}}>
                            <div className="col-sm-8 col-md-6 col-xl-6">
                              <a href="javascript:void(0)" className="bg-primary  text-center cart-link text-white py-2 mb-2 pl-4" onClick={(e) => { dropzoneRef && dropzoneRef.open() } }>
                                Click here to upload images
                              </a>
                             </div>
                         </div>

                      <Dropzone  onDrop={(imageFiles) =>this.onChangeImageToCompress('imageFiles',imageFiles)} accept="image/jpeg, image/png" multiple={true} ref={(node) => { dropzoneRef = node; }}>
                         {({getRootProps, getInputProps}) => (
                           <section >
                             <div
                               {...getRootProps({
                                 className: 'dropzone'
                               })}
                             >
                               <input {...getInputProps()} />
                               <div className = "row">

                  { files  && files.map((file, key) =>
                          (
                            <div className="col-xs-4 col-sm-3 col-md-3 col-xl-3 pt-3" key= {'pro-img' + key}>
                              <RctCard customClasses="d-flex  mb-0 flex-column justify-content-between overflow-hidden">
                                <div className="overlay-wrap overflow-hidden" >
                                  <div className="text-center p-4">

                                    <img src={file.preview}  alt="" type="file" name="imageFiles" className="w-100  img-fluid" />

                                   </div>
                                  <div className="overlay-content d-flex align-items-end">
                                  <a href="javascript:void(0)" className="bg-primary text-center w-100 cart-link text-white py-2" onClick={(e) => { this.onRemoveImage('imageFiles',file); e.preventDefault(); }}>
                                    Remove
                                  </a>
                                  </div>
                              </div>
                            </RctCard>
                          </div>
                          )
                        ) }

                    </div>
                  </div>
               </section>
            )}
          </Dropzone>
         </div>
        </div>

                      {serviceImageCompressed &&
                     <ImageCompressor imageforcompress = {serviceImageCompressed}
                                    onCompress ={(compressedimage) => this.onChangeCompressedImage(compressedimage)}
                                    imageHeightWidth = {imageHeightWidth}
                                    />
                                  }

                      <div className="row pt-15">
                        <Col sm={9}>
                            <Button variant="contained" disabled = {disabled} className="btn-primary text-white" onClick={() => this.addNewFeedback()}>Save</Button>
                        </Col>
                      </div>
                    </Form>
                </div>
            </div>

                    <Dialog fullWidth open={opnratingdialog} onClose={this.handleClose} aria-labelledby="form-dialog-title">
              					<DialogTitle id="form-dialog-title">Ratings</DialogTitle>
              					<DialogContent>
                                <div className = "row">
                                    <div className="col-sm-12 col-md-12 col-xl-4">
                                      <span> Equipment </span>
                                    </div>

                                    <Tooltip  id="tooltip-top" disableFocusListener disableTouchListener  title={"Rating : " + rating.equipment} placement="right-start">
                                      <div className="col-sm-12 col-md-12 col-xl-4">
                                        <Rating
                                          emptySymbol="fa fa-star-o fa-2x low"
                                          fullSymbol="fa fa-star fa-2x low"
                                          fractions={2}
                                          initialRating={rating.equipment}
                                          onClick= {(value) => this.onChangeRating('equipment',value)}
                                          />
                                      </div>
                                    </Tooltip>
                                  </div>
                                  <div className = "row">
                                      <div className="col-sm-12 col-md-12 col-xl-4">
                                        <span> Facilities </span>
                                      </div>

                                      <Tooltip  id="tooltip-top" disableFocusListener disableTouchListener  title={"Rating : " + rating.facilities} placement="right-start">
                                        <div className="col-sm-12 col-md-12 col-xl-4">
                                          <Rating
                                            emptySymbol="fa fa-star-o fa-2x low"
                                            fullSymbol="fa fa-star fa-2x low"
                                            fractions={2}
                                            initialRating={rating.facilities}
                                            onClick= {(value) => this.onChangeRating('facilities',value)}
                                            />
                                        </div>
                                      </Tooltip>
                                    </div>
                                    <div className = "row">
                                        <div className="col-sm-12 col-md-12 col-xl-4">
                                          <span> Trainer </span>
                                        </div>

                                        <Tooltip  id="tooltip-top" disableFocusListener disableTouchListener  title={"Rating : " + rating.trainer} placement="right-start">
                                          <div className="col-sm-12 col-md-12 col-xl-4">
                                            <Rating
                                              emptySymbol="fa fa-star-o fa-2x low"
                                              fullSymbol="fa fa-star fa-2x low"
                                              fractions={2}
                                              initialRating={rating.trainer}
                                              onClick= {(value) => this.onChangeRating('trainer',value)}
                                              />
                                          </div>
                                        </Tooltip>
                                      </div>
                                      <div className = "row">
                                          <div className="col-sm-12 col-md-12 col-xl-4">
                                            <span> Vibe </span>
                                          </div>

                                          <Tooltip  id="tooltip-top" disableFocusListener disableTouchListener  title={"Rating : " + rating.vibe} placement="right-start">
                                            <div className="col-sm-12 col-md-12 col-xl-4">
                                              <Rating
                                                emptySymbol="fa fa-star-o fa-2x low"
                                                fullSymbol="fa fa-star fa-2x low"
                                                fractions={2}
                                                initialRating={rating.vibe}
                                                onClick= {(value) => this.onChangeRating('vibe',value)}
                                                />
                                            </div>
                                          </Tooltip>
                                        </div>
                                        <div className = "row">
                                            <div className="col-sm-12 col-md-12 col-xl-4">
                                              <span> Value-for-money </span>
                                            </div>

                                            <Tooltip  id="tooltip-top" disableFocusListener disableTouchListener  title={"Rating : " + rating.valueformoney} placement="right-start">
                                              <div className="col-sm-12 col-md-12 col-xl-4">
                                                <Rating
                                                  emptySymbol="fa fa-star-o fa-2x low"
                                                  fullSymbol="fa fa-star fa-2x low"
                                                  fractions={2}
                                                  initialRating={rating.valueformoney}
                                                  onClick= {(value) => this.onChangeRating('valueformoney',value)}
                                                  />
                                              </div>
                                            </Tooltip>
                                          </div>


              					</DialogContent>
              					<DialogActions>
              						<Button variant="contained" onClick={this.handleClose} color="primary" className="text-white">
              							Cancel
                          		</Button>
              						<Button variant="contained" onClick={this.onSave} className="btn-info text-white">
              							Save
                          		</Button>
              					</DialogActions>
        				</Dialog>
        </div>
        );
    }
}

// map state to props
const mapStateToProps = ({ feedback, settings}) => {
  const { disabled,dialogLoading,isfeedbacksaved} =  feedback;
  const {clientProfileDetail} = settings;
  return { disabled,dialogLoading,clientProfileDetail,isfeedbacksaved}
}

export default connect(mapStateToProps, {
    addNewFeedback,
    showFeedbackLoadingIndicator,
    saveFeedback,
})(AddNewFeedback);
