/**
 * Cart Component
 */
import React, { Component, Fragment } from 'react';
import Button from '@material-ui/core/Button';
import { connect } from 'react-redux';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import api from 'Api';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import DeleteConfirmationDialog from 'Components/DeleteConfirmationDialog/DeleteConfirmationDialog';
//Actions
import { endMemberWorkoutSession ,saveMemberUnit ,saveMemberExerciseLog} from "Actions";
import RecordType from 'Assets/data/exerciserecordtype';
import CloseIcon from '@material-ui/icons/Close';

import {cloneDeep ,getFormtedDateTime, unique, getParams ,calculateSpeed,getLocalDate} from 'Helpers/helpers';
import {convertToSec ,convertSecToHour,convertkgTolbs,convertlbsTokg,convertkmTomiles,convertmilesTokm,convertmphTokph,convertkphTomph} from 'Helpers/unitconversion';
import Unit from 'Components/Unit/unit';
import timer from 'Components/Timer';
import { push } from 'connected-react-router';
import {isMobile} from 'react-device-detect';
import Fab from '@material-ui/core/Fab';
import EditExerciseValues from './EditExerciseValues';
import PerfectScrollbar from 'Components/PerfectScrollbar';
import RctOverlayLoader from 'Components/RctOverlayLoader/RctOverlayLoader';

const TotalActiveTimer = timer(1000)(calculateActiveTime);

function calculateActiveTime({ exerciseSession })
{
    let starttime = exerciseSession.sessionStartTime || getLocalDate(new Date());
    let activetime = (getLocalDate(new Date()) - starttime)/1000;
    activetime = convertSecToHour(activetime);

    return (<div className = "col-5 col-sm-2 col-md-2">
        <p><span >{activetime.hh} : {activetime.mm} : {activetime.ss}</span></p>
    </div>)

}


class ExerciseSession extends Component {

  constructor(props) {
     super(props);
     this.state = this.getInitialState();
  }

  getInitialState()
  {
    this.initialState = {
                    open: false,
                    exercises: [],
                    confirmationDialog : false,
                    activetime : {},
                    deleteConfirmationDialog : false,
                    dataToDelete:null,
                    editExerciseModel : false,
                    selectedexercise : null,
                    nxtdaysessionsaveConfirmationDialog : false,
                  }
                  return cloneDeep(this.initialState);
    }



    	hashRedirect({pathname, hash, search})
    	{
      		if(hash == "#"+ "session-detail")
      		 {
      			 let params = getParams(search);
      			 if(params && params.id)
      			 {
               const	{exerciseSession, location} = this.props;
                let exercises = this.getExerciseList();
                this.setState({ open: true ,exercises : exercises});
      			 }
      		 }
           else if(this.state.open){
               this.setState({ open: false });
           }
    	}
    componentDidMount()
    {
      const	{exerciseSession} = this.props;

    //  this.setState({ nxtdaysessionsaveConfirmationDialog : true });

      if(exerciseSession.sessionStartTime && new Date(exerciseSession.sessionStartTime).toDateString() != getLocalDate(new Date()).toDateString())
      {
           this.setState({ nxtdaysessionsaveConfirmationDialog : true });
          //this.props.endMemberWorkoutSession();
      }
      this.hashRedirect(location);
    }

    componentWillReceiveProps(nextProps, nextState) {
      const {pathname, hash, search} = nextProps.location || {};
      const {open} = this.state;


      if(hash == "" && this.props.location.hash)
      {
          this.setState(this.getInitialState());
      }
      else if(!this.props.location || (pathname != this.props.location.pathname  || hash != this.props.location.hash  || search !=  this.props.location.search))
      {
            this.hashRedirect({pathname, hash, search});
      }
    }


  handleClickOpen = () => {
    const	{exerciseSession} = this.props;
  	this.props.push(location.pathname + "?id=" + exerciseSession.sessionId + "#session-detail");
  };

  onConfirm()
  {
    let exerciseLog = this.state.exercises;


    if(exerciseLog && exerciseLog.length == 0)
    {
       exerciseLog = this.getExerciseList();
    }

    exerciseLog.forEach(x => {
      if (x.recordtypeId == 2 || x.recordtypeId == 4) {
        x.setList.forEach(y => y.reps = 0)
      }
    });

    if(exerciseLog.length > 0)
    {
      this.props.saveMemberExerciseLog({exerciseLog});
    }

    this.props.endMemberWorkoutSession({exerciseLog});


    this.setState({
      confirmationDialog : false,
    });
  }

