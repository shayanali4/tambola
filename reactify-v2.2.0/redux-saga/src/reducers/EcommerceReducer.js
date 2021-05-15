import {calculateExpiryDate,getDiscount,getTaxValues,getLocalDate} from 'Helpers/helpers';
import Auth from '../Auth/Auth';
const authObject = new Auth();
import update from 'react-addons-update';

import {
	ON_DELETE_ITEM_FROM_CART,
	ON_QUANTITY_CHANGE,
	ON_ADD_ITEM_TO_CART,
	ON_EMPLOYEE_CHANGE,
	GET_SERVICE_HIT_DETAIL,
	GET_SERVICE_HIT_DETAIL_SUCCESS,
	REQUEST_SUCCESS,
	REQUEST_FAILURE,
	ON_SHOW_LOADER,
	ON_HIDE_LOADER,
	ON_DATE_CHANGE,
	GET_MEMBER_DETAILS,
	GET_MEMBER_DETAILS_SUCCESS,
	SAVE_MEMBER_DETAIL,
	GET_ENQUIRY_DETAILS,
	GET_ENQUIRY_DETAILS_SUCCESS,
	SAVE_SUBSCRIPTION_DETAILS,
	SAVE_SUBSCRIPTION_DETAILS_SUCCESS,
	SAVE_INSTALLMENT_DETAIL,
	GET_PRODUCT_HIT_DETAIL,
	GET_PRODUCT_HIT_DETAIL_SUCCESS,
	ON_EMPLOYEELIST,
	ON_EMPLOYEELIST_SUCCESS,
	GET_PACKAGE_HIT_DETAIL,
	GET_PACKAGE_HIT_DETAIL_SUCCESS,
	OPEN_ADD_NEW_AVAILABLESERVICE_MODEL,
	OPEN_ADD_NEW_AVAILABLESERVICE_MODEL_SUCCESS,
	CLOSE_ADD_NEW_AVAILABLESERVICE_MODEL,
	ON_DISCOUNT_CHANGE,
	CART_EMPTY,
	ON_TOTALPROCE_CHANGE,
	ON_CLOSE_CHANGESALE_TRANSFER,
	ON_ASSIGNTRAINER_CHANGE,
	ON_COMPLEMENTCATEGORY_CHANGE,
	
	GET_UNFINISHEDCART_LIST,
    GET_UNFINISHEDCART_LIST_SUCCESS,
	OPEN_UNFINISHEDCART_IN_EXPRESSSALE,
} from "../actions/types";


//let clientProfileDetail = authObject.getClientProfile();

const INIT_STATE = {
	cart: [],
	services:null,
	products:null,
	packages:null,
	packageincart : null,
	tableInfo : {
		pageSize : 12,
		pageIndex : 0,
		pages : 1,
	},
	tableInfoProduct : {
		pageSize : 12,
		pageIndex : 0,
		pages : 1,
	},
	tableInfoPackage : {
		pageSize : 12,
		pageIndex : 0,
		pages : 1,
	},
	loading : false,
	disabled : false,
	dialogLoading : false,
	selectedmember:null,
	installments:null,
	employeeList : null,
	salesby :null,
	discounttypeId : "2",
	clientProfileDetail : authObject.getClientProfile(),
	invoiceid : '',
	Ischangeservice : false,
	isChangeSaleMemberSet : false,
	invoiceDate : getLocalDate(new Date()),
	unfinishedcartlist:null,
	tableInfoUnfinishedCart : {
        pageSize : 10,
        pageIndex : 0,
        pages : 1,
        totalrecord :0,
      },
	unfinishedcartid : null,  
}

