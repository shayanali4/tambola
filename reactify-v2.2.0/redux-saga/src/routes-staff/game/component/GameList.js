/**
 * Employee Management Page
 */
import React, { Component } from 'react';
// Import React Table
import ReactTable from "react-table";
import { connect } from 'react-redux';
import DeleteConfirmationDialog from 'Components/DeleteConfirmationDialog/DeleteConfirmationDialog';
import { getGames, opnAddNewGameModel ,opnViewGameModel, opnEditGameModel, deleteGame,
clsViewGameModel,clsAddNewGameModel,GamehandlechangeSelectAll,GamehandleSingleCheckboxChange } from 'Actions';
import Hotkeys from 'react-hot-keys';
import {Link} from 'react-router-dom';
import Checkbox from '@material-ui/core/Checkbox';
import  Status from 'Assets/data/status';
import {getLocalDate, getFormtedDate, checkError,checkModuleRights, getParams, makePlaceholderRTFilter, getFormtedDateTime} from 'Helpers/helpers';
import { push } from 'connected-react-router';
import Fab from '@material-ui/core/Fab';

class GameList extends Component {
	constructor(props) {
     super(props);
		 	this.state = {
				dataToDelete : null,
				deleteConfirmationDialog : false,
				exportGameDialog : false
		  };
   }

	 componentWillMount()
		 {
			 this.hashRedirect(location);
		 }
	 initiateExport = () =>
	 {
		 this.setState({
			 exportGameDialog : true
		 });
	 }
	 cancelExportDialog = () =>
	 {
		 this.setState({
			 exportGameDialog : false
		 });
	 }
  onAdd() {
		let data = {};
		this.props.opnAddNewGameModel(data);
	}

