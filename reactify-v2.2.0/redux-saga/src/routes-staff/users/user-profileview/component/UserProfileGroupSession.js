/**
 * Employee Management Page
 */
import React, { Component } from 'react';
// Import React Table
import ReactTable from "react-table";
import api from 'Api';
import {getFormtedDate,makePlaceholderRTFilter,cloneDeep,setLocalDate} from 'Helpers/helpers';
import DatePicker from 'Routes/advance-ui-components/dateTime-picker/components/DatePicker';
import GroupSessionFilter  from 'Assets/data/groupsessionfilter';

import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import CloseIcon from '@material-ui/icons/Close';
import {isMobile} from 'react-device-detect';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';

class UserProfileGroupSession extends Component {
   constructor(props) {
      super(props);
      this.state = this.getInitialState();
   }
   getInitialState()
   {
     this.initialState = {
                     groupsessions:null,

                     tableInfo : {
                       pageSize : 5,
                       pageIndex : 0,
                       pages : 1,
                       userId : 0,
                     },
                     sessionfilter : '1'
                   }
                   return cloneDeep(this.initialState);
     }

    getUserProfileGroupSessions({state,sessionfilter})
    {
                let {tableInfo}  = this.state ;
                let {id,month,year,activeIndex} = this.props;

                tableInfo.filtered = tableInfo.filtered || [];
                tableInfo.client_timezoneoffsetvalue = (localStorage.getItem('client_timezoneoffsetvalue') || 330);
                sessionfilter = sessionfilter == undefined ? this.state.sessionfilter: sessionfilter;
                if(state){
                  tableInfo.pageIndex  = state.page;
                  tableInfo.pageSize  = state.pageSize;
                  tableInfo.sorted  = state.sorted;
                  tableInfo.filtered = state.filtered;
                  tableInfo.userId =  id;
                  tableInfo.monthFilter =  month;
                  tableInfo.yearFilter =  year;
                  tableInfo.chartFilter =  activeIndex;
                }
                if(tableInfo.filtered && tableInfo.filtered.length > 0)
                {
                  tableInfo.filtered.map(x => {
                    if(x.id == "createdbydate") {
                      x.value = setLocalDate(x.value)
                    }
                  });
                }
         if(sessionfilter == 1){
            api.post('get-employeegroupsession', tableInfo)
           .then(response =>
             {

                this.setState({groupsessions : response.data[0],tableInfo : {...this.state.tableInfo , pages : response.data[1][0].pages}  })
              }
           ).catch(error => console.log(error) )
         }
         else{
           api.post('get-employeegroupsessionclasswise', tableInfo)
          .then(response =>
            {

               this.setState({groupsessions : response.data[0],tableInfo : {...this.state.tableInfo , pages : response.data[1][0].pages}  })
             }
          ).catch(error => console.log(error) )
        }
   }

   onChange(key,value){
     let {sessionfilter}  = this.state ;
     if(key == 'sessionfilter'){
       sessionfilter = value;
     }
     this.setState({
      sessionfilter : sessionfilter
    });
    this.getUserProfileGroupSessions({sessionfilter})
   }
 render() {

 let	{ groupsessions,tableInfo,sessionfilter} = this.state;
 const { id,open,onClose ,sessiontypelist} = this.props;
 let columns =[
   {
      Header: "ATTENDED ON",
     accessor :"createdbydate",
     Filter: ({onChange }) =>
      (
        <DatePicker  keyboard = {false}
          onChange = {date => onChange( date) }
        />
        ),
     Cell : data => (
       getFormtedDate(data.original.createdbydate)
     ),
     className : "text-center",
     minWidth:120,
   },
   {
      Header: "Commission",
      accessor :"commission",
      Filter : makePlaceholderRTFilter(),
      minWidth:120,
      className : "text-right",
  },
   {
    Header: "Class NAME",
    accessor :"classname",
    Cell : data =>
    (
          <h5 className=" text-uppercase">{data.original.classname}</h5>
    ),
    Filter : makePlaceholderRTFilter(),
    minWidth:140,
  },
  {
    Header: "SESSION TYPE",
    accessor :"sessiontype",
     Filter: ({ filter, onChange }) =>
       ( <select
           onChange={event => onChange(event.target.value)}
           style={{ width: "100%" }}
           value={filter ? filter.value : ""}
         >
         <option value="" >Show All</option>
         {  sessiontypelist && sessiontypelist.map((sessiontype, key) => (<option value={sessiontype.value} key = {'sessiontypeOption' + key }>{sessiontype.label}</option>  )) }
         </select>
       ),
       minWidth:120,
     },
 ]

 if(sessionfilter == '1')
   {
   columns.splice(2, 0, {
        Header: "MEMBER NAME",
        accessor :"name",
        Cell : data =>
        (
              <h5 className=" text-capitalize">{data.original.name}</h5>
        ),
        Filter : makePlaceholderRTFilter(),
        minWidth:120,
   })
 }
     return (
       <Dialog 	fullScreen = {isMobile ? true : false} fullWidth = {true} maxWidth = 'md'
           onClose={() => onClose()}
           open={open}
         >
         <DialogTitle >
             <div className="row">
                 <div className="col-sm-4 col-md-4 col-xl-4">
                     <span className="fw-bold text-capitalize">Conducted Group Session</span>
                  </div>
                  <div className="col-10 col-sm-7 col-md-7 col-xl-7">
                       <RadioGroup row aria-label="sessionfilter"   className ={'pl-15'}  name="sessionfilter" value={sessionfilter} onChange={(e) => this.onChange('sessionfilter', e.target.value,false)}>
                       {
                        GroupSessionFilter.map((sessionfilter, key) => ( <FormControlLabel value={sessionfilter.value}  key= {'sessionfilterOption' + key} control={<Radio />} label={sessionfilter.name} />))
                       }
                       </RadioGroup>
                   </div>
                  <div className="col-1 col-sm-1 col-md-1 col-xl-1">
                       <CloseIcon onClick={() => onClose()} className = {"pull-right pointer"}/>
                  </div>
          </div>
         </DialogTitle >
     <div className="table-responsive">

     <ReactTable
       columns={columns}
       manual // Forces table not to paginate or sort automatically, so we can handle it server-side
       showPaginationTop = {true}
       data={groupsessions || []}
       pages={tableInfo.pages} // Display the total number of pages
       loading={groupsessions ? false : true} // Display the loading overlay when we need it
       filterable
       defaultPageSize={tableInfo.pageSize}
       minRows = {1}
       className=" -highlight"
       onFetchData = {(state, instance) => {this.getUserProfileGroupSessions({state}) }}
     />
         </div>
 </Dialog>

 );
  }
  }

export default UserProfileGroupSession;
