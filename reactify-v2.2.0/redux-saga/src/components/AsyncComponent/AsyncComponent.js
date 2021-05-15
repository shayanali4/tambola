/**
 * AsyncComponent
 * Code Splitting Component / Server Side Rendering
 */
import React, { Component } from "react";
import Loadable from 'react-loadable';
// rct page loader
import RctPageLoader from 'Components/RctPageLoader/RctPageLoader';


export default function asyncComponent(getComponent) {
    class AsyncComponent extends Component {
        static Component = null;
        state = { Component: AsyncComponent.Component };

        componentWillMount() {
            if (!this.state.Component) {
                getComponent().then(Component => {
                    AsyncComponent.Component = Component
                    this.setState({ Component })
                })
            }
        }
        render() {
            const { Component } = this.state
            if (Component) {
                return <Component {...this.props} />
            }
            return null
        }
    }
    return AsyncComponent;
}



// // ecommerce dashboard
// const AsyncEcommerceDashboardComponent = Loadable({
// 	loader: () => import("Routes/dashboard/ecommerce"),
// 	loading: () => <RctPageLoader />,
// });
// master dashboard

const AsyncRoutes = Loadable({
	loader: () => import("Routes"),
	loading: () => <RctPageLoader />,
});
//
// const AsyncRoutesMember = Loadable({
// 	loader: () => import("RoutesMember"),
// 	loading: () => <RctPageLoader />,
// });
//
// const AsyncMasterDashboardComponent = Loadable({
// 	loader: () => import("Routes/dashboard/master-dashboard"),
// 	loading: () => <RctPageLoader />,
// });
// // budget-dashboard
// const AsyncBudgetDashboardComponent = Loadable({
// 	loader: () => import("Routes/dashboard/budget-dashboard"),
// 	loading: () => <RctPageLoader />,
// });
// // revenue dashboard
// const AsyncRevenueDashboardComponent = Loadable({
// 	loader: () => import("Routes/dashboard/revenue-dashboard"),
// 	loading: () => <RctPageLoader />,
// });
//
// // memberprofile-dashboard
// const AsyncMemberProfileDashboardComponent = Loadable({
// 	loader: () => import("Routes/dashboard/member-dashboard"),
// 	loading: () => <RctPageLoader />,
// });
// const AsyncStaffPerformanceComponent = Loadable({
// 	loader: () => import("Routes/dashboard/staff-performance"),
// 	loading: () => <RctPageLoader />,
// });
//
// // followup-dashboard
// const AsyncFollowupDashboardComponent = Loadable({
// 	loader: () => import("Routes/dashboard/followup-dashboard"),
// 	loading: () => <RctPageLoader />,
// });
//
// // followup analysis
// const AsyncFollowupAnalysisComponent = Loadable({
// 	loader: () => import("Routes/dashboard/followup-analysis"),
// 	loading: () => <RctPageLoader />,
// });
//
// // renewal analysis
// const AsyncRenewalAnalysisComponent = Loadable({
// 	loader: () => import("Routes/dashboard/renewal-analysis"),
// 	loading: () => <RctPageLoader />,
// });
//
// // conversion analysis
// const AsyncConversionAnalysisComponent = Loadable({
// 	loader: () => import("Routes/dashboard/conversion-analysis"),
// 	loading: () => <RctPageLoader />,
// });
//
//
// const AsyncMemberFeedbackComponent = Loadable({
// loader: () => import("Routes/members/memberfeedback"),
// loading: () => <RctPageLoader />,
// });
//
// const AsyncMemberInductionChecklistComponent = Loadable({
// loader: () => import("Routes/members/induction-checklist"),
// loading: () => <RctPageLoader />,
// });



// store category
// const AsyncStoreCategoryComponent = Loadable({
// 	loader: () => import("Routes/store-category"),
// 	loading: () => <RctPageLoader />,
// });
//
// // stores
// const AsyncStoreComponent = Loadable({
// 	loader: () => import("Routes/store"),
// 	loading: () => <RctPageLoader />,
// });
//
//
//
// // deal type
// const AsyncDealTypeComponent = Loadable({
// 	loader: () => import("Routes/deal-type"),
// 	loading: () => <RctPageLoader />,
// });
//
// // deals
// const AsyncDealComponent = Loadable({
// 	loader: () => import("Routes/deal"),
// 	loading: () => <RctPageLoader />,
// });



// deals
const AsyncGameComponent = Loadable({
	loader: () => import("Routes/game"),
	loading: () => <RctPageLoader />,
});


const AsyncBookTicketComponent = Loadable({
	loader: () => import("Routes/book-ticket"),
	loading: () => <RctPageLoader />,
});

const AsyncMySalesComponent = Loadable({
	loader: () => import("Routes/my-sales"),
	loading: () => <RctPageLoader />,
});
//
// // service
// const AsyncServiceComponent = Loadable({
// 	loader: () => import("Routes/service"),
// 	loading: () => <RctPageLoader />,
// });
//
// //package
// const AsyncPackageComponent = Loadable({
// 	loader: () => import("Routes/package"),
// 	loading: () => <RctPageLoader />,
// });
// // workouts
// //workoutroutine
// const AsyncWorkoutRoutineComponent = Loadable({
// 	loader: () => import("Routes/workouts/workout-routine"),
// 	loading: () => <RctPageLoader />,
// });
// // workout Schedule
// const AsyncWorkoutScheduleComponent = Loadable({
// 	loader: () => import("Routes/workouts/workout-schedule"),
// 	loading: () => <RctPageLoader />,
// 	});

  // Dashboard
  const AsyncDashboardComponent = Loadable({
  	loader: () => import("Routes/dashboard"),
  	loading: () => <RctPageLoader />,
  });

  // Change Password
  const AsyncChangePasswordComponent = Loadable({
  	loader: () => import("Routes/change-password"),
  	loading: () => <RctPageLoader />,
  });
