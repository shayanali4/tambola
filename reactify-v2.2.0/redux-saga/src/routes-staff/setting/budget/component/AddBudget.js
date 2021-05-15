/**
 * Employee Management Page
 */
import React, { Component, PureComponent } from 'react';
// Import React Table
import { connect } from 'react-redux';

import RctSectionLoader from 'Components/RctSectionLoader/RctSectionLoader';
import { clsAddNewBudgetModel, saveBudget } from 'Actions';

import Bloodgroup  from 'Assets/data/bloodgroup';

import {getLocalDate, getFormtedDate, checkError, cloneDeep,getMontEndDays,getYearEndDays,calculateExpiryDate} from 'Helpers/helpers';
import Dialog from '@material-ui/core/Dialog';
import BudgetDetail from './BudgetDetail';
import AppBar from '@material-ui/core/AppBar';
import PerfectScrollbar from 'Components/PerfectScrollbar';

import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Appaccess  from 'Assets/data/appaccess';
import BudgetPeriod  from 'Assets/data/budgetperiod';

import CloseIcon from '@material-ui/icons/Close';
import SaveIcon from '@material-ui/icons/Save';

import {required,email,checkLength,checkMobileNo,checkPincode,checkAlpha ,restrictLength} from 'Validations';
import { push } from 'connected-react-router';

import {isMobile} from 'react-device-detect';
import { NotificationManager } from 'react-notifications';
import BudgetType  from 'Assets/data/budgettype';
import Button from '@material-ui/core/Button';

function TabContainer({ children }) {
    return (
        <Typography component="div" style={{ padding: isMobile ? 0 : 8 * 3 }}>
            {children}
        </Typography>
    );
}

class AddBudget extends PureComponent {
	constructor(props) {
     super(props);
		   this.state = this.getInitialState();
   }

   getInitialState()
   {
     this.initialState = {
             activeIndex : 0,
             duration :"Month",
             durationcount : "3",
             totalmonthlybudget : '',
             budgetDetail:
             {
               fields : {
                           id :0,
                          budgetperiod : '1',
                          month : null,
                          startDate : null,
                          endDate : null,
                          budgettype :BudgetType,
                          totalbudget : 0
                       },
              errors : { },
               validated : false
           },
     };

      return cloneDeep(this.initialState);
   }


   componentWillReceiveProps(newProps)
   {
     const	{editbudget, editMode} = newProps;
     let {budgetDetail} = this.state;
     budgetDetail = budgetDetail.fields;
     if(editMode && editbudget && editbudget.id && editbudget.id != this.state.budgetDetail.fields.id )
     {
       budgetDetail.id = editbudget.id;
       budgetDetail.budgetperiod = editbudget.budgetperiodId;
       budgetDetail.month = getLocalDate(editbudget.month);
       budgetDetail.startDate = getLocalDate(editbudget.startDate);
       budgetDetail.endDate = getLocalDate(editbudget.endDate);
       budgetDetail.budgettype = editbudget.budgettype;
       budgetDetail.totalbudget = editbudget.totalbudget;

      this.state.duration = editbudget.duration;
      this.state.durationcount = editbudget.durationcount;
      this.state.totalmonthlybudget = editbudget.totalmonthlybudget;


        this.state.budget_old = cloneDeep(budgetDetail);
     }
   }

   componentWillUpdate(nextProps, nextState)
   {
     if((!nextProps.editMode && nextState.budgetDetail.fields.id != 0) || (this.props.addNewBudgetModal && !nextProps.addNewBudgetModal))
     {
        this.setState(this.getInitialState());
     }
   }


   onChangeBudgetDetail(key,value, isRequired)
   	{
   		let error= isRequired ? required(value) : '';
      const fields = this.state.budgetDetail.fields;
      let {startDate,endDate,budgetperiod,budgettype,totalbudget} = fields;
        let {durationcount,duration,totalmonthlybudget} = this.state;
      if(key == "budgetperiod"){
        let budgetPeriodduration = BudgetPeriod.filter(x => x.value == value)[0];
        duration = budgetPeriodduration.duration;
        durationcount = budgetPeriodduration.durationcount;
        totalmonthlybudget = fields.budgettype.map(x => ((x.budget || 0) /durationcount).toFixed(2) || '').reduce((a, b) => parseFloat(a) + parseFloat(b), 0);
          if(fields.month){
            let monthdays = getMontEndDays(fields.month);
             startDate = monthdays.firstDay;
             endDate = calculateExpiryDate(startDate,durationcount,duration);
          }
      }
    else if(key == "month"){
       let monthdays = getMontEndDays(value);
        startDate = monthdays.firstDay;
        endDate = calculateExpiryDate(startDate,durationcount,duration);
     }
    else if(key == "budgettype"){
          budgettype.forEach(x =>{
            if(x.value == value.id)
            {
           if(value.key == 'budget')
            {
              x[value.key] = value.value;
            }
          }
        })
          totalbudget = budgettype.map(x => x.budget || 0).reduce((a, b) => parseFloat(a) + parseFloat(b), 0);
          totalmonthlybudget = budgettype.map(x => ((x.budget || 0) /durationcount).toFixed(2) || '').reduce((a, b) => parseFloat(a) + parseFloat(b), 0);

          value = budgettype;
     }

   		this.setState({
   			budgetDetail: {
   				...this.state.budgetDetail,
   				fields : {...this.state.budgetDetail.fields,
   					[key] : value,
            startDate : startDate,
            endDate : endDate,
            totalbudget : totalbudget
   				},
   				errors : {...this.state.budgetDetail.errors,
   					[key] : error
   				}
   			},
        durationcount : durationcount,
        duration : duration,
        totalmonthlybudget : totalmonthlybudget ? parseFloat(totalmonthlybudget.toFixed(2))  : ''
     	});
      }

