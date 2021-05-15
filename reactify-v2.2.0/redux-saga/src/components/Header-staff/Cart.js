/**
 * Cart Component
 */
import React, { Component, Fragment } from 'react';
import PerfectScrollbar from 'Components/PerfectScrollbar';
import Badge from 'reactstrap/lib/Badge';
import UncontrolledDropdown from 'reactstrap/lib/UncontrolledDropdown';
import DropdownToggle from 'reactstrap/lib/DropdownToggle';
import DropdownMenu from 'reactstrap/lib/DropdownMenu';

import Button from '@material-ui/core/Button';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import Tooltip from '@material-ui/core/Tooltip';
import {isMobile} from 'react-device-detect';

//Helper
import { textTruncate ,getCurrency,checkOverlapDate} from "Helpers/helpers";

//Actions
import { deleteItemFromCart } from "Actions";

//intl Messages
import IntlMessages from 'Util/IntlMessages';


class Carts extends Component {

	//Get Total Price
	getTotalPrice() {
		const { cart } = this.props;
		let totalPrice = 0;
		for (const item of cart) {
			totalPrice += parseFloat(item.totalPrice);
		}
		return totalPrice.toFixed(2);
	}

	//Is Cart Empty
	isCartEmpty() {
		const { cart } = this.props;
		if (cart.length === 0) {
			return true;
		}
	}

	validate() {
		const { cart , salesby } = this.props;

		 if(cart.length == 0)
		 {
			 return false;
		 }
		 if(cart.filter(x => (x.isService == true && x.startDate == null) || (x.productQuantity != undefined && x.productQuantity == '') || (x.isService == true && x.isComplimentary == 1 && x.complementcategory == null)).length > 0)
		 {
			 return false;
		 }
		 if(salesby == '')
		{
			return false;
		}

		if((cart.filter(x => (x.servicetypeId == 1)).length > 1))
		{
					let servicelist = cart.filter(x => (x.servicetypeId == 1));

					let result = checkOverlapDate(servicelist);
					if(!result)
					{
						return false;
					}
		 }

		 if(cart.filter(x => (x.servicetypeId == 2 && cart.filter(r =>r.servicetypeId == 2 && r.activitytypeId == x.activitytypeId && r.brand == x.brand).length > 1)).length > 1)
			{
				let servicelist = (cart.filter(x => (x.servicetypeId == 2 && cart.filter(r =>r.servicetypeId == 2 && r.activitytypeId == x.activitytypeId && r.brand == x.brand).length > 1)));
				let result = checkOverlapDate(servicelist);
				if(!result)
				{
					return false;
				}
			}
		 // if(cart.filter(x => (x.servicetypeId == 1)).length > 1) {
		 //
			// 					 return false;
			//  }
			//  if(cart.filter(x => (x.servicetypeId == 2 && cart.filter(r =>r.servicetypeId == 2 && r.activitytypeId == x.activitytypeId && r.brand == x.brand).length > 1)).length > 1) {
		 //
	 		// 						return false;
	 		// }

		return true;
	}

	render() {
		const { cart } = this.props;
		return (
			<UncontrolledDropdown nav className="list-inline-item cart-icon">
				<DropdownToggle nav className="p-0">
					<Tooltip title="Shopping Cart" placement="bottom">
						<IconButton aria-label="bag">
							<i className="zmdi zmdi-shopping-cart"></i>
							<Badge color="success" className="badge-xs badge-top-right">{cart.length}</Badge>
						</IconButton>
					</Tooltip>
				</DropdownToggle>
				<DropdownMenu right>
					<div className="dropdown-head">
						<span><IntlMessages id="components.cart" /></span>
					</div>
					{this.isCartEmpty() ? (
						<div className="text-center p-4">
							<span className="d-block font-3x mb-15 text-danger"><i className="zmdi zmdi-shopping-cart"></i></span>
							<h3><IntlMessages id="components.CartEmptyText" /></h3>
						</div>
					) : (
							<Fragment>
								<PerfectScrollbar style={{ height: '160px' }}>
									<ul className="list-unstyled dropdown-body">
										{cart.map((cart, key) => (
											<li className="d-flex justify-content-between" key={key}>
												<div className="media overflow-hidden w-75">
													<div className="mr-15">
														<Avatar className="size-25 bg-primary rounded-circle">{(cart.name.substring(0, 2))}</Avatar>
													</div>
													<div className="media-body">
														<span className="fs-14 d-block">{textTruncate(cart.name, 25)}</span>
														<span className="fs-12 d-block text-muted">{textTruncate(cart.description, 50)}</span>
														<span className="fs-12 d-block text-muted">{cart.brand} {cart.activitytype && (' - ' + cart.activitytype)}</span>
													</div>
												</div>
												<div className="text-center">
													<span className="text-muted fs-12 d-block mb-10">Quantity : {cart.productQuantity ? cart.productQuantity : 1}</span>
													<span className="text-muted fs-12 d-block mb-10">{getCurrency()} {cart.price}</span>
												</div>
											</li>
										))}
									</ul>
								</PerfectScrollbar>
								<div className={ isMobile ? "dropdown-foot d-flex justify-content-between align-items-center p-10" : "dropdown-foot d-flex justify-content-between align-items-center" }>
									<div>
										<Button variant="contained" component={Link} to="/app/ecommerce/cart" color="primary" className={isMobile ? "mr-5 btn-xs" : " mr-10 btn-xs " }>
											<IntlMessages id="components.viewCart" />
										</Button>
										<Button variant="contained" disabled={!this.validate()} component={Link} to="/app/ecommerce/checkout" color="secondary" className={" btn-xs" } >
											<IntlMessages id="components.checkout" />
										</Button>
									</div>
									<span className="fw-normal text-dark font-weight-bold fs-14 ml-5"><IntlMessages id="widgets.total" /> {getCurrency()} {this.getTotalPrice()}</span>
								</div>
							</Fragment>
						)
					}
				</DropdownMenu>
			</UncontrolledDropdown>
		)
	}
}

const mapStateToProps = ({ ecommerce }) => {
	const { cart } = ecommerce;
	return { cart };
}

export default connect(mapStateToProps, {
	deleteItemFromCart
})(Carts);
