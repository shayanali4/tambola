/**
 * Feedback List Item
 */
import React, { Component } from 'react';
import IconButton from '@material-ui/core/IconButton';
import classnames from 'classnames';

import Input from 'reactstrap/lib/Input';
import Button from 'reactstrap/lib/Button';
import InputGroupText from 'reactstrap/lib/InputGroupText';
import InputGroup from 'reactstrap/lib/InputGroup';
import InputGroupAddon from 'reactstrap/lib/InputGroupAddon';
import { connect } from 'react-redux';
import { onCommentAction ,viewCommentsDetails,saveFeedbackStatus} from 'Actions';
import Rating from "react-rating";
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import FeedbackStatus  from 'Assets/data/feedbackstatus';
import Col from 'reactstrap/lib/Col';
import FormGroup from 'reactstrap/lib/FormGroup';
import {isMobile} from 'react-device-detect';
import { NotificationManager } from 'react-notifications';
import {checkError,getFormtedDateTime} from 'Helpers/helpers';
import {required} from 'Validations';
import FormHelperText from '@material-ui/core/FormHelperText';
import CustomConfig from 'Constants/custom-config';
import { RctCard } from 'Components/RctCard';
import CloseIcon from '@material-ui/icons/Close';
import TextField from '@material-ui/core/TextField';

class FeedbackListItem extends Component {
  state = {
      comment: '',
      opnratingdialog : false,
      ratingsdata : null,
      feedbackStatus : this.props.data.feedbackstatusId || '1',
      errors : { },
      validated : false,
      opnimagedialog : false,
      imagedata : null,
      imgsrc :null,
  }

  onReplySend() {
    let { comment,feedbackStatus } = this.state;
    let { userProfileDetail } = this.props;
     if(this.validate()){
          let data = this.props.data.comments;
          if (comment !== '') {
            let commentdata = {
              date:new Date(),
              comment,
              id : userProfileDetail.id,
              // name : userProfileDetail.firstname +' ' + userProfileDetail.lastname,
               feedbackid : this.props.data.id

            }
            // data = data ? data : [];
            // data.push(commentdata);
            // let feedbackid = this.props.data.id;
            if(feedbackStatus == "2" || feedbackStatus == "4"){
              let {data} = this.props;
              let requestdata = {};
              requestdata.id = data.id;
              requestdata.status = feedbackStatus;
                  if(feedbackStatus != data.feedbackstatusId){
                  this.props.saveFeedbackStatus(requestdata);
                }
            }
            this.props.onCommentAction({commentdata});
            this.setState({ comment: ''});
          }
        }
  }
  onClickviewCommentsDetails(id){
    this.props.viewCommentsDetails({id : id})
  }
  onClickviewRatings(data){
    this.setState({ opnratingdialog: true,ratingsdata :data });
  }
  onClickimagedialog(data){
    this.setState({ opnimagedialog: true,imagedata :data });
  }

  onCloseimagedialog = () => {
  this.setState({ opnimagedialog: false,imagedata :null });
  };
  onChange(value){
    if(this.state.feedbackStatus != value){
      this.setState({ feedbackStatus: value });
      let errors = {};

        if( value == "2" || value == "4"){
          let data = this.state;
          this.props.onReply();
          NotificationManager.error('Please enter comment');
          errors.comment = required(data.comment);
          let validated = checkError(errors);
          this.setState({
                  errors : errors, validated : validated
          });
        }
        else{
          let {data} = this.props;
          let requestdata = {};
          requestdata.id = data.id;
          requestdata.status = value;
              if(value != data.feedbackstatusId){
              this.props.saveFeedbackStatus(requestdata);
            }
       }
     }

  }

  handleClose = () => {
  this.setState({ opnratingdialog: false,ratingsdata :null });
  };