  validate()
    {
      let errors = {};
      const fields = this.state.budgetDetail.fields;
      errors.budgetperiod = required(fields.budgetperiod);
      errors.month = required(fields.month);

      let validated = checkError(errors);

       this.setState({
         budgetDetail: {	...this.state.budgetDetail,
            errors : errors, validated : validated
         }
       });

       return validated;
   }


   onSaveBudget()
   {
     const {budgetDetail,budget_old} = this.state;
     const	{editbudget, editMode} = this.props;
     if(this.validate())
     {
       if(!editMode || (editbudget && (JSON.stringify(budget_old) != JSON.stringify(budgetDetail.fields))))
        {
             let budget = budgetDetail.fields.budgettype.filter(x => x.budget);
             if(budget.length > 0){
                  const budgetdetail  = budgetDetail.fields;
                  budgetdetail.budgettypeArray = budgetdetail.budgettype.filter(x => x.budget && x.name != 'Total');
                  this.props.saveBudget({budgetdetail});
             }
             else{
               NotificationManager.error("Please fill Budget .");
             }
           }
      else {
             NotificationManager.error('No changes detected');
        }
     }
   }

    onClose()
	 	{
      this.setState(this.getInitialState());
	 		this.props.clsAddNewBudgetModel();
      this.props.push('/app/setting/budget');
	 	}

	render() {

	 const	{addNewBudgetModal ,dialogLoading ,disabled,clientProfileDetail,editbudget,editMode} = this.props;
 	 const {activeIndex ,budgetDetail,durationcount,duration,totalmonthlybudget} = this.state;
		return (
			<Dialog fullScreen open={addNewBudgetModal} onClose={() =>this.onClose()} >
					<AppBar position="static" className="bg-primary">
							<Toolbar>
									<IconButton color="inherit" onClick={() =>this.onClose()} aria-label="Close">
												<CloseIcon />
									</IconButton>
									<h5 className="w-50 mb-0 ">{ budgetDetail.fields.id != 0 ? 'UPDATE ' : 'ADD '  } BUDGET</h5>
									<div className="w-50 mb-0">
                  <Tabs
                        value = {activeIndex}
                        variant="fullWidth"
                        indicatorColor="secondary" >

                  </Tabs>
             </div>

             <Button onClick={() =>this.onSaveBudget()} disabled = {disabled} variant="text" mini= "true" ><SaveIcon /><span className ="pl-5">SAVE</span> </Button>


						</Toolbar>
				</AppBar>
        {((editMode && !editbudget) || dialogLoading ) &&
					<RctSectionLoader />
				}
				<PerfectScrollbar style={{ height: 'calc(100vh - 5px)' }}>

        <TabContainer> <BudgetDetail  isMultipleBranch = {clientProfileDetail.ishavemutliplebranch} fields = {budgetDetail.fields} errors ={budgetDetail.errors}
        onChange = {this.onChangeBudgetDetail.bind(this)} packtypeId = {clientProfileDetail.packtypeId} durationcount ={durationcount} duration ={duration} totalmonthlybudget ={totalmonthlybudget}/> </TabContainer>

        </PerfectScrollbar>
    			</Dialog>
	);
  }
  }
const mapStateToProps = ({ budgetReducer ,settings}) => {
	const { addNewBudgetModal, disabled, dialogLoading,editMode,editbudget} =  budgetReducer;
  const { clientProfileDetail} = settings;
  return { addNewBudgetModal, disabled , dialogLoading,clientProfileDetail,editMode,editbudget}
}

export default connect(mapStateToProps,{
	clsAddNewBudgetModel, saveBudget,push})(AddBudget);