//
// // Enquiry
// const AsyncEnquiryComponent = Loadable({
// 	loader: () => import("Routes/enquiry"),
// 	loading: () => <RctPageLoader />,
// });
// //manage class
// const AsyncManageClassComponent = Loadable({
// 	loader: () => import("Routes/classes/manage-class"),
// 	loading: () => <RctPageLoader />,
// });
//
// //schedules
// const AsyncSchedulesComponent = Loadable({
// 	loader: () => import("Routes/classes/schedules"),
// 	loading: () => <RctPageLoader />,
// });
// const AsyncClassAttendanceComponent = Loadable({
// 	loader: () => import("Routes/classes/class-attendance"),
// 	loading: () => <RctPageLoader />,
// 	});
//   const AsyncClassPerformanceComponent = Loadable({
//   	loader: () => import("Routes/classes/class-performance"),
//   	loading: () => <RctPageLoader />,
//   	});
//
// //expense
// const AsyncExpensesComponent = Loadable({
// 	loader: () => import("Routes/expense-management/expenses"),
// 	loading: () => <RctPageLoader />,
// });
// //investment
// const AsyncInvestmentComponent = Loadable({
// 	loader: () => import("Routes/expense-management/investment"),
// 	loading: () => <RctPageLoader />,
// });
//
// //staff pay
// const AsyncStaffPayComponent = Loadable({
// 	loader: () => import("Routes/expense-management/staff-pay"),
// 	loading: () => <RctPageLoader />,
// });
//
//
//
// //Zone
// const AsyncZoneComponent = Loadable({
// 	loader: () => import("Routes/setting/zone"),
// 	loading: () => <RctPageLoader />,
// });
//
// //Branch
// const AsyncbranchComponent = Loadable({
// 	loader: () => import("Routes/setting/branch"),
// 	loading: () => <RctPageLoader />,
// });
//

//Fitness Center
const AsyncfitnesscenterComponent = Loadable({
	loader: () => import("Routes/setting/fitness-center"),
	loading: () => <RctPageLoader />,
});
// //template configuration
// const AsynctemplateconfigurationComponent = Loadable({
// 	loader: () => import("Routes/setting/template-configuration"),
// 	loading: () => <RctPageLoader />,
// });
//Role
const AsyncRoleComponent = Loadable({
	loader: () => import("Routes/setting/role"),
	loading: () => <RctPageLoader />,
});
//Branding
const AsyncBrandingComponent = Loadable({
	loader: () => import("Routes/setting/branding"),
	loading: () => <RctPageLoader />,
});
//Integration
// const AsyncIntegrationComponent = Loadable({
// 	loader: () => import("Routes/setting/integration"),
// 	loading: () => <RctPageLoader />,
// });
// //budget
// const AsyncBudgetComponent = Loadable({
// 	loader: () => import("Routes/setting/budget"),
// 	loading: () => <RctPageLoader />,
// });
//
// // Disclaimer
// const AsyncDisclaimerComponent = Loadable({
// 	loader: () => import("Routes/setting/disclaimer"),
// 	loading: () => <RctPageLoader />,
// });
//
// //Advertisement
// const AsyncAdvertisementComponent = Loadable({
// 	loader: () => import("Routes/setting/advertisement"),
// 	loading: () => <RctPageLoader />,
// });
//
// //Poster
// const AsyncPosterComponent = Loadable({
// 	loader: () => import("Routes/setting/poster"),
// 	loading: () => <RctPageLoader />,
// });
//
// //Result and testimonial
// const AsyncResultAndTestimonialComponent = Loadable({
// 	loader: () => import("Routes/setting/resultandtestimonial"),
// 	loading: () => <RctPageLoader />,
// });
//

// termscondition
const AsyncTermsAndConditionComponent = Loadable({
	loader: () => import("Routes/terms-condition"),
	loading: () => <RctPageLoader />,
});
//
// // Product
// const AsyncProductComponent = Loadable({
// 	loader: () => import("Routes/product"),
// 	loading: () => <RctPageLoader />,
// });
//
// //Equipment
// const AsyncEquipmentBrandComponent = Loadable({
// 	loader: () => import("Routes/equipment/brands"),
// 	loading: () => <RctPageLoader />,
// });
//
// const AsyncEquipmentInstockComponent = Loadable({
// 	loader: () => import("Routes/equipment/equipmentinstock"),
// 	loading: () => <RctPageLoader />,
// });
//
// const AsyncEquipmentLibraryComponent = Loadable({
// 	loader: () => import("Routes/equipment/equipmentlibrary"),
// 	loading: () => <RctPageLoader />,
// });
//
// const AsyncEquipmentPurchasedComponent = Loadable({
// 	loader: () => import("Routes/equipment/equipmentpurchased"),
// 	loading: () => <RctPageLoader />,
// });
//
//
// //Broadcast
// const AsyncBroadcastComponent = Loadable({
// 	loader: () => import("Routes/broadcast"),
// 	loading: () => <RctPageLoader />,
// });
//
// //Covid-19 Disclaimer Configuration
// const AsyncCovid19ConfigurationComponent = Loadable({
// 	loader: () => import("Routes/covid19disclaimer/configuration"),
// 	loading: () => <RctPageLoader />,
// });
//
// //Covid-19 Member Disclaimer
// const AsyncCovid19MemberDisclaimerComponent = Loadable({
// 	loader: () => import("Routes/covid19disclaimer/memberdisclaimer"),
// 	loading: () => <RctPageLoader />,
// });
//
// //Covid-19 Staff Disclaimer
// const AsyncCovid19StaffDisclaimerComponent = Loadable({
// 	loader: () => import("Routes/covid19disclaimer/staffdisclaimer"),
// 	loading: () => <RctPageLoader />,
// });
//
// //Staff Covid-19 Disclaimer Form
// const AsyncStaffCovid19DisclaimerFormComponent = Loadable({
// 	loader: () => import("Routes/covid19staffdisclaimerform"),
// 	loading: () => <RctPageLoader />,
// });
//
// // Visitor Book
// const AsyncVisitorBookComponent = Loadable({
// 	loader: () => import("Routes/visitorbook"),
// 	loading: () => <RctPageLoader />,
// });
//
// // agency dashboard
// const AsyncSaasDashboardComponent = Loadable({
// 	loader: () => import("Routes/dashboard/saas"),
// 	loading: () => <RctPageLoader />,
// });
//
// const AsyncEnquiryDashboardComponent = Loadable({
// 	loader: () => import("Routes/dashboard/enquiry"),
// 	loading: () => <RctPageLoader />,
// });
//
// // competition
// const AsyncCompetitionComponent = Loadable({
// 	loader: () => import("Routes/competition"),
// 	loading: () => <RctPageLoader />,
// });

