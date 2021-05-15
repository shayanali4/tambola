import React, { Fragment, PureComponent,Component } from 'react';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import Switch from '@material-ui/core/Switch';
import TextField from '@material-ui/core/TextField';
import FormHelperText from '@material-ui/core/FormHelperText';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import Checkbox from '@material-ui/core/Checkbox';
import Tooltip from '@material-ui/core/Tooltip';
import Form from 'reactstrap/lib/Form';import FormGroup from 'reactstrap/lib/FormGroup';
import RctCollapsibleCard from 'Components/RctCollapsibleCard/RctCollapsibleCard';
import MenuItem from '@material-ui/core/MenuItem';
import DatePicker from 'Routes/advance-ui-components/dateTime-picker/components/DatePicker';
import BudgetPeriod  from 'Assets/data/budgetperiod';
import AutoSuggest from 'Routes/advance-ui-components/autoComplete/component/AutoSuggest';
import {isMobile} from 'react-device-detect';
import Fab from '@material-ui/core/Fab';
import ReactTable from "react-table";
import {getCurrency} from 'Helpers/helpers';

export default class BudgetDetail extends Component {
  handleChangeSchedule = (id, key, value , isRequired) => {
    this.props.onChange('budgettype', {id , key , value} , isRequired);
  };
  render() {
    const {fields, errors,onChange,branchList,isMultipleBranch,packtypeId,durationcount,duration,totalmonthlybudget} = this.props;
    return (
  <div className="textfields-wrapper">
  <RctCollapsibleCard >
  <form noValidate autoComplete="off">
          <div className="row">
          <div className="col-12 col-sm-12 col-md-3 col-xl-3">
            <FormGroup className="has-wrapper">
            <FormControl fullWidth>
            <InputLabel htmlFor="budgetperiod">Budget period</InputLabel>
                      <Select  required value={fields.budgetperiod} onChange={(e) => onChange('budgetperiod', e.target.value,  true)}
                        inputProps={{name: 'budgetperiod', id: 'budgetperiod', }}>
                        {
                          BudgetPeriod.map((budgetperiod, key) => ( <MenuItem value={budgetperiod.value} key = {'budgetperiodOption' + key }>{budgetperiod.name}</MenuItem> ))
                        }
                      </Select>
            </FormControl>
           </FormGroup>
          </div>
          <div className="col-8 col-sm-8 col-md-3">
            <div className="clearfix pl-20">
                 <div className="rct-picker">
                           <DatePicker
                           label="Start Month *"  value ={fields.month} format = {'MMM, YYYY'} placeholder = {'MMM, YYYY'} onChange={(date) => onChange('month', date,true)}
                           />
                           <FormHelperText  error>{errors.month}</FormHelperText>
                  </div>
             </div>
          </div>
          <div className="col-6 col-sm-6 col-md-3">
            <div className="clearfix pl-20">
                <div className="rct-picker">
                          <DatePicker
                          label="Start Date " disabled autoFocus = {true} value ={fields.startDate} onChange={(date) =>onChange('startDate', date,true)}
                          />
                          <FormHelperText  error>{errors.startDate}</FormHelperText>

               </div>
               </div>
            </div>

            <div className="col-6 col-sm-6 col-md-3">
             <div className="clearfix pl-20">
                  <div className="rct-picker">
                            <DatePicker
                            label="End Date " disabled value ={fields.endDate} onChange={(date) =>onChange('endDate', date,true)}
                            />
                            <FormHelperText  error>{errors.endDate}</FormHelperText>

                 </div>
                 </div>
               </div>
          </div>
          <div className="row">
               <div className="col-12 col-md-8 col-xl-6">
                        <ReactTable
                                  columns={[
                                    {
                                      Header: data =>  ( <span style = {{"textTransform" : "none"}}> </span>),
                                      accessor : 'name',
                                      width:200,

                                      Cell : data =>
                                      (
                                      <div className="row">
                                            <label className="professionaldetail_padding" > {data.original.name } </label>
                                       </div>
                                     )},
                                     {
                                       Header:  data =>  ( <span style = {{"textTransform" : "none"}}> ({getCurrency()}) Budget  </span>),
                                       Cell : data =>
                                       (
                                         <TextField disabled ={data.original.name == 'Total'} id="budget" type="number" fullWidth  value={data.original.budget || ''} onChange={(e) => this.handleChangeSchedule(data.original.value, 'budget' , e.target.value < 99999999 ? e.target.value : 99999999 , true)} />
                                      ),
                                     },
                                     {
                                       Header:  data =>  ( <span style = {{"textTransform" : "none"}}> Percentage (%) </span>),
                                       Cell : data =>
                                       (
                                         <TextField  disabled  id="percentage" type="number"  fullWidth  value={data.original.name == 'Total' ? '-' : ((data.original.budget /fields.totalbudget) * 100).toFixed(2) || ''}  />
                                        ),

                                     },
                                     {
                                       Header:  data =>  ( <span style = {{"textTransform" : "none","textAlign" : "right"}}> ({getCurrency()}) Monthly Budget </span>),
                                       Cell : data =>
                                       (
                                         <TextField disabled   type="number"  fullWidth  value={(data.original.budget /durationcount).toFixed(2) || ''}  />
                                        ),
                                     }
                                  ]}
                                  filterable = {false}
                                  sortable = {false}
                                  data = {fields.budgettype}
                                 // Forces table not to paginate or sort automatically, so we can handle it server-side
                                  showPagination= {false}
                                  showPaginationTop = {false}
                                  loading={false} // Display the loading overlay when we need it
                                  defaultPageSize={4}
                                  className=" -highlight"
                                  freezeWhenExpanded = {true}
                                  />

                    </div>
                 </div>
                 <div className="row">
                   <div className="col-sm-6 col-md-3 col-xl-3">
                                <TextField disabled  required  inputProps={{maxLength:50}}  id="totalbudget"  fullWidth label="Total Budget"  value={fields.totalbudget} />
                                <FormHelperText  error>{errors.totalbudget}</FormHelperText>
                     </div>
                     <div className="col-sm-6 col-md-3 col-xl-3">
                                  <TextField disabled  required  inputProps={{maxLength:50}}  id="totalmonthlybudget" fullWidth label="Total Monthly Budget"  value={totalmonthlybudget} />
                                  <FormHelperText  error></FormHelperText>
                       </div>
                  </div>
      </form>
      </RctCollapsibleCard>
      </div>
  );
}
}
