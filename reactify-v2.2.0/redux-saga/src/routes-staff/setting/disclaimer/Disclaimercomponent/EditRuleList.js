import React, {PureComponent}  from 'react';
import RctCollapsibleCard from 'Components/RctCollapsibleCard/RctCollapsibleCard';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import {isMobile} from 'react-device-detect';
import DialogTitle from '@material-ui/core/DialogTitle';
import CloseIcon from '@material-ui/icons/Close';
import AddCircleIcon from '@material-ui/icons/AddCircleOutline';
import PerfectScrollbar from 'Components/PerfectScrollbar';
import ReactTable from "react-table";
import api from 'Api';
import { NotificationManager } from 'react-notifications';
import { checkError, cloneDeep} from 'Helpers/helpers';

export default class EditRuleList extends PureComponent {
  constructor(props) {
     super(props);
      this.state = {
        basicdetail : {
            rulelist :[],
            tableInfo : {
              pageSize : 10,
              pageIndex : 0,
              pages : 1
            },
            	loading : false,
            }
      };
   }
   onChange (key,value){

     this.setState({
       basicdetail: {
         ...this.state.basicdetail,
           [key] : value,
            },
        });
      }
      getRulesList(state)
      {
        let {tableInfo }  = this.state.basicdetail ;
        tableInfo.filtered = tableInfo.filtered || [];

        if(state){
    			tableInfo.pageIndex  = state.page;
    			tableInfo.pageSize  = state.pageSize;
    			tableInfo.sorted  = state.sorted;
    			tableInfo.filtered = state.filtered;
    		}

        api.post('gymrules-list', tableInfo).then(response =>
         {
           tableInfo.pages = response.data[1][0].pages;
           let rulelist = response.data[0];
            this.setState({
               basicdetail: {
                 ...this.state.basicdetail,
                rulelist:rulelist,
                tableInfo : tableInfo,
              }
             });
        }
       ).catch(error => console.log(error) )
      }


 componentWillMount(){
 }

 onCheckedList(data)
 {
    let {checkedrulelist} = this.props;

    if(checkedrulelist.filter(x => x.id == data.id ).length > 0)
    {
        NotificationManager.error('Rule already exists');
    }
    else {
      checkedrulelist.push(data);
       NotificationManager.success('Rule Added!');
    }
  }

  render() {
    let {open ,saveRuleList,checkedrulelist} = this.props;
    const {basicdetail} = this.state;
    const {tableInfo} = basicdetail;
      return (
          <div>
               <Dialog fullWidth fullScreen = {isMobile ? true : false}
                   onClose={() => saveRuleList(checkedrulelist)}
                   open={open}
                 >
                 <DialogTitle >
                     <span className="fw-bold text-capitalize">ADD RULE</span>
                     <CloseIcon onClick={() => saveRuleList(checkedrulelist)} className = {"pull-right pointer"}/>
                 </DialogTitle>
			        <PerfectScrollbar style={{ height: 'calc(100vh - 5px)' }}>
                 <DialogContent className = "p-0">
                    <RctCollapsibleCard contentCustomClasses = {" p-0 "}>
                      <ReactTable
                          columns={[
                            {
                              Header: "Rules",
                              accessor: "rulename",
                              Cell : data => (
                                  <h5 className=" text-uppercase">{data.original.rulename }</h5>
                                )
                            },
                            {
                              Header: "ADD",
                              Cell : data => (<div className="list-action text-center">
                                <AddCircleIcon className = {"pointer"}
                                onClick={() => {
                                          this.onCheckedList(data.original);
                                   }}/>
                                </div>
                              ),
                              filterable : false,
                               sortable : false,
                                 width:80
                            },
                          ]}
                           minRows = {1}
                         // Forces table not to paginate or sort automatically, so we can handle it server-side
                          data = {basicdetail.rulelist || []}
                          manual // Forces table not to paginate or sort automatically, so we can handle it server-side
                          showPagination= {true}
                          pages={tableInfo.pages} // Display the total number of pages
                          showPaginationTop = {false}
                          filterable
                          defaultPageSize={tableInfo.pageSize}
                          loading={basicdetail.loading} // Display the loading overlay when we need it
                          className=" -highlight"
                          onFetchData = {(state, instance) =>  this.getRulesList(state)}
                     />
                  </RctCollapsibleCard >
                 </DialogContent>
                </PerfectScrollbar>
              </Dialog>
            </div>
          );
        }
      }