  cancelConfirmation()
  {
    this.setState({
     confirmationDialog : false,
   });
  }

  handleClickEndSession = () => {
      this.setState({
        confirmationDialog : true,
      });
  };

  handleClose = () => {
    this.props.history.goBack();
  };

  getExerciseList()
  {
    let exercises = [];
    for (var key in localStorage) {
        if (key.indexOf("||exercise_logs") > -1) {

          let exerciselog = localStorage.getItem(key);
          exerciselog = JSON.parse(exerciselog);
          var exercisedetail = exerciselog.logs.exerciseLog;
          var exercise = {};
          if(exercisedetail.exercise.id && exerciselog.logs.completed)
          {
            exercise.createddate = exerciselog.createddate;
            exercise.burnedCalorie = parseFloat(exercisedetail.burnedCalorie);
            exercise.exerciseid = exercisedetail.exercise.id;
            exercise.exerciseindex = exerciselog.logs.exerciseindex;
            exercise.routineid = exerciselog.id;
            exercise.dayid = exerciselog["day-id"];
            exercise.Isroutine = exerciselog.Isroutine;
            exercise.phase = exerciselog.phase;
            exercise.exercisename = exercisedetail.exercise.exercisename;
            exercise.setList = exercisedetail.setList;
            exercise.recordtype = exercisedetail.exercise.recordtype;
            exercise.recordtypeId = exercisedetail.exercise.recordtypeId ? exercisedetail.exercise.recordtypeId : RecordType.filter(r => r.name == exercisedetail.exercise.recordtype)[0].value;
            exercise.timercompleted = exerciselog.logs.timerStoped;

            exercises.push(exercise);
          }

        }
    }
        return exercises;

     //this.setState({exercises });

   //  let date = this.props.exerciseSession.sessionStartTime;
   //  api.post('member-workoutsession-detail',{date : date,sessionid : this.props.exerciseSession.sessionId})
   // .then(response =>
   //   {
   //     let exercises = response.data[0];
   //      exercises.forEach(x => x.exercisesets = x.exercisesets ? JSON.parse(x.exercisesets) : []);
   //      this.setState({exercises });
   //    }
   // )
  }


  initiateDelete(key , selectedexercise)
 	{
 		selectedexercise.key = key;
   	this.setState({
 		 deleteConfirmationDialog : true,
 			dataToDelete : selectedexercise
 	 });
 	}
 	onDelete(selectedexercise)
 	{
 		const {exercises} = this.state;
 	  exercises.splice(selectedexercise.key, 1);

    localStorage.removeItem(selectedexercise.exerciseindex +"||"+ selectedexercise.exerciseid +"||" + 'exercise_logs'+ selectedexercise.routineid + selectedexercise.dayid + (selectedexercise.Isroutine ? '' : selectedexercise.phase));

 	 this.setState({
 		 deleteConfirmationDialog : false,
 		 dataToDelete : null
 	 });

 	}
 	cancelDelete()
 	{
 		this.setState({
 		 deleteConfirmationDialog : false,
 			dataToDelete : null
 	 });
 	}

  onEdit(key,exercise)
 {
	 exercise.key = key;
	 this.setState({
		 editExerciseModel : true,
		  selectedexercise : exercise
	 });
 }

onCancel()
 {
   this.setState({
    editExerciseModel : false,
     selectedexercise : null,
  });
}


onChange(key,value)
{
      value.forEach(x => {
        let {hh,mm,ss} = x;
        x.time = convertToSec({hh,mm,ss});
        x.speed = this.props.distanceunit == 1 ?  calculateSpeed(x.distance_miles,x.time) :  calculateSpeed(x.distance,x.time);
      });

  this.setState({
    selectedexercise: {
      ...this.state.selectedexercise,
        [key] : value
      },
  });
}

onSaveExercise()
{
  let {selectedexercise} = this.state;

  let currentState = JSON.parse(localStorage.getItem(selectedexercise.exerciseindex +"||"+ selectedexercise.exerciseid +"||" + 'exercise_logs'+ selectedexercise.routineid + selectedexercise.dayid + (selectedexercise.Isroutine ? '' : selectedexercise.phase)));
  currentState.logs.exerciseLog.setList = selectedexercise.setList;

  localStorage.setItem(selectedexercise.exerciseindex +"||"+ selectedexercise.exerciseid +"||" + 'exercise_logs'+ selectedexercise.routineid + selectedexercise.dayid + (selectedexercise.Isroutine ?  '' : selectedexercise.phase) , JSON.stringify(currentState));

  this.setState({
    editExerciseModel : false,
  });
}

onSaveNxtdaySession()
{
      let exerciseLog = this.state.exercises;

      if(exerciseLog && exerciseLog.length == 0)
      {
         exerciseLog = this.getExerciseList();
      }

      exerciseLog.forEach(x => {
        if (x.recordtypeId == 2 || x.recordtypeId == 4) {
          x.setList.forEach(y => y.reps = 0)
        }
      });

      if(exerciseLog.length > 0)
      {
        this.props.saveMemberExerciseLog({exerciseLog});
      }

      this.props.endMemberWorkoutSession({exerciseLog});


      this.setState({
        nxtdaysessionsaveConfirmationDialog : false,
      });
}

onEndNxtdaySession()
{
    let exerciseLog = this.state.exercises;
      this.props.endMemberWorkoutSession({exerciseLog});
      this.setState({
        nxtdaysessionsaveConfirmationDialog : false
      });
}

onSessionEndWithoutSave()
{
  let exerciseLog = this.state.exercises;

      this.props.endMemberWorkoutSession({exerciseLog});
      this.setState({
        confirmationDialog : false
      });
}