// const AsyncUserWidgetComponent = Loadable({
// 	loader: () => import("Routes/widgets/user-widgets"),
// 	loading: () => <RctPageLoader />,
// });
//
// const AsyncUserChartsComponent = Loadable({
// 	loader: () => import("Routes/widgets/charts-widgets"),
// 	loading: () => <RctPageLoader />,
// });
//
// const AsyncGeneralWidgetsComponent = Loadable({
// 	loader: () => import("Routes/widgets/general-widgets"),
// 	loading: () => <RctPageLoader />,
// });
//
// const AsyncPromoWidgetsComponent = Loadable({
// 	loader: () => import("Routes/widgets/promo-widgets"),
// 	loading: () => <RctPageLoader />,
// });

// about us
// const AsyncAboutUsComponent = Loadable({
// 	loader: () => import("Routes/about-us"),
// 	loading: () => <RctPageLoader />,
// });

// // chat app
// const AsyncChatComponent = Loadable({
// 	loader: () => import("Routes/chat"),
// 	loading: () => <RctPageLoader />,
// });
//
// // mail app
// const AsyncMailComponent = Loadable({
// 	loader: () => import("Routes/mail"),
// 	loading: () => <RctPageLoader />,
// });
//
// // todo app
// const AsyncTodoComponent = Loadable({
// 	loader: () => import("Routes/todo"),
// 	loading: () => <RctPageLoader />,
// });

// // gallery
// const AsyncGalleryComponent = Loadable({
// 	loader: () => import("Routes/pages/gallery"),
// 	loading: () => <RctPageLoader />,
// });

// feedback
// const AsyncFeedbackComponent = Loadable({
// 	loader: () => import("Routes/pages/feedback"),
// 	loading: () => <RctPageLoader />,
// });

// // report
// const AsyncReportComponent = Loadable({
// 	loader: () => import("Routes/pages/report"),
// 	loading: () => <RctPageLoader />,
// });

// faq
// const AsyncFaqComponent = Loadable({
// 	loader: () => import("Routes/pages/faq"),
// 	loading: () => <RctPageLoader />,
// });
//
// // pricing
// const AsyncPricingComponent = Loadable({
// 	loader: () => import("Routes/pages/pricing"),
// 	loading: () => <RctPageLoader />,
// });

// blank
// const AsyncBlankComponent = Loadable({
// 	loader: () => import("Routes/pages/blank"),
// 	loading: () => <RctPageLoader />,
// });

// google maps
// const AsyncGooleMapsComponent = Loadable({
// 	loader: () => import("Routes/maps/google-map"),
// 	loading: () => <RctPageLoader />,
// });
//
// // google maps
// const AsyncLeafletMapComponent = Loadable({
// 	loader: () => import("Routes/maps/leaflet-map"),
// 	loading: () => <RctPageLoader />,
// });

// shop list
// const AsyncShoplistComponent = Loadable({
// 	loader: () => import("Routes/ecommerce/shop-list"),
// 	loading: () => <RctPageLoader />,
// });
//
// // shop grid
// const AsyncShopGridComponent = Loadable({
// 	loader: () => import("Routes/ecommerce/shop-grid"),
// 	loading: () => <RctPageLoader />,
// });
//
// // shop
// const AsyncShopComponent = Loadable({
// 	loader: () => import("Routes/ecommerce/shop"),
// 	loading: () => <RctPageLoader />,
// });

// service sales
// const AsyncServiceSalesComponent = Loadable({
// 	loader: () => import("Routes/ecommerce/service"),
// 	loading: () => <RctPageLoader />,
// });
//
// // product sales
// const AsyncProductSalesComponent = Loadable({
// 	loader: () => import("Routes/ecommerce/product"),
// 	loading: () => <RctPageLoader />,
// });
// const AsyncPackageSalesComponent = Loadable({
// 	loader: () => import("Routes/ecommerce/package"),
// 	loading: () => <RctPageLoader />,
// });
//
// // cart
// const AsyncCartComponent = Loadable({
// 	loader: () => import("Routes/ecommerce/cart"),
// 	loading: () => <RctPageLoader />,
// });
//
// // checkout
// const AsyncCheckoutComponent = Loadable({
// 	loader: () => import("Routes/ecommerce/checkout"),
// 	loading: () => <RctPageLoader />,
// });
//
// //ExpressSell
// const AsyncExpressSellComponent = Loadable({
// 	loader: () => import("Routes/ecommerce/express-sale"),
// 	loading: () => <RctPageLoader />,
// });
//
// //change-sale
// const AsyncChangeSaleComponent = Loadable({
// 	loader: () => import("Routes/ecommerce/change-sale"),
// 	loading: () => <RctPageLoader />,
// });
// //Edit-sale
// const AsyncEditChangeSaleComponent = Loadable({
// 	loader: () => import("Routes/ecommerce/ChangeSale"),
// 	loading: () => <RctPageLoader />,
// });
//
// //invoice
// const AsyncInvoiceComponent = Loadable({
// 	loader: () => import("Routes/ecommerce/invoice"),
// 	loading: () => <RctPageLoader />,
// });
//
// //invoice-list
// const AsyncSalesInvoiceListComponent = Loadable({
// 	loader: () => import("Routes/ecommerce/invoice-list"),
// 	loading: () => <RctPageLoader />,
// });
//
// //unfinished-cart
// const AsyncSalesUnfinishedCartComponent = Loadable({
// 	loader: () => import("Routes/ecommerce/unfinished-cart"),
// 	loading: () => <RctPageLoader />,
// });

// react dragula
// const AsyncReactDragulaComponent = Loadable({
// 	loader: () => import("Routes/drag-drop/react-dragula"),
// 	loading: () => <RctPageLoader />,
// });
//
// // react dnd
// const AsyncReactDndComponent = Loadable({
// 	loader: () => import("Routes/drag-drop/react-dnd"),
// 	loading: () => <RctPageLoader />,
// });

// themify icons
// const AsyncThemifyIconsComponent = Loadable({
// 	loader: () => import("Routes/icons/themify-icons"),
// 	loading: () => <RctPageLoader />,
// });
//
// // Simple Line Icons
// const AsyncSimpleLineIconsComponent = Loadable({
// 	loader: () => import("Routes/icons/simple-line-icons"),
// 	loading: () => <RctPageLoader />,
// });
//
// // Font Awesome
// const AsyncFontAwesomeComponent = Loadable({
// 	loader: () => import("Routes/icons/font-awesome"),
// 	loading: () => <RctPageLoader />,
// });
//
// // Material Icons
// const AsyncMaterialIconsComponent = Loadable({
// 	loader: () => import("Routes/icons/material-icons"),
// 	loading: () => <RctPageLoader />,
// });

