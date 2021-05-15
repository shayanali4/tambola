
/**
 * Profile Page
 */
import React, { Component } from 'react';

import Form from 'reactstrap/lib/Form';
import FormGroup from 'reactstrap/lib/FormGroup';
import Col from 'reactstrap/lib/Col';
import {cloneDeep } from 'Helpers/helpers';

import TextField  from '@material-ui/core/TextField';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';

import { saveClientSocialMedia } from 'Actions';
import DeleteConfirmationDialog from 'Components/DeleteConfirmationDialog/DeleteConfirmationDialog';

import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import {isMobile} from 'react-device-detect';
import { push } from 'connected-react-router';
import { NotificationManager } from 'react-notifications';

class Socialmedia extends Component {

  constructor(props) {
     super(props);
   this.state = this.getInitialState();
}
   getInitialState()
    {
    this.initialState = {
                      configuration: {
                                  facebook :
                                  {
                                    url : 'https://www.facebook.com/',
                                    id :  ''
                                  },
                                  instagram :
                                  {
                                    url : 'https://www.instagram.com/',
                                    id :  ''
                                  },
                                  youtube :
                                  {
                                    url : 'https://www.youtube.com/channel/',
                                    id :  ''
                                  },
                                  whatsapp :
                                  {
                                    url : 'https://wa.me/',
                                    id :  ''
                                  }
                              },
                          confirmationDialog : false,
                       };
               return cloneDeep(this.initialState);
    }

    componentWillMount()
    {
      let {facebook,instagram,youtube,whatsapp} = this.state.configuration;
      const {viewRights, clientProfileDetail} =  this.props;
      if(viewRights){
      facebook.id = clientProfileDetail.socialmedia ? clientProfileDetail.socialmedia.facebook.id  : '';
      instagram.id = clientProfileDetail.socialmedia ? clientProfileDetail.socialmedia.instagram.id  : '';
      youtube.id = clientProfileDetail.socialmedia && clientProfileDetail.socialmedia.youtube ? clientProfileDetail.socialmedia.youtube.id  : '';
      whatsapp.id = clientProfileDetail.socialmedia && clientProfileDetail.socialmedia.whatsapp ? clientProfileDetail.socialmedia.whatsapp.id  : '';
      this.state.socialmedia_old = cloneDeep({facebook,instagram,youtube,whatsapp});
    }
    else{
      this.props.push('/app/dashboard/master-dashboard');

    }
  }

  componentWillReceiveProps(newProps)
  {
    if(newProps.clientProfileDetail != this.props.clientProfileDetail)
    {
      let {facebook,instagram,youtube,whatsapp} = this.state.configuration;
      const {viewRights} =  this.props;
      if(viewRights){
      let socialmediadetail = newProps.clientProfileDetail;
      facebook.id = socialmediadetail.socialmedia ? socialmediadetail.socialmedia.facebook.id  : '';
      instagram.id = socialmediadetail.socialmedia ? socialmediadetail.socialmedia.instagram.id  : '';
      youtube.id = socialmediadetail.socialmedia && socialmediadetail.socialmedia.youtube ? socialmediadetail.socialmedia.youtube.id  : '';
      whatsapp.id = socialmediadetail.socialmedia && socialmediadetail.socialmedia.whatsapp ? socialmediadetail.socialmedia.whatsapp.id  : '';
        this.state.socialmedia_old = cloneDeep({facebook,instagram,youtube,whatsapp});
      }
  }
}

    onChange(key,value)
     {
       if(key == 'facebook')
       {

        value = value.replace("https://www.facebook.com/", "")

         this.setState({
           configuration: {
             ...this.state.configuration,
                facebook : {
                  ...this.state.configuration.facebook,
                     id : value
                }
             }
         });
       }
       else if (key == 'instagram') {

         value = value.replace("https://www.instagram.com/", "")

         this.setState({
           configuration: {
             ...this.state.configuration,
                instagram : {
                  ...this.state.configuration.instagram,
                     id : value
                }
             }
         });
       }
       else if (key == 'youtube') {

         value = value.replace("https://www.youtube.com/channel/", "")

         this.setState({
           configuration: {
             ...this.state.configuration,
                youtube : {
                  ...this.state.configuration.youtube,
                     id : value
                }
             }
         });
       }
       else if (key == 'whatsapp') {

         value = value.replace("https://wa.me/", "")

         this.setState({
           configuration: {
             ...this.state.configuration,
                whatsapp : {
                  ...this.state.configuration.whatsapp,
                     id : value
                }
             }
         });
       }
     }

     onConfirm()
     {
       let {configuration} = this.state;
         this.props.saveClientSocialMedia({configuration});
           this.setState({
             confirmationDialog : false,
           });
     }

     cancelConfirmation()
     {
       this.setState({
        confirmationDialog : false,
      });
     }
     onSave()
     {
       let {configuration ,socialmedia_old} = this.state;

       if((JSON.stringify(socialmedia_old) != JSON.stringify(configuration)))
       {
         this.setState({ confirmationDialog : true });
       }
       else {
         NotificationManager.error('No changes detected');
       }
     }

