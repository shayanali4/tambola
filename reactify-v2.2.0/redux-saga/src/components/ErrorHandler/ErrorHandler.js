import React, { Component, Fragment } from 'react';
import { push } from 'connected-react-router';
import { connect } from 'react-redux';
import DeleteConfirmationDialog from 'Components/DeleteConfirmationDialog/DeleteConfirmationDialog';
import Auth from '../../Auth/Auth';
import api from 'Api';
import AppConfig from 'Constants/AppConfig';

const auth = new Auth();

class ErrorHandler extends React.Component {
  constructor(props) {
    super(props)
    this.state = { errorOccurred: false }
  }

  componentDidCatch(error, info) {
    this.setState({ errorOccurred: true });
    error = error.message.replaceAll("'",'');
        api.post('error-logs',{error, info})
       .then(response =>
         {
         }).catch(error => console.log(error) )
  }

  onConfirm(){
    window.location.reload();
  }

  render() {
    return this.state.errorOccurred ?
    <div className = "text-center">
          <div className = " fw-bold m-20" style = {{fontSize : "30px"}}>

          </div>
        <div className = " fs-20 mb-5">
            Opps..!! Something went wrong!!
        </div>
        <div className = " fs-20 mb-5">
            Just hold on and thanks for your patience! Problem will be fixed soon!
        </div>
        <div className = "fs-20 mb-5">
            Please <a href="#" style = {{fontSize : "25px",textDecoration : "underline"}} onClick={(e) =>{e.preventDefault();this.onConfirm()}} > click here  </a>, to get refresh!
        </div>
        <div className = "fs-20">
          Please try again it may fix this error.
        </div>
    </div>
       : this.props.children
  }
}

const mapStateToProps = ({ }) => {
  return { }
}

export default connect(mapStateToProps,{push})(ErrorHandler);