  validate()
  	{
  		let errors = {};

  			const data = this.state;
  			errors.comment = required(data.comment);

  			let validated = checkError(errors);

  			this.setState({
  							errors : errors, validated : validated
  			});

  			 return validated;
  		}
      onPhotoClick(image)
      {
           let {imgsrc} = this.state;
           imgsrc = image;
           this.setState({ imgsrc:imgsrc});
      }
      onPhotoDialogClose = () => {
           this.setState({ imgsrc: null});
        };


  render() {
    const { data, viewFeedbackDetails, onReply,isGeneral,clientProfileDetail,tableInfo,updateRights} = this.props;
    const { opnratingdialog, ratingsdata,feedbackStatus,errors ,opnimagedialog,imagedata,imgsrc} = this.state;
      return (
    <div>
              <li className="d-flex justify-content-between">
                  <div className="media">

                      <img src={data.genderId == '2' ? require('Assets/img/female-profile.png') : require('Assets/img/male-profile.png')}
                      alt="feedback user" className="rounded-circle mr-20" width="60" height="60"
                      onError={(e)=>{ e.target.src = require('Assets/img/female-profile.png') }}/>

                      <div className="media-body" style = {{width : isMobile ? '300px' : '500px'}}>
                      <div className="row">
                          <div className="col-10 col-md-12 col-xl-8">
                              <p className="mb-5 text-base"><a href="javascript:void(0)">{data.name} { data.isstaff == '1' ? " (Staff)" : " (Member)"}</a> given feedback on the <span className="text-primary">{data.idea}</span></p>
                              {clientProfileDetail  && clientProfileDetail.id == 1 && tableInfo.clientid == 1 && <p className="mb-5 text-base"><span className="text-primary">Client name - {unescape(data.clientname)}</span></p>}
                              <span className="fs-12 text-muted fw-bold">{getFormtedDateTime(data.createdbydate)}</span>
                          </div>
                          {updateRights && isGeneral && data.ideaId != 5 ?
                              <div className="col-6 col-md-6 col-xl-4">
                                    <FormGroup className="has-wrapper">
                                    <FormControl fullWidth>
                                         <InputLabel className="professionaldetail_padding pl-10" >Feedback Status</InputLabel>
                                              <Select  value={feedbackStatus} onChange={(e) => this.onChange( e.target.value)}
                                                inputProps={{name: 'feedbackStatus', id: 'feedbackStatus', }}>

                                                {
                                                  FeedbackStatus.map((feedbackStatus, key) => ( <MenuItem value={feedbackStatus.value} key = {'feedbackStatusOption' + key }>{feedbackStatus.name}</MenuItem> ))
                                                }
                                              </Select>
                                    </FormControl>
                                   </FormGroup>
                            </div>
                            :
                            (updateRights && data.ideaId != 5 && <div className="col-6 col-md-6 col-xl-4">
                              <TextField inputProps={{maxLength:100}} disabled={true} fullWidth label="Feedback Status"  value={data.feedbackstatus} />
                            </div>)
                        }
                            </div>

                          {data.ideaId == 5 &&
                            <div className = "row">
                                <div className="col-sm-12 col-md-12 col-xl-4">
                                <span> Average Ratings </span>
                                </div>

                                <div className="col-sm-12 col-md-12 col-xl-8 d-flex" onClick={() => this.onClickviewRatings(data)}>
                                  <Rating
                                    readonly
                                    emptySymbol="fa fa-star-o fa-2x low"
                                    fullSymbol="fa fa-star fa-2x low"
                                    fractions={2}
                                    initialRating={data.averagerating}
                                    />
                                  <span className = "fs-16 fw-semi-bold pl-5 pt-5"> {"(" + (data.averagerating ? parseFloat(data.averagerating).toFixed(1) : 0)  + ")"} </span>
                                </div>
                              </div>
                        }
                          <div className="feed-content mb-10">
                              <a href="javascript:void(0)" onClick={() => this.onClickviewCommentsDetails(data.id)}>{data.description}</a>
                          </div>
                         <div className="social-action">
                              <a href="javascript:void(0)" onClick={onReply}><i className="zmdi zmdi-mail-reply"></i></a>
                          <IconButton aria-label="eye" onClick={() => this.onClickviewCommentsDetails(data.id)}>
                              <i className="ti-eye"></i>
                          </IconButton>
                          {data.images && data.images.length > 0 &&
                          <IconButton aria-label="eye" onClick={() => this.onClickimagedialog(data.images)}>
                              <i className="ti-pin-alt"></i>
                          </IconButton>
                        }
                          </div>
                          {data.replyBox &&
                            <div className="mb-20">
                              <InputGroup >
                                  <Input placeholder="Comment..." onChange={(e) => this.setState({ comment: e.target.value })} />
                                  <InputGroupAddon addonType="append"><Button color="primary" onClick={() => this.onReplySend()}>Send</Button></InputGroupAddon>
                              </InputGroup>
                              <FormHelperText  error>{errors.comment}</FormHelperText>
                                </div>
                            }
                      </div>
                  </div>
               <div className="list-action d-flex">

                  </div>
              </li>
              {opnratingdialog && ratingsdata != null &&

              <Dialog fullWidth open={opnratingdialog} onClose={this.handleClose} aria-labelledby="form-dialog-title">
                  <DialogTitle id="form-dialog-title">Ratings</DialogTitle>
                  <DialogContent>
                          <div className = "row pt-5">
                              <div className="col-sm-12 col-md-4 col-xl-4">
                                <span> Equipment </span>
                              </div>

                              <div className="col-sm-12 col-md-6 col-xl-6 d-flex">
                                 <Rating
                                  readonly
                                  emptySymbol="fa fa-star-o fa-2x low"
                                  fullSymbol="fa fa-star fa-2x low"
                                  fractions={2}
                                  initialRating={ratingsdata.equipmentrating}
                                  />
                                 <span className = "fs-16 fw-semi-bold pl-5 pt-5"> {"(" + (ratingsdata.equipmentrating ? parseFloat(ratingsdata.equipmentrating).toFixed(1) : 0) + ")"} </span>
                              </div>
                            </div>
                            <div className = "row pt-5">
                                <div className="col-sm-12 col-md-4 col-xl-4">
                                  <span> Facilities </span>
                                </div>

                                <div className="col-sm-12 col-md-6 col-xl-6 d-flex">
                                  <Rating
                                    readonly
                                    emptySymbol="fa fa-star-o fa-2x low"
                                    fullSymbol="fa fa-star fa-2x low"
                                    fractions={2}
                                    initialRating={ratingsdata.facilitiesrating}
                                    />
                                    <span className = "fs-16 fw-semi-bold pl-5 pt-5"> {"(" + (ratingsdata.facilitiesrating ? parseFloat(ratingsdata.facilitiesrating).toFixed(1) : 0) + ")"} </span>
                                </div>
                              </div>
                              <div className = "row pt-5">
                                  <div className="col-sm-12 col-md-4 col-xl-4">
                                    <span> Trainer </span>
                                  </div>

                                  <div className="col-sm-12 col-md-6 col-xl-6 d-flex">
                                    <Rating
                                      readonly
                                      emptySymbol="fa fa-star-o fa-2x low"
                                      fullSymbol="fa fa-star fa-2x low"
                                      fractions={2}
                                      initialRating={ratingsdata.trainerrating}
                                      />
                                     <span className = "fs-16 fw-semi-bold pl-5 pt-5"> {"(" + (ratingsdata.trainerrating ? parseFloat(ratingsdata.trainerrating).toFixed(1) : 0) + ")"} </span>
                                  </div>
                                </div>
                                <div className = "row pt-5">
                                    <div className="col-sm-12 col-md-4 col-xl-4">
                                      <span> Vibe </span>
                                    </div>

                                    <div className="col-sm-12 col-md-6 col-xl-6 d-flex">
                                      <Rating
                                        readonly
                                        emptySymbol="fa fa-star-o fa-2x low"
                                        fullSymbol="fa fa-star fa-2x low"
                                        fractions={2}
                                        initialRating={ratingsdata.viberating}
                                        />
                                        <span className = "fs-16 fw-semi-bold pl-5 pt-5"> {"(" + (ratingsdata.viberating ? parseFloat(ratingsdata.viberating).toFixed(1) : 0) + ")"} </span>
                                    </div>
                                  </div>
                                  <div className = "row pt-5">
                                      <div className="col-sm-12 col-md-4 col-xl-4">
                                        <span> Value-for-money </span>
                                      </div>

                                      <div className="col-sm-12 col-md-6 col-xl-6 d-flex ">
                                        <Rating
                                          readonly
                                          emptySymbol="fa fa-star-o fa-2x low"
                                          fullSymbol="fa fa-star fa-2x low"
                                          fractions={2}
                                          initialRating={ratingsdata.valueformoneyrating}
                                          />
                                          <span className = "fs-16 fw-semi-bold pl-5 pt-5"> {"(" + (ratingsdata.valueformoneyrating ? parseFloat(ratingsdata.valueformoneyrating).toFixed(1) : 0) + ")"} </span>
                                      </div>
                                    </div>


                  </DialogContent>
                  <DialogActions>
                    <Button variant="contained" onClick={this.handleClose} color="primary" className="text-white">
                      Cancel
                        </Button>

                  </DialogActions>
          </Dialog>
        }
        {opnimagedialog && imagedata != null &&

        <Dialog fullWidth open={opnimagedialog} onClose={this.onCloseimagedialog} aria-labelledby="form-dialog-title">
            <DialogTitle id="form-dialog-title">Attachment</DialogTitle>
            <DialogContent>
            <div className = "row">

              {imagedata  && imagedata.map((file, key) =>

                 (
                   <div className="col-6 col-sm-4 col-md-3 col-xl-3" key= {'exist-img' + key} onClick={() => this.onPhotoClick(file)}>
                     <RctCard customClasses="d-flex  mb-0 flex-column justify-content-between overflow-hidden">
                       <div className="overlay-wrap overflow-hidden" >
                         <div className="text-center p-4">

                           <img src={CustomConfig.serverUrl + file}  alt="" type="file" name="imageFiles" className="w-100  img-fluid" />

                          </div>
                         <div className="overlay-content d-flex align-items-end">
                         </div>
                     </div>
                   </RctCard>
                 </div>
                 )
               ) }


            </div>
            </DialogContent>
            <DialogActions>
              <Button variant="contained" onClick={this.onCloseimagedialog} color="primary" className="text-white">
                Cancel
                  </Button>

            </DialogActions>
    </Dialog>
  }
      { imgsrc &&

        <Dialog open={true} fullScreen ={isMobile  ? true : false} fullWidth  onClose={this.onPhotoDialogClose} aria-labelledby="form-dialog-title">
        <DialogTitle >
                <CloseIcon onClick={this.onPhotoDialogClose} className = {"pull-right pointer"}/>
        </DialogTitle>
        <DialogContent>

        <div className="row" >
        <div className="col-12">
        <img src={ CustomConfig.serverUrl  + imgsrc}  className = "w-100" style = {{height:"auto"}}/>
         </div>
        </div>

        </DialogContent>
            </Dialog>

          }
          </div>
  );
  }
  }
  const mapStateToProps = ({feedback,settings}) => {
    const {tableInfo} =  feedback;
    const { userProfileDetail,clientProfileDetail} = settings;
    return {userProfileDetail,clientProfileDetail,tableInfo};
  }

  export default connect(mapStateToProps, {onCommentAction,viewCommentsDetails,saveFeedbackStatus})(FeedbackListItem);
