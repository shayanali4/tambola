/**
 * Report Stats Widget
 */
import React, { Component ,Fragment} from 'react';
import Button from 'reactstrap/lib/Button';import ButtonGroup from 'reactstrap/lib/ButtonGroup';
import api from 'Api';

// chart config
import ChartConfig from 'Constants/chart-config';
import { LazyLoadModule } from "Components/AsyncComponent/Lazy";
// rct collapsible card
import RctCollapsibleCard from 'Components/RctCollapsibleCard/RctCollapsibleCard';
import { hexToRgbA } from 'Helpers/helpers';
import {getLocalDate, setLocalDate, checkError, cloneDeep ,getDaysInMonth,setLocalDateTime, getCurrency} from 'Helpers/helpers';
import FormGroup from 'reactstrap/lib/FormGroup';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import {isMobile} from 'react-device-detect';
import MultiCombobox from 'Routes/advance-ui-components/autoComplete/component/MultiCombobox';
import {convertinPercentage} from 'Helpers/unitconversion';
import ReactTable from "react-table";
import Saleslist from './saleslist';
const options = {
  responsive: true,
  tooltips: {
    mode: 'label',callbacks: {
                    title: function(tooltipItems, data) {
                    	if(!isNaN(Date.parse(data.labels[0])))
				           		{
							          let labelmonth = Month.filter(x => x.value == (data.labels[0].getMonth() + 1))[0].short;
							        	 return labelmonth + ' ' +  setLocalDate(tooltipItems[0].label, 'DD') ;
					          	}
					          	else{
						           	 return tooltipItems[0].label;
				          		}
                    }
                }
  },
  legend: {
    display: false,
    labels: {
      fontColor: ChartConfig.legendFontColor,
      usePointStyle: true
    }
  },
  scales: {
    xAxes: [{
      gridLines: {
        color: ChartConfig.chartGridColor,
        display: false
      },
      ticks: {
        fontColor: ChartConfig.axesColor,
        userCallback: function(label, index, labels) {
             if(isMobile){
                     // when the floored value is the same as the value we have a whole number
                     if (Math.floor(label) === label) {
                         return label;
                     }
                  }
                  else{
                    return label;
                  }
                 },
      }
    }],
    yAxes: [{
      gridLines: {
        color: ChartConfig.chartGridColor
      },
      ticks: {
        fontColor: ChartConfig.axesColor,
        min: 0,
        userCallback: function(label, index, labels) {
             if(!isMobile){
                     // when the floored value is the same as the value we have a whole number
                     if (Math.floor(label) === label) {
                         return label;
                     }
                  }
                  else{
                    return label;
                  }
                 },
      }
    }]
  }
};


class Membershiprenewalanalysis extends Component {

  state = {
                chartdata : {
                    labels: [],
                    datasets: []
                },

                masterchartdata : [],
                totalsales : 0,
                totaltickets : 0
      }

  componentDidMount()
  {
      this.getDashboardChartData({});
  }

  getDashboardChartData()
  {
       api.post('staffwise-sales')
      .then(response =>
        {
            let chartdata = {};
            let masterchartdata = response.data;
            chartdata.masterchartdata = masterchartdata;

            this.showchartData({masterchartdata})
         }
      ).catch(error => console.log(error) )
   }

 showchartData({masterchartdata })
 {
      let  labels = [];
        let  datasets = [
      {
              label: 'Total Sales',
              fill: true,
              lineTension: 0,
              fillOpacity: 0.5,
              backgroundColor: hexToRgbA(ChartConfig.color.primary, 0.8),
              borderColor: ChartConfig.color.primary,
              pointBorderColor: ChartConfig.color.white,
              pointBackgroundColor: ChartConfig.color.primary,
              pointBorderWidth: 0,
              pointHoverRadius: 5,
              pointHoverBackgroundColor: hexToRgbA(ChartConfig.color.primary, 1),
              pointHoverBorderColor: hexToRgbA(ChartConfig.color.primary, 1),
              pointHoverBorderWidth: 8,
              pointRadius: 0,
              pointHitRadius: 10,
              data: []
          }
      ];

         let y =  masterchartdata[1];
         y = y.filter(x => x.staffname != null);

         datasets[0].data  = cloneDeep(y.map(x => x.salescount));
         let totalsales = y.map(x => x.salescount).reduce((a, b) => parseFloat(a) + parseFloat(b), 0);


         labels = y.map(x => x.staffname );

       this.setState({
        chartdata: {...this.state.chartdata,
          labels : labels,
          datasets: datasets,
        },
        totalsales : totalsales,
        totaltickets : masterchartdata[0][0].ticketcount,
        masterchartdata : y


      })
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

    const {chartdata,masterchartdata,totalexpiry,totalrenewed,totalnotrenewed,totalsales,existingservice,renewedservice,totaltickets } = this.state;
    const {services} = this.props;
	return (

<div>
					<RctCollapsibleCard
						heading={"Agent Wise Sales"}
					>
					<Fragment>
            <div className="row mb-10">
              <div className="col-12">

              <div className="table-responsive mb-10">
                      <div className="flip-scroll">
                             <table className={isMobile ? "flip-content w-100" : "flip-content w-60"}>
                                  <thead style={{backgroundColor:"white"}} >
                                    <tr >
                                      <th className="text-dark fw-bold text-center">Total tickets</th>
                                      <th className="text-dark fw-bold text-center" >Sold tickets</th>
                                      <th className="text-dark fw-bold text-center" >Remaining tickets </th>

                                    </tr>
                                  </thead>
                                  <tbody>
                                    <tr  className="w-100">
                                          <td className="numeric text-center"> {totaltickets} </td>
                                          <td className="numeric text-center">{totalsales + convertinPercentage(totaltickets,totalsales,1)}</td>
                                          <td className="numeric text-center"> {(totaltickets - totalsales)  + convertinPercentage(totaltickets,(totaltickets - totalsales),1)} </td>

                                      </tr>

                                  </tbody>
                          </table>
                          </div>
                     </div>

          							<div className=" chart-top total-earn-chart d-flex justify-content-between mb-10">

                        </div>
                    </div>
	</div>
                <LazyLoadModule resolve={() => import('react-chartjs-2')}  {...{props : {data :chartdata , options :options , height :isMobile ? 300 : 60 }}} moduleName ={isMobile ? "HorizontalBar" : "Bar"}/>
					</Fragment>


          <ReactTable
            columns={ [

          				 {
                     Header: "Agent Name",
                     accessor: 'staffname',
                     filterable: false,
                     className : "text-center",
                      minWidth:150,
                   },

          				 {
          					 Header: "Sales Count",
          					 accessor: 'salescount',
          					 filterable : false,
                      className : "text-center",
          					  minWidth:80
          				 },

          	 ]}
        data={masterchartdata }
        defaultPageSize={masterchartdata.length}
        className=" -highlight"
        showPaginationTop = {true}
        showPaginationBottom = {false}
        defaultPageSize={5}
        pageSizeOptions =  {[5,10,25,50,100]}

                  />

                  </RctCollapsibleCard>

                  <RctCollapsibleCard
                    heading={"Ticket Wise Sales"}
                  >
                  <Saleslist />
					</RctCollapsibleCard>
          </div>
		);
	}
}

export default Membershiprenewalanalysis;
