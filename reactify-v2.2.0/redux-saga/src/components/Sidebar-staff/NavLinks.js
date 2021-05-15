// sidebar nav links
export default {
	category1: [
		{
			"menu_title": "sidebar.dashboard",
			"menu_icon": "fa fa-dashboard",
			"alias" :"dashboard",
			 name : 'Dashboard',
			 "path": "/app/dashboard",
			 "extrapath" :["/app/change-password"],

			"clientType" : [1,2],
			"packType" : [1,2,3],
			"professionalType" : [1,2,3],
			"serviceProvided" : [1,2,3],
			"child_routes": null
		},
		{
			"path": "/app/game",
			"menu_icon": "fa fa-gamepad ",
			"menu_title": "sidebar.game",
			"alias":"game",
			name : 'Game',
			"clientType" : [1,2],
			"packType" : [1,2,3],
			"professionalType" : [1,2,3],
			"serviceProvided" : [1,2,3]
		},
		{
			"path": "/app/book-ticket",
			"menu_icon": "fa fa-cart-arrow-down ",
			"menu_title": "sidebar.bookTicket",
			"alias":"bookticket",
			name : 'Book Ticket',
			"clientType" : [1,2],
			"packType" : [1,2,3],
			"professionalType" : [1,2,3],
			"serviceProvided" : [1,2,3]
		},
		{
			"path": "/app/my-sales",
			"menu_icon": "fa fa-money",
			"menu_title": "sidebar.mySales",
			"alias":"mysales",
			name : 'My Sales',
			"clientType" : [1,2],
			"packType" : [1,2,3],
			"professionalType" : [1,2,3],
			"serviceProvided" : [1,2,3]
		},
		// {
		// 	"path": "/app/store-category",
		// 	"menu_icon": "fa fa-folder-open",
		// 	"menu_title": "sidebar.storeCategory",
		// 	"alias":"storecategory",
		// 	name : 'Store Category',
		// 	"clientType" : [1,2],
		// 	"packType" : [1,2,3],
		// 	"professionalType" : [1,2,3],
		// 	"serviceProvided" : [1,2,3]
		// },
		// {
		// 	"path": "/app/store",
		// 	"menu_icon": "fa fa-home",
		// 	"menu_title": "sidebar.store",
		// 	"alias":"store",
		// 	name : 'Store',
		// 	"clientType" : [1,2],
		// 	"packType" : [1,2,3],
		// 	"professionalType" : [1,2,3],
		// 	"serviceProvided" : [1,2,3]
		// },
		// {
		// 	"path": "/app/deal-type",
		// 	"menu_icon": "fa fa-folder-open",
		// 	"menu_title": "sidebar.dealType",
		// 	"alias":"dealtype",
		// 	name : 'Deal Type',
		// 	"clientType" : [1,2],
		// 	"packType" : [1,2,3],
		// 	"professionalType" : [1,2,3],
		// 	"serviceProvided" : [1,2,3]
		// },
		// {
		// 	"path": "/app/deal",
		// 	"menu_icon": "zmdi zmdi-label",
		// 	"menu_title": "sidebar.deal",
		// 	"alias":"deal",
		// 	name : 'Deal',
		// 	"clientType" : [1,2],
		// 	"packType" : [1,2,3],
		// 	"professionalType" : [1,2,3],
		// 	"serviceProvided" : [1,2,3]
		// },
		// {
		// 	"menu_title": "sidebar.visitorbook",
		// 	"menu_icon": "ti-book",
		// 	 "alias" :"visitorbook",
		// 	 name : 'Visitor Book',
		// 	"path": "/app/visitorbook",
		// 	"clientType" : [1],
		// 	"packType" : [3],
		// 	"professionalType" : [1,2,3],
		// 	"serviceProvided" : [2,3],
		// 	"child_routes": null
		// },
		// {
		// 	"menu_title": "sidebar.enquiry",
		// 	"menu_icon": "ti-agenda",
		// 	 "alias" :"enquiry",
		// 	 name : 'Enquiry',
		// 	"path": "/app/enquiry/0",
		// 	"extrapath" :["/app/enquiry", "/app/enquiry/1", "/app/enquiry/2", "/app/enquiry/3", "/app/enquiry/4", "/app/enquiry/5"],
		// 	"clientType" : [1,2],
		// 	"packType" : [1,2,3],
		// 	"professionalType" : [1,2,3],
		// 	"serviceProvided" : [1,2,3],
		// 	"child_routes": null
		// },
		// {
		// 	"menu_title": "sidebar.ecommerce",
		// 	"menu_icon": "fa fa-shopping-cart ",
		// 	  "alias" :"sales",
		// 		name : 'Sales',
		// 		"clientType" : [1,2],
		// 		"packType" : [1,2,3],
		// 		"professionalType" : [1,2,3],
		// 		"serviceProvided" : [1,2,3],
		// 	"child_routes": [
		// 		{
		// 			"path": "/app/ecommerce/express-sale",
		// 			"extrapath" :["/app/ecommerce/cart", "/app/ecommerce/checkout","/app/ecommerce/invoice"],
		// 			"menu_title": "sidebar.expressSale",
		// 			"alias":"expresssale",
		// 			name : 'Express Sale',
		// 			"clientType" : [1,2],
		// 			"packType" : [3],
		// 			"professionalType" : [1,2,3],
		// 			"serviceProvided" : [1,2,3]
		// 		},
		// 		{
		// 			"path": "/app/ecommerce/service",
		// 			"extrapath" :["/app/ecommerce/cart", "/app/ecommerce/checkout", "/app/ecommerce/express-sale","/app/ecommerce/invoice"],
		// 			"menu_title": "sidebar.service",
		// 			"alias":"servicesale",
		// 			name : 'Service',
		// 			"clientType" : [1,2],
		// 			"packType" : [1,2,3],
		// 			"professionalType" : [1,2,3],
		// 			"serviceProvided" : [1,2,3]
		// 		},
		// 		{
		// 			"path": "/app/ecommerce/package",
		// 			"extrapath" :["/app/ecommerce/cart", "/app/ecommerce/checkout", "/app/ecommerce/express-sale","/app/ecommerce/invoice"],
		// 			"menu_title": "sidebar.package",
		// 			"alias" :"packagesale",
    //       name : 'Package',
		// 			"clientType" : [1,2],
    //       "clientType" : [1,2],
		// 			"packType" : [1,2,3],
		// 			"professionalType" : [1,2,3],
		// 			"serviceProvided" : [1,2,3]
		// 		},
		// 		{
		// 			"path": "/app/ecommerce/product",
		// 			"extrapath" :["/app/ecommerce/cart", "/app/ecommerce/checkout", "/app/ecommerce/express-sale","/app/ecommerce/invoice"],
		// 			"menu_title": "sidebar.product",
		// 			  "alias" :"productsale",
		// 				name : 'Product',
		// 				"clientType" : [1],
		// 				"packType" : [2,3],
		// 				"professionalType" : [1,2,3],
		// 				"serviceProvided" : [1,2,3]
		// 		},
		// 		{
		// 			"path": "/app/ecommerce/unfinished-cart",
		// 			"menu_title": "sidebar.unfinishedCart",
		// 			  "alias" :"unfinishedcart",
		// 				name : 'Unfinished Cart',
		// 				"clientType" : [1],
		// 				"packType" : [2,3],
		// 				"professionalType" : [1,2,3],
		// 				"serviceProvided" : [1,2,3]
		// 		},
		// 		{
		// 			"path": "/app/ecommerce/change-sale",
		// 			"extrapath" :["/app/ecommerce/changesale"],
		// 			"menu_title": "sidebar.changeSale",
		// 			"alias":"changesale",
		// 			name : 'Change Sale',
		// 			"clientType" : [1,2],
		// 			"packType" : [1,2,3],
		// 			"professionalType" : [1,2,3],
		// 			"serviceProvided" : [1,2,3]
		// 		},
		// 		{
		// 			"path": "/app/ecommerce/invoice-list",
		// 			"menu_title": "sidebar.invoiceList",
		// 			  "alias" :"invoice",
		// 				name : 'Invoice',
		// 				"clientType" : [1,2],
		// 				"packType" : [1,2,3],
		// 				"professionalType" : [1,2,3],
		// 				"serviceProvided" : [1,2,3]
		// 		}
		// 	]
		// },
		// {
		// 	"menu_title": "sidebar.members",
		// 	"menu_icon": "fa fa-vcard",
		// 	 "alias" :"members",
		// 	 name : 'Members',
		// 	 "clientType" : [1,2],
		// 	 "packType" : [1,2,3],
		// 	 "professionalType" : [1,2,3],
 		// 	"serviceProvided" : [1,2,3],
		// 	"child_routes": [
		// 		{
		// 			"path": "/app/members/member-management",
		// 			"menu_title": "sidebar.memberManagement",
		// 			"extrapath" :["/app/members/member-profile" , "/app/members/training-profile"] ,
		// 			"alias" :"membermanagement",
		// 			name : 'Member Management',
		// 			"clientType" : [1,2],
		// 			"packType" : [1,2,3],
		// 			"professionalType" : [1,2,3],
		// 			"serviceProvided" : [1,2,3]
		// 		},
		// 		{
		// 			"path": "/app/members/member-disclaimer",
		// 			"menu_title": "sidebar.disclaimer",
		// 				"alias" :"memberdisclaimer",
		// 				name : 'Member Disclaimer',
		// 				"clientType" : [1],
		// 				"packType" : [3],
		// 				"professionalType" : [1,2,3],
		// 				"serviceProvided" : [1,2,3]
		// 		},
		// 		{
		// 			"path": "/app/members/induction-checklist",
		// 			"menu_title": "sidebar.inductionChecklist",
		// 				"alias" :"inductionchecklist",
		// 				name : 'Induction Checklist',
		// 				"clientType" : [1],
		// 				"packType" : [3],
		// 				"professionalType" : [1,2,3],
		// 				"serviceProvided" : [2,3]
		// 		},
		// 		{
		// 			"path": "/app/members/inactive-members",
		// 			"menu_title": "sidebar.inactiveMembers",
		// 			 "alias" :"subscriptionexpired",
		// 			 name : 'Inactive Members',
		// 			 "clientType" : [1,2],
 		// 			"packType" : [1,2,3],
		// 			"professionalType" : [1,2,3],
		// 			"serviceProvided" : [1,2,3]
		//
		// 		},
		// 		{
		// 			"path": "/app/members/dues",
		// 			"menu_title": "sidebar.dues",
		// 			"alias":"dues",
		// 			name : 'Payment Dues',
		// 			"clientType" : [1,2],
		// 			"packType" : [1,2,3],
		// 			"professionalType" : [1,2,3],
		// 			"serviceProvided" : [1,2,3]
		// 		},
		// 		{
		// 			"path": "/app/members/pending-cheque",
		// 			"menu_title": "sidebar.pendingCheque",
		// 			"alias":"pendingcheque",
		// 			name : 'Pending Cheque',
		// 			"clientType" : [1,2],
		// 			"packType" : [1,2,3],
		// 			"professionalType" : [1,2,3],
		// 			"serviceProvided" : [1,2,3]
		// 		},
		// 		{
		// 			"path": "/app/members/member-attendance",
		// 			"menu_title": "sidebar.memberAttendance",
		// 			"alias" :"memberattendance",
		// 			name : 'Member Attendance',
		// 			"clientType" : [1],
		// 			"packType" : [1,2,3],
		// 			"professionalType" : [1,2,3],
		// 			"serviceProvided" : [1,2,3]
		// 		},
		// 		{
		// 			"path": "/app/members/measurement",
		// 			"menu_title": "sidebar.measurement",
		// 				"alias" :"measurement",
		// 				name : 'Measurement',
		// 				"clientType" : [1,2],
		// 				"packType" : [3],
		// 				"professionalType" : [1,2,3],
		// 				"serviceProvided" : [1,2,3]
		// 		},
		// 		{
		// 			"path": "/app/members/biometric/0",
		// 			"menu_title": "sidebar.biometric",
		// 				"alias" :"biometric",
		// 				name : 'Biometric',
		// 				"clientType" : [1],
		// 				"extrapath" :[ "/app/members/biometric/1","/app/members/biometric/2"],
		// 				"packType" : [1,2,3],
		// 				"professionalType" : [1,2,3],
		// 				"serviceProvided" : [2,3]
		// 		},
		// 		{
		// 			"path": "/app/members/gym-accessslot",
		// 			"menu_title": "sidebar.gymAccessslot",
		// 				"alias" :"gymaccessslot",
		// 				name : 'Gym Access Slot',
		// 				"clientType" : [1],
		// 				"packType" : [1,2,3],
		// 				"professionalType" : [1,2,3],
		// 				"serviceProvided" : [2,3]
		// 		},
		// 		{
		// 			"path": "/app/members/memberfeedback/0",
		// 			"menu_title": "sidebar.memberFeedback",
		// 				"alias" :"memberfeedback",
		// 				name : 'Member Feedback',
		// 				"clientType" : [1,2],
		// 				"extrapath" :[ "/app/members/memberfeedback/1","/app/members/memberfeedback/2","/app/members/memberfeedback/3"],
		// 				"packType" : [3],
		// 				"professionalType" : [1,2,3],
		// 				"serviceProvided" : [1,2,3]
		// 		},
		// 	]
		// },{
		// 	"menu_title": "sidebar.classes",
		// 	"menu_icon": "fa fa-bookmark",
		// 	  "alias" :"classes",
		// 		name : 'Classes',
		// 		"clientType" : [1,2],
		// 		"packType" : [2,3],
		// 		"professionalType" : [1,2,3],
		// 		"serviceProvided" : [1,2,3],
		// 	"child_routes": [
		// 		{
		// 			"path": "/app/classes/manage-class",
		// 			"menu_title": "sidebar.manageclass",
		// 			"alias" :"manageclass",
		// 				name : 'Manage Class',
		// 			"clientType" : [1,2],
		// 			"packType" : [2,3],
		// 			"professionalType" : [1,2,3],
		// 			"serviceProvided" : [1,2,3]
		// 		},
		// 		{
		// 			"path": "/app/classes/class-schedules",
		// 			"menu_title": "sidebar.classSchedules",
		// 			 "alias" :"classschedules",
		// 			 	name : 'Class Schedules',
		// 			 "clientType" : [1,2],
 		// 			"packType" : [2,3],
		// 			"professionalType" : [1,2,3],
		// 			"serviceProvided" : [1,2,3]
		// 		},
		// 		{
		// 			"path": "/app/classes/class-attendance",
		// 			"menu_title": "sidebar.classAttendance",
		// 			  "alias" :"classattendance",
		// 				name : 'Class Attendance',
		// 				"clientType" : [1,2],
		// 				"packType" : [2,3],
		// 				"professionalType" : [1,2,3],
		// 				"serviceProvided" : [1,2,3]
		// 		},
		// 		{
		// 			"path": "/app/classes/class-performance",
		// 			"menu_title": "sidebar.classPerformance",
		// 				"alias" :"classperformance",
		// 				name : 'Class Performance',
		// 				"clientType" : [1,2],
		// 				"packType" : [2,3],
		// 				"professionalType" : [1,2,3],
		// 				"serviceProvided" : [1,2,3]
		// 		},
		// 	]
		// },
		// {
		// 	"menu_title": "sidebar.personalTraining",
		// 	"menu_icon": "fa fa-universal-access",
		// 	 "alias" :"personaltraining",
		// 	 name : 'Personal Training',
		// 	 "clientType" : [1,2],
		// 	 "packType" : [2,3],
		// 	 "professionalType" : [1,2,3],
 		// 	"serviceProvided" : [1,2,3],
		// 	"child_routes": [
		// 		{
		// 			"path": "/app/personal-training/pt",
		// 			"extrapath": ["/app/personal-training/pt-room"],
		// 			"menu_title": "sidebar.PT",
		// 				"alias" :"pt",
		// 				name : 'PT & Diet',
		// 				"clientType" : [1,2],
		// 				"packType" : [2,3],
		// 				"professionalType" : [1,2,3],
		// 				"serviceProvided" : [1,2,3]
		// 		},
		// 		{
		// 			"path": "/app/personal-training/pt-schedule",
		// 			"menu_title": "sidebar.ptSchedule",
		// 				"alias" :"ptschedule",
		// 				name : 'PT & Diet Schedule',
		// 				"clientType" : [1,2],
		// 				"packType" : [2,3],
		// 				"professionalType" : [1,2,3],
		// 				"serviceProvided" : [1,2,3]
		// 		},
		// 		{
		// 			"path": "/app/personal-training/pt-attendence",
		// 			"menu_title": "sidebar.ptAttendence",
		// 				"alias" :"ptattendence",
		// 				name : 'PT Attendence',
		// 				"clientType" : [1,2],
		// 				"packType" : [2,3],
		// 				"professionalType" : [1,2,3],
		// 				"serviceProvided" : [1,2,3]
		// 		},
		// 	]
		// },
		// {
		// 	"menu_title": "sidebar.workouts",
		// 	"menu_icon": "fa fa-heartbeat",
		// 	"alias":"workouts",
		// 	name : 'Workouts',
		// 	"clientType" : [1,2],
		// 	"packType" : [3],
		// 	"professionalType" : [1,3],
		// 	"serviceProvided" : [1,2,3],
		// 	"child_routes": [
		// 		{
		// 			"path": "/app/workouts/exercise/0",
		// 			"extrapath" :["/app/workouts/exercise/1"],
		// 			"menu_title": "sidebar.exercise",
		// 			"alias":"exercise",
		// 			name : 'Exercise',
		// 			"clientType" : [1,2],
		// 			"packType" : [3],
		// 			"professionalType" : [1,3],
		// 			"serviceProvided" : [1,2,3]
		// 		},
		// 		{
		// 			"path":"/app/workouts/workout-routine",
		// 			"menu_title": "sidebar.workoutRoutine",
		// 			  "alias" :"workoutroutine",
		// 				name : 'Workout Routine',
		// 				"clientType" : [1,2],
		// 				"packType" : [3],
		// 				"professionalType" : [1,3],
		// 				"serviceProvided" : [1,2,3]
		// 		},
		// 		{
		// 			"path": "/app/workouts/workout-schedule",
		// 			"menu_title": "sidebar.workoutSchedule",
		// 				"alias" :"workoutschedule",
		// 				name : 'Allocate Workout',
		// 				"clientType" : [1,2],
		// 				"packType" : [3],
		// 				"professionalType" : [1,3],
		// 				"serviceProvided" : [1,2,3]
		// 		},
		// ]
		// },
		// {
		// 	"menu_title": "sidebar.diets",
		// 	"menu_icon": "fa fa-cutlery",
		// 	"alias":"diets",
		// 	name : 'Diets',
		// 	"clientType" : [1,2],
		// 	"packType" : [3],
		// 	"professionalType" : [2,3],
		// 	"serviceProvided" : [1,2,3],
		// 	"child_routes": [
		// 		{
		// 			"path": "/app/diets/recipe/0",
		// 			"extrapath" :["/app/diets/recipe/1"],
		// 			"menu_title": "sidebar.recipe",
		// 			"alias":"recipe",
		// 			name : 'Foods',
		// 			"clientType" : [1,2],
		// 			"packType" : [3],
		// 			"professionalType" : [2,3],
		// 			"serviceProvided" : [1,2,3]
		// 		},
		// 		{
		// 			"path":"/app/diets/diet-routine",
		// 			"menu_title": "sidebar.dietRoutine",
		// 			  "alias" :"dietroutine",
		// 				name : 'Diet Routine',
		// 				"clientType" : [1,2],
		// 				"packType" : [3],
		// 				"professionalType" : [2,3],
		// 				"serviceProvided" : [1,2,3]
		// 		},
		// 		{
		// 			"path": "/app/diets/allocate-diet",
		// 			"menu_title": "sidebar.allocateDiet",
		// 				"alias" :"allocatediet",
		// 				name : 'Allocate Diet',
		// 				"clientType" : [1,2],
		// 				"packType" : [3],
		// 				"professionalType" : [2,3],
		// 				"serviceProvided" : [1,2,3]
		// 		},
		// 	]
		// },
		// {
		// 	"menu_title": "sidebar.competition",
		// 	"menu_icon": "ti-cup",
		// 	"alias" :"competition",
		// 	"path": "/app/competition",
		// 	"child_routes": null,
		// 	"clientType" : [1,2],
		// 	"packType" : [1,2,3],
		// 	"professionalType" : [1,2,3]
		// },
		// {
		// 	"menu_title": "sidebar.service",
		// 	"menu_icon": "ti-bookmark-alt",
		// 	"alias" :"service",
		// 	name : 'Service',
		// 	"path": "/app/service",
		// 	"child_routes": null,
		// 	"clientType" : [1,2],
		// 	"packType" : [1,2,3],
		// 	"professionalType" : [1,2,3],
		// 	"serviceProvided" : [1,2,3]
		// },
		// {
		// 	"menu_title": "sidebar.package",
		// 	"menu_icon": "fa fa-gift",
		// 	"alias" :"package",
		// 	name : 'Package',
		// 	"path": "/app/package",
		// 	"child_routes": null,
		// 	"clientType" : [1,2],
		// 	"packType" : [1,2,3],
		// 	"professionalType" : [1,2,3],
		// 	"serviceProvided" : [1,2,3]
		// },
		// {
		// 	"menu_title": "sidebar.productlist",
		// 	"menu_icon": "fa fa-product-hunt",
		// 	"alias" :"product",
		// 	name : 'Product',
		// 	"path": "/app/product",
		// 	"child_routes": null,
		// 	"clientType" : [1],
		// 	"packType" : [2,3],
		// 	"professionalType" : [1,2,3],
		// 	"serviceProvided" : [1,2,3]
		// },
		// {
		// 	"menu_title": "sidebar.equipment",
		// 	"menu_icon": "fa fa-etsy",
		// 	"alias" :"equipment",
		// 	name : 'Equipment',
		// 	"clientType" : [1],
		// 	"packType" : [3],
		// 	"professionalType" : [1,2,3],
		// 	"serviceProvided" : [1,2,3],
		// 	"child_routes": [
		// 		{
		// 			"path": "/app/equipment/brands",
		// 			"menu_title": "sidebar.brands",
		// 			"alias":"equipmentbrands",
		// 			name : 'Equipment Brand',
		// 			"clientType" : [1],
		// 			"packType" : [3],
		// 			"professionalType" : [1,2,3],
		// 			"serviceProvided" : [1,2,3],
		// 		},
		// 		{
		// 			"path": "/app/equipment/equipmentlibrary",
		// 			"menu_title": "sidebar.equipmentlibrary",
		// 				"alias" :"equipmentlibrary",
		// 				name : 'Equipment Library',
		// 				"clientType" : [1],
		// 				"packType" : [3],
		// 				"professionalType" : [1,2,3],
		// 				"serviceProvided" : [1,2,3],
		// 		},
		// 		{
		// 			"path": "/app/equipment/equipmentpurchased",
		// 			"menu_title": "sidebar.equipmentpurchased",
		// 				"alias" :"equipmentpurchased",
		// 				name : 'Equipment Invoice',
		// 				"clientType" : [1],
		// 				"packType" : [3],
		// 				"professionalType" : [1,2,3],
		// 				"serviceProvided" : [1,2,3],
		// 		},
		// 		{
		// 			"path":"/app/equipment/equipmentinstock",
		// 			"menu_title": "sidebar.equipmentinstock",
		// 				"alias" :"equipmentinstock",
		// 				name : 'Equipment In-Stock',
		// 				"clientType" : [1],
		// 				"packType" : [3],
		// 				"professionalType" : [1,2,3],
		// 				"serviceProvided" : [1,2,3],
		// 		},
		// 	]
		// },
		// {
		// 	"menu_title": "sidebar.broadcast",
		// 	"menu_icon": "fa fa-bullhorn",
		// 	"alias" :"broadcast",
		// 	name : 'Broadcast',
		// 	"path": "/app/broadcast",
		// 	"child_routes": null,
		// 	"clientType" : [1,2],
		// 	"packType" : [2,3],
		// 	"professionalType" : [1,2,3],
		// 	"serviceProvided" : [1,2,3]
		// },
		// {
		// 	"menu_title": "sidebar.covid19disclaimer",
		// 	"menu_icon": "ti-write",
		// 	"alias" :"covid19disclaimer",
		// 	name : 'COVID-19 Disclaimer',
		// 	"clientType" : [1],
		// 	"packType" : [3],
		// 	"professionalType" : [1,2,3],
		// 	"serviceProvided" : [2,3],
		// 	"child_routes": [
		// 		{
		// 			"path": "/app/covid19disclaimer/configuration",
		// 			"menu_title": "sidebar.configuration",
		// 			"alias" :"covid19configuration",
		// 			name : 'Configuration',
		// 			"clientType" : [1],
		// 			"packType" : [3],
		// 			"professionalType" : [1,2,3],
		// 			"serviceProvided" : [2,3]
		// 		},
		// 		{
		// 			"path": "/app/covid19disclaimer/memberdisclaimer",
		// 			"menu_title": "sidebar.memberdisclaimer",
		// 			"alias" :"covid19memberdisclaimer",
		// 			name : 'Member Disclaimer',
		// 			"clientType" : [1],
		// 			"packType" : [3],
		// 			"professionalType" : [1,2,3],
		// 			"serviceProvided" : [2,3]
		// 		},
		// 		{
		// 			"path": "/app/covid19disclaimer/staffdisclaimer",
		// 			"menu_title": "sidebar.staffdisclaimer",
		// 				"alias" :"covid19staffdisclaimer",
		// 				name : 'Staff Disclaimer',
		// 				"clientType" : [1],
		// 				"packType" : [3],
		// 				"professionalType" : [1,2,3],
		// 				"serviceProvided" : [2,3]
		// 		},
		// 	]
		// },
		// {
		// 	"menu_title": "sidebar.profileSetting",
		// 	"menu_icon": "fa fa-users",
		// 	"alias" :"employeemanagement",
		// 	name : 'Staff',
		// 	"path": "/app/users/employee-management",
		// 	"extrapath" :["/app/users/user-profileview"] ,
		// 	"child_routes": null,
		// 	"clientType" : [2],
		// 	"packType" : [1,2,3],
		// 	"professionalType" : [1,2,3],
		// 	"serviceProvided" : [1,2,3],
		// },

		{
			"path": "/app/employee-management",
				"menu_icon": "fa fa-users",
			"menu_title": "sidebar.employeeManagement",
			"alias" :"employeemanagement",
			name : 'Manage Staff',
			"clientType" : [1],
			"packType" : [1,2,3],
			"professionalType" : [1,2,3],
			"serviceProvided" : [1,2,3]
		},
		// {
		// 	"menu_title": "sidebar.users",
		// 	"menu_icon": "fa fa-users",
		// 	  "alias" :"staff",
		// 		name : 'Staff',
		// 		"clientType" : [1],
		// 		"packType" : [1,2,3],
		// 		"professionalType" : [1,2,3],
		// 		"serviceProvided" : [1,2,3],
		// 	"child_routes": [
		// 		{
		// 			"path": "/app/users/employee-management",
		// 			"menu_title": "sidebar.employeeManagement",
		// 			"alias" :"employeemanagement",
		// 			name : 'Manage Staff',
		// 			"extrapath" :["/app/users/user-profileview"] ,
		// 			"clientType" : [1],
		// 			"packType" : [1,2,3],
		// 			"professionalType" : [1,2,3],
		// 			"serviceProvided" : [1,2,3]
		// 		},
		// 		// {
		// 		// 	"path": "/app/users/manageshift",
		// 		// 	"menu_title": "sidebar.manageshift",
		// 		// 	"alias" :"manageshift",
		// 		// 	name : 'Manage Shift',
		// 		// 	"clientType" : [1],
		// 		// 	"packType" : [2,3],
		// 		// 	"professionalType" : [1,2,3],
		// 		// 	"serviceProvided" : [1,2,3]
		// 		// },
		// 		// {
		// 		// 	"path": "/app/users/assignshift",
		// 		// 	"menu_title": "sidebar.assignshift",
		// 		// 	"alias" :"assignshift",
		// 		// 	name : 'Assign Shift',
		// 		// 	"clientType" : [1],
		// 		// 	"packType" : [2,3],
		// 		// 	"professionalType" : [1,2,3],
		// 		// 	"serviceProvided" : [1,2,3]
		// 		// },
		// 		// {
		// 		// 	"path": "/app/users/staff-attendance",
		// 		// 	"menu_title": "sidebar.staffAttendance",
		// 		// 	"alias" :"staffattendance",
		// 		// 	name : 'Staff Attendance',
		// 		// 	"clientType" : [1],
		// 		// 	"packType" : [1,2,3],
		// 		// 	"professionalType" : [1,2,3],
		// 		// 	"serviceProvided" : [1,2,3]
		// 		// },
		// 		// {
		// 		// 	"path": "/app/users/biometric/0",
		// 		// 	"menu_title": "sidebar.biometric",
		// 		// 		"alias" :"userbiometric",
		// 		// 		name : 'Biometric',
		// 		// 		"clientType" : [1],
		// 		// 		"extrapath" :[ "/app/users/biometric/1"],
		// 		// 		"packType" : [1,2,3],
		// 		// 		"professionalType" : [1,2,3],
		// 		// 		"serviceProvided" : [2,3]
		// 		// },
		// 	]
		// },
		//{
		// 	"menu_title": "sidebar.expenseManagement",
		// 	"menu_icon": "fa fa-money",
		// 	"alias" :"expensemanagement",
		// 	name : 'Invt. & Exp.',
		// 	"clientType" : [1],
		// 	"packType" : [2,3],
		// 	"professionalType" : [1,2,3],
		// 	"serviceProvided" : [1,2,3],
		// 	"child_routes": [
		// 		{
		// 			"path": "/app/expense-management/expenses",
		// 			"menu_title": "sidebar.expenses",
		// 			"alias" :"expenses",
		// 			name : 'Expenses',
		// 			"clientType" : [1],
		// 			"packType" : [2,3],
		// 			"professionalType" : [1,2,3],
		// 			"serviceProvided" : [1,2,3]
		// 		},
		// 		{
		// 			"path": "/app/expense-management/investment",
		// 			"menu_title": "sidebar.investment",
		// 			"alias" :"investment",
		// 			name : 'Investment',
		// 			"clientType" : [1],
		// 			"packType" : [3],
		// 			"professionalType" : [1,2,3],
		// 			"serviceProvided" : [1,2,3]
		// 		},
		// 		{
		// 			"path": "/app/expense-management/staff-pay",
		// 			"menu_title": "sidebar.staffPay",
		// 			"alias" :"staffPay",
		// 			name : 'Staff Pay',
		// 			"clientType" : [1],
		// 			"packType" : [2,3],
		// 			"professionalType" : [1,2,3],
		// 			"serviceProvided" : [1,2,3]
		// 		},
		// 	]
		// },
		// {
		// 	"menu_title": "sidebar.report",
		// 	"menu_icon": "fa fa-database",
		// 		"alias" :"report",
		// 		name : 'Report',
		// 		"clientType" : [1,2],
		// 		"packType" : [1,2,3],
		// 		"professionalType" : [1,2,3],
		// 		"serviceProvided" : [1,2,3],
		// 	"child_routes": [
		// 		{
		// 			"path": "/app/report/collection-report",
		// 			"menu_title": "sidebar.collectionReport",
		// 			"alias" :"collectionreport",
		// 			name : 'Collection Report',
		// 			"clientType" : [1,2],
		// 			"packType" : [1,2,3],
		// 			"professionalType" : [1,2,3],
		// 			"serviceProvided" : [1,2,3]
		// 		},
		// 		{
		// 			"path": "/app/report/dues-report",
		// 			"menu_title": "sidebar.duesReport",
		// 			"alias" :"duesreport",
		// 			name : 'Dues Report',
		// 			"clientType" : [1,2],
		// 			"packType" : [1,2,3],
		// 			"professionalType" : [1,2,3],
		// 			"serviceProvided" : [1,2,3]
		// 		},
		// 		{
		// 			"path": "/app/report/onlinepayment",
		// 			"menu_title": "sidebar.onlinepayment",
		// 			"alias" :"onlinepayment",
		// 			name : 'Online Payment',
		// 			"clientType" : [1,2],
		// 			"packType" : [3],
		// 			"professionalType" : [1,2,3],
		// 			"serviceProvided" : [1,2,3]
		// 		},
		// 		{
		// 			"path": "/app/report/sold-product",
		// 			"menu_title": "sidebar.soldProduct",
		// 			"alias" :"soldproduct",
		// 			name : 'Sold Product',
		// 			"clientType" : [1],
		// 			"packType" : [2,3],
		// 			"professionalType" : [1,2,3],
		// 			"serviceProvided" : [1,2,3]
		// 		},
		// 		{
		// 			"path": "/app/report/sold-service",
		// 			"menu_title": "sidebar.soldService",
		// 			"alias" :"soldservice",
		// 			name : 'Sold Service',
		// 			"clientType" : [1,2],
		// 			"packType" : [1,2,3],
		// 			"professionalType" : [1,2,3],
		// 			"serviceProvided" : [1,2,3]
		// 		},
		// 		{
		// 			"path": "/app/report/employee-attendancereport",
		// 			"menu_title": "sidebar.employeeAttendancereport",
		// 			"alias" :"employeeattendancereport",
		// 			name : 'Staff Attendance',
		// 			"clientType" : [1],
		// 			"packType" : [1,2,3],
		// 			"professionalType" : [1,2,3],
		// 			"serviceProvided" : [1,2,3]
		// 		},
		// 		{
		// 			"path": "/app/report/member-attendancereport",
		// 			"menu_title": "sidebar.memberAttendancereport",
		// 			"alias" :"memberattendancereport",
		// 			name : 'Member Attendance',
		// 			"clientType" : [1],
		// 			"packType" : [1,2,3],
		// 			"professionalType" : [1,2,3],
		// 			"serviceProvided" : [1,2,3]
		// 		},
		// 		{
		// 			"path": "/app/report/class-attendancereport",
		// 			"menu_title": "sidebar.classAttendancereport",
		// 			"alias" :"classattendancereport",
		// 			name : 'Class Attendance',
		// 			"clientType" : [1,2],
		// 			"packType" : [2,3],
		// 			"professionalType" : [1,2,3],
		// 			"serviceProvided" : [1,2,3]
		// 		},
		// 		{
		// 			"path": "/app/report/pt-attendancereport",
		// 			"menu_title": "sidebar.ptAttendancereport",
		// 			"alias" :"ptattendancereport",
		// 			name : 'PT Attendance',
		// 			"clientType" : [1,2],
		// 			"packType" : [2,3],
		// 			"professionalType" : [1,2,3],
		// 			"serviceProvided" : [1,2,3]
		// 		},
		// 		{
		// 			"path": "/app/report/enquiry-followupreport",
		// 			"menu_title": "sidebar.enquiryFollowupreport",
		// 			"alias" :"enquiryfollowupreport",
		// 			name : 'Enquiry Followup',
		// 			"clientType" : [1,2],
		// 			"packType" : [1,2,3],
		// 			"professionalType" : [1,2,3],
		// 			"serviceProvided" : [1,2,3]
		// 		},
		// 		{
		// 			"path": "/app/report/member-followupreport",
		// 			"menu_title": "sidebar.memberFollowupreport",
		// 			"alias" :"memberfollowupreport",
		// 			name : 'Member Followup',
		// 			"clientType" : [1,2],
		// 			"packType" : [1,2,3],
		// 			"professionalType" : [1,2,3],
		// 			"serviceProvided" : [1,2,3]
		// 		},
		// 		{
		// 			"path": "/app/report/active-membershipreport",
		// 			"menu_title": "sidebar.activeMembershipreport",
		// 			"alias" :"activemembershipreport",
		// 			name : 'Active Subscription',
		// 			"clientType" : [1,2],
		// 			"packType" : [1,2,3],
		// 			"professionalType" : [1,2,3],
		// 			"serviceProvided" : [1,2,3]
		// 		},
		// 		{
		// 			"path": "/app/report/membershipreport",
		// 			"menu_title": "sidebar.membershipreport",
		// 			"alias" :"membershipreport",
		// 			name : 'Subscription History',
		// 			"clientType" : [1,2],
		// 			"packType" : [1,2,3],
		// 			"professionalType" : [1,2,3],
		// 			"serviceProvided" : [1,2,3]
		// 		},
		// 		{
		// 			"path": "/app/report/gym-accessslot-report",
		// 			"menu_title": "sidebar.gymAccessSlotreport",
		// 			"alias" :"gymaccessslotreport",
		// 			name : 'Gym Access Slot',
		// 			"clientType" : [1],
		// 			"packType" : [1,2,3],
		// 			"professionalType" : [1,2,3],
		// 			"serviceProvided" : [2,3]
		// 		},
		// 		{
		// 			"path": "/app/report/visitorbook-report",
		// 			"menu_title": "sidebar.visitorbookReport",
		// 			"alias" :"visitorbookreport",
		// 			name : 'Visitor Book History',
		// 			"clientType" : [1],
		// 			"packType" : [3],
		// 			"professionalType" : [1,2,3],
		// 			"serviceProvided" : [2,3]
		// 		},
		// 		{
		// 			"path": "/app/report/notification",
		// 			"menu_title": "sidebar.notification",
		// 			"alias" :"notificationreport",
		// 			name : 'Notification Report',
		// 			"clientType" : [1,2],
		// 			"packType" : [1,2,3],
		// 			"professionalType" : [1,2,3],
		// 			"serviceProvided" : [1,2,3]
		// 		},
		//
		// 	]
		// },
		{
			"menu_title": "sidebar.setting",
			"menu_icon": "fa fa-cogs",
			"alias" :"setting",
			name : 'Settings',
			"clientType" : [1,2],
			"packType" : [1,2,3],
			"professionalType" : [1,2,3],
			"serviceProvided" : [1,2,3],
			"child_routes": [
				// {
				// 	"path": "/app/setting/zone",
				// 	"menu_title": "sidebar.zone",
				// 	"alias" :"zone",
				// 	name : 'Zone',
				// 	"clientType" : [1],
				// 	"packType" : [1,2,3],
				// 	"professionalType" : [1,2,3],
				// 	"serviceProvided" : [1,2,3]
				// },
				// {
				// 	"path": "/app/setting/branch",
				// 	"menu_title": "sidebar.branch",
				// 	"alias" :"branch",
				// 	name : 'Branch',
				// 	"clientType" : [1],
				// 	"packType" : [1,2,3],
				// 	"professionalType" : [1,2,3],
				// 	"serviceProvided" : [1,2,3]
				// },
				{
					"path": "/app/setting/organization/0",
					"menu_title": "sidebar.organization",
					"extrapath" :["/app/setting/organization/1","/app/setting/organization/2","/app/setting/organization/3","/app/setting/organization/4"],
					"alias" :"organization",
					name : 'Organization',
					"clientType" : [1,2],
					"packType" : [1,2,3],
					"professionalType" : [1,2,3],
					"serviceProvided" : [1,2,3]
				},
				// {
				// 	"path": "/app/setting/advertisement",
				// 	"menu_title": "sidebar.advertisement",
				// 	"alias" :"advertisement",
				// 	name : 'Advertisement',
				// 	"clientType" : [1,2],
				// 	"packType" : [3],
				// 	"professionalType" : [1,2,3],
				// 	"serviceProvided" : [1,2,3]
				// },
				// {
				// 	"path": "/app/setting/resultandtestimonial",
				// 	"menu_title": "sidebar.resultandtestimonial",
				// 	"alias" :"resultandtestimonial",
				// 	name : 'Result And Testimonial',
				// 	"clientType" : [1,2],
				// 	"packType" : [3],
				// 	"professionalType" : [1,2,3],
				// 	"serviceProvided" : [1,2,3]
				// },
				// {
				// 	"path": "/app/setting/poster",
				// 	"menu_title": "sidebar.poster",
				// 	"alias" :"poster",
				// 	name : 'Poster',
				// 	"clientType" : [1],
				// 	"packType" : [3],
				// 	"professionalType" : [1,2,3],
				// 	"serviceProvided" : [1,2,3]
				// },
				// {
				// 	"path": "/app/setting/budget",
				// 	"menu_title": "sidebar.budget",
				// 	"alias" :"budget",
				// 	name : 'Budget',
				// 	"clientType" : [1],
				// 	"packType" : [3],
				// 	"professionalType" : [1,2,3],
				// 	"serviceProvided" : [1,2,3]
				// },
				// {
				// 	"path": "/app/setting/disclaimer/0",
				// 	"menu_title": "sidebar.disclaimer",
				// 	"extrapath" :["/app/setting/disclaimer/1","/app/setting/disclaimer/2"],
				// 	"alias" :"disclaimer",
				// 	name : 'Disclaimer',
				// 	"clientType" : [1],
				// 	"packType" : [3],
				// 	"professionalType" : [1,2,3],
				// 	"serviceProvided" : [1,2,3]
				// },
				{
					"path": "/app/setting/branding",
					"menu_title": "sidebar.branding",
					"alias" :"branding",
					name : 'Branding',
					"clientType" : [1,2],
					"packType" : [1,2,3],
					"professionalType" : [1,2,3],
					"serviceProvided" : [1,2,3]
				},
				// {
				// 	"path": "/app/setting/integration",
				// 	"menu_title": "sidebar.integration",
				// 	"alias" :"integration",
				// 	name : 'Integration',
				// 	"clientType" : [1,2],
				// 	"packType" : [1,2,3],
				// 	"professionalType" : [1,2,3],
				// 	"serviceProvided" : [1,2,3]
				// },
				{
					"path": "/app/setting/role",
					"menu_title": "sidebar.role",
					"alias" :"role",
					name : 'Role',
					"clientType" : [1],
					"packType" : [1,2,3],
					"professionalType" : [1,2,3],
					"serviceProvided" : [1,2,3]
				},
				// {
				// 	"path": "/app/setting/template-configuration/0",
				// 	"menu_title": "sidebar.templateConfiguration",
				// 	"extrapath" :["/app/setting/template-configuration/1", "/app/setting/template-configuration/2", "/app/setting/template-configuration/3"],
				// 	"alias" :"templateconfiguration",
				// 	name : 'Notification',
				// 	"clientType" : [1,2],
				// 	"packType" : [1,2,3],
				// 	"professionalType" : [1,2,3],
				// 	"serviceProvided" : [1,2,3]
				// }
			]
		},
		{
			"path": "/app/change-password",
				"menu_icon": "fa fa-unlock-alt",
			"menu_title": "sidebar.changePassword",
			"alias" :"changepassword",
			name : 'Change Password',
			"clientType" : [1],
			"packType" : [1,2,3],
			"professionalType" : [1,2,3],
			"serviceProvided" : [1,2,3]
		},
		{
			"path": "/signin",
				"menu_icon": "fa fa-sign-out",
			"menu_title": "sidebar.logOut",
			"alias" :"logout",
			name : 'Logout',
			"clientType" : [1],
			"packType" : [1,2,3],
			"professionalType" : [1,2,3],
			"serviceProvided" : [1,2,3]
		}

	]
}
