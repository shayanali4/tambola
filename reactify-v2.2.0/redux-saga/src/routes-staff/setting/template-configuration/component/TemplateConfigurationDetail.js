import React, { Fragment, PureComponent,Component } from 'react';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import Switch from '@material-ui/core/Switch';
import TextField from '@material-ui/core/TextField';
import FormHelperText from '@material-ui/core/FormHelperText';
// intl messages
import IntlMessages from 'Util/IntlMessages';
import PageTitleBar from 'Components/PageTitleBar/PageTitleBar';

import Form from 'reactstrap/lib/Form';import FormGroup from 'reactstrap/lib/FormGroup';import Label from 'reactstrap/lib/Label';import Input from 'reactstrap/lib/Input';
import RctCollapsibleCard from 'Components/RctCollapsibleCard/RctCollapsibleCard';
import TemplateType  from 'Assets/data/templateType';


export default class TemplateConfigurationDetail extends Component {

  render() {
    const {fields, errors,onChange} = this.props;
    return (
      <div className="textfields-wrapper">
   <RctCollapsibleCard >
   <form noValidate autoComplete="off">
     <div className="row">
             <div className="col-sm-6 col-md-6 col-xl-4">
             <div className = "row pt-3" >
                  <label className="professionaldetail_padding" > Template Type </label>
                   <RadioGroup  row aria-label="templatetype"  id="templatetype" name="templatetype" value={fields.templatetype} onChange={(e) => onChange('templatetype',e.target.value)} onBlur = {(e) => onChange('templatetype',e.target.value)}>
                   {
                     TemplateType.map((templatetype, key) => ( <FormControlLabel value={templatetype.value} key= {'templatetypeOption' + key} control={<Radio  disabled = {fields.id != 0 ?  true : false}/>} label={templatetype.name} />))
                   }
                   </RadioGroup>
             </div>
            </div>
    </div>
     <div className="row">
                <div className="col-sm-6 col-md-3 col-xl-3">
                  <TextField required id="templatetitle" disabled = {fields.id != 0 ?  true : false}  fullWidth autoFocus = {true} label=" TemplateTitle"  value={fields.templatetitle} onChange={(e) => onChange('templatetitle',e.target.value, true)} />
                  <FormHelperText  error>{errors.templatetitle}</FormHelperText>
                </div>
                  {(fields.templatetype== "1" || fields.templatetype== "3")&&
                    <div className="col-sm-6 col-md-3 col-xl-3">
                      <TextField  id="subject"  fullWidth  label="Subject"  value={fields.subject} onChange={(e) => onChange('subject',e.target.value, true)} />
                      <FormHelperText  error>{errors.subject}</FormHelperText>
                    </div>
              }
    </div>
     <div className="row">
           <div className="col-sm-12 col-md-6 col-xl-6">
             <TextField required id="content" fullWidth multiline rows={2} rowsMax={4} label=" Content" value={fields.content} onChange={(e) => onChange('content',e.target.value, true)} />
             <FormHelperText  error>{errors.content}</FormHelperText>
           </div>
    </div>
        {fields.id != 0 &&
            <div className = "row">
              <div className = "col-12">
              <p className="fw-bold"> Note : </p>
              </div>
              <div className = "col-12">
                  <p className="mb-0"> <span>please use below predefined tags for dynamic values: </span></p>
              </div>
              <div className = "col-12">
                  <p> <span>{fields.predefinedtags}</span></p>
              </div>
         </div>
        }
  </form>
               </RctCollapsibleCard>
               </div>
                );
             }
             }
