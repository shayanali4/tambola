/**
 * Employee Management Page
 */
import React, { Component } from 'react';
// Import React Table
import {cloneDeep} from 'Helpers/helpers';
import { connect } from 'react-redux';
import RctCollapsibleCard from 'Components/RctCollapsibleCard/RctCollapsibleCard';
import api from 'Api';
import EditBasicList from './EditBasicList';
import TextField from '@material-ui/core/TextField';
import { NotificationManager } from 'react-notifications';
import {isMobile} from 'react-device-detect';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import classnames from 'classnames';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import { saveDisclaimer } from 'Actions';
import DatePicker from 'Routes/advance-ui-components/dateTime-picker/components/DatePicker';


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

class MedicalHistoryList extends Component {

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

   componentDidMount()
   {  }

    onDragEnd(result) {
      // dropped outside the list
      if (!result.destination || result.source.index == result.destination.index) {
        return;
      }
      let {medicalHistory_config} = this.props;
      const items = reorder(
        medicalHistory_config,
        result.source.index,
        result.destination.index
      );
      medicalHistory_config = items;
      this.props.saveDisclaimer({medicalHistory_config});
    }


   onAdd()
   {
     this.setState({
       addBasicQuestionDialog : true,
     });
   }


   onRemove = (data) => {
     let {medicalHistory_config} = this.props;
       medicalHistory_config.splice( medicalHistory_config.indexOf(data), 1 );
        this.props.saveDisclaimer({medicalHistory_config : cloneDeep(medicalHistory_config)});
   }

	render() {

	const	{addBasicQuestionDialog} = this.state;
  let {medicalHistory_config} = this.props;
   	return (

     <RctCollapsibleCard fullBlock>
        <div className="table-responsive">
            <div className="d-flex justify-content-between pt-20 pb-10 px-20">
              <div>
                <span> Medical History </span>
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
                     {medicalHistory_config && medicalHistory_config.map((question, key) => (
                     <Draggable key={'queslist'+ key} draggableId={question.id.toString()+key.toString()} index={key}>
                       {(provided, snapshot) => (

                          <div ref={provided.innerRef}   {...provided.draggableProps}    {...provided.dragHandleProps}
                              style={getItemStyle(snapshot.isDragging,
                              provided.draggableProps.style
                            )}>

                            <div className={classnames("card-base",'p-0','mb-0')}>
                             <div className={"row mr-0 " + (isMobile ? " pt-5 pr-5" : "p-10")} key={'questionOption' + key}>
                               <div className="col-11">
                                  <div className="col-12">
                                      <span>  <h4>{(key + 1) + '.  ' + unescape(question.question)}</h4> </span>
                                  </div>
                                  {question.questionoption.optiontype == 1 &&
                                    <div className = "row">
                                      <div className="col-7 col-sm-7 col-md-4 col-xl-2 d-inline ml-10">
                                        <FormControlLabel  control={<Radio />}
                                          disabled = {true}  label={'Yes'} className = "mb-0" />

                                         <FormControlLabel  control={<Radio />}
                                           disabled = {true}  label={'No'} className = "mb-0"/>
                                      </div>
                                      <div className="col-4 col-sm-4 col-md-4">
                                            <TextField disabled placeholder="Comments" className = "pb-0" />
                                      </div>
                                    </div>
                                  }

                                  {question.questionoption.optiontype == 2 &&
                                    <div className = "row">
                                      <div className="col-7 col-sm-7 col-md-4 col-xl-2 d-inline ml-10">
                                        <DatePicker disabled />
                                      </div>
                                    </div>
                                  }
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

             {addBasicQuestionDialog && <EditBasicList  open = {addBasicQuestionDialog} saveQuestionList = {(checkedquestionlist) => { this.setState({addBasicQuestionDialog : false}); this.props.saveDisclaimer({medicalHistory_config : checkedquestionlist } ); } } questiontype = {3} checkedquestionlist = {medicalHistory_config}/>}

     </RctCollapsibleCard>


	);
  }
  }


  const mapStateToProps = ({ disclaimerReducer }) => {
  	const { medicalHistory_config } =  disclaimerReducer;
    return { medicalHistory_config }
  }
  export default connect(mapStateToProps,{saveDisclaimer})(MedicalHistoryList);
