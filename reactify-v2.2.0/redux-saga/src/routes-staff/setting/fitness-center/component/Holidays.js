
/**
 * Profile Page
 /**
  * User Profile Page
  */
 import React, {Fragment, Component } from 'react';
 import AppBar from '@material-ui/core/AppBar';
 import Tabs from '@material-ui/core/Tabs';
 import { connect } from 'react-redux';
 import { Link } from 'react-router-dom';
 import Fab from '@material-ui/core/Fab';
 import Auth from '../../../../Auth/Auth';
 const auth = new Auth();
 import MenuItem from '@material-ui/core/MenuItem';
 import $ from 'jquery';
 import Select from '@material-ui/core/Select';
 import IsTaxInvoice  from 'Assets/data/istaxinvoice';

 import Tab from '@material-ui/core/Tab';
 import Typography from '@material-ui/core/Typography';
 import ReactTable from "react-table";
 import DeleteConfirmationDialog from 'Components/DeleteConfirmationDialog/DeleteConfirmationDialog';
 import DatePicker from 'Routes/advance-ui-components/dateTime-picker/components/DatePicker';

 import {getLocalDate, getFormtedDate,getFormtedDateTime ,checkError,checkModuleRights,getParams, makePlaceholderRTFilter} from 'Helpers/helpers';
 import { getHolidays , opnAddNewHolidaysModel,opnViewHolidaysModel
   ,deleteHolidays,clsViewHolidaysModel,clsAddNewHolidaysModel,opnEditHolidaysModel} from 'Actions';


 // Components
 import BasicConfiguration from './BasicConfiguration';
 import PaymentGateway from './PaymentGateway';
 import AddHolidays from './AddHolidays';


 // rct card box
 import { RctCard } from 'Components/RctCard';

// For Tab Content



class Holidays extends Component {
  constructor(props) {
     super(props);
		 	this.state = {
        dataToDelete : null,
      	deleteConfirmationDialog : false,
        year : getLocalDate(new Date()).getFullYear(),

        activeTab: 0

		  };
   }
   handleChange = ( value) => {
     this.setState({ activeTab: value });
   }

   // componentDidMount()
   // {
   //    let {activeTab,year } = this.state;
   //    let holidays = 'holidays' + '_' + activeTab + '_'  + year;
   //    let data = auth.getMasterDashboardChartData(holidays);
   //
   //   if(data)
   //   {
   //     let holidays = data.holidays;
   //     let activeTab = data.activeTab;
   //     let year = data.year;
   //     this.setState({activeTab , year });
   //     this.showchartData({holidays,activeTab,year})
   //   }
   //   else {
   //     this.getDashboardChartData({});
   //   }
   // }

   onChange({ year} )
   {
     year = year == undefined ? this.state.year: year;
     this.props.getHolidays({year :  year } );
    this.setState({ year});
  }
   componentWillMount()
  		 {
  			 this.hashRedirect(location);
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
     this.props.deleteHolidays(data);
   }
   cancelDelete()
   {
     this.setState({
 			deleteConfirmationDialog : false,
       dataToDelete : null
 		});
   }
   onAdd() {
     this.props.opnAddNewHolidaysModel();
 	}
  hashRedirect({pathname, hash, search})
		{

			if(hash == "#"+ "add")
			{
				this.onAdd();
			}
      else if(hash == "#"+ "view")
       {
         let params = getParams(search);
         if(params && params.id)
         {
              this.props.opnViewHolidaysModel({id : params.id});
         }
       }
       else if(hash == "#"+ "edit")
  		 {
  			 let params = getParams(search);
  			 if(params && params.id)
  			 {
  						this.props.opnEditHolidaysModel({id : params.id});
  			 }
  		 }
		}

    componentWillReceiveProps(nextProps, nextState) {
      const {pathname, hash, search} = nextProps.location;
      if(pathname != this.props.location.pathname  || hash != this.props.location.hash  || search !=  this.props.location.search)
      {
        this.props.clsViewHolidaysModel();
        this.props.clsAddNewHolidaysModel();

        this.hashRedirect({pathname, hash, search});
      }
    }

    shouldComponentUpdate(nextProps, nextState) {
  		if(nextProps.holidays || !nextProps.holidays || this.state.deleteConfirmationDialog != nextState.deleteConfirmationDialog )
  		{
  			return true;
  		}
  		else {
  			return false;
  		}
  	}