	render() {

    let {open,exercises,confirmationDialog,activetime,deleteConfirmationDialog,dataToDelete,editExerciseModel,selectedexercise,nxtdaysessionsaveConfirmationDialog} = this.state;
		const { exerciseSession,weightunit,distanceunit,dialogLoading} = this.props;

    // if(exercises){
    //     exercises.forEach(x => {x.recordtypeId  = RecordType.filter(r => r.name == x.recordtype)[0] });
    // }
    exercises = exercises || [];
    exercises.forEach(x => {
      if (x.recordtypeId == 2 || x.recordtypeId == 4) {
        x.setList.forEach(y => y.reps = 0)
      }
    });
  		return (

      <div>
      {exerciseSession.sessionId &&
          <div className = "fixed-plugin w-100 py-5" style = {{ "top": "inherit",  "bottom": "0px",  "left" : "0%" , "right" : "unset", "borderRadius" : "inherit" , "paddingLeft" : "19%", "zIndex" : "2"}}>
            <Button className="text-white bg-secondary" variant="contained"  onClick={() => this.handleClickOpen()}>
              Workout Session Detail
            </Button>
            <Button className="text-white bg-danger ml-10" variant="contained"  onClick={() => this.handleClickEndSession()}>
              End Session
            </Button>
        </div>
       }

       {dialogLoading && <RctOverlayLoader/>}

          <Dialog fullScreen = {isMobile ? true : false} open={open} fullWidth onClose={this.handleClose} aria-labelledby="form-dialog-title" disableBackdropClick = {true} >
            <PerfectScrollbar style={{ height : '590px', width : '100%' }}>
          	<DialogTitle >
                    <span className = "vr-super"> Session Detail </span>
                    <div className = "d-inline">
                      <Unit onChange = {() => this.props.saveMemberUnit()}/>
                    </div>
                   <CloseIcon onClick={this.handleClose} className = {"pull-right pointer"}/>
             </DialogTitle>
           <DialogContent>


            <div className="row">

              <div className = "col-12">
                  <p>Workout Started at {exerciseSession.sessionStartTime} </p>
              </div>

                <div className = "col-7 col-sm-4 col-md-4">
                    <p>Active Time </p>
                </div>

                <TotalActiveTimer exerciseSession = {this.props.exerciseSession}/>
                <div className = "col-7 col-sm-4 col-md-4">
                    <p>Total Variation  </p>
                </div>
                <div className = "col-5 col-sm-2 col-md-2">
                    <p><span >{unique(exercises.map(x => x.exerciseid)).length}</span></p>
                </div>
            </div>

            <div className="row">

                <div className = "col-7 col-sm-4 col-md-4">
                    <p>Total Sets  </p>
                </div>
                <div className = "col-5 col-sm-2 col-md-2">
                    <p><span >{exercises.map(x => x.setList.length).reduce((a, b) => parseInt(a) + parseInt(b), 0)}</span></p>
                </div>

                <div className = "col-7 col-sm-4 col-md-4">
                    <p>Total Reps </p>
                </div>
                <div className = "col-5 col-sm-2 col-md-2">
                    <p><span >{exercises.map(x =>  (x.recordtypeId != 2 && x.recordtypeId != 4) ? (x.setList.map(y => y.reps || 0).reduce((a, b) => parseInt(a) + parseInt(b), 0)) : 0).reduce((a, b) => parseInt(a) + parseInt(b), 0)}</span></p>
                </div>
            </div>

            <div className="row">



                <div className = "col-7 col-sm-4 col-md-4">
                    <p> Weight Lifted </p>
                </div>
                <div className = "col-5 col-sm-2 col-md-2">
                    <p><span >{
                      weightunit == 1 ?
                      Math.ceil(convertkgTolbs(exercises.map(x => x.recordtypeId == 3 ? (x.setList.map(y => y.weight ? y.weight * y.reps : 0).reduce((a, b) => a + b, 0)) : 0).reduce((a, b) => a + b, 0)))
                      :Math.ceil(exercises.map(x => x.recordtypeId == 3 ? ( x.setList.map(y => y.weight ? y.weight * y.reps : 0).reduce((a, b) => a + b, 0)) : 0).reduce((a, b) => a + b, 0))}


                    {weightunit == 1 ? ' lbs' : ' kg'}</span></p>
                </div>
                <div className = "col-7 col-sm-4 col-md-4">
                    <p>Burned Calories </p>
                </div>
                <div className = "col-5 col-sm-2 col-md-2 pl-0">
                    <p><span >{exercises.map(x =>  x.burnedCalorie || 0).reduce((a, b) => a + b, 0).toFixed("2") + ' Cal'}</span></p>
                </div>
            </div>

                 <div className="blog-list-wrap workout-routine">
                     <List className="p-0 ">
                     {exercises.sort((x,y) => new Date(x.createddate) - new Date(y.createddate)).map((exercise, key) => (
                         <ListItem key={"sessionexercises" + key} button className="post-item align-items-center justify-content-between py-25">
                           <div className="post-content d-flex  w-100">
                             {/*<div className="post-img mr-20">
                               <img src={data.thumbnail} alt="post-img" className="img-fluid" />
                             </div>*/}
                             <div className="post-info  w-80" >
                               <h5 className = "text-uppercase text-primary">	{exercise.exercisename}</h5>
                             {exercise && exercise.setList && exercise.setList.map((set, key1) => (
                               <div className="meta-info fs-12 text-muted mb-10" key={"setList" + key1} >
                               {exercise && exercise.recordtypeId &&  exercise.recordtypeId == 1  && <div className="row">
                                  <span className="ml-10  mr-1 d-inline-block">Reps : </span>
                                    <span className="mr-1 d-inline-block">{set.reps}</span>
                                      </div>
                                }
                                { exercise && exercise.recordtypeId  &&  exercise.recordtypeId  == 3 && <div className="row">
                                            <span className="ml-10 mr-1 d-inline-block">Reps</span>
                                          <span className="mr-1 d-inline-block">x</span>
                                          <span className="mr-1 d-inline-block">Weight({weightunit == 1 ? "lbs" : "kg"})  :</span>

                                                <span className="mr-1 d-inline-block">{set.reps}</span>
                                              <span className="mr-1 d-inline-block">x</span>
                                                <span className="mr-1 d-inline-block">{parseFloat(weightunit == 1 ? (set.weight_lbs ? set.weight_lbs : convertkgTolbs(set.weight) || 0) : set.weight || 0).toFixed(2)}</span>

                                              </div>
                                    }

                                    { exercise && exercise.recordtypeId  &&  (exercise.recordtypeId  == 2 || exercise.recordtypeId  == 4) && <div className="row">
                                      {set.calorie &&
                                        <div className = "col-4 col-sm-3">
                                                <span className="mr-1 d-inline-block"> Calorie : </span>
                                          </div>
                                        }
                                        {set.calorie &&
                                          <div className = "col-8 col-sm-9">
                                              <span className="mr-1 d-inline-block">{set.calorie +' cal'}</span>
                                            </div>
                                          }
                                          {set.distance &&
                                              <div className = "col-4 col-sm-3">
                                                    <span className="mr-1 d-inline-block"> Distance : </span>
                                              </div>
                                            }
                                              {set.distance &&
                                              <div className = "col-8 col-sm-9">
                                                  <span className="mr-1 d-inline-block">{parseFloat(distanceunit == 1 ?set.distance_miles: set.distance).toFixed(2)}{distanceunit == 1 ? " mile" : " km"}</span>
                                                </div>
                                              }
                                                {set.speed &&
                                                  <div className = "col-4 col-sm-3">
                                                        <span className="mr-1 d-inline-block"> Speed : </span>
                                                  </div>
                                                }
                                                {set.speed &&
                                                  <div className = "col-8 col-sm-9">
                                                      <span className="mr-1 d-inline-block">{parseFloat(distanceunit == 1 ?  calculateSpeed(set.distance_miles,set.time) :  calculateSpeed(set.distance,set.time)).toFixed(2)}{distanceunit == 1 ? " mph" : " kph"}</span>
                                                    </div>
                                                  }
                                                    {set.laps &&
                                                      <div className = "col-4 col-sm-3">
                                                            <span className="mr-1 d-inline-block"> Lap : </span>
                                                      </div>
                                                    }
                                                    {set.laps &&
                                                      <div className = "col-8 col-sm-9">
                                                          <span className="mr-1 d-inline-block">{set.laps}</span>
                                                        </div>
                                                      }
                                                        {(set.hh || set.mm || set.ss) &&
                                                        <div className = "col-4 col-sm-3">
                                                                <span className="mr-1 d-inline-block"> Duration : </span>
                                                          </div>
                                                        }
                                                          {(set.hh || set.mm || set.ss) &&
                                                          <div className = "col-8 col-sm-9">
                                                            <span className="mr-1 d-inline-block">{'  '+set.hh + ' hh ' + set.mm + ' mm ' + set.ss + ' ss ' }</span>
                                                            </div>
                                                          }
                                                    </div>}

                                         </div>
                                 ))}
                               <p className="mb-0"> </p>
                             </div>
                           </div>
                           <div className="d-inline hover-action w-20">
                             <Fab className="btn-success text-white m-5" variant="round" mini= "true" onClick={() => {this.onEdit(key,exercise)}} >
       												<i className="zmdi zmdi-edit"></i>
       											</Fab>
                            <Fab className="btn-danger text-white m-5" variant="round" onClick={() => this.initiateDelete(key,exercise)} mini= "true" >
      												<i className="zmdi zmdi-delete"></i>
      											</Fab>
                          </div>
                         </ListItem>
                       ))}
                     </List>
                 </div>

           </DialogContent>
             </PerfectScrollbar>
         </Dialog>


         {
            confirmationDialog &&
          <DeleteConfirmationDialog
            openProps = {confirmationDialog}
            title="Are You Sure Want To Continue?"
            message="This will end your session and save workout session detail."
            onConfirm={() => this.onConfirm()}
             onCancel={() => this.cancelConfirmation()}
             onContinue = {() => this.onSessionEndWithoutSave()}
             confirmlabel="Save"
             continuelabel= "End Without Save"
          />
          }

          {
            deleteConfirmationDialog &&
            <DeleteConfirmationDialog
              openProps = {deleteConfirmationDialog}
              title="Are You Sure Want To Delete?"
              message= { <span className = 'text-uppercase'>{dataToDelete.exercisename }</span> }
              onConfirm={() => this.onDelete(dataToDelete)}
               onCancel={() => this.cancelDelete()}
            />
          }

          {
            nxtdaysessionsaveConfirmationDialog &&
            <DeleteConfirmationDialog
              openProps = {nxtdaysessionsaveConfirmationDialog}
              title="Are You Sure Want To Continue?"
              message="This will save your previous day workout session detail."
              onConfirm={() => this.onSaveNxtdaySession()}
               onCancel={() => 	this.onEndNxtdaySession()}
               confirmlabel="Save"
              cancelabel= "Continue Without Save"

            />
          }

          {editExerciseModel &&
            <EditExerciseValues open = {editExerciseModel} selectedexercise = {selectedexercise} weightunit = {weightunit}
            distanceunit = {distanceunit} onCancel = {() => this.setState({ editExerciseModel :  false , selectedexercise : null})}
            onChange = {this.onChange.bind(this)} onSaveExercise = {this.onSaveExercise.bind(this)}/>
          }

     </div>

  	)
	}
}

const mapStateToProps = ({ memberExerciseLogReducer,settings }) => {
	const { exerciseSession ,dialogLoading} = memberExerciseLogReducer;
  const { weightunit,distanceunit  } =  settings;
	return { exerciseSession ,weightunit,distanceunit,dialogLoading};
}

export default connect(mapStateToProps, {
	endMemberWorkoutSession,saveMemberUnit, push ,saveMemberExerciseLog
})(ExerciseSession);
