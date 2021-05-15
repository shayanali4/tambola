/**
 * Orders Stats
 */
import React, { Component} from 'react';
import CountUp from 'react-countup';

// chart config
import ChartConfig from 'Constants/chart-config';
import { hexToRgbA } from 'Helpers/helpers';

import { LazyLoadModule } from "Components/AsyncComponent/Lazy";
import {getLocalDate,getFormtedTimeFromJsonDate, cloneDeep,setLocalDateTime,setLocalDate} from 'Helpers/helpers';

// collapsible card
import RctCollapsibleCard from 'Components/RctCollapsibleCard/RctCollapsibleCard';

import api from 'Api';
import DatePicker from 'Routes/advance-ui-components/dateTime-picker/components/DatePicker';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import AttendanceDeviceType  from 'Assets/data/attendancedevicetype';
import { connect } from 'react-redux';
import MultiSelect from 'Routes/advance-ui-components/autoComplete/component/MultiSelect';
import Auth from '../../Auth/Auth';
const auth = new Auth();

const options = {
  responsive: true,
  tooltips: {
    mode: 'label'
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

      }
    }],
    yAxes: [{
      gridLines: {
        color: ChartConfig.chartGridColor,
        display: false
      },
      ticks: {
          display: false,
        fontColor: ChartConfig.axesColor,
        min: 0,
        max : 5,
        userCallback: function(label, index, labels) {
                     // when the floored value is the same as the value we have a whole number
                     if (Math.floor(label) === label) {
                         return label;
                     }
                 },
      }
    }]
  }
};




class UserFootfallChart extends Component {
  state = {

            date: getLocalDate(new Date()),
            currentcheckin : 0,
            currentcheckout : 0,
            totalcheckin : 0,
            totalcheckout : 0,
            chartdata : {
                labels: [],
                datasets: [],
                yaxismax : 5,
            },
            attendancetype : this.props.clientProfileDetail && this.props.clientProfileDetail.biometric && this.props.clientProfileDetail.biometric.isbiometricenable ? '1,2' : '1',
            lastfetcheddate : null,
          }

      // componentDidMount()
      // {
      //   this.getDashboardBiometricAndQRCodeChartData({});
      //   // this.getDashboardChartData({});
      // }

      componentDidMount()
      {
         let {attendancetype , date } = this.state;
         let modulename = this.props.branchid + '_userfootfall';
         let componentname = attendancetype + '_' + setLocalDate(date,'DD-MM-YYYY');
         let data = auth.getMasterDashboardChartData(modulename,componentname);

        if(data)
        {
          let userfootfalldata = data.userfootfalldata;
          let attendancetype = data.attendancetype;
          let date = data.date;
          let lastfetcheddate = setLocalDateTime(data.startdate);
          this.setState({attendancetype , date , lastfetcheddate });
          this.showchartData(userfootfalldata);
        }
        else {
          this.getDashboardChartData(attendancetype);
        }
      }

      getDashboardChartData(attendancetype)
      {
        if(attendancetype.split(',').length > 1)
        {
          this.getDashboardBiometricAndQRCodeChartData({});
        }
        else {
          this.getDashboardOnChangeChartData({});
        }
      }

      getDashboardBiometricAndQRCodeChartData({date})
      {
        let attendancetype = '2';
        date = date == undefined ? this.state.date: date;
        let branchid =  this.props.branchid;
        let client_timezoneoffsetvalue = (localStorage.getItem('client_timezoneoffsetvalue') || 330);
        date = setLocalDate(date);
        api.post('dashboard-footfall-chart-user',{date,attendancetype,branchid,client_timezoneoffsetvalue})
       .then(response =>
         {
           attendancetype = '1';
           let data =  response.data.length > 0 ? response.data[0] : [];
           api.post('dashboard-footfall-chart-user',{date,attendancetype,branchid,client_timezoneoffsetvalue})
          .then(response =>
            {
                let data1 =  response.data.length > 0 ? response.data[0] : [];
                let concateddata = data.concat(data1);
                let chartdata = {};
                let lastfetcheddate = getLocalDate(new Date());
                let userfootfalldata = concateddata;
                chartdata.userfootfalldata = userfootfalldata;
                chartdata.attendancetype = '1,2';
                chartdata.date = date;
                chartdata.startdate = lastfetcheddate;
                let modulename = this.props.branchid + '_userfootfall';
                let componentname = '1,2' + '_' + setLocalDate(date,'DD-MM-YYYY');
                let minutes = 60;
                auth.setMasterDashboardChartData(chartdata,modulename,componentname,minutes);

                this.setState({lastfetcheddate : setLocalDateTime(lastfetcheddate) });

                this.showchartData(concateddata);
            }
           ).catch(error => console.log(error) )
         }
        ).catch(error => console.log(error) )
      }

