/**
 * Employee Management Page
 */
import React, { Component } from 'react';
// Import React Table
import {cloneDeep} from 'Helpers/helpers';

import api from 'Api';
import ReactTable from "react-table";
import  Questiontype from 'Assets/data/questiontype';
import Tooltip from '@material-ui/core/Tooltip';

 export default class QuestionLibrary extends Component {

   constructor(props) {
      super(props);
      this.state = this.getInitialState();
   }
   getInitialState()
   {
     this.initialState = {
                     questions:null,
                     tableInfo : {
                       pageSize : 10,
                       pageIndex : 0,
                       pages : 1,
                       totalrecord :0,
                     },
                   }
                   return cloneDeep(this.initialState);
     }


   getQuestions(state)
   {
     let {tableInfo }  = this.state ;

     tableInfo.filtered = tableInfo.filtered || [];

     if(state){

       tableInfo.pageIndex  = state.page;
       tableInfo.pageSize  = state.pageSize;
       tableInfo.sorted  = state.sorted;
       tableInfo.filtered = state.filtered;
     }
     api.post('get-questions-library', tableInfo)
    .then(response =>
      {
        let questionslist =  response.data[0] ;
      questionslist.forEach(y => {y.questiontypeValue = Questiontype.filter(value => value.name == y.questiontype).map(x => x.value)[0]} )
      questionslist.forEach(y => {y.questionoption = y.questionoption ? JSON.parse(y.questionoption) : ''} )

         this.setState({questions : questionslist ,tableInfo : {...this.state.tableInfo , pages : response.data[1][0].pages , totalrecord : response.data[1][0].count} })
       }
    ).catch(error => console.log(error) )
   }


	render() {

	const	{questions,tableInfo} = this.state;
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
        					 Header: "QUESTION TYPE",
        					 accessor: 'questiontype',
        					 width : 140,
        					 Filter: ({ filter, onChange }) =>
        						 ( <select
        								 onChange={event => onChange(event.target.value)}
        								 style={{ width: "100%" }}
        								 value={filter ? filter.value : ""}
        							 >
        							 <option value="" >Show All</option>
        							 {  Questiontype.map((question, key) => (<option value={question.value} key = {'questionOption' + key }>{question.name}</option>  )) }
        							 </select>
        						 )
        				 },
            		 {
            			 Header: "Questions",
            			 accessor: "question",
                   Cell : data => (
        						 <div>
        						 	 {data.original.questiontypeValue != 3 && data.original.questionoption.optiontype == 1 ?
        								 <Tooltip  id="tooltip-top" disableFocusListener disableTouchListener  title={
        									 <React.Fragment>
        										 <h4>Options</h4>
        										 <ol className = "pl-10">
        											 {data.original.questionoption.option.map((y, key) => (
        													 <li key={'liOption' + key}> {y} </li>
        											 ))}
        											</ol>
        									 </React.Fragment>
        								 } placement="bottom-start">
        				  				 <div className="media">
        				  				     <h5 >{data.original.question}</h5>
        				  				 </div>
        								 </Tooltip>
        								:
        								<div className="media">
        										<h5 >{data.original.question}</h5>
        								</div>
        							}
        						 </div>
        					 )
            		 },
            	 	 ]}
               manual // Forces table not to paginate or sort automatically, so we can handle it server-side
               showPaginationTop = {true}
               data={ questions || []}
               pages={tableInfo.pages} // Display the total number of pages
               loading={questions ? false : true} // Display the loading overlay when we need it
               filterable
               defaultPageSize={tableInfo.pageSize}
               minRows = {1}
               className=" -highlight"
               onFetchData = {(state, instance) => {this.getQuestions(state) }}
             />
        </div>


	);
  }
  }