// Basic Table
// const AsyncBasicTableComponent = Loadable({
// 	loader: () => import("Routes/tables/basic"),
// 	loading: () => <RctPageLoader />,
// });
//
// // Basic Table
// const AsyncDataTableComponent = Loadable({
// 	loader: () => import("Routes/tables/data-table"),
// 	loading: () => <RctPageLoader />,
// });
//
// // Responsive Table
// const AsyncResponsiveTableComponent = Loadable({
// 	loader: () => import("Routes/tables/responsive"),
// 	loading: () => <RctPageLoader />,
// });


// Users Profile
const AsyncUserProfileComponent = Loadable({
	loader: () => import("Routes/users/user-profile"),
	loading: () => <RctPageLoader />,
});

// Users Profile 1
const AsyncUserProfile1Component = Loadable({
	loader: () => import("Routes/users/user-profile-1"),
	loading: () => <RctPageLoader />,
});

//employee Management
const AsyncEmployeeManagementComponent = Loadable({
	loader: () => import("Routes/employee-management"),
	loading: () => <RctPageLoader />,
});
//staff-attendance
// const AsyncStaffAttendanceComponent = Loadable({
// 	loader: () => import("Routes/users/staff-attendance"),
// 	loading: () => <RctPageLoader />,
// });
// //user profile view
const AsyncUserProfileViewComponent = Loadable({
loader: () => import("Routes/users/user-profileview"),
loading: () => <RctPageLoader />,

});
//
// //user manage shift
// const AsyncUserManageShiftComponent = Loadable({
// loader: () => import("Routes/users/manageshift"),
// loading: () => <RctPageLoader />,
// });
//
// //user assign shift
// const AsyncUserAssignShiftComponent = Loadable({
// loader: () => import("Routes/users/assignshift"),
// loading: () => <RctPageLoader />,
// });
//
// const AsyncEmployeeFeedbackComponent = Loadable({
// 	loader: () => import("Routes/users/feedback"),
// 	loading: () => <RctPageLoader />,
// });
// //user biometric
// const AsyncUsersBiometricComponent = Loadable({
// 	loader: () => import("Routes/users/biometric"),
// 	loading: () => <RctPageLoader />,
// });
// /*----------members-----------*/
//
// //member Management
// const AsyncMemberManagementComponent = Loadable({
// 	loader: () => import("Routes/members/member-management"),
// 	loading: () => <RctPageLoader />,
// });
// //member Subscription
// const  AsyncMemberSubscriptionComponent = Loadable({
// 	loader: () => import("Routes/members/inactive-members"),
// 	loading: () => <RctPageLoader />,
// });
//
// //member dues
// const AsyncDuesComponent = Loadable({
// 	loader: () => import("Routes/members/dues"),
// 	loading: () => <RctPageLoader />,
// });
//
// //member measurement1
// const AsyncMeasurementComponent = Loadable({
// 	loader: () => import("Routes/members/measurement"),
// 	loading: () => <RctPageLoader />,
// });
//
//
// //member biometric
// const AsyncBiometricComponent = Loadable({
// 	loader: () => import("Routes/members/biometric"),
// 	loading: () => <RctPageLoader />,
// });
// //member attendance
// const AsyncAttendanceComponent = Loadable({
// 	loader: () => import("Routes/members/member-attendance"),
// 	loading: () => <RctPageLoader />,
// });
// //member pending cheques
// const AsyncPendingChequeComponent = Loadable({
// 	loader: () => import("Routes/members/pending-cheque"),
// 	loading: () => <RctPageLoader />,
// });
//
// 	//member profile
// const AsyncMemberProfileComponent = Loadable({
// 	loader: () => import("Routes/members/member-profile"),
// 	loading: () => <RctPageLoader />,
//
// });
//
// //member trainer profile
// const AsyncTrainerProfileComponent = Loadable({
// loader: () => import("Routes/members/training-profile"),
// loading: () => <RctPageLoader />,
// });
//
//
// // gym access slot
// const AsyncGymAccessSlotComponent = Loadable({
// 	loader: () => import("Routes/members/gym-accessslot"),
// 	loading: () => <RctPageLoader />,
// });
//
//
// // member disclaimer list
// const AsyncMemberDisclaimerComponent = Loadable({
// 	loader: () => import("Routes/members/member-disclaimer"),
// 	loading: () => <RctPageLoader />,
// });
//
//
// // personal training
// const AsyncPersonalTrainingComponent = Loadable({
// loader: () => import("Routes/Personal-training/PT"),
// loading: () => <RctPageLoader />,
//
// });
// //member pt attendence
// const AsyncPtAttendenceComponent = Loadable({
// loader: () => import("Routes/Personal-training/pt-attendence"),
// loading: () => <RctPageLoader />,
//
// });
//
// //member pt-schedule
// const AsyncPTScheduleComponent = Loadable({
// loader: () => import("Routes/Personal-training/pt-schedule"),
// loading: () => <RctPageLoader />,
//
// });
//
// //member pt-room
// const AsyncPTRoomComponent = Loadable({
// loader: () => import("Routes/Personal-training/pt-room"),
// loading: () => <RctPageLoader />,
//
// });
//
//
//
//
// /*----------masterdata-----------*/
// const AsyncExerciseComponent = Loadable({
// 	loader: () => import("Routes/workouts/exercise"),
// 	loading: () => <RctPageLoader />,
// });
//
// // report
//
// const AsyncReportPaymentComponent = Loadable({
// 	loader: () => import("Routes/report/collection-report"),
// 	loading: () => <RctPageLoader />,
// });
// const AsyncReportDuesComponent = Loadable({
// 	loader: () => import("Routes/report/dues-report"),
// 	loading: () => <RctPageLoader />,
// });
// const AsyncReportSoldProductComponent = Loadable({
// 	loader: () => import("Routes/report/sold-product"),
// 	loading: () => <RctPageLoader />,
// });
// const AsyncReportMemberAttendanceComponent = Loadable({
// 	loader: () => import("Routes/report/member-attendancereport"),
// 	loading: () => <RctPageLoader />,
// });
// const AsyncReportEmployeeAttendanceComponent = Loadable({
// 	loader: () => import("Routes/report/employee-attendancereport"),
// 	loading: () => <RctPageLoader />,
// });
// const AsyncReportClassAttendanceComponent = Loadable({
// 	loader: () => import("Routes/report/class-attendancereport"),
// 	loading: () => <RctPageLoader />,
// });
//
// const AsyncReportEnquiryFollowupComponent = Loadable({
// 	loader: () => import("Routes/report/enquiry-followupreport"),
// 	loading: () => <RctPageLoader />,
// });
// const AsyncReportMemberFollowupComponent = Loadable({
// 	loader: () => import("Routes/report/member-followupreport"),
// 	loading: () => <RctPageLoader />,
// });
// const AsyncReportActiveMembershipComponent = Loadable({
// 	loader: () => import("Routes/report/active-membershipreport"),
// 	loading: () => <RctPageLoader />,
// });
// const AsyncReportMembershipComponent = Loadable({
// 	loader: () => import("Routes/report/membershipreport"),
// 	loading: () => <RctPageLoader />,
// });
//
// const AsyncReportNotificationComponent = Loadable({
// 	loader: () => import("Routes/report/notification"),
// 	loading: () => <RctPageLoader />,
// });
// const AsyncReportOnlinePaymentComponent = Loadable({
// 	loader: () => import("Routes/report/onlinepayment"),
// 	loading: () => <RctPageLoader />,
// });
//
// const AsyncReportSoldServiceComponent = Loadable({
// 	loader: () => import("Routes/report/sold-service"),
// 	loading: () => <RctPageLoader />,
// });
//
// const AsyncReportPtAttendanceComponent = Loadable({
// 	loader: () => import("Routes/report/pt-attendancereport"),
// 	loading: () => <RctPageLoader />,
// });
// const AsyncReportGymAccessSlotComponent = Loadable({
// 	loader: () => import("Routes/report/gym-accessslot-report"),
// 	loading: () => <RctPageLoader />,
// });
// const AsyncReportVisitorBookComponent = Loadable({
// 	loader: () => import("Routes/report/visitorbook-report"),
// 	loading: () => <RctPageLoader />,
// });
/*--------------- Charts ----------------

// Re charts
const AsyncRechartsComponent = Loadable({
	loader: () => import("Routes/charts/recharts"),
	loading: () => <RctPageLoader />,
});

// ReactChartsjs2
const AsyncReactChartsjs2Component = Loadable({
	loader: () => import("Routes/charts/react-chartjs2"),
	loading: () => <RctPageLoader />,
});
*/
/*---------------------- Calendar -----------

// Basic Calendar
const AsyncBasicCalendarComponent = Loadable({
	loader: () => import("Routes/calendar/BasicCalendar"),
	loading: () => <RctPageLoader />,
});

// Cultures Calendar
const AsyncCulturesComponent = Loadable({
	loader: () => import("Routes/calendar/Cultures"),
	loading: () => <RctPageLoader />,
});

// Dnd Calendar
const AsyncDndComponent = Loadable({
	loader: () => import("Routes/calendar/Dnd"),
	loading: () => <RctPageLoader />,
});

// Selectable Calendar
const AsyncSelectableComponent = Loadable({
	loader: () => import("Routes/calendar/Selectable"),
	loading: () => <RctPageLoader />,
});

// Custom Calendar
const AsyncCustomComponent = Loadable({
	loader: () => import("Routes/calendar/Custom"),
	loading: () => <RctPageLoader />,
});
*/
/*---------------- Session ------------------*/

