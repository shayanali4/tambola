import React, { Component } from 'react';

import Form from 'reactstrap/lib/Form';import FormGroup from 'reactstrap/lib/FormGroup';
import Button from '@material-ui/core/Button';
import { Link } from 'react-router-dom';

import signupUrlInFirebase from 'Actions';

import RctCollapsibleCard from 'Components/RctCollapsibleCard/RctCollapsibleCard';

import TextField from '@material-ui/core/TextField';
import FormHelperText from '@material-ui/core/FormHelperText';
import {getClientURL} from 'Helpers/helpers';

  export default class Customurl extends React.Component {



    handleOnChange = (e, key) => {
    this.props.onChange(key,e.target.value);
    }


    onUrlCreation(){
    					const {url} = this.state;
    					if(url!==''){

    						this.props.signupUrlInFirebase({url}, this.props.history);
    					}

    }

	render() {
    const {fields, errors , clienttype} = this.props;

		return (
<RctCollapsibleCard>

      <div className="row">
      <div className="w-50 ">
      <TextField id="user-url" error={errors.url && errors.url !="" ? true : false} autoFocus={true} inputProps={{maxLength: 50 }} fullWidth label="Your URL" value={fields.url} onChange={(e) => this.handleOnChange(e, 'url')} onBlur = {(e) => this.handleOnChange(e, 'url')} />
      <FormHelperText  error>{errors.url}</FormHelperText>
      </div>

        <div className="w-50 text-left">
        <div  className="mt-4">
              <span > {'.' + getClientURL(clienttype)} </span>
         </div>
   </div>
      </div>
    </  RctCollapsibleCard>
		);
	}
}



/*  <FormGroup>
		<Button component={Link} to="/"  variant="contained" className="btn-info text-white btn-block btn-large">SignUp</Button>
	</FormGroup>
*/
