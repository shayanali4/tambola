/**
 * Pricing
 */
import React, { Component } from 'react';
import Switch from 'react-toggle-switch';

// components
import PricingBlockV1 from 'Components/Pricing/PricingBlockV1';
import PricingBlockV2 from 'Components/Pricing/PricingBlockV2';

// page title bar
import PageTitleBar from 'Components/PageTitleBar/PageTitleBar';

// intl messages
import IntlMessages from 'Util/IntlMessages';

// components
import Testimonials from './Tesimonials';
import Faqs from './Faqs';

/**
 * Define the version of the Google Pay API referenced when creating your
 * configuration
 *
 * @see {@link https://developers.google.com/pay/api/web/reference/object#PaymentDataRequest|apiVersion in PaymentDataRequest}
 */
const baseRequest = {
  apiVersion: 2,
  apiVersionMinor: 0
};


/**
 * Card networks supported by your site and your gateway
 *
 * @see {@link https://developers.google.com/pay/api/web/reference/object#CardParameters|CardParameters}
 * @todo confirm card networks supported by your site and gateway
 */
const allowedCardNetworks = ["AMEX", "DISCOVER", "JCB", "MASTERCARD", "VISA"];

/**
 * Card authentication methods supported by your site and your gateway
 *
 * @see {@link https://developers.google.com/pay/api/web/reference/object#CardParameters|CardParameters}
 * @todo confirm your processor supports Android device tokens for your
 * supported card networks
 */
const allowedCardAuthMethods = ["PAN_ONLY", "CRYPTOGRAM_3DS"];

/**
 * Identify your gateway and your site's gateway merchant identifier
 *
 * The Google Pay API response will return an encrypted payment method capable
 * of being charged by a supported gateway after payer authorization
 *
 * @todo check with your gateway on the parameters to pass
 * @see {@link https://developers.google.com/pay/api/web/reference/object#Gateway|PaymentMethodTokenizationSpecification}
 */
const tokenizationSpecification = {
  type: 'PAYMENT_GATEWAY',
  parameters: {
    'gateway': 'example',
    'gatewayMerchantId': 'exampleGatewayMerchantId'
  }
};

/**
 * Describe your site's support for the CARD payment method and its required
 * fields
 *
 * @see {@link https://developers.google.com/pay/api/web/reference/object#CardParameters|CardParameters}
 */
const baseCardPaymentMethod = {
  type: 'CARD',
  parameters: {
    allowedAuthMethods: allowedCardAuthMethods,
    allowedCardNetworks: allowedCardNetworks,
    billingAddressRequired :false
  }
};

/**
 * Describe your site's support for the CARD payment method including optional
 * fields
 *
 * @see {@link https://developers.google.com/pay/api/web/reference/object#CardParameters|CardParameters}
 */
const cardPaymentMethod = Object.assign(
  {},
  baseCardPaymentMethod,
  {
    tokenizationSpecification: tokenizationSpecification
  }
);

/**
 * An initialized google.payments.api.PaymentsClient object or null if not yet set
 *
 * @see {@link getGooglePaymentsClient}
 */
let paymentsClient = null;

/**
 * Configure your site's support for payment methods supported by the Google Pay
 * API.
 *
 * Each member of allowedPaymentMethods should contain only the required fields,
 * allowing reuse of this base request when determining a viewer's ability
 * to pay and later requesting a supported payment method
 *
 * @returns {object} Google Pay API version, payment methods supported by the site
 */
function getGoogleIsReadyToPayRequest() {
  return Object.assign(
      {},
      baseRequest,
      {
        allowedPaymentMethods: [baseCardPaymentMethod]
      }
  );
}

/**
 * Configure support for the Google Pay API
 *
 * @see {@link https://developers.google.com/pay/api/web/reference/object#PaymentDataRequest|PaymentDataRequest}
 * @returns {object} PaymentDataRequest fields
 */
function getGooglePaymentDataRequest() {
  const paymentDataRequest = Object.assign({}, baseRequest);
  paymentDataRequest.allowedPaymentMethods = [cardPaymentMethod];
  paymentDataRequest.transactionInfo = getGoogleTransactionInfo();
  paymentDataRequest.merchantInfo = {
    // @todo a merchant ID is available for a production environment after approval by Google
    // See {@link https://developers.google.com/pay/api/web/guides/test-and-deploy/integration-checklist|Integration checklist}
    // merchantId: '01234567890123456789',
    merchantName: 'Example Merchant'
  };
  return paymentDataRequest;
}

