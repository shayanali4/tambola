// action types
import  Questiontype from 'Assets/data/questiontype';
import Auth from '../Auth/Auth';
import {getLocalDate} from 'Helpers/helpers';

import {
  OPEN_ADD_NEW_RULE_MODEL,
  CLOSE_ADD_NEW_RULE_MODEL,
  SAVE_RULE,
  SAVE_RULE_SUCCESS,
  GET_RULES,
  GET_RULES_SUCCESS,
  OPEN_EDIT_RULE_MODEL,

  OPEN_ADD_NEW_QUESTION_MODEL,
  CLOSE_ADD_NEW_QUESTION_MODEL,
  SAVE_QUESTION,
  SAVE_QUESTION_SUCCESS,
  GET_QUESTIONS,
  GET_QUESTIONS_SUCCESS,
  OPEN_EDIT_QUESTION_MODEL,

  VIEW_DISCLAIMER,
  VIEW_DISCLAIMER_SUCCESS,
  CHANGE_DISCLAIMER,
  SAVE_DISCLAIMER,

  OPEN_STAFFDISCLAIMER_MODEL,
  OPEN_STAFFDISCLAIMER_MODEL_SUCCESS,
  CLOSE_STAFFDISCLAIMER_MODEL,
  SAVE_STAFFDISCLAIMER,
  SAVE_STAFFDISCLAIMER_SUCCESS,
  GET_STAFFDISCLAIMER_SAVED_FORM,
  GET_STAFFDISCLAIMER_SAVED_FORM_SUCCESS,

  VIEW_COVID19_DISCLAIMER,
  VIEW_COVID19_DISCLAIMER_SUCCESS,
  SAVE_COVID19_DISCLAIMER,

  GET_MEMBER_COVID19DISCLAIMERFORM,
  GET_MEMBER_COVID19DISCLAIMERFORM_SUCCESS,
  GET_STAFF_COVID19DISCLAIMERFORM,
  GET_STAFF_COVID19DISCLAIMERFORM_SUCCESS,

  OPEN_STAFF_COVID19DISCLAIMER_MODEL,
  OPEN_STAFF_COVID19DISCLAIMER_MODEL_SUCCESS,
  CLOSE_STAFF_COVID19DISCLAIMER_MODEL,
  SAVE_STAFF_COVID19DISCLAIMER,
  SAVE_STAFF_COVID19DISCLAIMER_SUCCESS,

  ON_SHOW_LOADER,
  ON_HIDE_LOADER,
  REQUEST_FAILURE,
  REQUEST_SUCCESS
} from 'Actions/types';

const authObject = new Auth();
// initial state
const INIT_STATE = {
      rules : null,
       loading : false,
       disabled : false,
       dialogLoading : false,
       editrule : null,
       editMode : false,
       addNewRuleModal : false,
       addNewQuestionModal : false,
       editquestion : null,
       questions : null,
       tableInfo : {
        pageSize : 10,
        pageIndex : 0,
        pages : 1,
        totalrecord :0,
      },
      tableInfoQuestion : {
       pageSize : 10,
       pageIndex : 0,
       pages : 1,
       totalrecord :0,
     },
     opndisclaimerModal : false,
     basicList:null,
     workoutHistory : null,
     medicalHistory : null,
     ruleList : null,
     declaration : null,
     emergencydetail : null,

     basicList_config:[],
     workoutHistory_config : [],
     medicalHistory_config : [],
     ruleList_config : [],
     declaration_config : null,
     enabledisclaimertomember_config : false,

     enablecovid19disclaimertomember_config : false,
     enablecovid19disclaimertostaff_config : false,
     covid19medicalHistory_config : [],
     covid19days_config : '',

     disclaimerformList : null,
     tableInfoCovid19Disclaimer : {
      pageSize : 10,
      pageIndex : 0,
      pages : 1,
      totalrecord :0,
    },

    staffdisclaimerformList : null,
    stafftableInfoCovid19Disclaimer : {
     pageSize : 10,
     pageIndex : 0,
     pages : 1,
     totalrecord :0,
   },

    opnCovid19DisclaimerModal : false,
    staffMedicalHistory : null,
	
	disclaimermemberdetails : null,
};


