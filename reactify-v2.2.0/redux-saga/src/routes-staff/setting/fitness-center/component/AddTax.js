import React, { Component } from 'react';
// Import React Table
import { connect } from 'react-redux';

import RctSectionLoader from 'Components/RctSectionLoader/RctSectionLoader';
import { clsAddNewTaxModel,saveClientTax } from 'Actions';
import Dialog from '@material-ui/core/Dialog';
import CloseIcon from '@material-ui/icons/Close';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import { push } from 'connected-react-router';
import {isMobile} from 'react-device-detect';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import RctCollapsibleCard from 'Components/RctCollapsibleCard/RctCollapsibleCard';
import {checkError, cloneDeep} from 'Helpers/helpers';
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

class AddTax extends Component {
  constructor(props) {
       super(props);
               this.state = this.getInitialState();
          }

   getInitialState()
    {
          this.initialState = {
                      taxDetail:
                      {
                        fields : {
                                      id:0,
                                      taxname: '',
                                      taxpercentage :'',
                                      taxgroupitem : null,
                                      countryArray : [],
                                      country : '',
                                    },
                                    errors : { },
                                    validated : false,
                                },
                            };
                        return cloneDeep(this.initialState);
                    }

  onChange(key,value, isRequired)
    {
      let {taxgroupitem} = this.state.taxDetail.fields;
      let error= isRequired ? required(value) : '';
        if(key == "taxgroupitem"){
          taxgroupitem.forEach(x => {
             if(x.id == value.id){
               if(value.key == 'checked')
                        {
                            x[value.key] = value.value;
                        }
                  }
          })
        }
        else if (key == 'taxpercentage') {
          if(checkDecimal(value))
          {
            value = parseFloat(value).toFixed(2);
          }
        }

      this.setState({
        taxDetail: {
          ...this.state.taxDetail,
          fields : {...this.state.taxDetail.fields,
            [key] : value,
            taxgroupitem : taxgroupitem
          },
          errors : {...this.state.taxDetail.errors,
            [key] : error
          },

        }
      });
     }

  handleChangeSchedule = (id, key, value , isRequired) => {
      this.onChange('taxgroupitem', {id , key , value} , isRequired);
    };

  validate()
    {
        let errors = {};
        const	{istextgroup} = this.props;

        const fields = this.state.taxDetail.fields;

        errors.taxname = required(fields.taxname);
        if(!istextgroup){
          errors.taxpercentage = required(fields.taxpercentage);
        }
        if(istextgroup){
          if(fields.taxgroupitem.filter(x => x.checked).length == 0)
          {
            NotificationManager.error('Select atleast one tax');
            errors.taxgroupitem = 'Select atleast one tax';
          }
        }

        let validated = checkError(errors);

         this.setState({
           taxDetail: {	...this.state.taxDetail,
              errors : errors, validated : validated
           }
         });
         return validated;
     }

   onSave()
     {
       const {taxDetail,tax_old} = this.state;
       const	{istextgroup} = this.props;
             if(this.validate())
             {
                   let taxdetail  = taxDetail.fields;
                   taxdetail.istextgroup = istextgroup;
                   if(taxdetail.taxgroupitem){
                     taxdetail.taxgroupitem = taxdetail.taxgroupitem.filter(x => x.checked)
                   }
                   this.props.saveClientTax({taxdetail});
                }
      }

	onClose()
		{
      this.setState(this.getInitialState());

			this.props.clsAddNewTaxModel();
			this.props.push('/app/setting/organization/2');
		}

  componentWillReceiveProps(newProps)
      {
          const	{taxlist,istextgroup} = newProps;
          let {taxDetail} = this.state;
          taxDetail = taxDetail.fields;
            if(taxlist  && !taxDetail.taxgroupitem && istextgroup)
            {
              taxDetail.taxgroupitem = taxlist;
              taxDetail.taxgroupitem.forEach(x =>x.checked = false);
            }

      }

    componentWillUpdate(nextProps, nextState)
      {
          if((this.props.addNewTaxModal != nextProps.addNewTaxModal))
            {
                 this.setState(this.getInitialState());
            }
      }

      getCountry = (value) =>
      {
              api.post('country-suggestion', {value})
              .then(response => {
                this.onChange('countryArray', response.data[0]);
              }).catch(error => console.log(error) )
      }

