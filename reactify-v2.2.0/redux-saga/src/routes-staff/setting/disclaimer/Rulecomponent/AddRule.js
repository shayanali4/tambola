/**
 * Employee Management Page
 */
import React, { Component, PureComponent } from 'react';
// Import React Table
import { connect } from 'react-redux';

import RctSectionLoader from 'Components/RctSectionLoader/RctSectionLoader';
import { clsAddNewRuleModel, saveRule } from 'Actions';
import {  checkError, cloneDeep} from 'Helpers/helpers';
import Dialog from '@material-ui/core/Dialog';
import AppBar from '@material-ui/core/AppBar';
import PerfectScrollbar from 'Components/PerfectScrollbar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';

import CloseIcon from '@material-ui/icons/Close';
import SaveIcon from '@material-ui/icons/Save';

import {required} from 'Validations';
import { NotificationManager } from 'react-notifications';
import { push } from 'connected-react-router';
import Button from '@material-ui/core/Button';


import {isMobile} from 'react-device-detect';
import RctCollapsibleCard from 'Components/RctCollapsibleCard/RctCollapsibleCard';
import TextField  from '@material-ui/core/TextField';
import FormHelperText from '@material-ui/core/FormHelperText';

function TabContainer({ children }) {
    return (
        <Typography component="div" style={{ padding: isMobile ? 0 : 8 * 3 }}>
            {children}
        </Typography>
    );
}

class AddRule extends Component {
	constructor(props) {
     super(props);
		   this.state = this.getInitialState();
   }

   getInitialState()
   {
     this.initialState = {
             activeIndex : 0,
             id :0,
             rulename:'',
             errors : { },
             validated : false,
     };
      return cloneDeep(this.initialState);
   }

   componentWillReceiveProps(newProps)
  {
    const	{editrule, editMode} = newProps;

     if(editMode && editrule && editrule.id && editrule.id != this.state.id )
     {

         this.state.id = editrule.id;
         this.state.rulename = editrule.rulename;

         this.state.rule_old = cloneDeep(editrule.rulename);

      }
  }


   componentWillUpdate(nextProps, nextState)
   {
     if((!nextProps.editMode && nextState.id != 0) || (this.props.addNewRuleModal && !nextProps.addNewRuleModal))
     {
        this.setState(this.getInitialState());
     }
   }

	 	onChangeruleDetail(key,value, isRequired)
	 	{
	 		let error= isRequired ? required(value) : '';

	 		this.setState({
	 					[key] : value,
	 				errors : {...this.state.errors,
	 					[key] : error
	 				}
	 		});
	 	}
      validate()
      {
        let errors = {};
        let {rulename} = this.state;

          errors.rulename = required(rulename);

          let validated = checkError(errors);

          this.setState({
                  errors : errors, validated : validated
          });
           return validated;
        }
	 	onSaveRecipe()
	 	{
	     const {rulename,rule_old,id} = this.state;
       const	{editrule, editMode} = this.props;

       if(this.validate())
       {
                 if(!editMode || (editrule && (JSON.stringify(rule_old) != JSON.stringify(rulename))))
                  {
                      let ruledetail  = {};
                       ruledetail.rulename  = rulename;
                       ruledetail.id  = id;
                      this.props.saveRule({ruledetail});
                  }
                  else {
                    NotificationManager.error("No changes detected")
                  }
	 		}
  }

    onClose()
	 	{
      this.setState(this.getInitialState());
	 		this.props.clsAddNewRuleModel();
      this.props.push('/app/setting/disclaimer/2');
	 	}

	render() {

	 const	{ addNewRuleModal, disabled , dialogLoading , editMode , editrule} = this.props;
 	 let {rulename,id,activeIndex,errors} = this.state;

		return (
			<Dialog fullWidth open={addNewRuleModal} onClose={() =>this.onClose()} >
					<AppBar position="static" className="bg-primary">
							<Toolbar>
									<IconButton color="inherit" onClick={() =>this.onClose()} aria-label="Close">
												<CloseIcon />
									</IconButton>
									<h5 className="w-100 mb-0 ">{ editMode || id != 0 ? 'UPDATE ' : 'ADD '  } RULE</h5>
									<div className="w-0 mb-0">
											<Tabs
														value={activeIndex}
														onChange={(e, value) => this.changeActiveIndex(value)}
														variant="fullWidth"
														indicatorColor="secondary" >

													</Tabs>
								   </div>

                    <Button onClick={() =>this.onSaveRecipe()} disabled = {disabled} variant="text" mini= "true" ><SaveIcon /><span className ="pl-5">SAVE</span> </Button>

						   </Toolbar>
				    </AppBar>
				{((editMode && !editrule) || dialogLoading ) &&
					<RctSectionLoader />
				}
		      <PerfectScrollbar style={{ height: 'calc(50vh - 5px)' }}>
            <div className="textfields-wrapper">
              <RctCollapsibleCard >
                <form noValidate autoComplete="off">
                  <div className="row">
                    <div className="col-sm-12 col-md-12 col-xl-12">
                       <TextField  required  inputProps={{maxLength:500}}  id="rulename" multiline rows={4} rowsMax={10} autoFocus = {true} fullWidth label="Rule"  value={rulename} onChange={(e) => this.onChangeruleDetail('rulename',e.target.value , true)} onBlur = {(e) => this.onChangeruleDetail('rulename',e.target.value, true)}/>
                       <FormHelperText  error>{errors.rulename}</FormHelperText>
                    </div>
                  </div>
                </form>
              </RctCollapsibleCard>
            </div>
					</PerfectScrollbar>
			</Dialog>

	);
  }
  }
const mapStateToProps = ({ disclaimerReducer }) => {
	const { addNewRuleModal, disabled, dialogLoading, editrule, editMode } =  disclaimerReducer;
  return { addNewRuleModal, disabled , dialogLoading, editrule, editMode}
}

export default connect(mapStateToProps,{
	clsAddNewRuleModel,saveRule,push})(AddRule);
