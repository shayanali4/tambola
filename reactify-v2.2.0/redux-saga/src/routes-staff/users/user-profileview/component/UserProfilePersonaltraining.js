/**
 * Employee Management Page
 */
import React, { Component } from 'react';
// Import React Table
import ReactTable from "react-table";
import api from 'Api';
import {getFormtedDate,getFormtedFromTime,makePlaceholderRTFilter,cloneDeep,setLocalDate} from 'Helpers/helpers';
import DatePicker from 'Routes/advance-ui-components/dateTime-picker/components/DatePicker';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import CloseIcon from '@material-ui/icons/Close';
import {isMobile} from 'react-device-detect';

class UserProfilePersonaltraining extends Component {
   constructor(props) {
      super(props);
      this.state = this.getInitialState();
   }
   getInitialState()
   {
     this.initialState = {
                     personaltrainings:null,

                     tableInfo : {
                       pageSize : 5,
                       pageIndex : 0,
                       pages : 1,
                       userId : 0,
                     },
                   }
                   return cloneDeep(this.initialState);
     }

    getUserProfilePersonaltrainings(state)
    {

                let {tableInfo }  = this.state ;
                let {id,month,year,activeIndex} = this.props;

                tableInfo.filtered = tableInfo.filtered || [];
                tableInfo.client_timezoneoffsetvalue = (localStorage.getItem('client_timezoneoffsetvalue') || 330);

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
                    if(x.id == "attendancedate") {
                      x.value = setLocalDate(x.value)
                    }
                  });
                }

      api.post('get-employeepersonaltraining', tableInfo)
     .then(response =>
       {

          this.setState({personaltrainings : response.data[0],tableInfo : {...this.state.tableInfo , pages : response.data[1][0].pages}  })
        }
     ).catch(error => console.log(error) )
    }

 render() {

 let	{ personaltrainings,tableInfo} = this.state;
 const { id,open,onClose,sessiontypelist } = this.props;

     return (
       <Dialog 	fullScreen = {isMobile ? true : false} fullWidth = {true} maxWidth = 'md'
           onClose={() => onClose()}
           open={open}
         >
         <DialogTitle >
         <span className="fw-bold text-capitalize">Conducted Personal Training</span>

           <CloseIcon onClick={() => onClose()} className = {"pull-right pointer"}/>

         </DialogTitle >
     <div className="table-responsive">

     <ReactTable
       columns={[
         {
            Header: "ATTENDED ON",
           accessor :"attendancedate",
           Filter: ({onChange }) =>
            (
              <DatePicker  keyboard = {false}
                onChange = {date => onChange( date) }
              />
              ),
           Cell : data => (
             getFormtedDate(data.original.attendancedate)
           ),
           className : "text-center",
           minWidth:120,
         },
         {
          Header: "START TIME",
           accessor: 'starttime',
           className : "text-center",
          Cell : data => (
            getFormtedFromTime(data.original.starttime)
          ),
          filterable : false,
          sortable : false,
          minWidth:100,
        },
        {
          Header: "END TIME",
           accessor: 'endtime',
           className : "text-center",
          Cell : data => (
            getFormtedFromTime(data.original.endtime)
          ),
          filterable : false,
          sortable : false,
          minWidth:100,
        },
        {
           Header: "Commission",
           accessor :"commission",
           Filter : makePlaceholderRTFilter(),
           minWidth:120,
         },
        {
           Header: "MEMBER NAME",
           accessor :"name",
           Cell : data =>
           (
                 <h5 className=" text-capitalize">{data.original.name}</h5>
           ),
           Filter : makePlaceholderRTFilter(),
           minWidth:120,
         },
         {
          Header: "SERVICE NAME",
          accessor :"servicename",
          Cell : data =>
          (
                <h5 className=" text-uppercase">{data.original.servicename}</h5>
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
             Cell : data =>
             (
                   <h5>{data.original.sessiontype && sessiontypelist && sessiontypelist.filter(x => x.value == data.original.sessiontype)[0].label  }</h5>
             ),
             minWidth:120,
           },
       ]}
       manual // Forces table not to paginate or sort automatically, so we can handle it server-side
       showPaginationTop = {true}
       data={personaltrainings || []}
       pages={tableInfo.pages} // Display the total number of pages
       loading={personaltrainings ? false : true} // Display the loading overlay when we need it
       filterable
       defaultPageSize={tableInfo.pageSize}
       minRows = {1}
       className=" -highlight"
       onFetchData = {(state, instance) => {this.getUserProfilePersonaltrainings(state) }}
     />
         </div>
 </Dialog>

 );
  }
  }

export default UserProfilePersonaltraining;
