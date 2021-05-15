
/**
 * Profile Page
 */
import React, { Component } from 'react';

import Form from 'reactstrap/lib/Form';
import FormGroup from 'reactstrap/lib/FormGroup';
import Col from 'reactstrap/lib/Col';
import {cloneDeep,checkModuleRights,getParams,checkError } from 'Helpers/helpers';
import FormHelperText from '@material-ui/core/FormHelperText';
import {required} from 'Validations';

import TextField  from '@material-ui/core/TextField';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Dropzone from 'react-dropzone';
import { RctCard } from 'Components/RctCard';
import ImageCropper from 'Components/ImageCropper';
import CustomConfig from 'Constants/custom-config';

import ReactTable from "react-table";
import InputAdornment from '@material-ui/core/InputAdornment';
import Input from '@material-ui/core/Input';
import { Link } from 'react-router-dom';
import Fab from '@material-ui/core/Fab';

import { opnAddNewTaxModel,clsAddNewTaxModel, getClientTax,saveClientTaxConfiguration,deleteClientTax,opnViewClientTaxModel
,opnAddNewTaxCodeCategoryModel,clsAddNewTaxCodeCategoryModel,getTaxCodeCategory,opnViewTaxCodeCategoryModel,deletTaxCodeCategory } from 'Actions';
import DeleteConfirmationDialog from 'Components/DeleteConfirmationDialog/DeleteConfirmationDialog';
import Switch from '@material-ui/core/Switch';

import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import {isMobile} from 'react-device-detect';
import { push } from 'connected-react-router';

import DiscountType  from 'Assets/data/discounttype';
import TaxType  from 'Assets/data/taxtype';
import PrintType  from 'Assets/data/printtype';

import Termsandconditionconfiguration  from 'Assets/data/termsandconditionconfiguration';

import AddTax from './AddTax';
import ViewTax from './ViewTax';
import AddTaxCodeCategory from './AddTaxCodeCategory';
import ViewTaxCodeCategory from './ViewTaxCodeCategory';

import {InvoiceConfig} from 'Constants/custom-config';

class TaxeConfiguration extends Component {

  constructor(props) {
     super(props);
   this.state = this.getInitialState();
}
   getInitialState()
    {
    this.initialState = {
                                   confirmationDialog : false,
                                   dataToDelete : null,
                                   deleteConfirmationDialog : false,
                                   signImageCropped : null,
                                   imageHeightWidth : {},
                                   taxdetail :{
                                     istaxenable : 0,
                                     taxtype : '1',
                                     gstin : '',
                                     printtype :'1',
                                     discounttype : '1',
                                     termsconditions : '',
                                     footermessge : '',
                                     signimage:'',
                                     imageFiles : [],
                                     cardswipedetail : {
                                        iscardswipeenable : 0,
                                        cardswipepercentage : ''
                                      },
                                     termsconditionstype :'1',
                                     isshowpaymentdetailingstinvoice : 0,
                                     showbenefitininvoice : 1
                                   },

                                   errors : { },
                                    validated : false,


                       };
               return cloneDeep(this.initialState);
    }
    onChange(key,value)
     {
         if(key == 'iscardswipeenable')
          {

            value = (value ? 1 : 0);
            if(!value)
            {
              this.state.taxdetail.cardswipedetail.cardswipepercentage = '';
            }
            this.setState({
              taxdetail: {
                ...this.state.taxdetail,
                 cardswipedetail: {
                   ...this.state.taxdetail.cardswipedetail,
                     [key] : value,
               }
             }
           });
          }
          else if(key == 'cardswipepercentage')
           {
             this.setState({
               taxdetail: {
                 ...this.state.taxdetail,
                  cardswipedetail: {
                    ...this.state.taxdetail.cardswipedetail,
                      [key] : value,
                    }
                  }
            });
           }
       else {
                 if(key == 'istaxenable' || key == 'isshowpaymentdetailingstinvoice' || key == 'showbenefitininvoice')
               {
                 value = (value ? 1 : 0);
               }

            this.setState({
             taxdetail: {
               ...this.state.taxdetail,
                 [key] : value
               }
           });
        }
     }
     onChangeImageToCrop(key,value)
     {

           this.setState({signImageCropped : value[0], imageHeightWidth : {width : 140 ,height : 110 , size : 0.1}});

     }
     onChangeCroppedImage(croppedimage)
     {

           this.onChange("imageFiles",[croppedimage])
          this.onCloseImageCropperDialog();
     }
     onCloseImageCropperDialog()
        {
             this.setState({
                 signImageCropped : null
             });
        }