  initiateDelete(data)
  {
    let requestData = {};
    requestData.id = data.id;
		requestData.Gamename = data.Gamename;
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
		this.props.deleteGame(data);
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
			 let params = getParams(search);
			 if(params && params.id)
			 {
						this.props.opnEditGameModel({id : params.id});
			 }
		 }
		 else if(hash == "#"+ "view")
			{
				// let params = getParams(search);
				// if(params && params.id)
				// {
						 this.props.opnViewGameModel({id : 1});
			//	}
			}
		}

		componentWillReceiveProps(nextProps, nextState) {

			const {pathname, hash, search} = nextProps.location;

			if(pathname != this.props.location.pathname  || hash != this.props.location.hash  || search !=  this.props.location.search)
			{

				this.props.clsViewGameModel();
				this.props.clsAddNewGameModel();

				this.hashRedirect({pathname, hash, search});
			}
		}

	shouldComponentUpdate(nextProps, nextState) {

		if(!nextProps.Games || nextProps.Games || this.state.deleteConfirmationDialog != nextState.deleteConfirmationDialog ||
		 this.state.exportGameDialog != nextState.exportGameDialog )
		{
			return true;
		}
		else {
			return false;
		}
	}

	inactiveHighlight(statusId)
	{
			if(statusId == 2)
			{
						return " text-danger";
			}
				return "";
	}
	GamehandlechangeSelectAll = (value) => {
 		this.props.GamehandlechangeSelectAll(value);
 	 };
  GamehandleSingleCheckboxChange(value,data,id){
 		this.props.GamehandleSingleCheckboxChange(value,data,id);
 		};

		onKeyUp(keyName, e, handle) {
		    console.log("test:onKeyUp", e, handle)
		    this.props.push("/app/game#view");
		  }
	render() {
	const	{ deleteConfirmationDialog, dataToDelete,exportGameDialog} = this.state;
	 const	{ games, tableInfo ,userProfileDetail, clientProfileDetail,selectAll,sessiontypelist} = this.props;

	 let updateRights = checkModuleRights(userProfileDetail.modules,"game","update");
	 let deleteRights = checkModuleRights(userProfileDetail.modules,"game","delete");
	 let addRights = checkModuleRights(userProfileDetail.modules,"game","add");

	 let columns = [

				 {
           Header: "Game Start Date-Time",
           accessor: 'launchdate',
           filterable: false,
           Cell : data => (
						 <Link to= {"/app/game?id="+data.original.id+"#edit"} >
							  <h5>{getFormtedDateTime(data.original.launchdate)}</h5>
						</Link>
           ),
           className : "text-center",
            minWidth:200,
         },

				 {
					 Header: "STATUS",
					 accessor: 'status',
					 Filter: ({ filter, onChange }) =>
						 ( <select
								 onChange={event => onChange(event.target.value)}
								 style={{ width: "100%" }}
								 value={filter ? filter.value : ""}
							 >
							 <option value="" >Show All</option>
							 {  Status.map((Gametype, key) => (<option value={Gametype.value} key = {'GamestatusOption' + key }>{Gametype.name}</option>  )) }
							 </select>
						 ),
						 minWidth:100,
						 Cell : data => (<span className = {this.inactiveHighlight(data.original.statusId)}>{ data.original.status}</span>),
				 },

	 ];





	 if(updateRights || deleteRights)
	{
		columns.splice(0, 0, {
					Header: "ACTION",
					Cell : data => (<div className="list-action d-inline hover-action">

	 					{ updateRights &&  <Fab component = {Link} to= {"/app/game?id="+data.original.id+"#edit"}  className="btn-success text-white m-5" variant="round" mini= "true" >
	 						<i className="fa fa-pencil"></i>
	 					</Fab>}
	  				  {  deleteRights && <Fab className="btn-danger text-white m-5" variant="round" mini= "true" onClick={() => this.initiateDelete(data.original)}>
	 						<i className="zmdi zmdi-delete"></i>
	 					</Fab>}
						</div>
					),
					filterable : false,
					sortable : false,
					minWidth:150,
				});
	}


		return (
			<div className="table-responsive">
				<div className="d-flex justify-content-between py-20 px-10">
					<div>
						{addRights &&
							<Link to="/app/game#add"  className="btn-outline-default mr-10 fw-bold"><i className="ti-plus"></i> Add Game</Link>
						}
						{addRights &&
							<Hotkeys
        keyName="shift+g+w"
        onKeyUp={this.onKeyUp.bind(this)}
      >
					{false &&		<Link to="/app/game#view"  className="btn-outline-default mr-10 fw-bold"><i className="fa fa-trophy"></i> View GamePage</Link> }
					</Hotkeys>	}
					</div>

					<div >
						<span className = "pr-5"> Total {tableInfo.totalrecord} Records </span>

					</div>
				</div>

        <ReactTable
          columns={columns}
      		manual // Forces table not to paginate or sort automatically, so we can handle it server-side
				showPaginationTop = {true}
		 	data={games || []}
			pages={tableInfo.pages} // Display the total number of pages
			loading={games  ? false : true} // Display the loading overlay when we need it
			filterable
			defaultPageSize={tableInfo.pageSize}
			minRows = {1}
			className=" -highlight"
			onFetchData = {(state, instance) => {this.props.getGames({state}) }}
								/>

								{
									deleteConfirmationDialog &&
									<DeleteConfirmationDialog
										openProps = {deleteConfirmationDialog}
										title="Are You Sure Want To Delete?"
										message= { <span className = 'text-capitalize'>  {dataToDelete.Gamename } </span> }
										onConfirm={() => this.onDelete(dataToDelete)}
										 onCancel={() => this.cancelDelete()}
									/>
								}


									</div>

	);
  }
  }
const mapStateToProps = ({ gameReducer ,settings}) => {
	const { games, tableInfo } =  gameReducer;
	const { userProfileDetail,clientProfileDetail,sessiontypelist} = settings;
  return { games, tableInfo ,userProfileDetail,clientProfileDetail,sessiontypelist}
}

export default connect(mapStateToProps,{
	getGames, opnAddNewGameModel ,opnViewGameModel, opnEditGameModel, deleteGame,
clsViewGameModel,clsAddNewGameModel, push})(GameList);