// Session Login
// const AsyncSessionLoginComponent = Loadable({
// 	loader: () => import("Routes/session/login"),
// 	loading: () => <RctPageLoader />,
// });
//
// // Session Register
// const AsyncSessionRegisterComponent = Loadable({
// 	loader: () => import("Routes/session/register"),
// 	loading: () => <RctPageLoader />,
// });
//
// // member signup
// const AsyncMemberSignUpComponent = Loadable({
// 	loader: () => import("Routes/session/member-signup"),
// 	loading: () => <RctPageLoader />,
// });
// // link pay
// const AsyncLinkPayComponent = Loadable({
// 	loader: () => import("Routes/session/link-pay"),
// 	loading: () => <RctPageLoader />,
// });

// Session Lock Screen
// const AsyncSessionLockScreenComponent = Loadable({
// 	loader: () => import("Routes/session/lock-screen"),
// 	loading: () => <RctPageLoader />,
// });

// Session Forgot Password
// const AsyncSessionForgotPasswordComponent = Loadable({
// 	loader: () => import("Routes/session/forgot-password"),
// 	loading: () => <RctPageLoader />,
// });

// Session Page 404
// const AsyncSessionPage404Component = Loadable({
// 	loader: () => import("Routes/session/404"),
// 	loading: () => <RctPageLoader />,
// });

// Session Page 404
// const AsyncSessionPage500Component = Loadable({
// 	loader: () => import("Routes/session/500"),
// 	loading: () => <RctPageLoader />,
// });

