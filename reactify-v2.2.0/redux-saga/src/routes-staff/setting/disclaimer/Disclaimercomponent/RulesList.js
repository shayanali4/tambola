/**
 * Employee Management Page
 */
import React, { Component } from 'react';
// Import React Table
import {cloneDeep} from 'Helpers/helpers';
import { connect } from 'react-redux';
import RctCollapsibleCard from 'Components/RctCollapsibleCard/RctCollapsibleCard';
import api from 'Api';
import EditRuleList from './EditRuleList';
import { NotificationManager } from 'react-notifications';
import {isMobile} from 'react-device-detect';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import classnames from 'classnames';
import { saveDisclaimer } from 'Actions';

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

class RulesList extends Component {

   constructor(props) {
      super(props);
      this.state = this.getInitialState();
      this.onDragEnd = this.onDragEnd.bind(this);
   }
   getInitialState()
   {
     this.initialState = {
                     addRuleDialog:false,
                   }
                   return cloneDeep(this.initialState);
     }

   componentDidMount()
   {    }

    onDragEnd(result) {
      // dropped outside the list
      if (!result.destination || result.source.index == result.destination.index) {
        return;
      }
      let {ruleList_config} = this.props;
      const items = reorder(
        ruleList_config,
        result.source.index,
        result.destination.index
      );
      ruleList_config = items;
      this.props.saveDisclaimer({ruleList_config});
    }

   onAdd()
   {
     this.setState({
       addRuleDialog : true,
     });
   }

   onRemove = (data) => {
     let {ruleList_config} = this.props;
     ruleList_config.splice( ruleList_config.indexOf(data), 1 );
        this.props.saveDisclaimer({ruleList_config : cloneDeep(ruleList_config)});
   }

render() {
	const	{addRuleDialog} = this.state;
let  {ruleList_config} = this.props;

   	return (

     <RctCollapsibleCard fullBlock>
        <div className="table-responsive">
            <div className="d-flex justify-content-between pt-20 pb-10 px-20">
              <div>
                <span> Rules & Regulations </span>
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
                     {ruleList_config && ruleList_config.map((rule, key) => (
                     <Draggable key={'rulelist'+ key} draggableId={rule.id.toString()+key.toString()} index={key}>
                       {(provided, snapshot) => (

                          <div ref={provided.innerRef}   {...provided.draggableProps}    {...provided.dragHandleProps}
                              style={getItemStyle(snapshot.isDragging,
                              provided.draggableProps.style
                            )}>
                          <div className={classnames("card-base",'p-0','mb-0')}>
                            <div className={"row mr-0" + (isMobile ? " p-5" : " p-10")} key={'ruleOption' + key}>
                                <div className="col-11">
                                      <span>  <h4>{(key + 1) + '.  ' + rule.rulename}</h4> </span>
                                </div>
                                <div className="list-action col-1 pl-10">
                                  <a href="javascript:void(0)" onClick={(e) => this.onRemove(rule)} ><i className="ti-close"></i></a>
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

        {addRuleDialog && <EditRuleList  open = {addRuleDialog} saveRuleList = {(checkedquestionlist) => { this.setState({addRuleDialog : false}); this.props.saveDisclaimer({ruleList_config : checkedquestionlist } ); }} checkedrulelist = {ruleList_config}/>}


     </RctCollapsibleCard>


	);
  }
  }



    const mapStateToProps = ({ disclaimerReducer }) => {
    	const { ruleList_config } =  disclaimerReducer;
      return { ruleList_config }
    }
    export default connect(mapStateToProps,{saveDisclaimer})(RulesList);