     onConfirm()
     {
       let {taxdetail} = this.state;
            this.props.saveClientTaxConfiguration({taxdetail});
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
       if(this.validate()){
         this.setState({
           confirmationDialog : true,
         });
       }

     }
     componentWillMount()
     {
       const {viewRights,clientProfileDetail} =  this.props;
       let {taxdetail} = this.state;
       if(viewRights){
          if(clientProfileDetail){
                  taxdetail.istaxenable = clientProfileDetail.istaxenable;
                  taxdetail.printtype = clientProfileDetail.printtypeId ;
                  taxdetail.termsconditionstype = clientProfileDetail.termsconditionstypeId ;
                  taxdetail.discounttype = clientProfileDetail.discounttypeId;
                  taxdetail.termsconditions = clientProfileDetail.termsconditions;
                  taxdetail.footermessge = clientProfileDetail.footermessge;
                  taxdetail.signimage = clientProfileDetail.signimage;
                  taxdetail.isshowpaymentdetailingstinvoice = clientProfileDetail.isshowpaymentdetailingstinvoice;
                  taxdetail.showbenefitininvoice = clientProfileDetail.showbenefitininvoice;
                }
          if(clientProfileDetail.istaxenable){
                taxdetail.taxtype = clientProfileDetail.taxtypeId;
                taxdetail.gstin = clientProfileDetail.gstin;
            }
            if(clientProfileDetail.cardswipe){
                 taxdetail.cardswipedetail.iscardswipeenable = clientProfileDetail.cardswipe.iscardswipeenable;
                 if(clientProfileDetail.cardswipe.iscardswipeenable){
                    taxdetail.cardswipedetail.cardswipepercentage = clientProfileDetail.cardswipe.cardswipepercentage;
               }
           }
          }

            this.hashRedirect(location);
     }

     onAdd(data) {
   		this.props.opnAddNewTaxModel({data});
   	}
    onAddTaxCode() {
     this.props.opnAddNewTaxCodeCategoryModel();
   }
    hashRedirect({pathname, hash, search , newenquiries})
  		{
  			if(hash == "#"+ "addtax")
  			{
          let  istextgroup = false;
  				this.onAdd(istextgroup);
  			}
      else if(hash == "#"+ "addtaxgroup")
  			{
          let  istextgroup = true;
  				this.onAdd(istextgroup);
  			}
        else if(hash == "#"+ "view")
    			{
            let params = getParams(search);
            if(params && params.id)
            {
                 this.props.opnViewClientTaxModel({id : params.id});
            }
        }
        else if(hash == "#"+ "addtaxcodecategory")
          {
            this.onAddTaxCode();
          }
          else if(hash == "#"+ "viewtaxcategory")
            {
              let params = getParams(search);
              if(params && params.id)
              {
                   this.props.opnViewTaxCodeCategoryModel({id : params.id});
              }
          }
  		}

      componentWillReceiveProps(nextProps, nextState) {

  			const {pathname, hash, search} = nextProps.location;

  			 if(pathname != this.props.location.pathname  || hash != this.props.location.hash  || search !=  this.props.location.search)
  			{
  						this.props.clsAddNewTaxModel();
              this.props.clsAddNewTaxCodeCategoryModel();
  			 			this.hashRedirect({pathname, hash, search});
  			}
  		}
      initiateDelete(data,key)
      {
        let requestData = {};
        requestData.id = data.id;
        if(key == 'taxcodecategory'){
          requestData.taxcategoryname = data.taxcategoryname;
        }
        else{
          requestData.taxname = data.taxname;
        }
        this.setState({
          deleteConfirmationDialog : true,
          dataToDelete : requestData,
          key : key
        });
      }

      onDelete(data)
      {
        if(this.state.key == 'taxcodecategory'){
          this.props.deletTaxCodeCategory(data);
        }
        else{
          this.props.deleteClientTax(data);
        }
        this.setState({
          deleteConfirmationDialog : false,
          dataToDelete : null
        });
      }
      cancelDelete()
      {
        this.setState({
          deleteConfirmationDialog : false,
          dataToDelete : null,
        });
      }

