import React, { Component } from 'react';
// Import React Table
import { connect } from 'react-redux';

import RctSectionLoader from 'Components/RctSectionLoader/RctSectionLoader';
import { clsAddNewHolidaysModel,saveHolidays } from 'Actions';
import Dialog from '@material-ui/core/Dialog';
import CloseIcon from '@material-ui/icons/Close';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import { push } from 'connected-react-router';
import {isMobile} from 'react-device-detect';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Col from 'reactstrap/lib/Col';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import DatePicker from 'Routes/advance-ui-components/dateTime-picker/components/DatePicker';

import RctCollapsibleCard from 'Components/RctCollapsibleCard/RctCollapsibleCard';
import {checkError, cloneDeep,getLocalDate} from 'Helpers/helpers';
import FormHelperText from '@material-ui/core/FormHelperText';
import {required,checkDecimal} from 'Validations';
import InputAdornment from '@material-ui/core/InputAdornment';
import Input from '@material-ui/core/Input';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import { NotificationManager } from 'react-notifications';
import ReactTable from "react-table";
import   Checkbox  from '@material-ui/core/Checkbox';
import PerfectScrollbar from 'Components/PerfectScrollbar';
import api from 'Api';
import AutoSuggest from 'Routes/advance-ui-components/autoComplete/component/AutoSuggest';

class AddHolidays extends Component {
  constructor(props) {
       super(props);
               this.state = this.getInitialState();
          }

   getInitialState()
    {
          this.initialState = {
                      holidaysDetail:
                      {
                        fields : {
                                      id:0,
                                      holidayname: '',
                                      holidaydate : null,
                                      repeatdate : 0,
                                    },
                                    errors : { },
                                    validated : false,
                                },
                            };
                        return cloneDeep(this.initialState);
                    }

  onChange(key,value)
    {
      let {holidaysgroupitem} = this.state.holidaysDetail.fields;
       if (key == "repeatdate") {
        value = value?1:0;
      }


      this.setState({
        holidaysDetail: {
          ...this.state.holidaysDetail,
          fields : {...this.state.holidaysDetail.fields,
            [key] : value,
          },


        }
      });
     }



  validate()
    {
        let errors = {};

        const fields = this.state.holidaysDetail.fields;

        errors.holidayname = required(fields.holidayname);
        errors.holidaydate = required(fields.holidaydate);


        let validated = checkError(errors);

         this.setState({
           holidaysDetail: {	...this.state.holidaysDetail,
              errors : errors, validated : validated
           }
         });
         return validated;
     }

   onSave()
     {
       const {holidaysDetail,holidays_old} = this.state;
       const	{editholidays, editMode} = this.props;

       if(this.validate())
       {
         if(!editMode || (editholidays && (JSON.stringify(holidays_old) != JSON.stringify(holidaysDetail.fields))))
          {
              const holidays = holidaysDetail.fields
                    this.props.saveHolidays({holidays});


             }
        else {
               NotificationManager.error('No changes detected');
          }
       }
     }

	onClose()
		{
      this.setState(this.getInitialState());

			this.props.clsAddNewHolidaysModel();
			this.props.push('/app/setting/organization/4');
		}

  componentWillReceiveProps(newProps)
      {
          const	{holidayslist} = newProps;
          let {holidaysDetail} = this.state;
          holidaysDetail = holidaysDetail.fields;

          const	{editholidays, editMode} = newProps;
          if(editMode && editholidays && editholidays.id && editholidays.id != this.state.holidaysDetail.fields.id )
          {
            holidaysDetail.id = editholidays.id;
            holidaysDetail.holidaydate = getLocalDate(editholidays.holidaydate);
            holidaysDetail.holidayname = editholidays.holidayname;
            holidaysDetail.repeatdate = editholidays.repeatdate;

            this.state.holidays_old = cloneDeep(holidaysDetail);
          }


      }

    componentWillUpdate(nextProps, nextState)
      {
          if((this.props.addNewHolidaysModal != nextProps.addNewHolidaysModal))
            {
                 this.setState(this.getInitialState());
            }
      }



	render() {
	 const	{ addNewHolidaysModal,holidayslist,onChange } = this.props;
   const {fields,errors} = this.state.holidaysDetail;
		return (
      <Dialog  fullWidth fullScreen = {isMobile ? true : false}
          onClose={() => this.onClose()}
          open={addNewHolidaysModal}
        >
        <DialogTitle >
              <CloseIcon onClick={() => this.onClose()} className = {"pull-right pointer"}/>
              <span className="fw-bold text-capitalize"> { fields.id != 0 ? 'UPDATE ' : 'ADD ' } HOLIDAY </span>
        </DialogTitle>
          <PerfectScrollbar style={{ height: '200px' }}>
          <DialogContent>
          <RctCollapsibleCard >
             <form noValidate autoComplete="off">
                   <div className="row">
                       <div className="col-sm-6 col-md-6 col-xl-6">
                             <TextField  required inputProps={{maxLength:50}}  id="holidayname" autoFocus = {true} fullWidth label={ "Holidays Name"}  value={fields.holidayname} onChange={(e) => this.onChange('holidayname',e.target.value, true)} onBlur = {(e) => this.onChange('holidayname',e.target.value, true)}/>
                             <FormHelperText  error>{errors.holidayname}</FormHelperText>
                        </div>
                        <div className="col-sm-6 col-md-6 col-xl-6">
                        <div className="rct-picker">
                                  <DatePicker
                                  label="Date *" disableFuture = {false} value ={fields.holidaydate} onChange={(date) => this.onChange('holidaydate', date,  false)}
                                  />
                                  <FormHelperText  error>{errors.date}</FormHelperText>
                        </div>
                        </div>

                  </div>

                  <div className="row">
                      <Col sm={12}>
                          <FormControlLabel  control={
                            <Checkbox color="primary"
                            checked={fields.repeatdate==0?false:true}

                             onChange={(e) => this.onChange('repeatdate', e.target.checked)} />
                          }  label="Repeat Every Year On Same Date"
                          />
                      </Col>
                  </div>


                  </form>
             </RctCollapsibleCard>
          </DialogContent>
          </PerfectScrollbar>
          <DialogActions>
           <Button variant="contained" onClick={() => this.onSave()} className="btn-primary text-white">
                Save
            </Button>
           <Button variant="contained"  onClick={() => this.onClose()}  className="btn-danger text-white">
                Cancel
            </Button>
            </DialogActions>

        </Dialog>

	);
  }
  }
const mapStateToProps = ({holidaysReducer }) => {
  const {holidays,addNewHolidaysModal,holidayslist ,editholidays,editMode} =  holidaysReducer;

  return { addNewHolidaysModal,holidayslist ,holidays,editholidays,editMode}
}

export default connect(mapStateToProps,{
	clsAddNewHolidaysModel,saveHolidays,push})(AddHolidays);