  render() {
    let {facebook,instagram,youtube,whatsapp} = this.state.configuration;
    let {confirmationDialog} = this.state;
    const {updateRights,addRights,clientProfileDetail} = this.props;

    return (
      <div className="configuration-wrapper ">
      <div className="row ">
          <div className = "col-12">
            <p>{clientProfileDetail && clientProfileDetail.packtypeId == 3 ? 'Your social media links are shown in-app to your members.' : 'Your social media links are shown in-app.'}</p>
          </div>
          <div className = "col-sm-12 col-md-5 col-xl-3">
             <span className = {!isMobile ? "fs-14" : ''}>
                   <a href = {facebook.id ? facebook.url + facebook.id : "javascript:void(0)"} target = "_blank">
                     <img src={require('Assets/img/facebook.png') } className="size-30"  />
                   </a>
                {facebook.url  + " + "}
            </span>
          </div>
            <div className = "col-12 col-md-6">
                         <TextField inputProps={{maxLength:100}} autoFocus = {true}  placeholder="Facebook Id"   value={facebook.id}  onChange={(e) =>this.onChange( 'facebook' ,e.target.value)} />
            </div>
            <div className="col-12 mb-10">
         {facebook.id &&
                    <a href = {  facebook.url + facebook.id } target = "_blank">
                     {facebook.url + facebook.id}
                    </a>

         }
         </div>
         <div className="col-sm-12 col-md-5 col-xl-3">

            <span className = {!isMobile ? "fs-14" : ''}>
                  <a href = {instagram.id ? instagram.url + instagram.id : "javascript:void(0)"} target = "_blank">
                      <img src={require('Assets/img/instagram.png') } className="size-30"  />
                  </a>
               {instagram.url  + " + "}
               </span>
          </div>
               <div className = "col-12 col-md-6">
                <TextField inputProps={{maxLength:100}} placeholder="Instagram Id"  value={instagram.id}  onChange={(e) =>this.onChange( 'instagram' ,e.target.value)}/>
                </div>

            <div className="col-12 mb-10">
          {instagram.id &&
                     <a href = {  instagram.url + instagram.id } target = "_blank">
                      {instagram.url + instagram.id}
                     </a>
          }
          </div>


          <div className="col-sm-12 col-md-5 col-xl-3">

             <span className = {!isMobile ? "fs-14" : ''}>
                   <a href = {youtube.id ? youtube.url + youtube.id : "javascript:void(0)"} target = "_blank">
                       <img src={require('Assets/img/youtube.png') } className="size-30"  />
                   </a>
                {youtube.url  + " + "}
                </span>
           </div>
                <div className = "col-12 col-md-6">
                 <TextField inputProps={{maxLength:100}} placeholder="Youtube Channel Id"  value={youtube.id}  onChange={(e) =>this.onChange( 'youtube' ,e.target.value)}/>
                 </div>

             <div className="col-12 mb-10">
           {youtube.id &&
                      <a href = {  youtube.url + youtube.id } target = "_blank">
                       {youtube.url + youtube.id}
                      </a>
           }
           </div>


           <div className="col-sm-12 col-md-5 col-xl-3">

              <span className = {!isMobile ? "fs-14" : ''}>
                    <a href = {whatsapp.id ? whatsapp.url + whatsapp.id : "javascript:void(0)"} target = "_blank">
                        <img src={require('Assets/img/whatsapp.png') } className="size-30"  />
                    </a>
                 {whatsapp.url  + " + "}
                 </span>
            </div>
                 <div className = "col-12 col-md-6">
                  <TextField inputProps={{maxLength:100}} placeholder="Country Code + Mobile Number + ?text=Hi I am interested to join"  value={whatsapp.id}  onChange={(e) =>this.onChange( 'whatsapp' ,e.target.value)}/>
                  </div>

              <div className="col-12 mb-10">
            {whatsapp.id &&
                       <a href = {  whatsapp.url + whatsapp.id } target = "_blank">
                        {whatsapp.url + whatsapp.id}
                       </a>
            }
            </div>


        <hr />
        {(updateRights && addRights) &&
          <div className="col-10 col-sm-6 col-md-3 ml-20">

               <Button variant="contained"  color="primary"  className="text-white" onClick={()=>this.onSave()}>
                  Save
                </Button>
          </div>
    }

      {
         confirmationDialog &&
       <DeleteConfirmationDialog
         openProps = {confirmationDialog}
         title="Are You Sure Want To Continue?"
         message="This will update your details ."
         onConfirm={() => this.onConfirm()}
          onCancel={() => this.cancelConfirmation()}
       />
       }
       </div>
  </div>
    );
  }
}

const mapStateToProps = ({ settings }) => {
  const { clientProfileDetail } = settings;
  return {  clientProfileDetail };
};

export default withRouter(connect(mapStateToProps, {saveClientSocialMedia,push})(Socialmedia));