export default (state = INIT_STATE, action) => {
    switch (action.type) {

          case REQUEST_FAILURE:
          return { ...state ,  dialogLoading : false, disabled : false, loading : false};

          case REQUEST_SUCCESS:
          return { ...state};

        case ON_SHOW_LOADER:
            return { ...state, loading: true };

        case ON_HIDE_LOADER:
            return { ...state, loading : false };

        case OPEN_ADD_NEW_RULE_MODEL :
            return { ...state, addNewRuleModal : true ,editMode : false , editrule : null };
        case CLOSE_ADD_NEW_RULE_MODEL:
            return { ...state, addNewRuleModal : false ,editMode : false , editrule : null};
        case SAVE_RULE:
                return { ...state,  dialogLoading : true, disabled : true };
        case SAVE_RULE_SUCCESS:
                return { ...state, dialogLoading : false,addNewRuleModal : false ,  editMode : false, editrule : null, disabled : false};
        case GET_RULES:
                    let tableInfo = state.tableInfo;
                      if(action.payload)
                      {
                        tableInfo.pageIndex  = action.payload.state.page;
                        tableInfo.pageSize  = action.payload.state.pageSize;
                        tableInfo.sorted  = action.payload.state.sorted;
                        tableInfo.filtered = action.payload.state.filtered;
                      }
                  return { ...state , tableInfo : tableInfo};
        case GET_RULES_SUCCESS:
                       return { ...state, rules:action.payload.data, tableInfo : {...state.tableInfo , pages : action.payload.pages[0].pages,totalrecord : action.payload.pages[0].count} };
         case OPEN_EDIT_RULE_MODEL:
                        return { ...state, addNewRuleModal : true, editMode : true, editrule: action.payload };




        case OPEN_ADD_NEW_QUESTION_MODEL :
                     return { ...state, addNewQuestionModal : true ,editMode : false , editquestion : null };
        case CLOSE_ADD_NEW_QUESTION_MODEL:
                     return { ...state, addNewQuestionModal : false ,editMode : false , editquestion : null};
        case SAVE_QUESTION:
                     return { ...state,  dialogLoading : true, disabled : true };
        case SAVE_QUESTION_SUCCESS:
                     return { ...state, dialogLoading : false,addNewQuestionModal : false ,  editMode : false, editquestion : null, disabled : false};
        case GET_QUESTIONS:
                     let tableInfoQuestion = state.tableInfoQuestion;
                        if(action.payload)
                          {
                            tableInfoQuestion.pageIndex  = action.payload.state.page;
                            tableInfoQuestion.pageSize  = action.payload.state.pageSize;
                            tableInfoQuestion.sorted  = action.payload.state.sorted;
                            tableInfoQuestion.filtered = action.payload.state.filtered;
                          }
                      return { ...state , tableInfoQuestion : tableInfoQuestion};
        case GET_QUESTIONS_SUCCESS:
                  let questionslist = action.payload.data;
                  questionslist.forEach(y => {y.questiontypeValue = Questiontype.filter(value => value.name == y.questiontype).map(x => x.value)[0]} );

                      return { ...state, questions:questionslist, tableInfoQuestion : {...state.tableInfoQuestion , pages : action.payload.pages[0].pages,totalrecord : action.payload.pages[0].count} };
        case OPEN_EDIT_QUESTION_MODEL:
                      return { ...state, addNewQuestionModal : true, editMode : true, editquestion: action.payload };



        case OPEN_STAFFDISCLAIMER_MODEL:
                       return { ...state , opndisclaimerModal : true,emergencydetail : null , dialogLoading : true, disclaimermemberdetails : null};

        case OPEN_STAFFDISCLAIMER_MODEL_SUCCESS:
        {
        let {configuration, questions, rules} = action.payload;

        questions.map((x) => {
           x.question = unescape(x.question);
            x.questionoption = JSON.parse(x.questionoption);

            if(x.questionoption.isotherenabled == 1)
            {
                x.questionoption.option[x.questionoption.option.length] = 'Other';
            }
            if(x.questionoption.isnaenabled == 1)
            {
                x.questionoption.option[x.questionoption.option.length] = 'N/A';
            }

            x.questionoption.option = x.questionoption.option.map((y,key) => {return {option : y }});

        });

        let declaration_config =  configuration.length > 0 ? unescape(configuration[0].consentdisclaimer) : '';
        let basicList_config = questions.filter(x => x.questiontypeid == 1);
        let workoutHistory_config = questions.filter(x => x.questiontypeid == 2);
        let medicalHistory_config = questions.filter(x => x.questiontypeid == 3);

        medicalHistory_config.map((x) => {
           x.questionoption.option.push({option : 'Yes' });
           x.questionoption.option.push({option : 'No' });
        });

        rules.map((x) => { x.rulename = unescape(x.rulename); });
        let ruleList_config = rules;
		
		
		let memberdetails = action.payload.disclaimermemberdetails || null;	 
		if(memberdetails)
		{
		  if(memberdetails.dateofbirth){
		   memberdetails.age = getLocalDate(new Date()).getFullYear() - (getLocalDate(memberdetails.dateofbirth)).getFullYear();
		  }
			memberdetails.measurementdata =   memberdetails.measurementdata  ? JSON.parse(memberdetails.measurementdata) : null ;
			memberdetails.weight = memberdetails.measurementdata && memberdetails.measurementdata.weight;
			memberdetails.height = memberdetails.measurementdata && memberdetails.measurementdata.height;
		}
			
        return { ...state,basicList:basicList_config, workoutHistory : workoutHistory_config ,   medicalHistory : medicalHistory_config,
                                   ruleList : ruleList_config, declaration : declaration_config,  dialogLoading : false ,
								   disclaimermemberdetails : memberdetails};
              }
                                   case CLOSE_STAFFDISCLAIMER_MODEL:
                                              return { ...state, opndisclaimerModal : false,basicList:null, workoutHistory : null ,   medicalHistory : null,
                                                                         ruleList : null, declaration : null,emergencydetail : null , disclaimermemberdetails : null};


                                   case SAVE_STAFFDISCLAIMER:

                                             if(action.payload.disclaimerform)
                                             {
                                               action.payload.disclaimerform.basicList = state.basicList;
                                               action.payload.disclaimerform.workoutHistory = state.workoutHistory;
                                               action.payload.disclaimerform.medicalHistory = state.medicalHistory;
                                               action.payload.disclaimerform.ruleList = state.ruleList;
                                               action.payload.disclaimerform.declaration = unescape(state.declaration);
                                             }

                                              return { ...state, loading : true, disabled : true , dialogLoading : true};
                                   case SAVE_STAFFDISCLAIMER_SUCCESS:
                                              return { ...state, loading : false,opndisclaimerModal : false, disabled : false, dialogLoading : false,
                                                basicList:null, workoutHistory : null ,   medicalHistory : null, ruleList : null, declaration : null,
                                                emergencydetail : null};

                                   case GET_STAFFDISCLAIMER_SAVED_FORM:
                                              return { ...state , opndisclaimerModal : true,emergencydetail : null , dialogLoading : true,disclaimermemberdetails : null};

                                   case GET_STAFFDISCLAIMER_SAVED_FORM_SUCCESS:
                                     
										let memberdetails = action.payload.disclaimermemberdetails;	 
										if(memberdetails.dateofbirth){
										   memberdetails.age = getLocalDate(new Date()).getFullYear() - (getLocalDate(memberdetails.dateofbirth)).getFullYear();
									    }
										memberdetails.measurementdata =   memberdetails.measurementdata  ? JSON.parse(memberdetails.measurementdata) : null ;
										memberdetails.weight = memberdetails.measurementdata && memberdetails.measurementdata.weight;
										memberdetails.height = memberdetails.measurementdata && memberdetails.measurementdata.height;

											 return { ...state,
                                                          basicList:action.payload.basicList,
                                                          workoutHistory : action.payload.workoutHistory ,
                                                          medicalHistory : action.payload.medicalHistory,
                                                          ruleList : action.payload.ruleList,
                                                          declaration : unescape(action.payload.declaration),
                                                          emergencydetail : action.payload.emergencydetail,
														  disclaimermemberdetails : memberdetails,
                                                           dialogLoading : false,
                                                         };

                      case VIEW_DISCLAIMER:
                            return { ...state , dialogLoading : true};


                      case VIEW_DISCLAIMER_SUCCESS:
                      {
                            let {configuration, questions, rules} = action.payload;

                            questions.map((x) => {
                               x.question = unescape(x.question);
                                x.questionoption = JSON.parse(x.questionoption);
                            });

                            let declaration_config =  configuration.length > 0 ? unescape(configuration[0].consentdisclaimer) : '';

                            let profileDetail = authObject.getClientProfile();;
                            if(profileDetail && profileDetail.id > 1)
                            {
                                  declaration_config = declaration_config.replace(/\{\$G_ORGNAME\$\}/g, profileDetail.organizationname);
                            }



                            let enabledisclaimertomember_config =  configuration.length > 0 ? configuration[0].enabledisclaimertomember : 0;

                            let basicList_config = questions.filter(x => x.questiontypeid == 1);
                            let workoutHistory_config = questions.filter(x => x.questiontypeid == 2);
                            let medicalHistory_config = questions.filter(x => x.questiontypeid == 3);

                            rules.map((x) => { x.rulename = unescape(x.rulename); });
                            let ruleList_config = rules;

                            return { ...state, declaration_config, enabledisclaimertomember_config,basicList_config ,workoutHistory_config, medicalHistory_config, ruleList_config,dialogLoading : false};
                          }
                      case SAVE_DISCLAIMER:
                        {
                            let { declaration_config, enabledisclaimertomember_config,basicList_config ,workoutHistory_config, medicalHistory_config, ruleList_config} = action.payload;

                            declaration_config = declaration_config || state.declaration_config;
                            enabledisclaimertomember_config = enabledisclaimertomember_config == null ? state.enabledisclaimertomember_config : enabledisclaimertomember_config;
                            basicList_config = basicList_config || state.basicList_config;
                            workoutHistory_config = workoutHistory_config || state.workoutHistory_config;
                            medicalHistory_config = medicalHistory_config || state.medicalHistory_config;
                            ruleList_config = ruleList_config || state.ruleList_config;

                            return { ...state, declaration_config, enabledisclaimertomember_config,basicList_config ,workoutHistory_config, medicalHistory_config, ruleList_config};
                          }

                          case VIEW_COVID19_DISCLAIMER:
                                return { ...state , dialogLoading : true};

                          case VIEW_COVID19_DISCLAIMER_SUCCESS:
                          {
                                let {configuration, questions} = action.payload;

                                questions.map((x) => {
                                   x.question = unescape(x.question);
                                    x.questionoption = JSON.parse(x.questionoption);
                                });

                                let enablecovid19disclaimertomember_config =  configuration.length > 0 ? configuration[0].enabledisclaimertomember : 0;
                                let enablecovid19disclaimertostaff_config =  configuration.length > 0 ? configuration[0].enabledisclaimertostaff : 0;
                                let covid19days_config =  configuration.length > 0 ? configuration[0].covid19daysconfig : '7';

                                let covid19medicalHistory_config = questions.filter(x => x.questiontypeid == 3);

                                return { ...state, enablecovid19disclaimertomember_config,enablecovid19disclaimertostaff_config, covid19medicalHistory_config,covid19days_config,dialogLoading : false};
                              }
                          case SAVE_COVID19_DISCLAIMER:
                            {
                                let { enablecovid19disclaimertomember_config,covid19medicalHistory_config,enablecovid19disclaimertostaff_config,covid19days_config} = action.payload;

                                enablecovid19disclaimertomember_config = enablecovid19disclaimertomember_config == null ? state.enablecovid19disclaimertomember_config : enablecovid19disclaimertomember_config;
                                enablecovid19disclaimertostaff_config = enablecovid19disclaimertostaff_config == null ? state.enablecovid19disclaimertostaff_config : enablecovid19disclaimertostaff_config;
                                covid19days_config = covid19days_config == null ? state.covid19days_config : covid19days_config;
                                covid19medicalHistory_config = covid19medicalHistory_config || state.covid19medicalHistory_config;

                                return { ...state, enablecovid19disclaimertomember_config,enablecovid19disclaimertostaff_config,covid19medicalHistory_config,covid19days_config};
                              }

                          case GET_MEMBER_COVID19DISCLAIMERFORM:

                              let tableInfoCovid19Disclaimer = state.tableInfoCovid19Disclaimer;
                                if(action.payload)
                                {
                                  if(action.payload.state)
                                  {
                                    tableInfoCovid19Disclaimer.pageIndex  = action.payload.state.page;
                                    tableInfoCovid19Disclaimer.pageSize  = action.payload.state.pageSize;
                                    tableInfoCovid19Disclaimer.sorted  = action.payload.state.sorted;
                                    tableInfoCovid19Disclaimer.filtered = action.payload.state.filtered;
                                  }
                                  else {
                                   if(action.payload.memberdisclaimerfilter != null){
                                     tableInfoCovid19Disclaimer.memberdisclaimerfilter = action.payload.memberdisclaimerfilter;
                                   }
                                   else if (action.payload.filterbydate || action.payload.filterbydate == null) {
                                     tableInfoCovid19Disclaimer.filterbydate = action.payload.filterbydate;
                                   }
                                 }
                                }

                            return { ...state , tableInfoCovid19Disclaimer : tableInfoCovid19Disclaimer};

                            case GET_MEMBER_COVID19DISCLAIMERFORM_SUCCESS:
                              let disclaimerformList = action.payload.data;

                                disclaimerformList.map((x) => {
                                  x.disclaimerform = JSON.parse(x.disclaimerform);
                                  x.covid19history = JSON.parse(x.covid19history);
                                });
                            return { ...state, disclaimerformList: disclaimerformList , tableInfoCovid19Disclaimer : {...state.tableInfoCovid19Disclaimer , pages : action.payload.pages[0].pages,totalrecord : action.payload.pages[0].count}};

                            case OPEN_STAFF_COVID19DISCLAIMER_MODEL :
                                       return { ...state,loading : true};
                            case OPEN_STAFF_COVID19DISCLAIMER_MODEL_SUCCESS:
                            let {configuration, questions} = action.payload;

                            questions.map((x) => {
                               x.question = unescape(x.question);
                                x.questionoption = JSON.parse(x.questionoption);

                                x.questionoption.option = x.questionoption.option.map((y,key) => {return {option : y }});

                            });

                             let medicalHistory_config = questions.filter(x => x.questiontypeid == 3);

                            medicalHistory_config.map((x) => {
                               x.questionoption.option.push({option : 'Yes' });
                               x.questionoption.option.push({option : 'No' });
                            });

                            return { ...state, staffMedicalHistory : medicalHistory_config,opnCovid19DisclaimerModal : true,  loading : false };

                            case CLOSE_STAFF_COVID19DISCLAIMER_MODEL:
                                       return { ...state, opnCovid19DisclaimerModal : false,loading : false};

                            case SAVE_STAFF_COVID19DISCLAIMER:
                                       return { ...state, loading : true, disabled : true};
                            case SAVE_STAFF_COVID19DISCLAIMER_SUCCESS:
                                       return { ...state, loading : false,opnCovid19DisclaimerModal : false, disabled : false};

                             case GET_STAFF_COVID19DISCLAIMERFORM:

                                 let stafftableInfoCovid19Disclaimer = state.stafftableInfoCovid19Disclaimer;
                                   if(action.payload)
                                   {
                                     if(action.payload.state)
                                     {
                                       stafftableInfoCovid19Disclaimer.pageIndex  = action.payload.state.page;
                                       stafftableInfoCovid19Disclaimer.pageSize  = action.payload.state.pageSize;
                                       stafftableInfoCovid19Disclaimer.sorted  = action.payload.state.sorted;
                                       stafftableInfoCovid19Disclaimer.filtered = action.payload.state.filtered;
                                     }
                                     else {
                                      if(action.payload.staffdisclaimerfilter != null){
                                        stafftableInfoCovid19Disclaimer.staffdisclaimerfilter = action.payload.staffdisclaimerfilter;
                                      }
                                      else if (action.payload.filterbydate || action.payload.filterbydate == null) {
                                        stafftableInfoCovid19Disclaimer.filterbydate = action.payload.filterbydate;
                                      }
                                    }
                                   }

                               return { ...state , stafftableInfoCovid19Disclaimer : stafftableInfoCovid19Disclaimer};

                               case GET_STAFF_COVID19DISCLAIMERFORM_SUCCESS:
                                 let staffdisclaimerformList = action.payload.data;

                                   staffdisclaimerformList.map((x) => {
                                     x.disclaimerform = JSON.parse(x.disclaimerform);
                                     x.covid19history = JSON.parse(x.covid19history);
                                   });
                               return { ...state, staffdisclaimerformList: staffdisclaimerformList , stafftableInfoCovid19Disclaimer : {...state.stafftableInfoCovid19Disclaimer , pages : action.payload.pages[0].pages,totalrecord : action.payload.pages[0].count}};


        default: return { ...state};
    }
}
