/**
 * Employee Management Page
 */
import React, { Component, PureComponent } from 'react';
// Import React Table
import { connect } from 'react-redux';

import RctSectionLoader from 'Components/RctSectionLoader/RctSectionLoader';
import { clsAddNewQuestionModel, saveQuestion } from 'Actions';

import  Questiontype from 'Assets/data/questiontype';

import {getLocalDate, checkError, cloneDeep} from 'Helpers/helpers';
import Dialog from '@material-ui/core/Dialog';
import QuestionDetail from './QuestionDetail';
import AppBar from '@material-ui/core/AppBar';
import PerfectScrollbar from 'Components/PerfectScrollbar';

import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';

import CloseIcon from '@material-ui/icons/Close';
import SaveIcon from '@material-ui/icons/Save';

import {required,restrictLength,checkDescription,allowAlphaNumeric} from 'Validations';
import { push } from 'connected-react-router';
import { NotificationManager } from 'react-notifications';

import {isMobile} from 'react-device-detect';

import Button from '@material-ui/core/Button';

function TabContainer({ children }) {
    return (
        <Typography component="div" style={{ padding: isMobile ? 0 : 8 * 3 }}>
            {children}
        </Typography>
    );
}

class AddQuestion extends PureComponent {
	constructor(props) {
     super(props);
		   this.state = this.getInitialState();
   }

   getInitialState()
   {
     this.initialState = {
             activeIndex : 0,
             questionData :
             {
               fields : {
                  id : 0,
                  questiontype : '1',
                  question : '',
                  questionoption : {
                    isotherenabled : 0,
                    isnaenabled : 1,
                    optiontype : '1',
                    option : [],
                  },
                  optionname : '',

                },
                errors : { },
               validated : false
           },
     };

      return cloneDeep(this.initialState);
   }

	 componentWillReceiveProps(newProps)
	 {
		 let	{editquestion, editMode} = newProps;
		 let {questionData} = this.state;
     editquestion = editquestion && editquestion.data;

     questionData= questionData.fields;

		 if(editMode && editquestion && editquestion.id && editquestion.id != this.state.questionData.fields.id)
		 {
       let questiontype = Questiontype.filter(value => value.name == editquestion.questiontype)[0];

       questionData.id = editquestion.id;
       questionData.questiontype =questiontype ? questiontype.value : '1';
       questionData.question = editquestion.question;
       questionData.questionoption = editquestion.questionoption;

       this.state.question_old = cloneDeep(questionData);

     }
	 }

   componentWillUpdate(nextProps, nextState)
   {
     if((!nextProps.editMode && nextState.questionData.fields.id != 0) || (this.props.addNewQuestionModal && !nextProps.addNewQuestionModal))
     {
        this.setState(this.getInitialState());
     }
   }


   onChangeQuestion(key,value, isRequired)
   {
     let error= isRequired ? required(value) : '';
     const fields = this.state.questionData.fields;
     let questionoption = fields.questionoption;
     if (key == "isotherenabled" )
     {
      questionoption.isotherenabled = value?1:0;
      value = questionoption;
      }
      if (key == "isnaenabled" )
      {
       questionoption.isnaenabled = value?1:0;
       value = questionoption;
       }
      else if (key == "optiontype" ) {
        questionoption.optiontype = value;
      }

     this.setState({
       questionData: {
         ...this.state.questionData,
         fields : {...this.state.questionData.fields,
           [key] : value,
           questionoption : questionoption,
         },
         errors : {...this.state.questionData.errors,
           [key] : error
         }
       }
     });
   }

   onAddOption()
   {
     const {optionname,questionoption} = this.state.questionData.fields;
     let errors = {};
     if(optionname)
     {
        questionoption.option.push(optionname);
     }
     else {
        errors.optionname = required(optionname);
     }

     this.setState({
       questionData: {
         ...this.state.questionData,
         fields : {...this.state.questionData.fields,
            questionoption : {...this.state.questionData.fields.questionoption,
                option : questionoption.option,
              },
           optionname : '',
         },
         errors : errors,
       }
     });
   }


