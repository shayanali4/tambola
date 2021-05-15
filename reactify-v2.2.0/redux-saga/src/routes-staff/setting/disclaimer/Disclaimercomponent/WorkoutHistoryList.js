/**
 * Employee Management Page
 */
import React, { Component } from 'react';
// Import React Table
import {cloneDeep} from 'Helpers/helpers';
import { connect } from 'react-redux';
import RctCollapsibleCard from 'Components/RctCollapsibleCard/RctCollapsibleCard';
import api from 'Api';
import { NotificationManager } from 'react-notifications';
import {isMobile} from 'react-device-detect';
import EditBasicList from './EditBasicList';
import classnames from 'classnames';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import TextField from '@material-ui/core/TextField';
import { saveDisclaimer } from 'Actions';
import DatePicker from 'Routes/advance-ui-components/dateTime-picker/components/DatePicker';

import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

// a little function to help us with reordering the result
const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
};
// const grid = 8;
const getItemStyle = (isDragging, draggableStyle) => ({
  ...draggableStyle,
});
const getListStyle = isDraggingOver => ({
  // background: isDraggingOver ? 'lightblue' : 'lightgrey',
  // padding: grid,
});


class WorkoutHistoryList extends Component {

   constructor(props) {
      super(props);
      this.state = this.getInitialState();
       this.onDragEnd = this.onDragEnd.bind(this);
   }
   getInitialState()
   {
     this.initialState = {
                     addBasicQuestionDialog:false,
                    }
                   return cloneDeep(this.initialState);
     }

     onDragEnd(result) {
       // dropped outside the list
       if (!result.destination || result.source.index == result.destination.index) {
         return;
       }
  		 let {workoutHistory_config} = this.props;
  	   const items = reorder(
         workoutHistory_config,
         result.source.index,
         result.destination.index
       );
  		 workoutHistory_config = items;
       this.props.saveDisclaimer({workoutHistory_config});
     }

   componentDidMount()
   {   }

   onAdd()
   {
     this.setState({
       addBasicQuestionDialog : true,
     });
   }

   onRemove = (data) => {
     let {workoutHistory_config} = this.props;
       workoutHistory_config.splice( workoutHistory_config.indexOf(data), 1 );
        this.props.saveDisclaimer({workoutHistory_config : cloneDeep(workoutHistory_config)});
   }

	render() {

	const	{addBasicQuestionDialog} = this.state;
  let {workoutHistory_config} =this.props;
   	return (

     <RctCollapsibleCard fullBlock>
        <div className="table-responsive">
            <div className="d-flex justify-content-between pt-20 pb-10 px-20">
              <div>
                <span> Workout History </span>
              </div>
              <div>
                <a href="javascript:void(0)" onClick={() => this.onAdd()} className="btn-outline-default"><i className="ti-pencil"></i></a>
              </div>
            </div>

            <DragDropContext onDragEnd={this.onDragEnd}>
             <Droppable droppableId="droppable">
               {(provided, snapshot) => (
                  <div
                     {...provided.droppableProps} ref={provided.innerRef} style={getListStyle(snapshot.isDraggingOver)}>
                     {workoutHistory_config && workoutHistory_config.map((question, key) => (
                     <Draggable key={'queslist'+ key} draggableId={question.id.toString()+key.toString()} index={key}>
                       {(provided, snapshot) => (

                          <div ref={provided.innerRef}   {...provided.draggableProps}    {...provided.dragHandleProps}
                              style={getItemStyle(snapshot.isDragging,
                              provided.draggableProps.style
                            )}>

                            <div className={classnames("card-base",'p-0','mb-0')}>
                             <div className={"row mr-0" + (isMobile ? " pt-5 pr-5" : " p-10")} key={'questionOption' + key}>
                               <div className="col-11">
                                 <div className="row">
                                   <div className="col-12">
                                     <span className = {(isMobile ? " pl-10" :  "")}>  <h4>{(key + 1) + '.  ' + unescape(question.question)}</h4> </span>
                                   </div>

                                   {question.questionoption.optiontype == 1 && question.questionoption.option.map((y, key) => (
                                       <div className={isMobile ? " col-12" :  " col-6 "} key={'divOption' + key}>
                                         <FormControlLabel  control={
                                           <Checkbox color="primary"   disabled />
                                            }  label={y} className = {"mb-0" + (isMobile ? " pl-20" :  " pl-10")}
                                         />
                                       </div>
                                       ))
                                   }
                                   {question.questionoption.optiontype == 1 && question.questionoption.isotherenabled == 1 &&
                                     <div className={isMobile ? " col-12" :  " col-6 "}>
                                       <FormControlLabel  control={
                                         <Checkbox color="primary"   disabled />
                                       }  label={'Other'} className = {"mb-0" + (isMobile ? " pl-20" :  " pl-10")}
                                       />
                                     </div>
                                   }
                                   {question.questionoption.optiontype == 1 && question.questionoption.isnaenabled == 1 &&
                                     <div className={isMobile ? " col-12" :  " col-6 "}>
                                       <FormControlLabel  control={
                                         <Checkbox color="primary"   disabled />
                                       }  label={'N/A'} className = {"mb-0" + (isMobile ? " pl-20" :  " pl-10")}
                                       />
                                     </div>
                                   }
                                   {question.questionoption.optiontype == 2 &&
                                     <div className="col-6">
                                           <TextField disabled placeholder="Add text" className = {"pb-0" + (isMobile ? " pl-20" :  " pl-10")} />
                                     </div>
                                  }
                                  {question.questionoption.optiontype == 3 &&
                                    <div className="col-6">
                                          <DatePicker disabled />
                                    </div>
                                 }
                                  </div>
                                </div>
                                <div className="list-action col-1 pl-10">
                                  <a href="javascript:void(0)" onClick={(e) => this.onRemove(question)} ><i className="ti-close"></i></a>
                                </div>
                              </div>
                             </div>
                            </div>
                          )}
                        </Draggable>
                      ))}
                     {provided.placeholder}
                    </div>
                   )}
                  </Droppable>
                </DragDropContext>
              </div>

              {addBasicQuestionDialog && <EditBasicList  open = {addBasicQuestionDialog} saveQuestionList = {(checkedquestionlist) => { this.setState({addBasicQuestionDialog : false}); this.props.saveDisclaimer({workoutHistory_config : checkedquestionlist } ); } } questiontype = {2} checkedquestionlist = {workoutHistory_config}/>}

     </RctCollapsibleCard>


	);
  }
  }



      const mapStateToProps = ({ disclaimerReducer }) => {
      	const { workoutHistory_config } =  disclaimerReducer;
        return { workoutHistory_config }
      }
      export default connect(mapStateToProps,{saveDisclaimer})(WorkoutHistoryList);
