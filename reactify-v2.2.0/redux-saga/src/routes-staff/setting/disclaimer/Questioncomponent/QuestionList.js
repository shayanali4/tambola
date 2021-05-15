/**
 * Employee Management Page
 */
import React, { Component } from 'react';
// Import React Table
import ReactTable from "react-table";
import { connect } from 'react-redux';
import DeleteConfirmationDialog from 'Components/DeleteConfirmationDialog/DeleteConfirmationDialog';
import { getQuestions, opnAddNewQuestionModel , opnEditQuestionModel, deleteQuestion,
clsAddNewQuestionModel } from 'Actions';

import  Questiontype from 'Assets/data/questiontype';

import {Link} from 'react-router-dom';

import {getLocalDate, getFormtedDate, checkError,checkModuleRights, getParams} from 'Helpers/helpers';

import Fab from '@material-ui/core/Fab';
import Tooltip from '@material-ui/core/Tooltip';

class QuestionList extends Component {
	constructor(props) {
     super(props);
		 	this.state = {
				dataToDelete : null,
				deleteConfirmationDialog : false,
		  };
   }

	 componentWillMount()
		 {
			 this.hashRedirect(location);
		 }

  onAdd() {
		this.props.opnAddNewQuestionModel();
	}

  initiateDelete(data)
  {
    let requestData = {};
    requestData.id = data.id;
		//requestData.servicename = data.servicename;
    this.setState({
			deleteConfirmationDialog : true,
      dataToDelete : requestData
		});
  }

  onDelete(data)
  {
    this.setState({
      deleteConfirmationDialog : false,
      dataToDelete : null
    });
		this.props.deleteQuestion(data);
  }

  cancelDelete()
  {
    this.setState({
			deleteConfirmationDialog : false,
      dataToDelete : null
		});
  }

	hashRedirect({pathname, hash, search})
		{
			if(hash == "#"+ "add")
			{
				this.onAdd();
			}
		 else if(hash == "#"+ "edit")
		 {
			 const	{ questions } = this.props;
			 let params = getParams(search);
			 if(params && params.id)
			 {
				 	let data = questions ? questions.filter(x => x.id == params.id)[0] : '';
						this.props.opnEditQuestionModel({data : data});
			 }
		 }
		}

		componentWillReceiveProps(nextProps, nextState) {

			const {pathname, hash, search} = nextProps.location;

			if(pathname != this.props.location.pathname  || hash != this.props.location.hash  || search !=  this.props.location.search)
			{
				this.props.clsAddNewQuestionModel();
				this.hashRedirect({pathname, hash, search});
			}
		}

	shouldComponentUpdate(nextProps, nextState) {

		if(!nextProps.questions || nextProps.questions || this.state.deleteConfirmationDialog != nextState.deleteConfirmationDialog )
		{
			return true;
		}
		else {
			return false;
		}
	}


	render() {
	const	{ deleteConfirmationDialog, dataToDelete} = this.state;
	 const	{ questions, tableInfoQuestion ,userProfileDetail} = this.props;

	 let updateRights = checkModuleRights(userProfileDetail.modules,"disclaimer","update");
	 let deleteRights = checkModuleRights(userProfileDetail.modules,"disclaimer","delete");

	 let columns = [
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
					 Header: "QUESTIONS",
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
	 ];

	 if(updateRights || deleteRights)
	{
		columns.splice(0, 0,{
					Header: "ACTION",
					Cell : data => (<div className="list-action d-inline hover-action">

	 					{ updateRights &&  <Fab component = {Link} to= {"/app/setting/disclaimer/1?id="+data.original.id+"#edit"}  className="btn-success text-white m-5" variant="round" mini= "true" >
	 						<i className="ti-pencil"></i>
	 					</Fab>}
	  				  {  deleteRights && <Fab className="btn-danger text-white m-5" variant="round" mini= "true" onClick={() => this.initiateDelete(data.original)}>
	 						<i className="zmdi zmdi-delete"></i>
	 					</Fab>}
						{/*  updateRights &&   <Link to= {"/app/service?id="+data.original.id+"#edit"} ><i className="ti-pencil"></i></Link> */}
						{/*  deleteRights &&  <a href="javascript:void(0)" onClick={() => this.initiateDelete(data.original)}><i className="ti-close"></i></a> */}
						</div>
					),
					filterable : false,
					sortable : false,
						width:100
				});
	}
		return (
			<div className="table-responsive">
				<div className="d-flex justify-content-between pb-10 px-10">
					<div>
						{checkModuleRights(userProfileDetail.modules,"disclaimer","add") &&
								<Link to="/app/setting/disclaimer/1#add"  className="btn-outline-default mr-10 fw-bold"><i className="ti-plus"></i> Add Question</Link>
						}
					</div>
					<div className = "pt-5">
						 <span > Total {tableInfoQuestion.totalrecord} Records </span>
					</div>
				</div>
        <ReactTable
          columns={columns}
      		manual // Forces table not to paginate or sort automatically, so we can handle it server-side
				showPaginationTop = {true}
		 	data={questions || []}
			pages={tableInfoQuestion.pages} // Display the total number of pages
			loading={questions  ? false : true} // Display the loading overlay when we need it
			filterable
			defaultPageSize={tableInfoQuestion.pageSize}
			minRows = {1}
			className=" -highlight"
			onFetchData = {(state, instance) => {this.props.getQuestions({state}) }}
								/>

								{
									deleteConfirmationDialog &&
									<DeleteConfirmationDialog
										openProps = {deleteConfirmationDialog}
										title="Are You Sure Want To Delete?"
										message= { <span className = 'text-capitalize'>   </span> }
										onConfirm={() => this.onDelete(dataToDelete)}
										 onCancel={() => this.cancelDelete()}
									/>
								}

					</div>

	);
  }
  }
const mapStateToProps = ({ disclaimerReducer, settings }) => {
	const { questions, tableInfoQuestion } =  disclaimerReducer;
	const { userProfileDetail} = settings;
  return { questions, tableInfoQuestion ,userProfileDetail}
}

export default connect(mapStateToProps,{
	getQuestions, opnAddNewQuestionModel , opnEditQuestionModel, deleteQuestion,
clsAddNewQuestionModel})(QuestionList);