      getDashboardOnChangeChartData({date,attendancetype})
      {
        date = date == undefined ? this.state.date: date;
        attendancetype = attendancetype == undefined ? this.state.attendancetype: attendancetype;
        let branchid =  this.props.branchid;
        let client_timezoneoffsetvalue = (localStorage.getItem('client_timezoneoffsetvalue') || 330);
        date = setLocalDate(date);
        api.post('dashboard-footfall-chart-user',{date,attendancetype,branchid,client_timezoneoffsetvalue})
       .then(response =>
         {
           let data =  response.data.length > 0 ? response.data[0] : [];

           let chartdata = {};
           let lastfetcheddate = getLocalDate(new Date());
           let userfootfalldata = data;
           chartdata.userfootfalldata = userfootfalldata;
           chartdata.attendancetype = attendancetype;
           chartdata.date = date;
           chartdata.startdate = lastfetcheddate;
           let modulename = this.props.branchid + '_userfootfall';
           let componentname = attendancetype + '_' + setLocalDate(date,'DD-MM-YYYY');
           let minutes = 60;
           auth.setMasterDashboardChartData(chartdata,modulename,componentname,minutes);

           this.setState({lastfetcheddate : setLocalDateTime(lastfetcheddate) });

           this.showchartData(userfootfalldata);
         }
        ).catch(error => console.log(error) )
      }


    showchartData(data)
      {
            let canvas = document.createElement('canvas');
            const ctx = canvas.getContext("2d");
            var gradientFill = ctx.createLinearGradient(0, 170, 0, 50);
            gradientFill.addColorStop(0, "rgba(255, 255, 255, 0)");
            gradientFill.addColorStop(1, hexToRgbA(ChartConfig.color.warning, 0.6));

            var gradientFill1 = ctx.createLinearGradient(0, 170, 0, 50);
            gradientFill1.addColorStop(0, "rgba(255, 255, 255, 0)");
            gradientFill1.addColorStop(1, hexToRgbA(ChartConfig.color.primary, 0.6));

            // date = date == undefined ? this.state.date: date;
            // attendancetype = attendancetype == undefined ? this.state.attendancetype: attendancetype;
            // let branchid =  this.props.branchid;
            //
            //    api.post('dashboard-footfall-chart-user',{date,attendancetype,branchid})
            //   .then(response =>
            //     {
                  let  datasets = [
                     {
                        label: "Check-in",
                        fill: true,
                        lineTension: 0,
                        fillOpacity: 0.3,
                        backgroundColor: gradientFill1,
                        borderColor: ChartConfig.color.primary,
                        borderWidth: 3,
                        pointBackgroundColor: ChartConfig.color.primary,
                        pointBorderWidth: 2,
                        pointRadius: 4,
                        pointBorderColor: '#FFF',
                        pointHoverRadius: 1,
                        pointHoverBorderWidth: 2,
                        data:[]
                      },
                      {
                          label: "Check-out",
                          fill: true,
                          lineTension: 0,
                          fillOpacity: 0.3,
                          backgroundColor: gradientFill,
                          borderColor: ChartConfig.color.warning,
                          borderWidth: 3,
                          pointBackgroundColor: ChartConfig.color.warning,
                          pointBorderWidth: 2,
                          pointRadius: 4,
                          pointBorderColor: '#FFF',
                          pointHoverRadius: 1,
                          pointHoverBorderWidth: 2,
                          data:[]
                      },
                  ];
                  let currentdate = getLocalDate(new Date());
                  let currenthour = currentdate.getHours();


                  currenthour = currentdate.getMinutes() > 30 ? currenthour + 1 : currenthour;
                      let y =  data.length > 0 ? data : [];
                      var maxvalue = Math.max.apply(Math, y.map(function(o) { return o.inData; }));

                      let z=0,checkinhour = [], checkouthour =[];
                      for(z=0;z<=23;z++){checkinhour.push({hourData: z}), checkouthour.push({hourData: z})}

                       checkinhour.forEach(x => {
                        var checkinValue = y.filter(z => z.hourData == x.hourData && z.inOrout == 1)[0];
                        x.value = checkinValue ? checkinValue.inData : 0;
                       });

                       checkouthour.forEach(x => {
                         var checkoutValue = y.filter(z => z.hourData == x.hourData && z.inOrout == 2)[0];
                         x.value = checkoutValue ? checkoutValue.inData : 0
                        });

                      let currentcheckin = checkinhour.filter(x => x.hourData == currenthour)[0].value;
                      let totalcheckin = checkinhour.map(x => x.value).reduce((a, b) => parseInt(a) + parseInt(b), 0);
                      let currentcheckout = checkouthour.filter(x => x.hourData == currenthour)[0].value;
                      let totalcheckout = checkouthour.map(x => x.value).reduce((a, b) => parseInt(a) + parseInt(b), 0);

                        datasets[0].data  = cloneDeep(checkinhour.map(x => x.value));
                        datasets[1].data  = cloneDeep(checkouthour.map(x => x.value));

                      let labels = checkinhour.map(({hourData}) => {let x = hourData;  if(x < 12){x = x + ' AM'}else{x = (x == 12 ? x :x%12) + ' PM'} return x;} );

                   this.setState({
                    chartdata: {...this.state.chartdata,
                      labels : labels,
                      datasets: datasets,
                    },
                    currentcheckin : currentcheckin,
                    currentcheckout : currentcheckout,
                    totalcheckin : totalcheckin,
                    totalcheckout : totalcheckout,
                    yaxismax : maxvalue + 5
                  })
              //    }
              // ).catch(error => console.log(error) )
          }

