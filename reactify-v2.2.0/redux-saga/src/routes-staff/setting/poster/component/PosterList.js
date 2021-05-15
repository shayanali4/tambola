/**
 * Employee Management Page
 */
import React, { Component } from 'react';

import { connect } from 'react-redux';
import DeleteConfirmationDialog from 'Components/DeleteConfirmationDialog/DeleteConfirmationDialog';
import { getPoster, opnAddNewPosterModel , deletePoster,clsAddNewPosterModel } from 'Actions';

import {Link} from 'react-router-dom';
import {getLocalDate, getFormtedDate, checkError,checkModuleRights,getParams,downloadFile,downloadFileByUrl} from 'Helpers/helpers';
import Fab from '@material-ui/core/Fab';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import InfiniteScroll from "react-infinite-scroll-component";
import CustomConfig from 'Constants/custom-config';
import { RctCard } from 'Components/RctCard';

class PosterList extends Component {
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
  componentDidMount(){
       this.props.getPoster();
     }
  onAdd() {
		this.props.opnAddNewPosterModel();
	}

  initiateDelete(data)
  {
    let requestData = {};
    requestData.id = data.id;
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
    this.props.deletePoster(data);

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
		}

		componentWillReceiveProps(nextProps, nextState) {

			const {pathname, hash, search} = nextProps.location;

			if(pathname != this.props.location.pathname  || hash != this.props.location.hash  || search !=  this.props.location.search)
			{
				this.props.clsAddNewPosterModel();

				this.hashRedirect({pathname, hash, search});
			}
		}

	shouldComponentUpdate(nextProps, nextState) {

		if(!nextProps.posters || nextProps.posters || this.state.deleteConfirmationDialog != nextState.deleteConfirmationDialog)
		{
			return true;
		}
		else {
			return false;
		}
	}

  getPosterList = () =>
  {
      this.props.getPoster();
  }

  onDownloadFile(image)
  {
    let imagearray = image.split('/');
    let length = image.split('/').length;
    let filename = imagearray[length-1];
    downloadFileByUrl(image, filename);
  }

	render() {
	const	{ deleteConfirmationDialog, dataToDelete} = this.state;
	 const	{posters,loadingScroll ,userProfileDetail,clientProfileDetail} = this.props;

	 let deleteRights = checkModuleRights(userProfileDetail.modules,"poster","delete");

		return (
			<div >
				<div className="d-flex justify-content-between py-20 px-10">
    					<div>
    						{clientProfileDetail &&	clientProfileDetail.id == 1 &&	<Link to="/app/setting/poster#add" className="btn-outline-default mr-10 fw-bold"><i className="ti-plus"></i> Add Poster</Link>}
    					</div>
    					<div >

    					</div>
				</div>


        <InfiniteScroll
            dataLength={posters.length}
            next={this.getPosterList}
            hasMore={loadingScroll}
            height = {600}
            loader={<h4 className = {"pl-30"}>Loading....</h4>  }

        >

              <div className = "row mx-10">
                 {posters && posters.length > 0 && posters.map((posterslist, key) =>
                   (
                    <div className="col-sm-12 col-md-6 col-xl-6"  key = {"branch" + key}>
                      <Card className="rounded mb-30 text-white blog-layout-three position-relative">
                          <CardContent className = "p-10">
                            <RctCard customClasses="d-flex  mb-0 flex-column justify-content-between overflow-hidden">
                              <div className="overlay-wrap overflow-hidden" >
                                <div className="text-center p-4">
                                   <img src={CustomConfig.serverUrl + posterslist.posterimage} alt="" type="file" name="imageFiles"  className="w-100  img-fluid"/>
                                </div>
                                <div className="overlay-content d-flex align-items-end">
                                  { deleteRights && clientProfileDetail &&	clientProfileDetail.id == 1 &&
                                    <a href="javascript:void(0)" className="bg-danger text-center w-100 cart-link text-white py-2" onClick={(e) => {this.initiateDelete(posterslist); e.preventDefault(); }}>
                                      Delete
                                    </a>
                                  }
                                  { clientProfileDetail &&	clientProfileDetail.id != 1 &&
                                    <a href="javascript:void(0)" className="bg-primary text-center w-100 cart-link text-white py-2" onClick={(e) => {this.onDownloadFile(CustomConfig.serverUrl + posterslist.posterimage); e.preventDefault(); }}>
                                      Download
                                    </a>
                                  }
                                </div>
                            </div>
                          </RctCard>
                        </CardContent>
                          {/*<CardActions className="d-flex justify-content-between border-top py-10">
                            <div className="list-action d-inline hover-action">
                              { deleteRights && clientProfileDetail &&	clientProfileDetail.id == 1 && <Fab className="btn-danger text-white m-5 pointer" variant="round" mini= "true" onClick={() => this.initiateDelete(posterslist)}>
                              <i className="zmdi zmdi-delete fs-20"></i>
                              </Fab>}
                              { clientProfileDetail &&	clientProfileDetail.id != 1 && <Fab className="btn-primary text-white m-5 pointer" variant="round" mini= "true" onClick={() => this.onDownloadFile(CustomConfig.serverUrl + posterslist.posterimage)}>
                              <i className="ti-download fs-20"></i>
                              </Fab>}
                            </div>
                          </CardActions>*/}
                      </Card>
                      </div>
                    ))}
                      </div>
                    </InfiniteScroll>


								{
									deleteConfirmationDialog &&
									<DeleteConfirmationDialog
										openProps = {deleteConfirmationDialog}
										title="Are You Sure Want To Delete?"
										message= { <span className = 'text-capitalize'>  </span> }
										onConfirm={() => this.onDelete(dataToDelete)}
										 onCancel={() => this.cancelDelete()}
									/>
								}
					</div>

	);
  }
  }
const mapStateToProps = ({ posterReducer ,settings}) => {
	const {posters,loadingScroll  } =  posterReducer;
  const { userProfileDetail , clientProfileDetail} = settings;
  return {posters,loadingScroll,userProfileDetail , clientProfileDetail}
}

export default connect(mapStateToProps,{
	getPoster, opnAddNewPosterModel , deletePoster, clsAddNewPosterModel })(PosterList);
