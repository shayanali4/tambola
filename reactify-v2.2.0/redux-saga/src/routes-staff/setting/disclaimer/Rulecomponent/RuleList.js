/**
 * Employee Management Page
 */
import React, { Component } from 'react';
// Import React Table
import ReactTable from "react-table";
import { connect } from 'react-redux';
import DeleteConfirmationDialog from 'Components/DeleteConfirmationDialog/DeleteConfirmationDialog';
import {clsAddNewRuleModel,opnAddNewRuleModel,getRules,opnEditRuleModel,deleteRule} from 'Actions';
import {checkModuleRights,getParams} from 'Helpers/helpers';
import {Link} from 'react-router-dom';
import Fab from '@material-ui/core/Fab';

class RuleList extends Component {
	constructor(props) {
     super(props);
		 	this.state = {
				dataToDelete : null,
				deleteConfirmationDialog : false
		  };
   }

 componentWillMount()
		 {
			 this.hashRedirect(location);
		 }

  onAdd() {
		this.props.opnAddNewRuleModel();
	}

	initiateDelete(data)
  {
    this.setState({
			deleteConfirmationDialog : true,
      dataToDelete : data
		});
  }

  onDelete(data)
  {
    this.setState({
      deleteConfirmationDialog : false,
      dataToDelete : null
    });
		this.props.deleteRule(data);
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
				const {rules} = this.props;
				let params = getParams(search);
				if(params && params.id)
				{
					let data = rules ? rules.filter(x => x.id == params.id)[0].rulename : '';
						 this.props.opnEditRuleModel({id : params.id,rulename : data});
				}
			}
		}

		componentWillReceiveProps(nextProps, nextState) {

			const {pathname, hash, search} = nextProps.location;

			if(pathname != this.props.location.pathname  || hash != this.props.location.hash  || search !=  this.props.location.search)
			{
				this.props.clsAddNewRuleModel();

				this.hashRedirect({pathname, hash, search});
			}
		}

	shouldComponentUpdate(nextProps, nextState) {

		if(!nextProps.rules || nextProps.rules || this.state.deleteConfirmationDialog != nextState.deleteConfirmationDialog)
		{
			return true;
		}
		else {
			return false;
		}
	}

	render() {

	const	{ deleteConfirmationDialog, dataToDelete} = this.state;
	 const	{ rules, tableInfo ,userProfileDetail} = this.props;

	 let updateRights = checkModuleRights(userProfileDetail.modules,"disclaimer","update");
	 let deleteRights = checkModuleRights(userProfileDetail.modules,"disclaimer","delete");

	 let columns = [
		 {
			 Header: "Rules",
			 accessor: "rulename",
			 Cell : data => (
  				 <div className="media">
  				     <h5 >{data.original.rulename}</h5>
  				 </div>
			 )
		 },
	 	 ];
		 if(updateRights || deleteRights)
			 {
				 columns.splice(0, 0,{
 					 Header: "ACTION",
 					 Cell : data => (<div className="list-action d-inline hover-action">

						 { updateRights &&  <Fab component = {Link} to= {"/app/setting/disclaimer/2?id="+data.original.id+"#edit"}  className="btn-success text-white m-5" variant="round" mini= "true" >
							 <i className="ti-pencil"></i>
						 </Fab>}
							 {  deleteRights && <Fab className="btn-danger text-white m-5" variant="round" mini= "true" onClick={() => this.initiateDelete(data.original)}>
							 <i className="zmdi zmdi-delete"></i>
						 </Fab>}
 						 {/*  updateRights && 	<Link to= {"/app/diets/recipe?id="+data.original.id+"#edit"}><i className="ti-pencil"></i></Link> */}
 						 {/*  deleteRights &&	<a href="javascript:void(0)" onClick={() => this.initiateDelete(data.original)}><i className="ti-close"></i></a> */}
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
								<Link to="/app/setting/disclaimer/2#add"  className="btn-outline-default mr-10 fw-bold"><i className="ti-plus"></i> Add Rule</Link>
							}
					</div>
					<div className = "pt-5">
						<span > Total {tableInfo.totalrecord} Records </span>
					</div>
				</div>
								<ReactTable
									columns={columns}
									manual // Forces table not to paginate or sort automatically, so we can handle it server-side
									showPaginationTop = {true}
									data={ rules || []}
									pages={tableInfo.pages} // Display the total number of pages
									loading={rules ? false : true} // Display the loading overlay when we need it
									filterable
									defaultPageSize={tableInfo.pageSize}
									minRows = {1}
									className=" -highlight"
									onFetchData = {(state, instance) => {this.props.getRules({state}) }}

								/>

								{
									deleteConfirmationDialog &&
									<DeleteConfirmationDialog
										openProps = {deleteConfirmationDialog}
										title="Are You Sure Want To Delete?"
										message= { <span className = 'text-uppercase'>{dataToDelete.rulename }</span> }
										onConfirm={() => this.onDelete(dataToDelete)}
										 onCancel={() => this.cancelDelete()}
									/>
								}
					</div>

	);
  }
  }
const mapStateToProps = ({ disclaimerReducer , settings}) => {
	const {rules,tableInfo} =  disclaimerReducer;
	const { userProfileDetail} = settings;
  return {rules,tableInfo,userProfileDetail}
}

export default connect(mapStateToProps,{
opnAddNewRuleModel,clsAddNewRuleModel,getRules,opnEditRuleModel,deleteRule})(RuleList);
