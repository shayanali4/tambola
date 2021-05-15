import React, { Component } from 'react';
// Import React Table
import { connect } from 'react-redux';

import RctSectionLoader from 'Components/RctSectionLoader/RctSectionLoader';
import { clsAddNewTaxCodeCategoryModel,saveTaxCodecategory } from 'Actions';
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
import {required,restrictLength} from 'Validations';
import InputAdornment from '@material-ui/core/InputAdornment';
import Input from '@material-ui/core/Input';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import { NotificationManager } from 'react-notifications';
import ReactTable from "react-table";
import   Checkbox  from '@material-ui/core/Checkbox';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import  Taxcodecategorytype from 'Assets/data/taxcodecategorytype';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import api from 'Api';
import AutoSuggest from 'Routes/advance-ui-components/autoComplete/component/AutoSuggest';

class AddTaxCodeCategory extends Component {
  constructor(props) {
       super(props);
               this.state = this.getInitialState();
          }

   getInitialState()
    {
          this.initialState = {
                      taxCategoryDetail:
                      {
                        fields : {
                                      id:0,
                                      taxcategoryname: '',
                                      taxcode :'',
                                      taxgroup : '',
                                      taxcodecategorytype : '1',
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
                        let {taxgroupitem} = this.state.taxCategoryDetail.fields;
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
                          else if(key == 'taxcode')
                              {
                                value = restrictLength(value,10);
                              }
                        this.setState({
                          taxCategoryDetail: {
                            ...this.state.taxCategoryDetail,
                            fields : {...this.state.taxCategoryDetail.fields,
                              [key] : value,
                              taxgroupitem : taxgroupitem
                            },
                            errors : {...this.state.taxCategoryDetail.errors,
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

                            const fields = this.state.taxCategoryDetail.fields;

                            errors.taxcategoryname = required(fields.taxcategoryname);
                            errors.taxcode = required(fields.taxcode);
                            errors.taxgroup = required(fields.taxgroup);

                            let validated = checkError(errors);

                             this.setState({
                               taxCategoryDetail: {	...this.state.taxCategoryDetail,
                                  errors : errors, validated : validated
                               }
                             });
                             return validated;
                         }
                         onSave()
                         {
                           const {taxCategoryDetail,tax_old} = this.state;
                           const	{istextgroup} = this.props;
                                 if(this.validate())
                                 {
                                       let taxCategorydetail  = taxCategoryDetail.fields;
                                       this.props.saveTaxCodecategory({taxCategorydetail});
                                    }
                                }

	onClose()
		{
      this.setState(this.getInitialState());

			this.props.clsAddNewTaxCodeCategoryModel();
			this.props.push('/app/setting/organization/2');
		}
    componentWillReceiveProps(newProps)
        {
            const	{taxlist,istextgroup} = newProps;
            let {taxCategoryDetail} = this.state;
            taxCategoryDetail = taxCategoryDetail.fields;
              if(taxlist  && !taxCategoryDetail.taxgroupitem && istextgroup)
              {
                taxCategoryDetail.taxgroupitem = taxlist;
                taxCategoryDetail.taxgroupitem.forEach(x =>x.checked = false);
              }
          }

        componentWillUpdate(nextProps, nextState)
              {
                  if((this.props.addNewTaxCodeCategoryModal != nextProps.addNewTaxCodeCategoryModal))
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
	 const	{ addNewTaxCodeCategoryModal,istextgroup,taxlist,clientProfileDetail } = this.props;
   const {fields,errors} = this.state.taxCategoryDetail;
		return (
      <Dialog fullWidth fullScreen = {isMobile ? true : false}
          onClose={() => this.onClose()}
          open={addNewTaxCodeCategoryModal}
        >
        <DialogTitle >
              <CloseIcon onClick={() => this.onClose()} className = {"pull-right pointer"}/>
              <span className="fw-bold text-capitalize"> ADD TAX CODE CATEGORY</span>
        </DialogTitle>
          <DialogContent>
          <RctCollapsibleCard >
             <form noValidate autoComplete="off">
                   <div className="row">
                     {clientProfileDetail && clientProfileDetail.packtypeId != 1 &&
                       <div className="col-12">
                        <div className = "row" >
                             <label className="professionaldetail_padding" >Applicable on</label>
                                  <RadioGroup row aria-label="taxcodecategorytype"   className ={'pl-15'}  name="taxcodecategorytype" value={fields.taxcodecategorytype} onChange={(e) => this.onChange('taxcodecategorytype', e.target.value,false)}>
                                 {
                                   Taxcodecategorytype.map((taxcodecategorytype, key) => ( <FormControlLabel value={taxcodecategorytype.value} key= {'taxcodecategorytypeOption' + key} control={<Radio />} label={taxcodecategorytype.name} />))
                                 }
                                 </RadioGroup>
                          </div>
                       </div>
                      }
                       <div className="col-12">
                             <TextField  required inputProps={{maxLength:100}}  id="taxcategoryname" autoFocus = {true} fullWidth label={clientProfileDetail && clientProfileDetail.packtypeId != 1 ? "Service/Product Category" : "Service Category"} value={fields.taxcategoryname} onChange={(e) => this.onChange('taxcategoryname',e.target.value, true)} onBlur = {(e) => this.onChange('taxcategoryname',e.target.value, true)}/>
                             <FormHelperText  error>{errors.taxcategoryname}</FormHelperText>
                        </div>
                <div className="col-sm-6 col-md-6 col-xl-6">
                    <TextField  required  type ="number"  id="taxcode" autoFocus = {true} fullWidth label="Tax Code" value={fields.taxcode} onChange={(e) => this.onChange('taxcode',e.target.value, true)} onBlur = {(e) => this.onChange('taxcode',e.target.value, true)}/>
                   <FormHelperText  error>{errors.taxcode}</FormHelperText>
                </div>
                {clientProfileDetail && clientProfileDetail.id == 1 &&
                  <div className="col-sm-6 col-md-6 col-xl-6">
                    <AutoSuggest  value = {fields.country} suggestions = {fields.countryArray} getSuggetion= {(value) => this.getCountry(value)}  label = "Country" onChange= {(value) => this.onChange('country', value) }/>
                    {errors.country && <FormHelperText  error>{errors.country}</FormHelperText>}
                  </div>
                }
                  <div className="col-sm-6 col-md-6 col-xl-6">
                                 <FormControl fullWidth>
                                     <InputLabel required htmlFor="taxgroup">Tax Group</InputLabel>
                                     <Select value={fields.taxgroup} onChange={(e) => this.onChange(e.target.name,e.target.value)}
                                       inputProps={{name: 'taxgroup', id: 'taxgroup', }}>

                                       {
                                         taxlist && taxlist.map((taxgroup, key) => ( <MenuItem value={taxgroup.id} key= {'taxgroupOption' + key}>{taxgroup.label}</MenuItem> ))
                                        }
                                     </Select>
                                     <FormHelperText  error>{errors.taxgroup}</FormHelperText>
                                 </FormControl>
                  </div>
                  </div>
                  </form>
             </RctCollapsibleCard>
          </DialogContent>
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
	const {addNewTaxCodeCategoryModal ,taxlist,clientProfileDetail} =  settings;
  return { addNewTaxCodeCategoryModal ,taxlist,clientProfileDetail}
}

export default connect(mapStateToProps,{
	clsAddNewTaxCodeCategoryModel,saveTaxCodecategory,push})(AddTaxCodeCategory);
