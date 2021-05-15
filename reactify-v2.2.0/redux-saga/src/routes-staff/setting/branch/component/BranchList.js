/**
 * Employee Management Page
 */
import React, { Component } from 'react';

import { connect } from 'react-redux';
import DeleteConfirmationDialog from 'Components/DeleteConfirmationDialog/DeleteConfirmationDialog';
import { getBranches, opnAddNewBranchModel ,opnViewBranchModel, opnEditBranchModel,
 deleteBranch,clsViewBranchModel,clsAddNewBranchModel } from 'Actions';

import {Link} from 'react-router-dom';
import {getLocalDate, getFormtedDate, checkError,checkModuleRights,getParams, makePlaceholderRTFilter} from 'Helpers/helpers';
import Fab from '@material-ui/core/Fab';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
//import GoogleMapReact from 'google-map-react';
import GoogleMap from 'Components/google-map-react';
import {GoogleMapConfig} from 'Constants/custom-config';
// Import React Table
import ReactTable from "react-table";


const AnyReactComponent = ({ text }) => (
  <div style={{
    color: 'white',
    background: 'grey',
    padding: '15px 10px',
    display: 'inline-flex',
    textAlign: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '100%',
    transform: 'translate(-50%, -50%)',
    cursor: 'pointer'
  }}>
    {text}
  </div>
);

class BranchList extends Component {
	constructor(props) {
     super(props);
		 	this.state = {
				dataToDelete : null,
				deleteConfirmationDialog : false,
		  };
   }

   static defaultProps = {
     center: {
       lat: 23.06,
       lng: 72.57
     },
     zoom: 10
   };



componentWillMount()
		 {
			 this.hashRedirect(location);
		 }
  onAdd() {
		this.props.opnAddNewBranchModel();
	}