      validate()
        {
          let errors = {};
          const taxdetail = this.state.taxdetail;

          if(taxdetail.istaxenable == 1)
          {
              errors.gstin = required(taxdetail.gstin);
          }
          if(taxdetail.cardswipedetail.iscardswipeenable)
          {
             errors.cardswipepercentage = required(taxdetail.cardswipedetail.cardswipepercentage);
          }

          let validated = checkError(errors);

           this.setState({
             taxdetail: {	...this.state.taxdetail,
             },
                errors : errors, validated : validated
           });

           return validated;
      }

  render() {
    let {confirmationDialog,deleteConfirmationDialog,dataToDelete,taxdetail,errors,imageHeightWidth,signImageCropped} = this.state;
    const {updateRights,addRights,taxes,deleteRights,taxlist,taxcodecategories,clientProfileDetail} = this.props;
    const {cardswipedetail} = taxdetail;
    let taxcodeheader = clientProfileDetail && clientProfileDetail.packtypeId != 1 ? "Service/Product Category" : "Service Category";
    let columns = [
      {
        Header: "Tax Name",
        accessor : 'taxname',
        Cell : data => (
          <Link to= {"/app/setting/organization/2?id="+data.original.id+"#view"} >
            <h5 className = "text-uppercase">{ data.original.taxgroupitem ? data.original.taxname + " (" +"Tax Group" +")" : data.original.taxname + " (" +"Tax" +")"  }</h5>
            </Link>
        )
     },
     {
       Header: "Percentage",
       accessor : 'percentage',
       className : "text-center",
       Cell : data => (
           <h5>{ data.original.percentage + " %"}</h5>
       )
     }
    ];
    if(deleteRights)
    {
     columns.push({
        Header: "ACTION",
        Cell : data => (<div className="list-action d-inline hover-action">
        {  (deleteRights && (data.original.clientid == data.original.requestclientid)) &&
          <Fab className="btn-danger text-white m-5 pointer size-25" variant="round" mini = "true" onClick={() => this.initiateDelete(data.original)}>
            <i className="zmdi zmdi-delete"></i>
          </Fab>  }
          </div>
        ),
        filterable : false,
        sortable : false,
         width:80,
         className : "text-center",

      });
    }
    let columns1 = [
      {
        Header: taxcodeheader,
        accessor : 'taxcategoryname',
        Cell : data => (
          <Link to= {"/app/setting/organization/2?id="+data.original.id+"#viewtaxcategory"} >
            <h5 className = "text-uppercase">{data.original.taxcategoryname} </h5>
            </Link>
        ),
        width : 250
     },
     {
       Header: "Applicable On",
       accessor : 'taxcodecategorytype',
       className : "text-center"
     },
     {
       Header: "Tax Code",
       accessor : 'taxcode',
       className : "text-center"
     },
     {
       Header: "Tax Group",
       accessor : 'taxgroupname',
       Cell : data => (
           <h5>{data.original.taxgroupname + "(" +data.original.percentage +" %)"} </h5>
       ),
     }
    ];
    if(deleteRights)
    {
     columns1.push({
        Header: "ACTION",
        Cell : data => (<div className="list-action d-inline hover-action">
        {  (deleteRights && (data.original.clientid == data.original.requestclientid)) &&
          <Fab className="btn-danger text-white m-5 pointer size-25" variant="round" mini = "true" onClick={() => this.initiateDelete(data.original,'taxcodecategory')}>
            <i className="zmdi zmdi-delete"></i>
          </Fab>  }
          </div>
        ),
        filterable : false,
        sortable : false,
         width:80,
         className : "text-center",

      });
    }
    return (
      <div className="texttaxdetail-wrapper mb-10">
      <div  className= "row" >
      <div className = "col-12 col-md-6 col-xl-6 d-inline">
          <div  className= "row" >
          <div className="col-12 ">
                   <div  className= "row" >
                    <label className="professionaldetail_padding  pt-10" > Discount type </label>
                         <RadioGroup row aria-label="discounttype" className = "pl-15"  id="discounttype" name="discounttype" value={taxdetail.discounttype} onChange={(e) => this.onChange('discounttype', e.target.value)}>
                         {
                           DiscountType.map((discounttype, key) => ( <FormControlLabel value={discounttype.value}
                              key= {'discounttypeOption' + key} control={<Radio />} label={ discounttype.name } />))
                         }
                         </RadioGroup>
              </div>
          </div>
          <div className = "col-12">
              <div className ="row">
              <label className="professionaldetail_padding  pt-10" > Print type</label>
                       <RadioGroup row  aria-label="printtype"  name="printtype"   value={taxdetail.printtype} onChange={(e) => this.onChange('printtype', e.target.value)}>
                       {
                         PrintType.map((printtype, key) => ( <FormControlLabel value={printtype.value} key= {'printtypeOption' + key} control={<Radio />} label={printtype.name} />))
                       }
                     </RadioGroup>
              </div>
          </div>

          <div className = "col-12">
              <div className ="row">
              <label className="professionaldetail_padding  pt-10" > Terms & conditions on </label>
                       <RadioGroup row  aria-label="termsconditionstype"  name="termsconditionstype"   value={taxdetail.termsconditionstype} onChange={(e) => this.onChange('termsconditionstype', e.target.value)}>
                       {
                         Termsandconditionconfiguration.map((termsconditionstype, key) => ( <FormControlLabel value={termsconditionstype.value} key= {'termsconditionstypeOption' + key} control={<Radio />} label={termsconditionstype.name} />))
                       }
                     </RadioGroup>
              </div>
          </div>

          <div className="col-12">
                    <TextField  inputProps={{maxLength:7000}} multiline rows={taxdetail.termsconditionstype == 1 ? 3 : 7} id="termsconditions" fullWidth label="Terms & Conditions"  value={taxdetail.termsconditions} onChange={(e) => this.onChange('termsconditions', e.target.value)}/>
                    <FormHelperText  error>{'Total characters : ' + taxdetail.termsconditions.length + ' (Max. 7000 characters allowed)'}</FormHelperText>
                    <FormHelperText  error>{errors.termsconditions}</FormHelperText>
           </div>
           <div className="col-12">
                     <TextField  inputProps={{maxLength:2000}} multiline rows={2}  id="footermessge" fullWidth label="Invoice footer message"  value={taxdetail.footermessge} onChange={(e) => this.onChange('footermessge', e.target.value)}/>
                     <FormHelperText  error>{'Total characters : ' + taxdetail.footermessge.length + ' (Max. 2000 characters allowed)'}</FormHelperText>
                     <FormHelperText  error>{errors.footermessge}</FormHelperText>
            </div>

            <div className="col-12 col-md-6 col-xl-6 mb-10">
             <div className = "row" style={{display: 'flex'}}>
                 <div className="col-11">
                     <span>Authorised signature</span>
                 </div>
                <div className="pull-right">
                    <i className="ti-close text-danger pointer"
                    onClick={() =>
                      {
                          if(taxdetail.imageFiles.length > 0)
                          {
                            this.setState({
                             taxdetail: {
                               ...this.state.taxdetail,
                                 'imageFiles' : []
                               }
                           });
                          }
                          else if(taxdetail.signimage)
                          {
                            this.setState({
                             taxdetail: {
                               ...this.state.taxdetail,
                                 'signimage' : ''
                               }
                           });
                          }
                      }
                      }></i>

                </div>
              </div>
              <Dropzone  onDrop={(imageFiles) =>this.onChangeImageToCrop('imageFiles',imageFiles)} accept="image/jpeg, image/png" multiple={false} >
                              {({getRootProps, getInputProps}) => (
                                <section >
                                  <div
                                    {...getRootProps({
                                      className: 'dropzone '
                                    })}
                                     style={{ minHeight: '80px',height : '130px',minWidth : '140px' }}
                                  >
                                    <input {...getInputProps()} />

                    <div className="col-10" >
                        <div className="overlay-wrap overflow-hidden" >
                          <div className="text-center p-2">

                          {
                            taxdetail.imageFiles.length > 0 ?
                    <img src={taxdetail.imageFiles[0].preview} key= {'pro'} alt="" type="file" name="imageFiles" width="140" height="110" />
                    :<img src={taxdetail.signimage && CustomConfig.serverUrl + taxdetail.signimage} alt="" type="file" name="imageFiles" width="140" height="110"  />
                    }
                           </div>

                       </div>

                    </div>
       </div>
     </section>
   )}
 </Dropzone>
  </div>

               <div className = "col-12 ">

                   <div  className= "row" >
                       <div className="professionaldetail_padding">Enable taxes
                          <Switch checked={taxdetail.istaxenable==false?false:true} onChange={(e) => this.onChange('istaxenable', e.target.checked )} aria-label=""
                             value="yes"		/>Yes
                      </div>
                      <p className = "pl-20">By enabling taxes, you need to create a tax code category and the tax code category must be assigned at the service and product configuration to generate a valid tax invoice.</p>
                  </div>

                </div>
                {( taxdetail.istaxenable == 1) &&
                <div className = "col-12 col-md-8 col-xl-6">
                    <TextField required inputProps={{maxLength:15}}   id="gstin" autoFocus = {true} fullWidth label={clientProfileDetail.countrycode == "IN" ? "Sales Tax Number (GSTIN)" :  "Sales Tax Number"} placeholder = "Ex. GSTIN" value={taxdetail.gstin} onChange={(e) =>this.onChange( 'gstin' ,e.target.value)} />
                     <FormHelperText  error>{errors.gstin}</FormHelperText>
                </div>
              }

                {taxdetail.istaxenable == 1 &&
                <div className = "col-12 ">
                    {/*<div className ="row">
                             <label className="professionaldetail_padding pt-10" > Tax Type</label>
                             <RadioGroup row  aria-label="taxtype"  name="taxtype" className = "pl-15"   value={taxdetail.taxtype} onChange={(e) => this.onChange('taxtype', e.target.value)}>
                             {
                               TaxType.map((taxtype, key) => ( <FormControlLabel value={taxtype.value} key= {'taxtypeOption' + key} control={<Radio />} label={taxtype.name} />))
                             }
                           </RadioGroup>
                    </div>*/}
                </div>
              }
              <div className = "col-12 pb-10">
                      <div  className= "row" >
                         <div className="professionaldetail_padding">  Apply Card Swipe Charge
                           <Switch checked={cardswipedetail.iscardswipeenable==0?false:true} onChange={(e) => this.onChange('iscardswipeenable', e.target.checked )} aria-label=""
                           value="yes"		/>Yes
                         </div>
                         {cardswipedetail.iscardswipeenable == 1 &&
                             <div className= {"col-12 col-xl-6" } >
                             <FormControl fullWidth>
                              <InputLabel required htmlFor="cardswipepercentage" >Card Swipe Charge In Percentage</InputLabel>
                                  <Input
                                    id="cardswipepercentage"
                                    type= "number"
                                    inputProps={{min:0,max :20}}
                                    value={cardswipedetail.cardswipepercentage}
                                    onChange={(e) => this.onChange('cardswipepercentage',e.target.value > 20 ? 20 : e.target.value)}
                                    endAdornment={'%'}
                                  />
                                  {
                                     <FormHelperText  error>{errors.cardswipepercentage}</FormHelperText>
                                  }
                                 </FormControl>
                             </div>
                         }
                     </div>
                     </div>
                     {taxdetail.istaxenable == 1 &&
                      <div className = "col-12 ">
                         <div  className= "row" >
                             <div className="professionaldetail_padding">Show Payment Details in GST Invoice
                                <Switch checked={taxdetail.isshowpaymentdetailingstinvoice==false?false:true} onChange={(e) => this.onChange('isshowpaymentdetailingstinvoice', e.target.checked )} aria-label=""
                                   value="yes"		/>Yes
                            </div>
                        </div>
                      </div>
                    }
                    {taxdetail.istaxenable == 1 &&
                     <div className = "col-12 ">
                        <div  className= "row" >
                            <div className="professionaldetail_padding">Show Benefit in Invoice
                               <Switch checked={taxdetail.showbenefitininvoice==false?false:true} onChange={(e) => this.onChange('showbenefitininvoice', e.target.checked )} aria-label=""
                                  value="yes"		/>Yes
                           </div>
                       </div>
                     </div>
                   }
          {(updateRights && addRights) &&
          <div className="pb-20">
          <div className="col-4">
              <Button  color="primary" variant="contained" onClick={() => this.onSave()} className="text-white">Save</Button>
            </div>
          </div>
        }
      </div>
      </div>
          {(taxdetail.istaxenable == 1) &&
          <div className = "col-12 col-md-6 col-xl-6 d-inline">

        <div className="d-flex justify-content-between mb-10">
          <div>
               <Link to="/app/setting/organization/2#addtaxcodecategory"  className="btn-outline-default mr-10 fw-bold"><i className="ti-plus"></i> Add Tax Code Category</Link>
           </div>
        </div>
        <div className = "col-12  p-0  mb-40 ">
            <ReactTable
               columns={columns1}
                  filterable = { false}
                  manual // Forces table not to paginate or sort automatically, so we can handle it server-side
                  sortable = { false }
                  data = {taxcodecategories || []}
                  minRows = {taxcodecategories && taxcodecategories.length}
                 // Forces table not to paginate or sort automatically, so we can handle it server-side
                  showPagination= {false}
                  showPaginationTop = {false}
                  loading={false} // Display the loading overlay when we need it
                  defaultPageSize={4}
                  className=" -highlight"
                  freezeWhenExpanded = {true}
                  onFetchData = {(state, instance) => {this.props.getTaxCodeCategory({state}) }}
                  />
        </div>
        {(updateRights && addRights) &&
          <div className="d-flex justify-content-between mb-10">
            <div>
                 <Link to="/app/setting/organization/2#addtax"  className="btn-outline-default mr-10 fw-bold"><i className="ti-plus"></i> Add Tax</Link>
                  <Link to="/app/setting/organization/2#addtaxgroup"  className="btn-outline-default mr-10 fw-bold"><i className="ti-plus"></i> Add Tax Group</Link>
             </div>
          </div>
        }
           <div className = "col-12 p-0 mb-40">
               <ReactTable
                  columns={columns}
                     filterable = { false}
                     manual // Forces table not to paginate or sort automatically, so we can handle it server-side
                     sortable = { false }
                     data = {taxes || []}
                     minRows = {taxes && taxes.length}
                    // Forces table not to paginate or sort automatically, so we can handle it server-side
                     showPagination= {false}
                     showPaginationTop = {false}
                     loading={false} // Display the loading overlay when we need it
                     defaultPageSize={4}
                     className=" -highlight"
                     freezeWhenExpanded = {true}
                     onFetchData = {(state, instance) => {this.props.getClientTax({state}) }}
                     />
           </div>
        </div>

      }

        </div>
        { signImageCropped &&
       <ImageCropper onCancel = {this.onCloseImageCropperDialog.bind(this)}
                      imageforcrop = {signImageCropped}
                      onCrop ={(croppedimage) => this.onChangeCroppedImage(croppedimage)}
                      imageHeightWidth = {imageHeightWidth}
                      />
                    }

      {
         confirmationDialog &&
       <DeleteConfirmationDialog
         openProps = {confirmationDialog}
         title="Are You Sure Want To Continue?"
         message={<span>This will change your invoice/tax settings.<br /> User will be logged out after successfull update.</span>}
         onConfirm={() => this.onConfirm()}
          onCancel={() => this.cancelConfirmation()}
       />
       }
       {
         deleteConfirmationDialog &&
         <DeleteConfirmationDialog
           openProps = {deleteConfirmationDialog}
           title="Are You Sure Want To Delete?"
           message= { <span className = 'text-capitalize'>  {dataToDelete.taxname ? dataToDelete.taxname : dataToDelete.taxcategoryname} </span> }
           onConfirm={() => this.onDelete(dataToDelete)}
            onCancel={() => this.cancelDelete()}
         />
       }

       <AddTax />
       <ViewTax/>
       <AddTaxCodeCategory/>
       <ViewTaxCodeCategory/>

  </div>
    );
  }
}

const mapStateToProps = ({ settings }) => {
  const {taxes,taxlist,taxcodecategories, clientProfileDetail } = settings;
  return { taxes,taxlist,taxcodecategories , clientProfileDetail};
};

export default withRouter(connect(mapStateToProps, {opnAddNewTaxModel,clsAddNewTaxModel,getClientTax,
  saveClientTaxConfiguration,deleteClientTax,opnViewClientTaxModel,opnAddNewTaxCodeCategoryModel,clsAddNewTaxCodeCategoryModel,
  getTaxCodeCategory,opnViewTaxCodeCategoryModel,deletTaxCodeCategory,push})(TaxeConfiguration));
