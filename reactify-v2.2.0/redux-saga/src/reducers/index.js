/**
 * App Reducers
 */
import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';
import settings from './settings';
//import chatAppReducer from './ChatAppReducer';
//import emailAppReducer from './EmailAppReducer';
import sidebarReducer from './SidebarReducer';

// import storeReducer from './StoreReducer';
// import storeCategoryReducer from './StoreCategoryReducer';
//
// import dealReducer from './DealReducer';
// import dealTypeReducer from './DealTypeReducer';


import gameReducer from './GameReducer';
import bookticketReducer from './BookTicketReducer';


//import todoAppReducer from './TodoAppReducer';
import authUserReducer from './AuthUserReducer';
// import feedbacksReducer from './FeedbacksReducer';
// import ecommerceReducer from './EcommerceReducer';
import employeeManagementReducer from './EmployeeManagementReducer';
import signupReducer from './SignUpReducer';
// import memberManagementReducer from './MemberManagementReducer';
// import memberSubscriptionReducer from './MemberSubscriptionReducer';
// import serviceReducer from './ServiceReducer';
// import enquiryReducer from './EnquiryReducer';
// import classReducer from './ClassReducer';
// import zoneReducer from './ZoneReducer';
// import branchReducer from './BranchReducer';
// import measurementReducer from './MeasurementReducer';
// import duesReducer from './DuesReducer';
// import productReducer from './ProductReducer';
// import exerciseReducer from './ExerciseReducer';
import forgetpasswordReducer from './ForgetPasswordReducer';
// import workoutroutineReducer from './WorkoutRoutineReducer';
// import memberattendanceReducer from './MemberAttendanceReducer';
// import workoutscheduleReducer from './WorkoutScheduleReducer';
// import expenseReducer from './ExpenseReducer';
// import staffpayReducer from './StaffPayReducer';
// import templateconfigurationReducer from './TemplateConfigurationReducer';
// import classattendanceReducer from './ClassAttendanceReducer';
import roleReducer from './RoleReducer';
// import classPerformanceReducer from './ClassPerformanceReducer';
// import equipmentReducer from './EquipmentReducer';
// import personaltrainingReducer from './PersonalTrainingReducer';
// import recipeReducer from './RecipeReducer';
// import dietroutineReducer from './DietRoutineReducer';
// import allocateDietReducer from './AllocateDietReducer';
// import employeeattendanceReducer from './EmployeeAttendanceReducer';
// import disclaimerReducer from './DisclaimerReducer';
// import investmentReducer from './InvestmentReducer';
// import biomaxReducer from './BiomaxReducer';
// import trainersFeedbackByMemberReducer from './TrainersFeedbackByMemberReducer';
// import budgetReducer from './BudgetReducer';
// import broadcastReducer from './BroadcastReducer';
// import changesaleReducer from './ChangeSaleReducer';
// import competitionReducer from './CompetitionReducer';
// import gymAccessSlotReducer from './GymAccessSlotReducer';
// import visitorBookReducer from './VisitorBookReducer';
// import advertisementReducer from './AdvertisementReducer';
// import posterReducer from './PosterReducer';
// import employeeShiftReducer from './EmployeeShiftReducer';
// import resultAndTestimonialReducer from './ResultAndTestimonialReducer';
// import followupDashboardReducer from './FollowupDashboardReducer';
// import packageReducer from './PackageReducer';
//
// import memberDisclaimerListReducer from './MemberDisclaimerListReducer';
//
// import inductionChecklistReducer from './InductionChecklistReducer';
//
// import loginEnquiryFormReducer from './LoginEnquiryFormReducer';
//
// import memberSidebarReducer from './member/SidebarReducer';
// import memberWorkoutScheduleReducer from './member/WorkoutScheduleReducer';
// import memberChangePasswordReducer from './member/MemberChangePasswordReducer';
// import memberWorkoutRoutineReducer from './member/WorkoutRoutineReducer';
// import bodyProgressReducer from './member/BodyProgressReducer';
// import memberExerciseLogReducer from './member/ExerciseLogReducer';
// import memberFeedbackReducer from './member/MemberFeedbackReducer';
// import memberattendedSessionReducer from './member/AttendedSessionReducer';
// import memberDietRoutineReducer from './member/DietRoutineReducer';
// import memberPreSetDietReducer from './member/PreSetDietReducer';
// import memberDietLogReducer from './member/DietLogReducer';
// import memberWaterLogReducer from './member/WaterLogReducer';
// import memberDisclaimerReducer from './member/MemberDisclaimerReducer';
// import memberBuyServiceReducer from './member/BuyServiceReducer';
// import holidaysReducer from './HolidaysReducer';
// import memberCovid19DisclaimerReducer from './member/MemberCovid19DisclaimerReducer';
// import memberGymAccessSlotReducer from './member/GymAccessSlotReducer';
// import memberPTSlotReducer from './member/PTSlotReducer';
// import memberSignUpReducer from './member/MemberSignUpReducer';



export default (history) => combineReducers({
  router: connectRouter(history),
  settings,
//  chatAppReducer,
//  emailApp: emailAppReducer,
  sidebar: sidebarReducer,
//  todoApp: todoAppReducer,
  authUser: authUserReducer,
  // feedback: feedbacksReducer,
  // ecommerce: ecommerceReducer,
  employeeManagementReducer,
  signupReducer,
  // memberManagementReducer,
  // memberSubscriptionReducer,
  // serviceReducer,
  // enquiryReducer,
  // classReducer,
  // zoneReducer,
  // branchReducer,
  // measurementReducer,
  // duesReducer,
  // productReducer,
  //exerciseReducer,
  forgetpasswordReducer,
  // workoutroutineReducer,
  // memberattendanceReducer,
  // workoutscheduleReducer,
  // expenseReducer,
  // staffpayReducer,
  // templateconfigurationReducer,
  // classattendanceReducer,
  roleReducer,
  // classPerformanceReducer,
  // equipmentReducer,
  // personaltrainingReducer,
  // recipeReducer,
  // dietroutineReducer,
  // allocateDietReducer,
  // employeeattendanceReducer,
  // disclaimerReducer,
  // investmentReducer,
  // biomaxReducer,
  // packageReducer,
  // trainersFeedbackByMemberReducer,
  // budgetReducer,
  // holidaysReducer,
  // broadcastReducer,
  // changesaleReducer,
  // competitionReducer,
  // gymAccessSlotReducer,
  // visitorBookReducer,
  // advertisementReducer,
  // posterReducer,
  // employeeShiftReducer,
  // resultAndTestimonialReducer,
  // followupDashboardReducer,
  // memberDisclaimerListReducer,
  // inductionChecklistReducer,
  // loginEnquiryFormReducer,
  // storeReducer,
  // storeCategoryReducer,
  // dealReducer,
  // dealTypeReducer,
  gameReducer,
  bookticketReducer,
  // memberSidebarReducer,
  // memberWorkoutScheduleReducer,
  // memberChangePasswordReducer,
  // memberWorkoutRoutineReducer,
  // bodyProgressReducer,
  // memberExerciseLogReducer,
  // memberFeedbackReducer,
  // memberattendedSessionReducer,
  // memberDietRoutineReducer,
  // memberPreSetDietReducer,
  // memberDietLogReducer,
  // memberWaterLogReducer,
  // memberDisclaimerReducer,
  // memberBuyServiceReducer,
  // memberCovid19DisclaimerReducer,
  // memberGymAccessSlotReducer,
  // memberPTSlotReducer,
  // memberSignUpReducer
});