	render() {
	 const	{ addNewTaxModal,istextgroup,taxlist,clientProfileDetail } = this.props;
   const {fields,errors} = this.state.taxDetail;
		return (
      <Dialog  fullWidth fullScreen = {isMobile ? true : false}
          onClose={() => this.onClose()}
          open={addNewTaxModal}
        >
        <DialogTitle >
              <CloseIcon onClick={() => this.onClose()} className = {"pull-right pointer"}/>
              <span className="fw-bold text-capitalize"> {istextgroup ? "ADD TAX GROUP" : "ADD TAX"}</span>
        </DialogTitle>
          <PerfectScrollbar style={{ height: istextgroup ? 'calc(100vh - 5px)' : '150px' }}>
          <DialogContent>
          <RctCollapsibleCard >
             <form noValidate autoComplete="off">
                   <div className="row">
                       <div className="col-sm-6 col-md-6 col-xl-6">
                             <TextField  required inputProps={{maxLength:50}}  id="taxname" autoFocus = {true} fullWidth label={!istextgroup ? "Tax Name" : "Tax Group Name"}  value={fields.taxname} onChange={(e) => this.onChange('taxname',e.target.value, true)} onBlur = {(e) => this.onChange('taxname',e.target.value, true)}/>
                             <FormHelperText  error>{errors.taxname}</FormHelperText>
                        </div>
                        {clientProfileDetail && clientProfileDetail.id == 1 &&
                          <div className="col-sm-6 col-md-6 col-xl-6">
                            <AutoSuggest  value = {fields.country} suggestions = {fields.countryArray} getSuggetion= {(value) => this.getCountry(value)}  label = "Country" onChange= {(value) => this.onChange('country', value) }/>
                            {errors.country && <FormHelperText  error>{errors.country}</FormHelperText>}
                          </div>
                        }
                        {!istextgroup &&
                          <div className="col-sm-6 col-md-6 col-xl-6">
                            <FormControl fullWidth>
                                    <InputLabel htmlFor="taxpercentage" required>Tax Percentage</InputLabel>
                                     <Input
                                            id="adornment-biceps"
                                            type= "number"
                                            value={fields.taxpercentage}
                                            onChange={(e) => this.onChange('taxpercentage',e.target.value > 100 ? 100  : e.target.value, true)}
                                            endAdornment={<InputAdornment position="end">%</InputAdornment>}
                                          />
                                          <FormHelperText  error>{errors.taxpercentage}</FormHelperText>
                            </FormControl>
                            </div>
                          }
                  </div>
                  {istextgroup &&
                    <ReactTable
                    columns={[
                                {
                                  Header: "Tax Name",
                                  accessor : 'label',
                                  Cell : data =>
                                      (
                                            <div className="row">
                                                <Checkbox color="primary"
                                                  checked = {data.original.checked || false}
                                                    onChange = {(e) => this.handleChangeSchedule(data.original.id, 'checked' , e.target.checked , true) }
                                                   />
                                                <label className="professionaldetail_padding" > {data.original.label } </label>
                                               </div>
                                           )
                                    },
                                    {
                                      Header: "Percentage",
                                      accessor : 'percentage',
                                      className : "text-center",
                                      Cell : data => (
                                          <h5 className ="mt-20">{data.original.percentage + " %" }</h5>
                                      ),
                                    }
                            ]}
                            filterable = { false}
                          sortable = { false }
                          data = {fields.taxgroupitem || [] }
                         // Forces table not to paginate or sort automatically, so we can handle it server-side
                          showPagination= {false}
                          showPaginationTop = {false}
                          loading={false} // Display the loading overlay when we need it
                          className=" -highlight"
                          minRows = {fields.taxgroupitem && fields.taxgroupitem.length}
                          freezeWhenExpanded = {true}
                          />
                  }
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
const mapStateToProps = ({ settings }) => {
	const {addNewTaxModal,istextgroup ,taxlist,clientProfileDetail} =  settings;
  return { addNewTaxModal,istextgroup ,taxlist,clientProfileDetail}
}

export default connect(mapStateToProps,{
	clsAddNewTaxModel,saveClientTax,push})(AddTax);