   onRemoveOption(data)
   {
     const {optionname,questionoption} = this.state.questionData.fields;
     let options = questionoption.option;
     options.splice( options.indexOf(data), 1 );

     this.setState({
       questionData: {
         ...this.state.questionData,
         fields : {...this.state.questionData.fields,
            questionoption : {...this.state.questionData.fields.questionoption,
                option : options,
              },
         }
       }
     });
   }

   validate()
   {
       let errors = {};
       const fields = this.state.questionData.fields;

       errors.questiontype = required(fields.questiontype);
       errors.question = required(fields.question);
       errors.questionoption = required(fields.questionoption.optiontype);

       if(fields.questiontype == 3 && fields.questionoption.optiontype == 3)
       {
         errors.questionoption = 'Required';
       }

       if(fields.questiontype != 3 && fields.questionoption.optiontype == 1 && fields.questionoption.option.length == 0)
       {
         NotificationManager.error('Add option');
         errors.questionoption = 'Add option';
       }

       let validated = checkError(errors);

        this.setState({
          questionData: {	...this.state.questionData,
             errors : errors, validated : validated
          }
        });

        return validated;
   }
   onSaveQuestion()
   {
     const {questionData,question_old} = this.state;
     const	{editquestion, editMode} = this.props;

     if(this.validate())
     {
       if(!editMode || (editquestion && (JSON.stringify(question_old) != JSON.stringify(questionData.fields))))
        {
          let question  = questionData.fields;
            // if(question.isotherenabled == 1)
            // {
            //   question.questionoption.isotherenabled == 1;
            // }
            this.props.saveQuestion({question});
        }
        else {
          NotificationManager.error('No changes detected');
         }
   }
  }

    onClose()
	 	{
      this.setState(this.getInitialState());
	 		this.props.clsAddNewQuestionModel();
      this.props.push('/app/setting/disclaimer/1');
	 	}

	render() {

	 const	{ addNewQuestionModal, disabled , dialogLoading , editMode , editquestion} = this.props;
 	 const {questionData ,activeIndex} = this.state;

		return (
			<Dialog fullScreen open={addNewQuestionModal} onClose={() =>this.onClose()} >
					<AppBar position="static" className="bg-primary">
							<Toolbar>
									<IconButton color="inherit" onClick={() =>this.onClose()} aria-label="Close">
												<CloseIcon />
									</IconButton>
									<h5 className="w-50 mb-0 ">{ editMode || questionData.fields.id != 0 ? 'UPDATE ' : 'ADD '  } QUESTION</h5>
									<div className="w-50 mb-0">
											<Tabs
														variant = "fullWidth"
														indicatorColor="secondary">
											</Tabs>
								   </div>

                   <Button onClick={() =>this.onSaveQuestion()} disabled = {disabled} variant="text" mini= "true" ><SaveIcon /><span className ="pl-5">SAVE</span> </Button>


						 </Toolbar>
			  	</AppBar>
				{((editMode && !editquestion) || dialogLoading ) &&
					<RctSectionLoader />
				}
	       <PerfectScrollbar style={{ height: 'calc(100vh - 5px)' }}>
            <TabContainer>
              <QuestionDetail fields = {questionData.fields} errors ={questionData.errors}  onChange = {this.onChangeQuestion.bind(this)} onAddOption = {this.onAddOption.bind(this)} onRemoveOption = {this.onRemoveOption.bind(this)} />
            </TabContainer>
				</PerfectScrollbar>
			</Dialog>

	);
  }
  }
const mapStateToProps = ({ disclaimerReducer }) => {
	const { addNewQuestionModal, disabled, dialogLoading, editquestion, editMode } =  disclaimerReducer;
  return { addNewQuestionModal, disabled , dialogLoading, editquestion, editMode}
}

export default connect(mapStateToProps,{
	clsAddNewQuestionModel, saveQuestion, push})(AddQuestion);
