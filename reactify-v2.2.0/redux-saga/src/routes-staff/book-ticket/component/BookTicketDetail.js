import React, { Fragment, PureComponent,Component } from 'react';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import TextField from '@material-ui/core/TextField';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import DatePicker from 'Routes/advance-ui-components/dateTime-picker/components/DateTime';
import tambola from 'Components/Tambola';
import Form from 'reactstrap/lib/Form';import FormGroup from 'reactstrap/lib/FormGroup';

import  Status from 'Assets/data/status';

import { RctCard } from 'Components/RctCard';
import CustomConfig from 'Constants/custom-config';
import Tooltip from '@material-ui/core/Tooltip';

export default class  ServiceDetail extends PureComponent {





render() {
    const {fields, errors,editMode, onChange,onRemove,booktickettypelist,storelist,clientprofile,branchlist,parallelplanlist,sessiontypelist} = this.props;

      let  dropzoneRef;

return (
  <div className="editor-wrapper">

      <form noValidate autoComplete="off">


      <div className="row">
      <div className="col-12">
                <TextField required  autoFocus = {true} inputProps={{maxLength:200}} id="customer" fullWidth label="Customer Name" value={fields.customer} onChange={(e) => onChange('customer',e.target.value , true)}/>
                <FormHelperText  error>{errors.customer}</FormHelperText>
       </div>
       <div className="col-12">
       <TextField id="mobile" type="number" fullWidth label="Mobile Number"   value={fields.mobile} onChange={(e) => onChange('mobile', e.target.value)} onBlur = {(e) => onChange('mobile', e.target.value, true)}/>
       <FormHelperText  error>{errors.mobile}</FormHelperText>

        </div>
   </div>

        </form>


       </div>
      );
             }
             }