// terms and condition
// const AsyncTermsConditionComponent = Loadable({
// 	loader: () => import("Routes/pages/terms-condition"),
// 	loading: () => <RctPageLoader />,
// });
//
//
// //Member workout profile
// const AsyncHomeComponent = Loadable({
// 	loader: () => import("RoutesMember/home"),
// 	loading: () => <RctPageLoader />,
// });
//
// const AsyncFitnessTrackingComponent = Loadable({
// 	loader: () => import("RoutesMember/fitness-tracking"),
// 	loading: () => <RctPageLoader />,
// });
//
//
// const AsyncPtRoomComponent = Loadable({
// 	loader: () => import("RoutesMember/pt-room"),
// 	loading: () => <RctPageLoader />,
// });
//
//
// const AsyncTimelineComponent = Loadable({
// 	loader: () => import("RoutesMember/timeline"),
// 	loading: () => <RctPageLoader />,
// });
//
// const AsyncMembershipComponent = Loadable({
// 	loader: () => import("RoutesMember/membership"),
// 	loading: () => <RctPageLoader />,
// });
//
// const AsyncBuyServicesComponent = Loadable({
// 	loader: () => import("RoutesMember/buy-service"),
// 	loading: () => <RctPageLoader />,
// });
//
// const AsyncClassScheduleComponent = Loadable({
// 	loader: () => import("RoutesMember/class-schedule"),
// 	loading: () => <RctPageLoader />,
// });
//
// const AsyncMemberRewardPointsComponent = Loadable({
// 	loader: () => import("RoutesMember/reward-points"),
// 	loading: () => <RctPageLoader />,
// });
//
// const AsyncMemberWorkoutScheduleComponent = Loadable({
// 	loader: () => import("RoutesMember/workout-schedule"),
// 	loading: () => <RctPageLoader />,
// });
//
// const AsyncMemberChangePasswordComponent = Loadable({
// 	loader: () => import("RoutesMember/changepassword"),
// 	loading: () => <RctPageLoader />,
// });
// //member gym access slot
// const AsyncMemberGymAccessSlotComponent = Loadable({
// 	loader: () => import("RoutesMember/gym-accessslot"),
// 	loading: () => <RctPageLoader />,
// });
// // pt schedule
// const AsyncMembersPTScheduleComponent = Loadable({
// 	loader: () => import("RoutesMember/pt-schedule"),
// 	loading: () => <RctPageLoader />,
// });
// const AsyncMemberExerciseLibraryComponent = Loadable({
// 	loader: () => import("RoutesMember/memberexercise"),
// 	loading: () => <RctPageLoader />,
// });
//
// const AsyncMemberWorkoutRoutineComponent = Loadable({
// 	loader: () => import("RoutesMember/workout-routine"),
// 	loading: () => <RctPageLoader />,
// });
// const AsyncbodyprogressComponent = Loadable({
// 	loader: () => import("RoutesMember/body-progress"),
// 	loading: () => <RctPageLoader />,
// });
//
// const AsyncprogressphotosComponent = Loadable({
// 	loader: () => import("RoutesMember/progress-photos"),
// 	loading: () => <RctPageLoader />,
// });
//
// const AsynchistoryComponent = Loadable({
// 	loader: () => import("RoutesMember/history"),
// 	loading: () => <RctPageLoader />,
// });
//
// const AsyncmemberfeedbackComponent = Loadable({
// 	loader: () => import("RoutesMember/member-feedback"),
// 	loading: () => <RctPageLoader />,
// });
//
// const AsyncmembersettingComponent = Loadable({
// 	loader: () => import("RoutesMember/setting"),
// 	loading: () => <RctPageLoader />,
// });
//
// const AsyncmemberattendedsessionComponent = Loadable({
// 	loader: () => import("RoutesMember/attended-session"),
// 	loading: () => <RctPageLoader />,
// });
//
// const AsyncMemberPreSetDietComponent = Loadable({
// 	loader: () => import("RoutesMember/preset-diet"),
// 	loading: () => <RctPageLoader />,
// });
//
// const AsyncMemberDisclaimerFormComponent = Loadable({
// 	loader: () => import("RoutesMember/disclaimerform"),
// 	loading: () => <RctPageLoader />,
// });
//
// const AsyncMemberCovid19DisclaimerFormComponent = Loadable({
// 	loader: () => import("RoutesMember/covid19disclaimerform"),
// 	loading: () => <RctPageLoader />,
// });
//
// const AsyncMemberRecipelibraryComponent = Loadable({
// 	loader: () => import("RoutesMember/recipe-library"),
// 	loading: () => <RctPageLoader />,
// });
//
// const AsyncMemberDietRoutineComponent = Loadable({
// 	loader: () => import("RoutesMember/diet-routine"),
// 	loading: () => <RctPageLoader />,
// });
//
// const AsyncMemberCartComponent = Loadable({
// 	loader: () => import("RoutesMember/cart"),
// 	loading: () => <RctPageLoader />,
// });
//
// const AsyncMemberPaymentComponent = Loadable({
// 	loader: () => import("RoutesMember/payment"),
// 	loading: () => <RctPageLoader />,
// });
//
//
// // diet
// const AsyncDietrecipeComponent = Loadable({
// 	loader: () => import("Routes/diets/recipe"),
// 	loading: () => <RctPageLoader />,
// });
// const AsyncDietRoutineComponent = Loadable({
// 	loader: () => import("Routes/diets/diet-routine"),
// 	loading: () => <RctPageLoader />,
// });
// // allocate diet
// const AsyncAllocateDietComponent = Loadable({
//   loader: () => import("Routes/diets/allocate-diet"),
//   loading: () => <RctPageLoader />,
//   });
/*---------------- Editor -------------------

// editor quill
const AsyncQuillEditorComponent = Loadable({
	loader: () => import("Routes/editor/quill-editor"),
	loading: () => <RctPageLoader />,
});

// editor Wysiwyg
const AsyncWysiwygEditorComponent = Loadable({
	loader: () => import("Routes/editor/wysiwyg-editor"),
	loading: () => <RctPageLoader />,
});
*/
/*------------- Form Elemets -------------

// forms elements
const AsyncFormElementsComponent = Loadable({
	loader: () => import("Routes/forms/form-elements"),
	loading: () => <RctPageLoader />,
});

// forms TextField
const AsyncTextFieldComponent = Loadable({
	loader: () => import("Routes/forms/material-text-field"),
	loading: () => <RctPageLoader />,
});

// forms TextField
const AsyncSelectListComponent = Loadable({
	loader: () => import("Routes/forms/select-list"),
	loading: () => <RctPageLoader />,
});
*/
/*------------------ UI Components ---------------

// components Alerts
const AsyncUIAlertsComponent = Loadable({
	loader: () => import("Routes/components/alert"),
	loading: () => <RctPageLoader />,
});

// components Appbar
const AsyncUIAppbarComponent = Loadable({
	loader: () => import("Routes/components/app-bar"),
	loading: () => <RctPageLoader />,
});

// components BottomNavigation
const AsyncUIBottomNavigationComponent = Loadable({
	loader: () => import("Routes/components/bottom-navigation"),
	loading: () => <RctPageLoader />,
});

// components BottomNavigation
const AsyncUIAvatarsComponent = Loadable({
	loader: () => import("Routes/components/avatar"),
	loading: () => <RctPageLoader />,
});

// components Buttons
const AsyncUIButtonsComponent = Loadable({
	loader: () => import("Routes/components/buttons"),
	loading: () => <RctPageLoader />,
});

// components Badges
const AsyncUIBadgesComponent = Loadable({
	loader: () => import("Routes/components/badges"),
	loading: () => <RctPageLoader />,
});

// components CardMasonary
const AsyncUICardMasonaryComponent = Loadable({
	loader: () => import("Routes/components/card-masonry"),
	loading: () => <RctPageLoader />,
});

// components Cards
const AsyncUICardsComponent = Loadable({
	loader: () => import("Routes/components/cards"),
	loading: () => <RctPageLoader />,
});

// components Chips
const AsyncUIChipsComponent = Loadable({
	loader: () => import("Routes/components/chip"),
	loading: () => <RctPageLoader />,
});

// components Dialog
const AsyncUIDialogComponent = Loadable({
	loader: () => import("Routes/components/dialog"),
	loading: () => <RctPageLoader />,
});

// components Dividers
const AsyncUIDividersComponent = Loadable({
	loader: () => import("Routes/components/dividers"),
	loading: () => <RctPageLoader />,
});

// components Drawers
const AsyncUIDrawersComponent = Loadable({
	loader: () => import("Routes/components/drawers"),
	loading: () => <RctPageLoader />,
});

// components ExpansionPanel
const AsyncUIExpansionPanelComponent = Loadable({
	loader: () => import("Routes/components/expansion-panel"),
	loading: () => <RctPageLoader />,
});

// components Grid List
const AsyncUIGridListComponent = Loadable({
	loader: () => import("Routes/components/grid-list"),
	loading: () => <RctPageLoader />,
});

// components List
const AsyncUIListComponent = Loadable({
	loader: () => import("Routes/components/list"),
	loading: () => <RctPageLoader />,
});

// components Menu
const AsyncUIMenuComponent = Loadable({
	loader: () => import("Routes/components/menu"),
	loading: () => <RctPageLoader />,
});

// components Popover
const AsyncUIPopoverComponent = Loadable({
	loader: () => import("Routes/components/popover"),
	loading: () => <RctPageLoader />,
});

// components Progress
const AsyncUIProgressComponent = Loadable({
	loader: () => import("Routes/components/progress"),
	loading: () => <RctPageLoader />,
});

// components Snackbar
const AsyncUISnackbarComponent = Loadable({
	loader: () => import("Routes/components/snackbar"),
	loading: () => <RctPageLoader />,
});

// components SelectionControls
const AsyncUISelectionControlsComponent = Loadable({
	loader: () => import("Routes/components/selection-controls"),
	loading: () => <RctPageLoader />,
});
*/
/*---------------- Advance UI Components -------------

// advance components DateAndTimePicker
const AsyncAdvanceUIDateAndTimePickerComponent = Loadable({
	loader: () => import("Routes/advance-ui-components/dateTime-picker"),
	loading: () => <RctPageLoader />,
});

// advance components Tabs
const AsyncAdvanceUITabsComponent = Loadable({
	loader: () => import("Routes/advance-ui-components/tabs"),
	loading: () => <RctPageLoader />,
});

// advance components Stepper
const AsyncAdvanceUIStepperComponent = Loadable({
	loader: () => import("Routes/advance-ui-components/stepper"),
	loading: () => <RctPageLoader />,
});

// advance components NotificationComponent
const AsyncAdvanceUINotificationComponent = Loadable({
	loader: () => import("Routes/advance-ui-components/notification"),
	loading: () => <RctPageLoader />,
});

// advance components SweetAlert
const AsyncAdvanceUISweetAlertComponent = Loadable({
	loader: () => import("Routes/advance-ui-components/sweet-alert"),
	loading: () => <RctPageLoader />,
});

// advance components autoComplete
const AsyncAdvanceUIAutoCompleteComponent = Loadable({
	loader: () => import("Routes/advance-ui-components/autoComplete"),
	loading: () => <RctPageLoader />,
});
*/
export {
	AsyncRoutes,
//	AsyncRoutesMember,
	// AsyncUserWidgetComponent,
	// AsyncUserChartsComponent,
	// AsyncGeneralWidgetsComponent,
	// AsyncPromoWidgetsComponent,
//	AsyncAboutUsComponent,
	// AsyncChatComponent,
	// AsyncMailComponent,
	// AsyncTodoComponent,
	//AsyncGalleryComponent,
	//AsyncFeedbackComponent,
	//AsyncReportComponent,
	// AsyncFaqComponent,
	// AsyncPricingComponent,
//	AsyncBlankComponent,
	// AsyncGooleMapsComponent,
	// AsyncLeafletMapComponent,
	// AsyncShoplistComponent,
	// AsyncShopGridComponent,
	// AsyncInvoiceComponent,
  // AsyncSalesInvoiceListComponent,
  // AsyncSalesUnfinishedCartComponent,
	// AsyncReactDragulaComponent,
	// AsyncReactDndComponent,
	// AsyncThemifyIconsComponent,
	// AsyncSimpleLineIconsComponent,
	// AsyncFontAwesomeComponent,
	// AsyncMaterialIconsComponent,
	// AsyncBasicTableComponent,
	// AsyncDataTableComponent,
	// AsyncResponsiveTableComponent,

	AsyncUserProfileComponent,
	AsyncUserProfile1Component,
	AsyncEmployeeManagementComponent,
//  AsyncStaffAttendanceComponent,
  AsyncUserProfileViewComponent,
  // AsyncUserManageShiftComponent,
  // AsyncUserAssignShiftComponent,
	// AsyncEmployeeFeedbackComponent,
  // AsyncUsersBiometricComponent,
	// AsyncMemberManagementComponent,
	// AsyncMemberSubscriptionComponent,
	// AsyncDuesComponent,
	// AsyncMeasurementComponent,
  // AsyncBiometricComponent,
  // AsyncMemberGymAccessSlotComponent,
  // AsyncMembersPTScheduleComponent,
	// AsyncAttendanceComponent,
	// AsyncPendingChequeComponent,
	// AsyncMemberProfileComponent,
  // AsyncTrainerProfileComponent,
  // AsyncGymAccessSlotComponent,
  // AsyncMemberDisclaimerComponent,
  // AsyncMemberFeedbackComponent,
  // AsyncPtAttendenceComponent,
  // AsyncPTScheduleComponent,
  // AsyncPTRoomComponent,
  // AsyncPersonalTrainingComponent,
	// AsyncWorkoutScheduleComponent,
  // AsyncAllocateDietComponent,
	// AsyncReportPaymentComponent,
  // AsyncReportDuesComponent,
	// AsyncReportSoldProductComponent,
	// AsyncReportMemberAttendanceComponent,
  // AsyncReportEmployeeAttendanceComponent,
	// AsyncReportClassAttendanceComponent,
	// AsyncReportEnquiryFollowupComponent,
	// AsyncReportMemberFollowupComponent,
  // AsyncReportActiveMembershipComponent,
  // AsyncReportMembershipComponent,
  // AsyncReportNotificationComponent,
  // AsyncReportOnlinePaymentComponent,
  // AsyncReportSoldServiceComponent,
  // AsyncReportPtAttendanceComponent,
  // AsyncReportGymAccessSlotComponent,
  // AsyncReportVisitorBookComponent,
	// AsyncExerciseComponent,
  // AsyncDietrecipeComponent,
  // AsyncDietRoutineComponent,
	// // AsyncRechartsComponent,
	// AsyncReactChartsjs2Component,
	// AsyncBasicCalendarComponent,
	// AsyncCulturesComponent,
	// AsyncDndComponent,
	// AsyncSelectableComponent,
	// AsyncCustomComponent,
	// AsyncSessionLoginComponent,
	// AsyncSessionRegisterComponent,
  // AsyncMemberSignUpComponent,
  // AsyncLinkPayComponent,
//	AsyncSessionLockScreenComponent,
	//AsyncSessionForgotPasswordComponent,
	//AsyncSessionPage404Component,
	//AsyncSessionPage500Component,
	//AsyncTermsConditionComponent,
	// AsyncQuillEditorComponent,
	// AsyncWysiwygEditorComponent,
	// AsyncFormElementsComponent,
	// AsyncTextFieldComponent,
	// AsyncSelectListComponent,
	// AsyncUIAlertsComponent,
	// AsyncUIAppbarComponent,
	// AsyncUIBottomNavigationComponent,
	// AsyncUIAvatarsComponent,
	// AsyncUIButtonsComponent,
	// AsyncUIBadgesComponent,
	// AsyncUICardMasonaryComponent,
	// AsyncUICardsComponent,
	// AsyncUIChipsComponent,
	// AsyncUIDialogComponent,
	// AsyncUIDividersComponent,
	// AsyncUIDrawersComponent,
	// AsyncUIExpansionPanelComponent,
	// AsyncUIGridListComponent,
	// AsyncUIListComponent,
	// AsyncUIMenuComponent,
	// AsyncUIPopoverComponent,
	// AsyncUIProgressComponent,
	// AsyncUISnackbarComponent,
	// AsyncUISelectionControlsComponent,
	// AsyncAdvanceUIDateAndTimePickerComponent,
	// AsyncAdvanceUITabsComponent,
	// AsyncAdvanceUIStepperComponent,
	// AsyncAdvanceUINotificationComponent,
	// AsyncAdvanceUISweetAlertComponent,
	// AsyncAdvanceUIAutoCompleteComponent,
	//AsyncShopComponent,
	// AsyncServiceSalesComponent,
	// AsyncProductSalesComponent,
  // AsyncPackageSalesComponent,
	// AsyncCartComponent,
	// AsyncCheckoutComponent,
  // AsyncExpressSellComponent,
  // AsyncChangeSaleComponent,
  // AsyncEditChangeSaleComponent,
//	AsyncEcommerceDashboardComponent,
	// AsyncMasterDashboardComponent,
  // AsyncBudgetDashboardComponent,
	// AsyncRevenueDashboardComponent,
  // AsyncMemberProfileDashboardComponent,
  // AsyncFollowupDashboardComponent,
  // AsyncFollowupAnalysisComponent,
  // AsyncRenewalAnalysisComponent,
  // AsyncConversionAnalysisComponent,
  // AsyncStaffPerformanceComponent,
	// AsyncSaasDashboardComponent,
	// AsyncEnquiryDashboardComponent,
	// AsyncServiceComponent,
  // AsyncStoreCategoryComponent,
  // AsyncStoreComponent,
  // AsyncDealTypeComponent,
  // AsyncDealComponent,
  AsyncBookTicketComponent,
  AsyncMySalesComponent,
AsyncGameComponent,
  // AsyncWorkoutRoutineComponent,
	// AsyncEnquiryComponent,
  AsyncDashboardComponent,
  AsyncChangePasswordComponent,
	// AsyncManageClassComponent,
	// AsyncStaffPayComponent,
	// AsyncExpensesComponent,
  // AsyncInvestmentComponent,
	// AsyncSchedulesComponent,
	// AsyncClassAttendanceComponent,
  // AsyncClassPerformanceComponent,
	// AsyncZoneComponent,
	// AsyncbranchComponent,
	 AsyncfitnesscenterComponent,
	// AsynctemplateconfigurationComponent,
	 AsyncRoleComponent,
   AsyncBrandingComponent,
  // AsyncIntegrationComponent,
  // AsyncBudgetComponent,
  // AsyncDisclaimerComponent,
  // AsyncAdvertisementComponent,
  // AsyncPosterComponent,
  // AsyncResultAndTestimonialComponent,
  // AsyncTermsAndConditionComponent,
	// AsyncProductComponent,
  // AsyncEquipmentBrandComponent,
  // AsyncEquipmentInstockComponent,
  // AsyncEquipmentLibraryComponent,
  // AsyncEquipmentPurchasedComponent,
  // AsyncBroadcastComponent,
  // AsyncCovid19ConfigurationComponent,
  // AsyncCovid19MemberDisclaimerComponent,
  // AsyncCovid19StaffDisclaimerComponent,
  // AsyncStaffCovid19DisclaimerFormComponent,
  // AsyncVisitorBookComponent,
	// AsyncHomeComponent,
	// AsyncFitnessTrackingComponent,
	// AsyncPtRoomComponent,
  // AsyncTimelineComponent,
	// AsyncMembershipComponent,
  // AsyncBuyServicesComponent,
  // AsyncClassScheduleComponent,
  // AsyncMemberCartComponent,
  // AsyncMemberPaymentComponent,
	// AsyncbodyprogressComponent,
	// AsyncmemberfeedbackComponent,
  // AsyncMemberInductionChecklistComponent,
  // AsyncmembersettingComponent,
  // AsyncmemberattendedsessionComponent,
	// AsyncprogressphotosComponent,
	// AsynchistoryComponent,
	// AsyncMemberChangePasswordComponent,
	// AsyncMemberExerciseLibraryComponent,
	// AsyncMemberWorkoutRoutineComponent,
	// AsyncMemberWorkoutScheduleComponent,
  // AsyncMemberDietRoutineComponent,
  // AsyncMemberPreSetDietComponent,
  // AsyncMemberDisclaimerFormComponent,
  // AsyncMemberCovid19DisclaimerFormComponent,
  // AsyncMemberRecipelibraryComponent,
  // AsyncMemberRewardPointsComponent,
  // AsyncCompetitionComponent,
  // AsyncPackageComponent
};
