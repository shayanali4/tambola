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
import RctCollapsibleCard from 'Components/RctCollapsibleCard/RctCollapsibleCard';
import  Status from 'Assets/data/status';

import { RctCard } from 'Components/RctCard';
import CustomConfig from 'Constants/custom-config';
import Tooltip from '@material-ui/core/Tooltip';
import Checkbox from '@material-ui/core/Checkbox';

export default class  ServiceDetail extends PureComponent {





render() {
    const {fields, errors,editMode, onChange,onRemove,gametypelist,storelist,clientprofile,branchlist,parallelplanlist,sessiontypelist} = this.props;

      let  dropzoneRef;

return (
  <div className="editor-wrapper">
    <RctCollapsibleCard >
      <form noValidate autoComplete="off">


           <div className="row">

              <div className = "col-12">
              <div className ="row">
                 <label className="professionaldetail_padding" > Status </label>
                       <RadioGroup row aria-label="status" className ={'pl-15'}   name="status"   value={fields.status} onChange={(e) => onChange('status', e.target.value)}>
                       {
                         Status.map((status, key) => ( <FormControlLabel value={status.value} key= {'statusOption' + key} control={<Radio />} label={status.name} />))
                       }
                     </RadioGroup>
              </div>
              </div>

              <div className = "col-12">
                      <label > Winning Prices </label>
              <div className ="row">


              {

                fields.gameprice.map((price, key) => (
                    <div className = "col-12 col-sm-6 col-md-4 col-xl-3 " key= {'priceOption' + key}>
                  <FormControlLabel value={price.value}  control={<Checkbox
                    checked = {price.checked ?true:false}
                    onChange = {(e) => {price.checked = e.target.checked ; this.forceUpdate(); } }

                    />} label={price.name} />
                  </div>
                ))

              }        </div>
                </div>


                </div>
                <div className="row" >
                  <div className="col-sm-6 col-md-4">
                    <div className="rct-picker">
                        <DatePicker label = "Launch Date *"  value ={fields.launchdate} onChange = {(date) => onChange('launchdate', date , false) } />
                        <FormHelperText  error>{errors.launchdate}</FormHelperText>
                    </div>
                  </div>
                </div>
                <div className="row" >
                  <div className="col-sm-6 col-md-4">

          <TextField id="noofsheets" type="number" inputProps={{max:100}}
          fullWidth label="No Of Sheets"
          value={fields.noofsheets}
          onChange={(e) => onChange( 'noofsheets',e.target.value)} onBlur = {(e) => onChange( 'noofsheets',e.target.value, true)} />
          </div>
        </div>

                {!editMode  &&
                                <div className="d-flex justify-content-between py-20 ">
                  <a href="javascript:void(0)" onClick={() =>{ if(fields.noofsheets > 0) { onChange('tickets',  tambola.getTickets(fields.noofsheets) , false);}  }}
                    className="btn-outline-default mr-5"><i className="ti-plus"></i> Generate Tickets</a>
                </div>
              }
  <div className="row" >
  {fields.tickets && fields.tickets.map((x, key) =>
     (<div className="col-12 col-lg-4" key = {"ticket-" + key}>
                <table className="table mt-2 ticket"><tbody><tr className="mh bg-secondary">
                <th colSpan="9">SHEET  : { Math.ceil((x.ticketid)/6)} , TICKET : {x.ticketid} <span className = "text-warning"> {x.customer ? "( " + x.customer + " )" : ""} </span></th></tr>

                {
                  x.ticket && x.ticket.map((tr,ckey) => (
                    <tr key = {"tr-" + key + "-" + ckey }>
                    <td className = {"text-white fw-bold fs-16 px-5 py-0 " + (ckey == 1 ? "bg-danger" : "bg-primary") }  style = {{"textAlign" : 'center',"border" : "1px solid #ffffff"}}>
                                      {tr[0] || ' '}
                                  </td><td className = {"text-white fw-bold fs-16 px-0 py-0 " + (ckey == 1 ? "bg-primary" : "bg-danger") } style = {{"textAlign" : 'center',"border" : "1px solid #ffffff"}}>
                                      {tr[1] || ' '}
                                  </td><td className = {"text-white fw-bold fs-16 px-0 py-0 " + (ckey == 1 ? "bg-danger" : "bg-primary") } style = {{"textAlign" : 'center',"border" : "1px solid #ffffff"}}>
                                  {tr[2] || ' '}
                                  </td><td className = {"text-white fw-bold fs-16 px-0 py-0 " + (ckey == 1 ? "bg-primary" : "bg-danger") } style = {{"textAlign" : 'center',"border" : "1px solid #ffffff"}}>
                                      {tr[3] || ' '}
                                  </td><td className = {"text-white fw-bold fs-16 px-0 py-0 " + (ckey == 1 ? "bg-danger" : "bg-primary") } style = {{"textAlign" : 'center',"border" : "1px solid #ffffff"}}>
                                    {tr[4] || ' '}
                                  </td><td className = {"text-white fw-bold fs-16 px-0 py-0 " + (ckey == 1 ? "bg-primary" : "bg-danger") } style = {{"textAlign" : 'center',"border" : "1px solid #ffffff"}}>
                                      {tr[5] || ' '}
                                  </td><td className = {"text-white fw-bold fs-16 px-0 py-0 " + (ckey == 1 ? "bg-danger" : "bg-primary") } style = {{"textAlign" : 'center',"border" : "1px solid #ffffff"}}>
                                      {tr[6] || ' '}
                                  </td><td className = {"text-white fw-bold fs-16 px-0 py-0 " + (ckey == 1 ? "bg-primary" : "bg-danger") } style = {{"textAlign" : 'center',"border" : "1px solid #ffffff"}}>
                                  {tr[7] || ' '}
                                  </td><td className = {"text-white fw-bold fs-16 px-0 py-0 " + (ckey == 1 ? "bg-danger" : "bg-primary") } style = {{"textAlign" : 'center',"border" : "1px solid #ffffff"}}>
                                  {tr[8] || ' '}
                                  </td></tr>
                  ))
                }

</tbody></table>
</div>))
}
    </div>


        </form>
    </RctCollapsibleCard>



       </div>
      );
             }
             }