  render() {

    const {deleteConfirmationDialog, activeTab ,dataToDelete,year} = this.state;
    const { addRights ,tableInfo, clientProfileDetail ,userProfileDetail,holidays,updateRights,deleteRights} = this.props;
    const {pathname, hash, search} = this.props.location;
    var date = getLocalDate(new Date());
    var Year = [];

    for(let i = 2019; i <= getLocalDate(new Date()).getFullYear() ; i++ )
    {
        Year.push(i);
    }
    Year = $.unique(Year);


    let params = getParams(search);


    let columns = [
                    {
                     Header: "NAME",
                     accessor: 'holidayname',
                     minWidth:130,
                     Filter : makePlaceholderRTFilter(),
                     className : "text-middle",
                   },
                   {
                    Header: "DATE",
                    accessor: 'holidaydate',
                    Filter: ({onChange }) =>
                     (
                       <DatePicker  keyboard = {false}
                         onChange = {date => onChange( date) }
                       />
                       ),
                    Cell : data => (
                      getFormtedDate(data.original.holidaydate)
                    ),
                    className : "text-middle",
                    minWidth:80,
                    className : "text-center",
                },
                {
                 Header: "is repeated Every year",
                 accessor: 'repeatdate',
                 minWidth:130,
                 Filter: ({ filter, onChange }) =>
                   (
                    <select
                       onChange={event => onChange(event.target.value)}
                       style={{ width: "100%" }}
                       value={filter ? filter.value : ""}
                     >
                     <option value="" >Show All</option>
                     {  IsTaxInvoice.map((istaxinvoice, key) => (<option value={istaxinvoice.value} key = {'istaxinvoiceOption' + key }>{istaxinvoice.name}</option>  )) }

                     </select>
                   ),
                   className : "text-center",
                 }
               ];

                 if(updateRights || deleteRights)
                 {
                  columns.splice(0, 0, {
                    Header: "ACTION",
                    Cell : data => (<div className="list-action d-inline hover-action">
                      {/*  <a href="javascript:void(0)" onClick={() => this.onView(data.original)}><i className="ti-eye"></i></a>*/}
                      {updateRights &&
                         <Fab component = {Link} to = {"/app/setting/organization/4?id="+data.original.id+"#edit"}  className="btn-success text-white m-5 pointer" variant="round" mini= "true" >
                            <i className="zmdi zmdi-edit"></i>
                         </Fab>
                      }
                      {deleteRights &&
                        <Fab className="btn-danger text-white m-5 pointer" variant="round" mini= "true" onClick={() => this.initiateDelete(data.original)}>
                          <i className="zmdi zmdi-delete"></i>
                        </Fab>
                      }
                      </div>
                      ),
                      filterable : false,
                      sortable : false,
                      minWidth:60,
                    });
                  }


    return (

      <div className="table-responsive">
      <div className="d-flex justify-content-between pb-20 border-bottom">
            <div>
              { addRights &&	<Link to="/app/setting/organization/4#add"  className="btn-outline-default mr-10 fw-bold mt-5"><i className="ti-plus"></i> Set Holidays</Link>}
            </div>

            <Select className = {'dropdown-chart'} value={year} onChange={(e) => this.onChange({year : e.target.value})}
              inputProps={{name: 'year', id: 'year', }}>
              {
              Year.map((year, key) => ( <MenuItem value={year} key= {'yearOption' + key}>{year}</MenuItem> ))
              }
            </Select>


       </div>
        <ReactTable
        columns={columns}
        manual // Forces table not to paginate or sort automatically, so we can handle it server-side
        showPaginationTop = {true}
        data={holidays ||  []}
        pages={tableInfo.pages} // Display the total number of pages
        loading={holidays ? false: true} // Display the loading overlay when we need it
        filterable
        defaultPageSize={tableInfo.pageSize}
        minRows = {1}
        className=" -highlight"
        onFetchData = {(state, instance) => {state.year = year; this.props.getHolidays({state})  }}
        />

								{
									deleteConfirmationDialog &&
									<DeleteConfirmationDialog
										openProps = {deleteConfirmationDialog}
										title="Are You Sure Want To Delete?"
                    message= { <span className = 'text-capitalize'>  {dataToDelete.name } </span> }
										onConfirm={() => this.onDelete(dataToDelete)}
										 onCancel={() => this.cancelDelete()}
									/>
								}
               <AddHolidays updateRights={updateRights} addRights ={addRights} />


					</div>


    );
  }
}

const mapStateToProps = ({ holidaysReducer , settings}) => {
	const {holidays , tableInfo } =  holidaysReducer;
  const { userProfileDetail,clientProfileDetail } =  settings;
   return {holidays , tableInfo ,userProfileDetail,clientProfileDetail}
}

export default connect (mapStateToProps,{ deleteHolidays ,getHolidays ,opnEditHolidaysModel ,opnViewHolidaysModel
                        ,clsAddNewHolidaysModel ,clsViewHolidaysModel,opnAddNewHolidaysModel}) (Holidays);
