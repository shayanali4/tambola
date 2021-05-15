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
import  Questiontype from 'Assets/data/questiontype';

export default class EditBasicList extends PureComponent {
  constructor(props) {
     super(props);
      this.state = {
        basicdetail : {
            questionlist :[],
            tableInfo : {
              pageSize : 10,
              pageIndex : 0,
              pages : 1
            },
            	loading : false,
            }
      };
   }

   onCheckedList(data)
   {
      let {checkedquestionlist} = this.props;

      if(checkedquestionlist.filter(x => x.id == data.id ).length > 0)
      {
          NotificationManager.error('Question already exists');
      }
      else {
        checkedquestionlist.push(data);
        NotificationManager.success('Question Added!');
      }
    }

      getQuestionList(state)
      {
        let {tableInfo }  = this.state.basicdetail ;
        let {questiontype,checkedquestionlist}   = this.props ;
        tableInfo.filtered = tableInfo.filtered || [];

        if(state){
    			tableInfo.pageIndex  = state.page;
    			tableInfo.pageSize  = state.pageSize;
    			tableInfo.sorted  = state.sorted;
    			tableInfo.filtered = state.filtered;
    		}
        tableInfo.questionType = questiontype || 1;

        api.post('basicquestion-list', tableInfo).then(response =>
         {
           tableInfo.pages = response.data[1][0].pages;
           let questionlist = response.data[0];


           questionlist.filter(x =>{
              x.questionoption = x.questionoption ? JSON.parse(x.questionoption): null;
              x.question = unescape(x.question);
            })
            this.setState({
               basicdetail: {
                 ...this.state.basicdetail,
                questionlist:questionlist,
                tableInfo : tableInfo,
              }
             });
        }
       ).catch(error => console.log(error) )
      }

 componentWillMount(){

 }

  render() {
    let {open ,saveQuestionList,checkedquestionlist} = this.props;
    const {basicdetail} = this.state;
    const {tableInfo} = basicdetail;
      return (
          <div>
               <Dialog fullWidth fullScreen = {isMobile ? true : false}
                   onClose={()=> saveQuestionList(checkedquestionlist)}
                   open={open}
                 >
                 <DialogTitle >
                     <span className="fw-bold text-capitalize">ADD QUESTION</span>
                     <CloseIcon onClick={()=> saveQuestionList(checkedquestionlist)} className = {"pull-right pointer"}/>
                 </DialogTitle>
			        <PerfectScrollbar style={{ height: 'calc(100vh - 5px)' }}>
                 <DialogContent className = "p-0">
                    <RctCollapsibleCard contentCustomClasses = {" p-0 "}>
                      <ReactTable
                          columns={[
                            {
                              Header: "Questions",
                              accessor: "question",
                              Cell : data => (
                                  <h5 className=" text-uppercase">{data.original.question }</h5>
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
                          data = {basicdetail.questionlist || []}
                          manual // Forces table not to paginate or sort automatically, so we can handle it server-side
                          showPagination= {true}
                          pages={tableInfo.pages} // Display the total number of pages
                          showPaginationTop = {false}
                          filterable
                          defaultPageSize={tableInfo.pageSize}
                          loading={basicdetail.loading} // Display the loading overlay when we need it
                          className=" -highlight"
                          onFetchData = {(state, instance) =>  this.getQuestionList(state)}
                     />
                  </RctCollapsibleCard >
                 </DialogContent>
                </PerfectScrollbar>
              </Dialog>
            </div>
          );
        }
      }