          onChangeActiveStateMonth({date})
          {
            date = date == undefined ? this.state.date: date;
            this.setState({date });
            if(this.state.attendancetype && this.state.attendancetype.split(',').length > 1)
            {
               this.getDashboardBiometricAndQRCodeChartData({date});
            }
            else {
              this.getDashboardOnChangeChartData({date});
            }
          }

          onChange(key,value){
            if(value)
            {
              this.setState({ [key] : value});
              if(value.split(',').length > 1)
              {
                 this.getDashboardBiometricAndQRCodeChartData({attendancetype : value});
              }
              else {
                this.getDashboardOnChangeChartData({attendancetype : value});
              }
            }
          }


  render() {
    const {chartdata,date,currentcheckin,currentcheckout,totalcheckin,totalcheckout ,yaxismax,attendancetype,lastfetcheddate} = this.state;
    const {clientProfileDetail} = this.props;
    options.scales.yAxes[0].ticks.max = yaxismax;
    return (
    <RctCollapsibleCard
        heading ={<div className ="d-flex justify-content-between pr-15">
                  <span>Staff Footfall</span>
                    <div className = "w-30 pull-right pr-5">
                    <DatePicker
                      disableFuture = {true}
                      value ={date}
                      keyboard = {false}
                      onChange = {(date) => this.onChangeActiveStateMonth({date : date}) }
                    />
                  </div>
                    {clientProfileDetail && clientProfileDetail.biometric &&clientProfileDetail.biometric.isbiometricenable == 1 &&
                      <div className = "w-35">
                        <MultiSelect
                        label = {""}
                        value = {attendancetype}
                        options = {AttendanceDeviceType.map(x => ({value : x.value, label : x.name}))}
                        onChange={(e) =>{ this.onChange('attendancetype',e); }}
                         />
                      </div>
                     }
                  </div>
                }
        fullBlock
        reloadable
        reloadabletooltip = {"Date last fetched on : " + lastfetcheddate}
        onReload = {() =>  this.getDashboardChartData(attendancetype)}
        contentCustomClasses = {"pt-0"}

    >
        <div className = "row">

            <div className = "col-12">
                <span className="fs-20 px-20">{getFormtedTimeFromJsonDate(getLocalDate(new Date()))}</span>
            </div>
            <div className = "col-12">

                <div className="d-flex justify-content-between px-20">
                    <div className="counter-report">
                        <span className="fs-16  mb-0"> <i className="ti-arrow-up" style = {{'color' : ChartConfig.color.primary}}></i>  Check-in : <CountUp start={0} end={currentcheckin} /></span>
                    </div>
                </div>

                <div className="d-flex justify-content-between px-20">
                    <div className="counter-report">
                        <span className="fs-16 mb-0"><i className="ti-arrow-down" style = {{'color' : ChartConfig.color.warning}}></i> Check-out : <CountUp start={0} end={currentcheckout} /> </span>
                    </div>
                </div>

            </div>
        </div>

        <div>
			<LazyLoadModule resolve={() => import('react-chartjs-2')}  {...{props : {data :chartdata , options :options , height : 110 }}} moduleName = "Line"/>

        </div>
        <div className="d-flex justify-content-between p-20">
            <div className="totle-status">
                <h2><CountUp start={0} end={totalcheckin} className = "pl-30"/></h2>
                <span>Total Check-in</span>
            </div>
            <div className="totle-status">
                <h2><CountUp start={0} end={totalcheckout} className = "pl-30" /></h2>
                <span>Total Check-out</span>
            </div>
        </div>
    </RctCollapsibleCard>

);
}
}
const mapStateToProps = ({  settings}) => {
  const { clientProfileDetail} = settings;
  return { clientProfileDetail}
}

export default connect(mapStateToProps)(UserFootfallChart);