/**
 * Return an active PaymentsClient or initialize
 *
 * @see {@link https://developers.google.com/pay/api/web/reference/client#PaymentsClient|PaymentsClient constructor}
 * @returns {google.payments.api.PaymentsClient} Google Pay API client
 */
function getGooglePaymentsClient() {
  if ( paymentsClient === null ) {
    	paymentsClient = new google.payments.api.PaymentsClient({environment: 'TEST'});
  }
  return paymentsClient;
}

/**
 * Initialize Google PaymentsClient after Google-hosted JavaScript has loaded
 *
 * Display a Google Pay payment button after confirmation of the viewer's
 * ability to pay.
 */
function onGooglePayLoaded() {
  const paymentsClient = getGooglePaymentsClient();
  paymentsClient.isReadyToPay(getGoogleIsReadyToPayRequest())
      .then(function(response) {
        if (response.result) {

          addGooglePayButton();
          // @todo prefetch payment data to improve performance after confirming site functionality
          // prefetchGooglePaymentData();
        }
      })
      .catch(function(err) {
        // show error in developer console for debugging
        console.error(err);
      });
}

/**
 * Add a Google Pay purchase button alongside an existing checkout button
 *
 * @see {@link https://developers.google.com/pay/api/web/reference/object#ButtonOptions|Button options}
 * @see {@link https://developers.google.com/pay/api/web/guides/brand-guidelines|Google Pay brand guidelines}
 */
function addGooglePayButton() {
  const paymentsClient = getGooglePaymentsClient();
  const button =
      paymentsClient.createButton({onClick: onGooglePaymentButtonClicked});
	 	  document.getElementById('container').appendChild(button);
}

/**
 * Provide Google Pay API with a payment amount, currency, and amount status
 *
 * @see {@link https://developers.google.com/pay/api/web/reference/object#TransactionInfo|TransactionInfo}
 * @returns {object} transaction info, suitable for use as transactionInfo property of PaymentDataRequest
 */
function getGoogleTransactionInfo() {
  return {
    currencyCode: 'INR',
    totalPriceStatus: 'FINAL',
    // set to cart total
    totalPrice: '1.00'
  };
}

/**
 * Prefetch payment data to improve performance
 *
 * @see {@link https://developers.google.com/pay/api/web/reference/client#prefetchPaymentData|prefetchPaymentData()}
 */
function prefetchGooglePaymentData() {
  const paymentDataRequest = getGooglePaymentDataRequest();
  // transactionInfo must be set but does not affect cache
  paymentDataRequest.transactionInfo = {
    totalPriceStatus: 'NOT_CURRENTLY_KNOWN',
    currencyCode: 'INR'
  };
  const paymentsClient = getGooglePaymentsClient();
  paymentsClient.prefetchPaymentData(paymentDataRequest);
}

/**
 * Show Google Pay payment sheet when Google Pay payment button is clicked
 */
function onGooglePaymentButtonClicked() {
  const paymentDataRequest = getGooglePaymentDataRequest();
  paymentDataRequest.transactionInfo = getGoogleTransactionInfo();

  const paymentsClient = getGooglePaymentsClient();
  paymentsClient.loadPaymentData(paymentDataRequest)
      .then(function(paymentData) {
        // handle the response
      
        processPayment(paymentData);
      })
      .catch(function(err) {
  
        // show error in developer console for debugging
        console.error(err);
      });
}

/**
 * Process payment data returned by the Google Pay API
 *
 * @param {object} paymentData response from Google Pay API after user approves payment
 * @see {@link https://developers.google.com/pay/api/web/reference/object#PaymentData|PaymentData object reference}
 */
function processPayment(paymentData) {
  // show returned data in developer console for debugging
  console.log(paymentData);
  // @todo pass payment data response to your gateway to process payment
}

export default class PricingPage extends Component {

	state = {
		monthlyPlan: true,
		businessPlan: 30,
		enterprisePlan: 59
	}