export default (state = INIT_STATE, action) => {
	switch (action.type) {

		case GET_SERVICE_HIT_DETAIL:

			let tableInfo = state.tableInfo;
			tableInfo.filtered = action.payload ? action.payload.filtered : [];
			tableInfo.pageIndex = action.payload ? action.payload.pageIndex : 0;
			tableInfo.isExpressSale  = action.payload && action.payload.isExpressSale ? action.payload.isExpressSale : false ;

		return { ...state , tableInfo : tableInfo};

		case GET_SERVICE_HIT_DETAIL_SUCCESS:
						let services = action.payload.data;
						services.map((x) => { x.images = x.images ? JSON.parse(x.images): '';
						});
						let servicepages = action.payload.pages.length > 0 ? action.payload.pages[0].pages : 1;

						let clientProfileDetail = authObject.getClientProfile();

			return { ...state, services: services ,clientProfileDetail:clientProfileDetail,
				discounttypeId : clientProfileDetail && clientProfileDetail.discounttypeId.toString(),
				tableInfo : {...state.tableInfo , pages : servicepages}};

		case ON_DELETE_ITEM_FROM_CART:
			let index = state.cart.indexOf(action.payload)
			return update(state, {
				cart: {
					$splice: [[index, 1]]
				}
			});

		case ON_QUANTITY_CHANGE:
		{
			state.clientProfileDetail = state.clientProfileDetail || authObject.getClientProfile();
			let cartItemIndex = state.cart.indexOf(action.payload.cartItem);
			let qty = action.payload.quantity < 0 ? 0 : action.payload.quantity;
				let cartItem = action.payload.cartItem;

				if(qty > 0 && ( cartItem.discount > 0 || cartItem.specialprice > 0))
				{

					if(cartItem.specialprice > 0  &&  qty > 0 && cartItem.discounttypeId == "1")
					{
						 if(cartItem.Quantity > 0)
						 {
							 if(qty > cartItem.Quantity)
							 {
									 cartItem.discount = cartItem.discount / (qty - 1) * qty;
							 }
							 else {
								 cartItem.discount = cartItem.discount / (qty + 1) * qty;
							 }
						 }

					}

						let  { discount,discountedprice} = getDiscount(cartItem.discounttypeId,cartItem.discount ,  cartItem.confiqurationbaseprice, qty ) ;
					 	cartItem.discountedprice =discount;

						 if(state.clientProfileDetail && state.clientProfileDetail.istaxenable && cartItem.taxpercentage && discountedprice > 0)
						 {
							 let {basePrice ,tax, totalPrice} = getTaxValues(1 , cartItem.taxpercentage ,  discountedprice);
							 cartItem.taxamount = tax;
							 cartItem.baseprice = basePrice;
							 cartItem.totalPrice = totalPrice;
						 }
						 else{
							 cartItem.taxamount = 0;
								cartItem.baseprice = discountedprice;
								cartItem.totalPrice = discountedprice;
							}
				}
				else {
					 cartItem.discountedprice = "";
					 	 let	confiqurationprice =	cartItem.confiqurationprice * qty;
						 if(state.clientProfileDetail && state.clientProfileDetail.istaxenable && cartItem.taxpercentage)
						 {
							 let {basePrice ,tax, totalPrice} = getTaxValues(2 , cartItem.taxpercentage ,  confiqurationprice);
							 cartItem.taxamount = tax;
							 cartItem.baseprice = basePrice;
							 cartItem.totalPrice = totalPrice;
						 }
						 else{
								cartItem.baseprice = confiqurationprice.toFixed(2);
								cartItem.totalPrice = confiqurationprice.toFixed(2);
							}
				 }

					return update(state, {
						cart: {
							[cartItemIndex]: {
								Quantity: { $set: qty },
								discountedprice : {$set : cartItem.discountedprice},
								totalPrice: { $set: cartItem.totalPrice},
								taxamount : {$set : cartItem.taxamount},
								price : {$set : (cartItem.confiqurationprice * qty).toFixed(2)},
								baseprice : {$set : cartItem.baseprice }
							}
					}
				});
		}

		case ON_DATE_CHANGE:
			{
				let cartItemIndex = state.cart.indexOf(action.payload.cartItem);
				let {cartItem, date} = action.payload;
				let expirydate=calculateExpiryDate(date,cartItem.durationcount,cartItem.duration);

				return update(state, {
					cart: {
						[cartItemIndex]: {
							startDate: { $set: action.payload.date },
							expiryDate: { $set: expirydate}
						}}
				});
			}

			case ON_EMPLOYEE_CHANGE:
			{
				if(action.payload.employee == "salesby"){
					return update(state, {
								salesby: { $set: action.payload.cartItem },
						},
					)
				}
				else if (action.payload.employee == "invoiceDate") {
					return update(state, {
								invoiceDate: { $set: action.payload.cartItem },
						},
					)
				}

			}

		case ON_ADD_ITEM_TO_CART:
					if(Array.isArray(action.payload)){

															 let {cart} = state;
															 let {clientProfileDetail} = state;
															 action.payload.forEach(x => {


																 if(clientProfileDetail && clientProfileDetail.istaxenable && x.taxcategoryid)
																 {
																	 let {basePrice ,tax, totalPrice} = getTaxValues(2 , x.taxpercentage , x.price);
																	 x.taxamount = tax;
																	 x.baseprice = basePrice;
																	 x.totalPrice = totalPrice;
																 }
																 else {
																	 x.taxamount = 0;
																	 x.baseprice = x.price;
																	 x.totalPrice = x.price;
																 }

																 x.confiqurationprice = x.totalPrice;
																 x.confiqurationbaseprice  = x.baseprice;

																 x.taxamount = x.taxamount * x.Quantity;
																 x.baseprice = x.baseprice * x.Quantity;
																 x.totalPrice = x.totalPrice * x.Quantity;
																 x.price =  x.totalPrice;
																 x.creditedamount  = x.creditedamount || 0;
																 x.description  = x.servicetype;
						 										 x.brand = x.sessiontype;
						 										 x.activitytype =x.activity;
 						 									   x.isComplimentary = x.iscomplimentaryservice;

															 x.discount = x.discount || '';
															 x.discountedprice = x.discountedprice || '';
															 x.taxname = x.taxname;
															 x.taxpercentage =  x.taxpercentage || 0;
															 x.taxcategoryid = x.taxcategoryid || 0;
															 x.membershipid = x.membershipid;
															 let expirydate = null;
														 	 if(x.startDate){
														 		expirydate=calculateExpiryDate(x.startDate,x.durationcount,x.duration);
														 	}
															x.startDate =x.startDate || null;
															x.expiryDate =  expirydate;

															 x.specialprice =  x.specialprice || 0;

															 if(x.specialprice > 0)
															 {
																		 x.discountedprice = (x.confiqurationbaseprice * x.Quantity) - (x.specialprice * x.Quantity * 100)/(100 + (x.taxpercentage))
																		 x.discountedprice = parseFloat(x.discountedprice.toFixed(2));
																		 x.discounttypeId = state.discounttypeId;
																		 if(x.discounttypeId == 1)
																		 {
																			x.discount = x.discountedprice;
																		 }
																		 else if(x.discounttypeId == 2) {
																			 x.discount  = x.discountedprice * 100 / (x.confiqurationbaseprice  * x.Quantity);
																			 x.discount = parseFloat(x.discount.toFixed(2));
																		 }

																		 if(clientProfileDetail && clientProfileDetail.istaxenable && x.taxcategoryid)
																		 {
																			 let {basePrice ,tax, totalPrice} = getTaxValues(2 , x.taxpercentage , x.specialprice * x.Quantity);
																			 x.taxamount = tax;
																			 x.baseprice = basePrice;
																			 x.totalPrice = totalPrice;
																		 }
																		 else {
																			 x.taxamount = 0;
																			 x.baseprice = x.specialprice * x.Quantity;
																			 x.totalPrice = x.specialprice * x.Quantity;
																		 }
															 }
															 });


															 cart = cart.concat(action.payload);
															 return { ...state, cart: cart,clientProfileDetail:clientProfileDetail};

			 }
			 else
			 {
						      let newCartItem = {};
									let {cart} = state;
									newCartItem.isService = action.payload.isService;
									newCartItem.Quantity = '1';
									newCartItem.discounttypeId = state.discounttypeId;
									state.clientProfileDetail = authObject.getClientProfile();
									newCartItem.creditedamount  = action.payload.creditedamount || 0;
									let price =  action.payload.price - newCartItem.creditedamount;
									price = price > 0 ? price : 0;

									if(state.clientProfileDetail && state.clientProfileDetail.istaxenable && action.payload.taxcategoryid)
									{
											let {basePrice ,tax, totalPrice} = getTaxValues(2 , action.payload.taxpercentage , price);
											newCartItem.taxamount = tax;
											newCartItem.baseprice = basePrice;
											newCartItem.totalPrice = totalPrice || 0;
									}
									else {
											newCartItem.taxamount = 0;
											newCartItem.baseprice = price;
											newCartItem.totalPrice = price;
									}

									 newCartItem.objectID = action.payload.id;
									 newCartItem.discount = action.payload.discount || '';
								 	 newCartItem.discountedprice = action.payload.discountedprice || '';

									//	newCartItem.taxname = action.payload.taxname;
									 newCartItem.taxpercentage =  action.payload.taxpercentage || 0;
									 newCartItem.taxid = action.payload.taxid;
								 	 newCartItem.taxcategoryid = action.payload.taxcategoryid || 0;

									 newCartItem.confiqurationprice = action.payload.price;
								   newCartItem.confiqurationbaseprice  = newCartItem.baseprice;
									 newCartItem.price =  newCartItem.totalPrice;
									 newCartItem.discountlimit = action.payload.maxdiscountlimit;

									 newCartItem.specialprice =  action.payload.specialprice || 0;

									 if(newCartItem.specialprice > 0)
									 {
									 		 newCartItem.discountedprice = ((newCartItem.confiqurationbaseprice)  * newCartItem.Quantity) - ((newCartItem.specialprice - newCartItem.creditedamount )* newCartItem.Quantity * 100)/(100 + (newCartItem.taxpercentage))
									 		 newCartItem.discountedprice = parseFloat(newCartItem.discountedprice.toFixed(2));
									 		 if(newCartItem.discounttypeId == 1)
									 		 {
									 			 newCartItem.discount = newCartItem.discountedprice;
									 		 }
									 		 else if(newCartItem.discounttypeId == 2) {
									 				newCartItem.discount  = newCartItem.discountedprice * 100 / ((newCartItem.confiqurationbaseprice)  * newCartItem.Quantity);
									 				newCartItem.discount = parseFloat(newCartItem.discount.toFixed(2));
									 			}


									 			if(state.clientProfileDetail && state.clientProfileDetail.istaxenable && action.payload.taxcategoryid)
									 			{
									 				let {basePrice ,tax, totalPrice} = getTaxValues(2 , action.payload.taxpercentage , (newCartItem.specialprice - newCartItem.creditedamount));
									 				newCartItem.taxamount = tax;
									 				newCartItem.baseprice = basePrice;
									 				newCartItem.totalPrice = totalPrice;
									 			}
									 			else {
									 				newCartItem.taxamount = 0;
									 				newCartItem.baseprice = newCartItem.specialprice;
									 				newCartItem.totalPrice = newCartItem.specialprice;
									 			}
									 		}

									if(action.payload.isService == true ){
										let expirydate = null;
										if(action.payload.startDate){
											expirydate=calculateExpiryDate(action.payload.startDate,action.payload.durationcount,action.payload.duration);
										}
						      	newCartItem.name = action.payload.servicename;
										newCartItem.description  = action.payload.servicetype;
										newCartItem.brand = action.payload.sessiontype;
										newCartItem.duration  = action.payload.duration;
										newCartItem.durationcount  = action.payload.durationcount;
										newCartItem.servicetypeId  = action.payload.servicetypeId;
										newCartItem.activitytype = action.payload.activity;
										newCartItem.activitytypeId = action.payload.activitytypeId;
										newCartItem.sessiontypeId = action.payload.sessiontypeId;
										newCartItem.startDate = action.payload.startDate;

										newCartItem.expiryDate = newCartItem.creditedamount > 0 ? action.payload.expiryDate : expirydate;
										newCartItem.isComplimentary = action.payload.iscomplimentaryservice;
										newCartItem.assigntrainerid = action.payload.assigntrainerid || 0;
										newCartItem.sessioncount  = action.payload.sessioncount;
										newCartItem.ptcommissiontype = action.payload.ptcommissiontype || null;
										newCartItem.ptcommssion = action.payload.ptcommssion || 0;
										newCartItem.membershipaccesslimit  = action.payload.membershipaccesslimit || null;

									}
									else if(action.payload.isService == false){
										newCartItem.name = action.payload.productname;
										newCartItem.description = action.payload.description;
										newCartItem.category = action.payload.category;
										newCartItem.availablequantity = action.payload.quantity;
										newCartItem.isComplimentary = action.payload.iscomplimentaryproduct;
						      }

							return update(state, {
								cart: {
									$push: [newCartItem]
								},
							});
		}
			case REQUEST_FAILURE:
							 return { ...state , loading : false, dialogLoading : false, disabled : false};
					 case REQUEST_SUCCESS:
										 return { ...state, loading : false, dialogLoading : false, disabled : false};
					 case ON_SHOW_LOADER:
									 return { ...state, loading : true, disabled : true};
						case ON_HIDE_LOADER:
								 return { ...state, loading : false, dialogLoading : false, disabled : false};
					 case GET_MEMBER_DETAILS :
                 return { ...state, loading : true , selectedmember : null};
	         case GET_MEMBER_DETAILS_SUCCESS:

					 			state.clientProfileDetail = authObject.getClientProfile();

								let selectedmember = action.payload.data[0];
								if(state.clientProfileDetail && state.clientProfileDetail.salesbasedonrepresentative == "1" && selectedmember)
								{
									state.salesby = selectedmember.salesbyid || '';
								}

                 return { ...state,selectedmember:selectedmember , salesby : state.salesby};
					 case SAVE_MEMBER_DETAIL:
		 		         return { ...state,  dialogLoading : true, selectedmember : action.payload , isChangeSaleMemberSet : true };
					 case GET_ENQUIRY_DETAILS :
			            return { ...state, loading : true ,selectedmember : null};
		       case GET_ENQUIRY_DETAILS_SUCCESS:
							 state.clientProfileDetail = authObject.getClientProfile();

							 let selectedenquiry = action.payload.data[0];
							 if(state.clientProfileDetail && state.clientProfileDetail.salesbasedonrepresentative == "1" && selectedenquiry)
							 {
								 state.salesby = selectedenquiry.attendedbyid || '';
							 }

								return { ...state,selectedmember:selectedenquiry , salesby : state.salesby};
				   case SAVE_SUBSCRIPTION_DETAILS:
									return { ...state,  dialogLoading : true, disabled : true };
			  	 case SAVE_SUBSCRIPTION_DETAILS_SUCCESS:

						  		 return { ...state, dialogLoading : false,selectedmember : null, disabled : false,cart : [] ,invoiceid:action.payload ?  action.payload.data : '',installments : null,isChangeSaleMemberSet : false};
					 case SAVE_INSTALLMENT_DETAIL:
					         return { ...state, installments : action.payload };

					 case GET_PRODUCT_HIT_DETAIL:
									let tableInfoProduct = state.tableInfo;
									tableInfoProduct.filtered = action.payload ? action.payload.filtered : [];
								  tableInfoProduct.pageIndex  = action.payload ? action.payload.pageIndex : 0;
									tableInfoProduct.isExpressSale  = action.payload && action.payload.isExpressSale ? action.payload.isExpressSale : false ;
							 return { ...state , tableInfoProduct : tableInfoProduct};

 		 			 case GET_PRODUCT_HIT_DETAIL_SUCCESS:

					 				let products = action.payload.data;
									products.map((x) =>  x.images = x.images ? JSON.parse(x.images) : '');
									let pages = action.payload.pages.length > 0 ? action.payload.pages[0].pages : 1;
								  state.clientProfileDetail = state.clientProfileDetail  || authObject.getClientProfile();

						  return { ...state, products: products, clientProfileDetail:state.clientProfileDetail,  discounttypeId : state.clientProfileDetail && state.clientProfileDetail.discounttypeId.toString(), tableInfoProduct : {...state.tableInfoProduct , pages : pages}};

					case ON_EMPLOYEELIST :
												return { ...state};
					 case ON_EMPLOYEELIST_SUCCESS:
					 {
					 			let employeeList = action.payload.employeeList;

								employeeList = employeeList ? employeeList.map(x => { x.value = x.id;  x.label = x.label + " - " + x.employeecode; return x; }) : []

								let profileDetail = authObject.getProfile();
				 				return { ...state, employeeList:employeeList,salesby : profileDetail.id};
						}
						case ON_TOTALPROCE_CHANGE:
						{
								let {cart} = state;

								let cartItemIndex = cart.indexOf(action.payload.cartItem);
								let cartItem = action.payload.cartItem;

									 if(state.clientProfileDetail && state.clientProfileDetail.istaxenable && cartItem.taxpercentage)
									 {

										 cartItem.discountedprice = "";
										 let	confiqurationprice =	(cartItem.confiqurationprice - cartItem.creditedamount) * cartItem.Quantity;
										 cartItem.totalPrice =  action.payload.value > confiqurationprice ? confiqurationprice : action.payload.value;

										cartItem.discountedprice = (cartItem.confiqurationbaseprice * cartItem.Quantity) - (cartItem.totalPrice * 100)/(100 + (cartItem.taxpercentage))
										cartItem.discountedprice = parseFloat(cartItem.discountedprice.toFixed(2));
										if(cartItem.discounttypeId == 1)
										{
											cartItem.discount = cartItem.discountedprice;
										}
										else if(cartItem.discounttypeId == 2) {
											cartItem.discount  = cartItem.discountedprice * 100 / (cartItem.confiqurationbaseprice  * cartItem.Quantity);
											cartItem.discount = parseFloat(cartItem.discount.toFixed(2));
										}

										 let {basePrice ,tax, totalPrice} = getTaxValues(2 , cartItem.taxpercentage ,  cartItem.totalPrice);
										 cartItem.taxamount = tax;
										 cartItem.baseprice = basePrice;
										 cartItem.totalPrice = totalPrice;

											return update(state, {
												cart: {
													[cartItemIndex]: {
														discount: { $set: cartItem.discount },

														discountedprice : {$set : cartItem.discountedprice},
														totalPrice: { $set: cartItem.totalPrice},
														taxamount : {$set : cartItem.taxamount},
														baseprice : {$set : cartItem.baseprice }
													}}
											});
							 }
							 else if(state.clientProfileDetail && !state.clientProfileDetail.istaxenable){
								 cartItem.discountedprice = "";
								 let	confiqurationprice =	cartItem.confiqurationprice * cartItem.Quantity;
								 cartItem.totalPrice =  action.payload.value > confiqurationprice ? confiqurationprice : action.payload.value;

								cartItem.discountedprice = (cartItem.confiqurationbaseprice * cartItem.Quantity) - (cartItem.totalPrice * 100)/100;
								cartItem.discountedprice = parseFloat(cartItem.discountedprice.toFixed(2));
								if(cartItem.discounttypeId == 1)
								{
									cartItem.discount = cartItem.discountedprice;
								}
								else if(cartItem.discounttypeId == 2) {
									cartItem.discount  = cartItem.discountedprice * 100 / (cartItem.confiqurationbaseprice  * cartItem.Quantity);
									cartItem.discount = parseFloat(cartItem.discount.toFixed(2));
								}

								 let {basePrice ,tax, totalPrice} = getTaxValues(2 , cartItem.taxpercentage ,  cartItem.totalPrice);
								 cartItem.taxamount = tax;
								 cartItem.baseprice = basePrice;
								 cartItem.totalPrice = totalPrice;

									return update(state, {
										cart: {
											[cartItemIndex]: {
												discount: { $set: cartItem.discount },

												discountedprice : {$set : cartItem.discountedprice},
												totalPrice: { $set: cartItem.totalPrice},
												taxamount : {$set : cartItem.taxamount},
												baseprice : {$set : cartItem.baseprice }
											}}
									});

							 }

						}
						case ON_DISCOUNT_CHANGE:
							{
								let {cart} = state;
								state.clientProfileDetail = state.clientProfileDetail || authObject.getClientProfile();
								if(action.payload.key == 'discounttypeId'){
									let discounttypeid = action.payload.discount;
										cart.forEach(cartItem => {
											if(cartItem.Quantity > 0)
											{
												cartItem.discounttypeId = discounttypeid;
												if(cartItem.discount)
												{
													if(discounttypeid == 2)
													{
														cartItem.discount = (cartItem.discount)/((cartItem.confiqurationbaseprice - cartItem.creditedamount) * cartItem.Quantity) *100;
													}
														let  { discount,discountedprice} = getDiscount(discounttypeid, cartItem.discount ,  (cartItem.confiqurationbaseprice - cartItem.creditedamount), cartItem.Quantity ) ;
														cartItem.discountedprice = discount > 0 ? discount : '' ;
														if(state.clientProfileDetail && state.clientProfileDetail.istaxenable && cartItem.taxpercentage && discountedprice > 0)
														{
																let {basePrice ,tax, totalPrice} = getTaxValues(1 , cartItem.taxpercentage ,  discountedprice);
																cartItem.taxamount = tax;
																cartItem.baseprice = basePrice;
																cartItem.totalPrice = totalPrice;
														}
														else
														{
															cartItem.taxamount = 0;
															cartItem.baseprice = discountedprice;
															cartItem.totalPrice = discountedprice;
														}
													}
													else {
														cartItem.discountedprice = "";
															let	confiqurationprice =	(cartItem.confiqurationprice - cartItem.creditedamount) * cartItem.Quantity;
															if(state.clientProfileDetail && state.clientProfileDetail.istaxenable && cartItem.taxpercentage)
															{
																let {basePrice ,tax, totalPrice} = getTaxValues(2 , cartItem.taxpercentage ,  (cartItem.confiqurationprice - cartItem.creditedamount) * cartItem.Quantity);
																cartItem.taxamount = tax;
																cartItem.baseprice = basePrice;
																cartItem.totalPrice = totalPrice;
															}
															else{
																 cartItem.baseprice = confiqurationprice.toFixed(2);
																 cartItem.totalPrice = confiqurationprice.toFixed(2);
															 }
													}
											}
										});
										return update(state, {
											discounttypeId: {	$set: discounttypeid	},
												cart : { $set: cart }
									 });
									}
									else{

										let cartItemIndex = state.cart.indexOf(action.payload.cartItem);
										let cartItem = action.payload.cartItem;

										if(cartItem.Quantity > 0)
										{
											if(action.payload.discount)
											{
												let  { discount,discountedprice} = getDiscount(cartItem.discounttypeId, action.payload.discount ,  cartItem.confiqurationbaseprice, cartItem.Quantity ) ;
												cartItem.discountedprice = discount;

												if(state.clientProfileDetail && state.clientProfileDetail.istaxenable && cartItem.taxcategoryid && discountedprice > 0)
												{
													let {basePrice ,tax, totalPrice} = getTaxValues(1 , cartItem.taxpercentage ,  discountedprice);

													cartItem.taxamount = tax;
													cartItem.baseprice = basePrice;
													cartItem.totalPrice = totalPrice;
												}
												else{
													 cartItem.taxamount = 0;
													 cartItem.baseprice = discountedprice;
													 cartItem.totalPrice = discountedprice;
												}
										 }
										 else {
											 cartItem.discountedprice = "";
											 let	confiqurationprice =	(cartItem.confiqurationprice - cartItem.creditedamount)  * cartItem.Quantity;
											 if(state.clientProfileDetail && state.clientProfileDetail.istaxenable && cartItem.taxpercentage)
											 {
												 let {basePrice ,tax, totalPrice} = getTaxValues(2 , cartItem.taxpercentage ,  (cartItem.confiqurationprice - cartItem.creditedamount) * cartItem.Quantity);
												 cartItem.taxamount = tax;
												 cartItem.baseprice = basePrice;
												 cartItem.totalPrice = totalPrice;
											 }
											 else{
												 cartItem.baseprice = confiqurationprice.toFixed(2);
												 cartItem.totalPrice = confiqurationprice.toFixed(2);
												}
										 }
										}

													return update(state, {
														cart: {
															[cartItemIndex]: {
																discount: { $set: action.payload.discount },

																discountedprice : {$set : cartItem.discountedprice},
																totalPrice: { $set: cartItem.totalPrice},
																taxamount : {$set : cartItem.taxamount},
																baseprice : {$set : cartItem.baseprice }
															}}
													});
								}
							}
			case CART_EMPTY :
			 	return update(state, {
			 			cart: {
			 							$set: []
			 					}
			 		});

			case ON_CLOSE_CHANGESALE_TRANSFER:
								return { ...state, selectedmember : null , isChangeSaleMemberSet : false , cart : []};


			case ON_ASSIGNTRAINER_CHANGE:
			{
				let cartItemIndex = state.cart.indexOf(action.payload.cartItem);
				let employeeDetail = state.employeeList.filter(x => x.id == action.payload.assigntrainerid)[0];
				let ptcommissiontype = employeeDetail ? employeeDetail.ptcommissiontypeId : null;
				let ptcommssion = employeeDetail ? employeeDetail.ptcommssion : 0;

				return update(state, {
					cart: {
						[cartItemIndex]: {
							assigntrainerid: { $set: action.payload.assigntrainerid || 0 },
							ptcommissiontype: { $set: ptcommissiontype },
							ptcommssion: { $set: ptcommssion }
						}}
				});
			}

			case ON_COMPLEMENTCATEGORY_CHANGE:
			{
				let cartItemIndex = state.cart.indexOf(action.payload.cartItem);

				return update(state, {
					cart: {
						[cartItemIndex]: {
							complementcategory: { $set: action.payload.complementcategory || null },
						}}
				});
			}
					case GET_PACKAGE_HIT_DETAIL:
						let tableInfoPackage = state.tableInfoPackage;
							if(action.payload)
							{
								tableInfoPackage.filtered = action.payload.filtered;
								tableInfoPackage.pageIndex  = action.payload.pageIndex;
								tableInfoPackage.isExpressSale  = action.payload.isExpressSale ? action.payload.isExpressSale : false ;
							}
							else {
								tableInfoPackage.filtered = [];
							}

					    return { ...state , tableInfoPackage : tableInfoPackage};

				   case GET_PACKAGE_HIT_DETAIL_SUCCESS:
					    let {packages,packageincart} = state;
							 if(state.tableInfoPackage.isExpressSale){
									packages = action.payload.data;
								}
								else{
									packageincart = action.payload.data;
								}
							 let packagepages = action.payload.pages.length > 0 ? action.payload.pages[0].pages : 1;

					    return { ...state, packages: packages,packageincart : packageincart, tableInfoPackage : {...state.tableInfoPackage , pages : packagepages}};

				   case ON_EMPLOYEELIST :
					    return { ...state,employeeList : null};
		           
				   case ON_EMPLOYEELIST_SUCCESS:
						let employeeList = action.payload.employeeList;
						return { ...state, employeeList:employeeList};
						
				   case GET_UNFINISHEDCART_LIST:
					  let tableInfoUnfinishedCart = state.tableInfoUnfinishedCart;
						if(action.payload)
						{
						  if(action.payload.state)
						  {
							tableInfoUnfinishedCart.pageIndex  = action.payload.state.page;
							tableInfoUnfinishedCart.pageSize  = action.payload.state.pageSize;
							tableInfoUnfinishedCart.sorted  = action.payload.state.sorted;
							tableInfoUnfinishedCart.filtered = action.payload.state.filtered;
						  }
						}
						  return { ...state ,tableInfoUnfinishedCart : tableInfoUnfinishedCart,dialogLoading : false};
          
				  case GET_UNFINISHEDCART_LIST_SUCCESS:
						  return { ...state, unfinishedcartlist: action.payload.data, tableInfoUnfinishedCart : {...state.tableInfoUnfinishedCart ,
							pages : action.payload.pages[0].pages,
							totalrecord : action.payload.pages[0].count,
						  },dialogLoading : false};				
								
				  case OPEN_UNFINISHEDCART_IN_EXPRESSSALE :
					
						let cartdata = action.payload.data;
						let purchasedetail = cartdata.purchasedetail ? JSON.parse(cartdata.purchasedetail) : null;
						if(state.cart.length > 0)
						{
							state.cart = [];
						}
						if(purchasedetail)
						{
							let member = {};
							member.id = cartdata.memberid;
							member.membername = cartdata.membername;
							member.membercode = cartdata.membercode;
							member.mobile = cartdata.mobile;
							member.personalemailid = cartdata.personalemailid;
							member.label = cartdata.membername ;
							member.firstname =  cartdata.firstname;
							member.lastname = cartdata.lastname;
							member.memberOption = '1';
									
							return update(state, {
								cart: {$set: purchasedetail.cart },
								selectedmember : {$set: member },
								unfinishedcartid : {$set: cartdata.id },
							});
						}			
												
		default:
			return { ...state };

	}
}
