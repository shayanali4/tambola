/**
 * Feedback Details
 */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import Button from '@material-ui/core/Button';
import Form from 'reactstrap/lib/Form';import FormGroup from 'reactstrap/lib/FormGroup';import Input from 'reactstrap/lib/Input';
import Avatar from '@material-ui/core/Avatar';

// actions
import { showFeedbackLoadingIndicator, navigateToBack, onCommentAction } from 'Actions';

// rct card box
import RctCollapsibleCard from 'Components/RctCollapsibleCard/RctCollapsibleCard';

// rct section loader
import RctSectionLoader from 'Components/RctSectionLoader/RctSectionLoader';
import {getFormtedDateTime} from 'Helpers/helpers';
import PerfectScrollbar from 'Components/PerfectScrollbar';
import Dialog from '@material-ui/core/Dialog';
import {isMobile} from 'react-device-detect';
import DialogContent from '@material-ui/core/DialogContent';
import CloseIcon from '@material-ui/icons/Close';
import DialogTitle from '@material-ui/core/DialogTitle';
import FormHelperText from '@material-ui/core/FormHelperText';

class FeedbackDetails extends Component {

  state = {
    comment: '',
    data : this.props.viewFeedback && this.props.viewFeedback.comments ? this.props.viewFeedback.comments : [],
    commentdata : {}
  }

  /**
   * Navigate To Back
   */
  navigateToBack() {
    this.props.navigateToBack();
  }

  /**
   * On Comment
   */
  onComment() {
    let { comment,data ,commentdata} = this.state;
    let { userProfileDetail } = this.props;
    if (comment !== '') {
      commentdata = {
        date:new Date(),
        comment,
        id : userProfileDetail.id,
        name : userProfileDetail.firstname +' ' + userProfileDetail.lastname,
        feedbackid : this.props.viewFeedback.id
      }
      // data.push(commentdata);
      // let feedbackid = this.props.viewFeedback.id;
      this.props.onCommentAction({commentdata});
      this.setState({ comment: '',commentdata : commentdata });
    }
  }

  componentWillReceiveProps(newProps){
    let { commentdata,data} = this.state;
    if(newProps.iscommentsave == true && newProps.iscommentsave != this.props.iscommentsave){
      data.unshift(commentdata);
      this.setState({ data : data,commentdata : {} , comment : ''});
    }
  }



  render() {
    const { viewFeedback, loading,viewCommentDialog } = this.props;
    let {data,comment} = this.state;

    if(viewFeedback && this.state.data != null && this.state.data.length == 0 )
    {
       data = viewFeedback.comments ? viewFeedback.comments :[];
    }
    return (
      <Dialog fullWidth  fullScreen = {isMobile ? true : false}
          onClose={() => this.onClose()}
          open={viewCommentDialog}
					fullWidth = {true} maxWidth = 'md'
        >
        <DialogTitle >
            <span className="fw-bold text-capitalize">All Feedbacks</span>
            <CloseIcon  onClick={() => this.navigateToBack()} className = {"pull-right pointer"}/>
        </DialogTitle>

             <DialogContent>

              <div className="row">
                <div className="col-12">

                    <div className={"row" + (isMobile ? '' : ' ml-30')}>
                      <div className="mb-20 col-12">
                        <h2 className ="fw-bold">{viewFeedback.idea}</h2>
                        <p >{viewFeedback.description}</p>
                      </div>
                      <div className="col-12">
                        {data && data.length > 0 ?
                          <h2 className="heading">Comment ({data.length})</h2>
                          : <h2 className="heading">No Comments Found</h2>
                        }
                      </div>
                      <div className="col-12">
                        <PerfectScrollbar style={{ height: '300px' }}>
                          <ul className={"list-unstyled comment-sec "}>
                            {data && data.length > 0 && data.map((comment, key) => (
                              <li  key={key}>
                                <div className = "row mx-5" >
                                    <div className = "col-12 col-sm-12 col-md-3 col-xl-4 d-inline" >
                                      <p className = "mb-0">{comment.name }</p>
                                      <p >{getFormtedDateTime(comment.date)}</p>
                                    </div>
                                    <div className="media-body pl-10">
                                      <p className="comment-box">{unescape(comment.comment)}</p>
                                    </div>
                                </div>

                              </li>
                            ))}
                          </ul>
                        </PerfectScrollbar>
                      </div>

                        <div className="col-11 mt-20 ml-20">
                          <Input type="textarea" rows="7" name="text" maxLength="500" id="Text" value = {comment} placeholder="Type Your comment..." onChange={(e) => this.setState({ comment: e.target.value })} />
                          <FormHelperText  error>{'Total characters : ' + comment.length + ' (Max. 500 characters allowed)'}</FormHelperText>
                        </div>

                        <div className="col-4 col-sm-4 col-md-2 col-xl-2 ml-20 mt-20">
                          <Button variant="contained" className="btn-primary text-white btn-lg" onClick={() => this.onComment()}>Comment</Button>
                        </div>

                   </div>

              </div>
            </div>
            {loading &&
              <RctSectionLoader />
            }
          </DialogContent>
        </Dialog>
    );
  }
}

// map state to props
const mapStateToProps = ({ feedback,settings }) => {
  const {viewFeedback, loading,iscommentsave,viewCommentDialog } = feedback;
  const { userProfileDetail} = settings;
  return {viewFeedback, loading , userProfileDetail,iscommentsave,viewCommentDialog};
}

export default connect(mapStateToProps, {
  showFeedbackLoadingIndicator,
  navigateToBack,
  onCommentAction
})(FeedbackDetails);
