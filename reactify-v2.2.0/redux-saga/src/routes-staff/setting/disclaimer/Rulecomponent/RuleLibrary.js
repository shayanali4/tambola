/**
 * Employee Management Page
 */
import React, { Component } from 'react';
// Import React Table
import {cloneDeep} from 'Helpers/helpers';

import api from 'Api';
import ReactTable from "react-table";

 export default class RuleLibrary extends Component {

   constructor(props) {
      super(props);
      this.state = this.getInitialState();
   }
   getInitialState()
   {
     this.initialState = {
                     rules:null,
                     tableInfo : {
                       pageSize : 10,
                       pageIndex : 0,
                       pages : 1,
                       totalrecord :0,
                     },
                   }
                   return cloneDeep(this.initialState);
     }


   getRules(state)
   {
     let {tableInfo }  = this.state ;

     tableInfo.filtered = tableInfo.filtered || [];

     if(state){

       tableInfo.pageIndex  = state.page;
       tableInfo.pageSize  = state.pageSize;
       tableInfo.sorted  = state.sorted;
       tableInfo.filtered = state.filtered;
     }
     api.post('get-rules-library', tableInfo)
    .then(response =>
      {
         this.setState({rules : response.data[0] ,tableInfo : {...this.state.tableInfo , pages : response.data[1][0].pages, totalrecord : response.data[1][0].count} })
       }
    ).catch(error => console.log(error) )
   }


	render() {

	const	{rules,tableInfo} = this.state;
   	return (

         <div className="table-responsive">

             <div className="d-flex justify-content-between pb-10 px-10">
              <div>

              </div>
              <div >
                 <span > Total {tableInfo.totalrecord} Records </span>
              </div>
            </div>

             <ReactTable
               columns={[
            		 {
            			 Header: "Rules",
            			 accessor: "rulename",
            			 Cell : data => (
              				 <div className="media">
              				     <h5 >{data.original.rulename}</h5>
              				 </div>
            			 )
            		 },
            	 	 ]}
               manual // Forces table not to paginate or sort automatically, so we can handle it server-side
               showPaginationTop = {true}
               data={ rules || []}
               pages={tableInfo.pages} // Display the total number of pages
               loading={rules ? false : true} // Display the loading overlay when we need it
               filterable
               defaultPageSize={tableInfo.pageSize}
               minRows = {1}
               className=" -highlight"
               onFetchData = {(state, instance) => {this.getRules(state) }}
             />
        </div>


	);
  }
  }
