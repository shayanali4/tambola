import React, { Fragment, PureComponent,Component } from 'react';
import Form from 'reactstrap/lib/Form';
import RctCollapsibleCard from 'Components/RctCollapsibleCard/RctCollapsibleCard';
import TextField  from '@material-ui/core/TextField';
import FormHelperText from '@material-ui/core/FormHelperText';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

// a little function to help us with reordering the result
const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
};

/**
 * Moves an item from one list to another list.
 */
const move = (source, destination, droppableSource, droppableDestination) => {
    const sourceClone = Array.from(source);
    const destClone = Array.from(destination);
    const [removed] = sourceClone.splice(droppableSource.index, 1);

    destClone.splice(droppableDestination.index, 0, removed);

    const result = {};
    result[droppableSource.droppableId] = sourceClone;
    result[droppableDestination.droppableId] = destClone;

    return result;
};

const grid = 8;

const getItemStyle = (isDragging, draggableStyle) => ({
    // some basic styles to make the items look a bit nicer
    userSelect: 'none',
    padding: grid * 2,
    margin: `0 0 ${grid}px 0`,

    // change background colour if dragging
    background: isDragging ? 'lightgreen' : 'grey',

    // styles we need to apply on draggables
    ...draggableStyle
});

const getListStyle = isDraggingOver => ({
    background: isDraggingOver ? 'lightblue' : 'lightgrey',
    padding: grid,
    width: 250
});


export default class Zonedetail extends Component {

  id2List = {
         droppable: 'totalbranches',
         droppable2: 'selectedbranches'
     };

  //getList = id => this.state[this.id2List[id]];

  getList = id => this.props.fields[this.id2List[id]];

  onDragEnd = result => {
        const { source, destination } = result;

        // dropped outside the list
        if (!destination) {
            return;
        }

        if (source.droppableId === destination.droppableId) {
            const items = reorder(
                this.getList(source.droppableId),
                source.index,
                destination.index
            );

            // let state = { items };
            //
            // if (source.droppableId === 'droppable2') {
            //     state = { selected: items };
            // }
            //
            // this.setState(state);
        } else {
            const result = move(
                this.getList(source.droppableId),
                this.getList(destination.droppableId),
                source,
                destination
            );

            this.props.onChange('branchesselected',result);

        }
    };

 render() {
   const {fields,errors , onChange} = this.props;
  return (
    <div className="textfields-wrapper">
      <RctCollapsibleCard >
        <form noValidate autoComplete="off">
          <div className="row">
             <div className="col-sm-6 col-md-6 col-xl-4">
                    <TextField  required inputProps={{maxLength:50}}  id="name" autoFocus = {true} fullWidth label="Zone/City Name" value={fields.name}  onChange={(e) => onChange('name',e.target.value , true)} onBlur = {(e) =>onChange('name',e.target.value , true)}/>
                    <FormHelperText  error>{errors.name}</FormHelperText>
              </div>
          </div>

          <div className="row pt-10">
          <DragDropContext onDragEnd={this.onDragEnd}>
                <Droppable droppableId="droppable">
                    {(provided, snapshot) => (
                        <div className="col-sm-6 col-md-4 col-xl-4"
                            ref={provided.innerRef}
                            style={getListStyle(snapshot.isDraggingOver)}>
                            <span className = "pb-5"> Total Branches </span>
                            {fields.totalbranches.map((item, index) => (
                                <Draggable
                                    key={item.id}
                                    draggableId={item.id}
                                    index={index}>
                                    {(provided, snapshot) => (
                                        <div
                                            ref={provided.innerRef}
                                            {...provided.draggableProps}
                                            {...provided.dragHandleProps}
                                            style={getItemStyle(
                                                snapshot.isDragging,
                                                provided.draggableProps.style
                                            )}>
                                            {unescape(item.label)}
                                        </div>
                                    )}
                                </Draggable>
                            ))}
                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>
                <Droppable droppableId="droppable2">
                    {(provided, snapshot) => (
                        <div className="col-sm-6 col-md-4 col-xl-4"
                            ref={provided.innerRef}
                            style={getListStyle(snapshot.isDraggingOver)}>
                            <span className = "pb-5"> Selected Branches </span>
                            {fields.selectedbranches.map((item, index) => (
                                <Draggable
                                    key={item.id}
                                    draggableId={item.id}
                                    index={index}>
                                    {(provided, snapshot) => (
                                        <div
                                            ref={provided.innerRef}
                                            {...provided.draggableProps}
                                            {...provided.dragHandleProps}
                                            style={getItemStyle(
                                                snapshot.isDragging,
                                                provided.draggableProps.style
                                            )}>
                                            {unescape(item.label)}
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

      </form>
    </RctCollapsibleCard>
  </div>
  );
 }
}
