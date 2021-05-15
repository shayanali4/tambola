/**
 * Root Sagas
 */
import { all } from 'redux-saga/effects';

// sagas
import authSagas from './Auth';
//import emailSagas from './Email';
//import todoSagas from './Todo';
//import feedbacksSagas from './Feedbacks';
// import memberManagementSagas from './MemberManagement'
// import memberSubscriptionSagas from './MemberSubscription'

import employeeManagementSagas from './EmployeeManagement';
import signUpSagas from './SignUp';
// import serviceSagas from './service';
// import enquirySagas from './Enquiry';
// import classSagas from './Class';

// import ZoneSagas from './Zone';
// import BranchSagas from './Branch';
// import MeasurementSagas from './Measurement';
// import DuesSagas from './Dues';

// import productSagas from './Product';
// import ecommerceSagas from './Ecommerce';
// import exerciseSagas from './Exercise';
// import workoutroutineSagas from './WorkoutRoutine';
// import memberattendanceSagas from './MemberAttendance';
// import workoutscheduleSagas from './WorkoutSchedule';
// import expenseSagas from './Expense';
// import staffpaySagas from './StaffPay';
// import templateconfigurationSagas from './TemplateConfiguration';
// import classattendanceSagas from './ClassAttendance';
import roleSagas from './Role';
// import performanceSagas from './ClassPerformance';
// import equipmentSagas from './Equipment';
// import personaltrainingSagas from './PersonalTraining';
// import recipeSagas from './Recipe';
// import dietroutineSagas from './DietRoutine';
// import allocatedietSagas from './AllocateDiet';
// import employeeAttendanceSagas from './EmployeeAttendance';
// import disclaimerSagas from './Disclaimer';
// import investmentSagas from './Investment';
// import biomaxSagas from './Biomax';
// import trainersFeedbackByMemberSagas from './TrainersFeedbackByMember';
// import budgetSagas from './Budget';
// import holidaysSagas from './Holidays';
// import broadcastSagas from './Broadcast';
// import changesaleSagas from './ChangeSale';
// import competitionSagas from './Competition';
// import gymAccessSlotSagas from './GymAccessSlot';
// import visitorBookSagas from './VisitorBook';
// import advertisementSagas from './Advertisement';
// import posterSagas from './Poster';
// import employeeShiftSagas from './EmployeeShift';
// import resultAndTestimonialSagas from './ResultAndTestimonial';
// import followupDashboardSagas from './FollowupDashboard';
// import packageSagas from './Package';
// import memberDisclaimerListSagas from './MemberDisclaimerList';
// import inductionChecklistSagas from './InductionChecklist';
// import loginEnquiryFormSagas from './LoginEnquiryForm';

// import storeSagas from './store';
// import storeCategorySaga from './storeCategory';
//
// import dealSagas from './deal';
// import dealTypeSaga from './dealType';

import gameSagas from './game';
import bookticketSagas from './bookticket';


// import membershipSagas from './member/Membership';
// import memberBuyServiceSagas from './member/BuyService';
// import memberWorkoutScheduleSagas from './member/WorkoutSchedule';
// import memberWorkoutRoutineSagas from './member/WorkoutRoutine';
// import bodyprogressSagas from './member/BodyProgress';
// import memberExerciseLogSagas from './member/ExerciseLog';
// import memberFeedbackSagas from './member/MemberFeedback';
// import memberUnitSagas from './member/Unit';
// import memberattendedSessionSagas from './member/AttendedSession';
// import memberDietRoutineSagas from './member/DietRoutine';
// import memberpresetdietSagas from './member/PreSetDiet';
// import memberdietlogSagas from './member/DietLog';
// import memberwaterlogSagas from './member/WaterLog';
// import memberDisclaimerSagas from './member/MemberDisclaimer';
// import memberCovid19DisclaimerSagas from './member/MemberCovid19Disclaimer';
// import memberGymAccessSlotSagas from './member/GymAccessSlot';
// import memberptSlotSagas from './member/PTSlot';
// import memberSignUpSagas from './member/MemberSignUp';


export default function* rootSaga(getState) {
    yield all([
        authSagas(),
      //  emailSagas(),
      //  todoSagas(),
      //  feedbacksSagas(),
        employeeManagementSagas(),
        signUpSagas(),
        // memberManagementSagas(),
        // memberSubscriptionSagas(),
        // serviceSagas(),
        // enquirySagas(),
        // classSagas(),
        // storeSagas(),
        // storeCategorySaga(),
        // dealSagas(),
        // dealTypeSaga(),

        gameSagas(),
        bookticketSagas(),
    //     ZoneSagas(),
    //     BranchSagas(),
    //     ecommerceSagas(),
    //     MeasurementSagas(),
    //     DuesSagas(),
    //     productSagas(),
    //     exerciseSagas(),
    //     workoutroutineSagas(),
    //     memberattendanceSagas(),
    //     workoutscheduleSagas(),
    //     expenseSagas(),
    //     staffpaySagas(),
    //     templateconfigurationSagas(),
    //     classattendanceSagas(),
         roleSagas(),
    //     performanceSagas(),
    //     equipmentSagas(),
    //     personaltrainingSagas(),
    //     recipeSagas(),
    //     dietroutineSagas(),
    //     allocatedietSagas(),
    //     employeeAttendanceSagas(),
    //     disclaimerSagas(),
    //     investmentSagas(),
    //     biomaxSagas(),
    //     trainersFeedbackByMemberSagas(),
    //     budgetSagas(),
    //     holidaysSagas(),
    //     broadcastSagas(),
    //     changesaleSagas(),
    //     competitionSagas(),
    //     gymAccessSlotSagas(),
    //     visitorBookSagas(),
    //     advertisementSagas(),
    //     posterSagas(),
    //     employeeShiftSagas(),
    //     resultAndTestimonialSagas(),
    //     followupDashboardSagas(),
    //     packageSagas(),
		// memberDisclaimerListSagas(),
    //     inductionChecklistSagas(),
    //     loginEnquiryFormSagas(),

        // membershipSagas(),
        // memberBuyServiceSagas(),
        // memberWorkoutScheduleSagas(),
        // memberWorkoutRoutineSagas(),
        // bodyprogressSagas(),
        // memberExerciseLogSagas(),
        // memberFeedbackSagas(),
        // memberUnitSagas(),
        // memberattendedSessionSagas(),
        // memberDietRoutineSagas(),
        // memberpresetdietSagas(),
        // memberdietlogSagas(),
        // memberwaterlogSagas(),
        // memberDisclaimerSagas(),
        // memberCovid19DisclaimerSagas(),
        // memberGymAccessSlotSagas(),
        // memberptSlotSagas(),
        // memberSignUpSagas()
    ]);
}
