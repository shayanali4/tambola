/**
 * Report Stats Widget
 */
import React, { Component ,Fragment} from 'react';
import Button from 'reactstrap/lib/Button';import ButtonGroup from 'reactstrap/lib/ButtonGroup';
import api from 'Api';

import { hexToRgbA } from 'Helpers/helpers';
import {getLocalDate, setLocalDate, checkError, cloneDeep ,getDaysInMonth,setLocalDateTime, getCurrency} from 'Helpers/helpers';

import {isMobile} from 'react-device-detect';

import {convertinPercentage} from 'Helpers/unitconversion';
import ReactTable from "react-table";



class Membershiprenewalanalysis extends Component {

  state = {

                masterchartdata : [],
                totalsales : 0,
      }

  componentDidMount()
  {
      this.getDashboardChartData({});
  }

  getDashboardChartData()
  {
       api.post('my-sales')
      .then(response =>
        {
            let chartdata = {};
            let masterchartdata = response.data[0];

            this.setState({masterchartdata : masterchartdata});



         }
      ).catch(error => console.log(error) )
   }




  componentWillReceiveProps(nextProps, nextState)
  {

    }



      onChange({existingservice,renewedservice}){
        existingservice = existingservice == undefined ? this.state.existingservice: existingservice;
        renewedservice = renewedservice == undefined ? this.state.renewedservice: renewedservice;

        this.getDashboardChartData({existingservice,renewedservice});
        this.setState({existingservice,renewedservice});
      }

	render() {

    const {chartdata,masterchartdata,totalexpiry,totalrenewed,totalnotrenewed,totalsales,existingservice,renewedservice } = this.state;
    const {services} = this.props;
	return (

					<div>


          <ReactTable
            columns={ [

          				 {
                     Header: "Ticket No.",
                     accessor: 'ticketid',
                     filterable: true,
                     className : "text-center",
                      minWidth:80,
                   },

          				 {
          					 Header: "Customer Name",
          					 accessor: 'customer',
          					 filterable : true,
                      className : "text-center",
          					  minWidth:150
          				 },
                   {
          					 Header: "Mobile No",
          					 accessor: 'mobile',
          					 filterable : true,
                      className : "text-center",
          					  minWidth:120
          				 },

          	 ]}
        data={masterchartdata }
        defaultPageSize={masterchartdata.length}
        className=" -highlight"
        showPaginationTop = {true}
        showPaginationBottom = {false}
        defaultPageSize={10}
        pageSizeOptions =  {[5,10,25,50,100]}

                  />

					</div>

		);
	}
}

export default Membershiprenewalanalysis;