  initiateDelete(data)
  {
    let requestData = {};
    requestData.id = data.id;
		requestData.branchname = data.branchname;
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
    this.props.deleteBranch(data);

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
						this.props.opnEditBranchModel({id : params.id});
			 }
		 }
		 else if(hash == "#"+ "view")
			{
				let params = getParams(search);
				if(params && params.id)
				{
						 this.props.opnViewBranchModel({id : params.id});
				}
			}
		}

		componentWillReceiveProps(nextProps, nextState) {

			const {pathname, hash, search} = nextProps.location;

			if(pathname != this.props.location.pathname  || hash != this.props.location.hash  || search !=  this.props.location.search)
			{

				this.props.clsViewBranchModel();
				this.props.clsAddNewBranchModel();

				this.hashRedirect({pathname, hash, search});
			}
		}

	shouldComponentUpdate(nextProps, nextState) {

		if(!nextProps.branches || nextProps.branches || this.state.deleteConfirmationDialog != nextState.deleteConfirmationDialog)
		{
			return true;
		}
		else {
			return false;
		}
	}
  renderMarkers(map, maps,brancheslist) {

    let title = brancheslist.branchname;
    let latitude = parseFloat(brancheslist.latitude);
    let longitude = parseFloat(brancheslist.longitude);
    new maps.Marker({
      position: { lat: latitude, lng: longitude },
      map,
      title: title
    });
  };

	render() {
	const	{ deleteConfirmationDialog, dataToDelete} = this.state;
	 const	{branches,loadingScroll ,userProfileDetail,tableInfo} = this.props;

	 let updateRights = checkModuleRights(userProfileDetail.modules,"branch","update");
	 let deleteRights = checkModuleRights(userProfileDetail.modules,"branch","delete");


   let columns = [
         {
           Header: "BRANCH NAME",
           accessor: "branchname",
           minWidth:120,
           Filter : makePlaceholderRTFilter(),
           Cell : data =>
          (
              <Link to= {"/app/setting/branch?id="+data.original.id+"#view"} >
                  <div className="d-inline">
                          <div>
                            <h5 className=" text-capitalize ">{data.original.branchname}</h5>
                          </div>
                            <div className="square-160 pt-5" >
                                  {data.original.latitude && data.original.longitude &&
                                            <GoogleMap
                                                 bootstrapURLKeys={{ key: GoogleMapConfig.Apikey  }}
                                                  yesIWantToUseGoogleMapApiInternals={true}
                                                  center={ {
                                                                lat: parseFloat(data.original.latitude),
                                                                lng: parseFloat(data.original.longitude)
                                                          } }
                                                   zoom={this.props.zoom}
                                                   onGoogleApiLoaded={({ map, maps }) => this.renderMarkers(map, maps,data.original)}
                                                   />
                                    }
                            </div>
                </div>
            </Link>
          ),
         },
         {
           Header: "BRANCH ADDRESS",
           accessor: "gmapaddress",
           minWidth:170,
           Filter : makePlaceholderRTFilter(),
         },
         {
           Header: "MANAGER",
           accessor: 'managername',
           minWidth:80,
         },

         {
           Header: "Phone no",
           accessor: 'phone',
           className : "text-center",
           minWidth:80,
           Filter : makePlaceholderRTFilter(),
         }
   ]

     if(updateRights || deleteRights || addRights || viewRights)
    {
      columns.splice(0, 0, {
        Header: "ACTION",
        Cell : data => (<div className="list-action d-inline hover-action">

          { updateRights &&  <Fab component = {Link} to= {"/app/setting/branch?id="+data.original.id+"#edit"}  className="btn-success text-white m-5" variant="round" mini= "true" >
            <i className="ti-pencil"></i>
          </Fab>}
          {
          //   {  deleteRights && <Fab className="btn-danger text-white m-5" variant="round" mini= "true" onClick={() => this.initiateDelete(data.original)}>
          //   <i className="zmdi zmdi-delete"></i>
          // </Fab>}
        }
          </div>
        ),
        sortable : false,
        filterable : false,
        minWidth:50,
        className : "text-center",
      });
    }

		return (
        <div className="table-responsive">
  				<div className="d-flex justify-content-between py-20 px-10">
  					<div>
            {checkModuleRights(userProfileDetail.modules,"branch","add") &&		<Link to="/app/setting/branch#add" className="btn-outline-default mr-10 fw-bold"><i className="ti-plus"></i> Add Branch</Link>}
  					</div>
  					<div className = "pt-5">
  						<span > Total {tableInfo.totalrecord} Records </span>
  					</div>
  				</div>


                <ReactTable
                  columns={columns}
                  manual // Forces table not to paginate or sort automatically, so we can handle it server-side
                  showPaginationTop = {true}
                  data={branches || []}
                  pages={tableInfo.pages} // Display the total number of pages
                  loading={branches ? false : true} // Display the loading overlay when we need it
                  filterable
                  defaultPageSize={tableInfo.pageSize}
                  minRows = {1}
                  className=" -highlight"
                  onFetchData = {(state, instance) => {this.props.getBranches({state}) }}
                />

								{
									deleteConfirmationDialog &&
									<DeleteConfirmationDialog
										openProps = {deleteConfirmationDialog}
										title="Are You Sure Want To Delete?"
										message= { <span className = 'text-capitalize'>  {dataToDelete.branchname } </span> }
										onConfirm={() => this.onDelete(dataToDelete)}
										 onCancel={() => this.cancelDelete()}
									/>
								}
					</div>

	);
  }
  }
const mapStateToProps = ({ branchReducer ,settings}) => {
	const {branches,loadingScroll,tableInfo} =  branchReducer;
  const { userProfileDetail} = settings;
  return {branches,loadingScroll,userProfileDetail,tableInfo}
}

export default connect(mapStateToProps,{
	getBranches, opnAddNewBranchModel ,opnViewBranchModel, opnEditBranchModel, deleteBranch,
  clsViewBranchModel,clsAddNewBranchModel })(BranchList);
