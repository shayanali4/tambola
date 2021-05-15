/**
 * Employee Management Page
 */
import React, { Component } from 'react';
// Import React Table
import ReactTable from "react-table";
import api from 'Api';
import {getFormtedDate,makePlaceholderRTFilter,cloneDeep,setLocalDate } from 'Helpers/helpers';
import DatePicker from 'Routes/advance-ui-components/dateTime-picker/components/DatePicker';
import Tooltip from '@material-ui/core/Tooltip';
import  Paymentmode  from 'Assets/data/paymentmode';
import StaffPayType from 'Assets/data/staffpaytype';
import IsTaxInvoice  from 'Assets/data/istaxinvoice';

class UserProfileStaffpay extends Component {
   constructor(props) {
      super(props);
      this.state = this.getInitialState();
   }
   getInitialState()
   {
     this.initialState = {
                    staffpay:null,
                     tableInfo : {
                       pageSize : 5,
                       pageIndex : 0,
                       pages : 1,
                       memberId : 0,
                     },
                   }
                   return cloneDeep(this.initialState);
     }

    getUserProfileStaffpay(state)
    {

                let {tableInfo }  = this.state ;
                let {id} = this.props;

                tableInfo.filtered = tableInfo.filtered || [];

                if(state){
                  tableInfo.pageIndex  = state.page;
                  tableInfo.pageSize  = state.pageSize;
                  tableInfo.sorted  = state.sorted;
                  tableInfo.filtered = state.filtered;
                  tableInfo.userId =  id;
                }

                if(tableInfo.filtered && tableInfo.filtered.length > 0)
                {
                  tableInfo.filtered.map(x => {
                    if(x.id == "paymentdate") {
                      x.value = setLocalDate(x.value)
                    }
                  });
                }

      api.post('user-profile-staffpay', tableInfo)
     .then(response =>
       {
         response.data[0].map((x) => {
           x.remark = x.remark ? unescape(x.remark) : '';
         })
          this.setState({staffpay : response.data[0],tableInfo : {...this.state.tableInfo , pages : response.data[1][0].pages}  })
        }
     ).catch(error => console.log(error) )
    }

 render() {

 let	{ staffpay,tableInfo} = this.state;
  const { id} = this.props;

let columns =[
  {
    Header: "Payment Date",
    accessor: "paymentdate",
    Filter: ({onChange }) =>
      (
        <DatePicker  keyboard = {false}
          onChange = {date => onChange( date) }
        />
        ),
    Cell : data => (
      getFormtedDate(data.original.paymentdate)
    ),
    minWidth : 100,
    className : "text-center",
  },
  {
    Header: "Payment Mode",
    accessor: "paymentmode",
    minWidth : 120,
    Filter: ({ filter, onChange }) =>
      ( <select
          onChange={event => onChange(event.target.value)}
          style={{ width: "100%" }}
          value={filter ? filter.value : ""}
        >
        <option value="" >Show All</option>
        {  Paymentmode.map((payment, key) => (<option value={payment.value} key = {'paymentOption' + key }>{payment.name}</option>  )) }
        </select>
      ),
    Cell : data =>
           (
               <div >
                 <Tooltip PopperProps={{ style: { pointerEvents: 'none' } }} id="tooltip-top" disableFocusListener disableTouchListener  title={(data.original.paymentmodeId != 1 ?
                   (data.original.paymentmodeId == 2 ?
                     ("Cheque No : " + data.original.chequeno + " ,Cheque Date : " + getFormtedDate(data.original.chequeDate) + " ,Bank Name : " + data.original.bankName + (data.original.remark ? (" ,Remark : "+ data.original.remark) : ''))
                     : ("Reference ID : " + data.original.referenceid + (data.original.remark ? (" ,Remark : "+ data.original.remark) : '')))
                   : "Remark : "+ data.original.remark)} placement="bottom-start">
                     <h5 >{data.original.paymentmode}</h5>
                 </Tooltip>
               </div>
          ),
  },
  {
    Header: "Pay Type",
    accessor: "staffpaytype",
    Filter: ({ filter, onChange }) =>
      ( <select
          onChange={event => onChange(event.target.value)}
          style={{ width: "100%" }}
          value={filter ? filter.value : ""}
        >
        <option value="" >Show All</option>
        {  StaffPayType.map((staffpaytype, key) => (<option value={staffpaytype.value} key = {'staffpaytypeOption' + key }>{staffpaytype.name}</option>  )) }
        </select>
      ),
      minWidth:130,
  },
  {
    Header: "Dues Adjust with salary pay",
    accessor: "advancepaymentadjustment",
    Filter: ({ filter, onChange }) =>
      ( <select
          onChange={event => onChange(event.target.value)}
          style={{ width: "100%" }}
          value={filter ? filter.value : ""}
        >
        <option value="" >Show All</option>
        {  IsTaxInvoice.map((advancepaymentadjustment, key) => (<option value={advancepaymentadjustment.value} key = {'advancepaymentadjustmentOption' + key }>{advancepaymentadjustment.name}</option>  )) }
        </select>
      ),
      Cell : data => (
      <div>  {data.original.advancepaymentadjustmentLabel}</div>
      ),
      minWidth:200,
  },
  {
    Header: "Paid Salary/Advance Pay",
    accessor: "paidsalary",
    minWidth : 180,
    className : "text-right",
    Filter : makePlaceholderRTFilter(),
  },
  {
    Header: "Paid Commission",
    accessor: "paidcommission",
    Filter : makePlaceholderRTFilter(),
    minWidth : 120,
    className : "text-right",
  },
  {
    Header: "Total Paid Amount",
    accessor: "amount",
    Filter : makePlaceholderRTFilter(),
    minWidth : 140,
    className : "text-right",
  }
]


     return (
   <div>
     <div  className="table-responsive">
        <ReactTable

          columns={columns}
          manual // Forces table not to paginate or sort automatically, so we can handle it server-side
          showPaginationTop = {false}
          data={staffpay || []}
          showPagination = {true}
          pages={tableInfo.pages} // Display the total number of pages
          loading={staffpay ? false : true} // Display the loading overlay when we need it
          filterable
          defaultPageSize={tableInfo.pageSize}
          minRows = {1}
          className=" -highlight"
          onFetchData = {(state, instance) => {this.getUserProfileStaffpay(state) }}
        />

         </div>
       </div>

 );
  }
  }


  export default UserProfileStaffpay;