	componentWillMount () {
		const script = document.createElement("script");

		script.src = "https://pay.google.com/gp/p/js/pay.js";
		script.async = false;
		document.body.appendChild(script);
	}
	componentDidMount () {
  			setTimeout(onGooglePayLoaded,2000);

    }


	// on plan change
	onPlanChange(isMonthly) {
		this.setState({ monthlyPlan: !isMonthly });
		if (!isMonthly) {
			this.setState({ businessPlan: 30, enterprisePlan: 59 });
		} else {
			this.setState({ businessPlan: 35, enterprisePlan: 70 });
		}
	}

	render() {
		return (
			<div className="pricing-wrapper">
				<PageTitleBar title={<IntlMessages id="widgets.pricing" />} match={this.props.match} />
				<div className="pricing-top mb-50">
					<div className="row">
						<div className="col-sm-12 col-md-9 col-lg-7 mx-auto text-center">
							<h2 className="mb-20">Choose the plan that works for you.</h2>
							<div>
								<span>Monthly</span>
								<Switch onClick={() => this.onPlanChange(this.state.monthlyPlan)} on={this.state.monthlyPlan} />
								<span>Yearly ( get 2 month extra)</span>
							</div>
						</div>
					</div>
				</div>
				<div id="container"></div>
				<div className="price-list">
					<div className="row row-eq-height">
						<PricingBlockV1
							planType="free"
							type="widgets.basic"
							color="primary"
							description="Secure file sharing and collaboration. Ideal for small teams."
							buttonText="widgets.startToBasic"
							price="widgets.free"
							users={1}
							features={[
								'100 GB secure storage',
								'2 GB file upload',
								'Minimum 3 users, max 10 users'
							]}
						/>
						<PricingBlockV1
							planType="premium"
							type="widgets.pro"
							color="warning"
							description="More power & personalization"
							buttonText="widgets.upgradeToPro"
							price={this.state.businessPlan}
							users={1}
							features={[
								'Unlimited storage',
								'5 GB file upload',
								'Minimum 3 users, max 10 users'
							]}
						/>
						<PricingBlockV1
							planType="premium"
							type="widgets.advanced"
							color="info"
							description="More power & personalization"
							buttonText="widgets.upgradeToAdvance"
							price={this.state.enterprisePlan}
							users={1}
							features={[
								'Unlimited storage',
								'20 GB file upload',
								'Minimum 13 users, max 20 users'
							]}
						/>
					</div>
					<div className="text-center py-40">
						<h2 className="mb-0"><IntlMessages id="widgets.comparePlans" /></h2>
					</div>
					<div className="fixed-pricing">
						<div className="row no-gutters row-eq-height">
							<div className="col-sm-12 col-md-4">
								<PricingBlockV2
									type="widgets.basic"
									responses="100 responses / mo"
									color="primary"
									features={[
										'Granular access and controls',
										'Desktop sync',
										'Mobile access',
										'Version history',
										'SSL and at-rest encryption',
										'Two-factor authentication',
										'Standard business support',
										'User management',
										'Employee management',
										'25,000 API calls per month'
									]}
								/>
							</div>
							<div className="col-sm-12 col-md-4">
								<PricingBlockV2
									type="widgets.pro"
									responses="Unlimited responses"
									color="warning"
									features={[
										'Includes all Starter features plus',
										'Advanced user and security reporting',
										'Custom branding',
										'Version history',
										'SSL and at-rest encryption',
										'Two-factor authentication',
										'Standard business support',
										'User management',
							   			'Employee management',
										'25,000 API calls per month'
									]}
								/>
							</div>
							<div className="col-sm-12 col-md-4">
								<PricingBlockV2
									type="widgets.pro"
									responses="Unlimited responses"
									color="info"
									features={[
										'Granular access and controls',
										'Desktop sync',
										'Mobile access',
										'Version history',
										'SSL and at-rest encryption',
										'Two-factor authentication',
										'Standard business support',
										'User management',
										'Employee management',
										'25,000 API calls per month'
									]}
								/>
							</div>
						</div>
					</div>
				</div>
				<div className="testimonial-wrapper mb-50">
					<div className="row">
						<Testimonials />
					</div>
				</div>
				<Faqs />
			</div>
		);
	}
}
