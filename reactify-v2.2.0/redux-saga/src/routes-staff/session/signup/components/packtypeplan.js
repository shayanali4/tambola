import React, { Component } from 'react';
import Form from 'reactstrap/lib/Form';
import PricingBlockV2 from 'Components/Pricing/PricingBlockV2';
import Packtype from 'Assets/data/packtype';

export default class Packtypeplan extends React.Component {

	render() {

		return (

      <div className="fixed-pricing mb-0">
        <div className="row no-gutters">
          <div className="col-sm-12 col-md-4">
            <PricingBlockV2
              type={"widgets.standard"}
              responses=""
              color="primary"
              features={Packtype[0].modules}
            />
          </div>
          <div className="col-sm-12 col-md-4">
            <PricingBlockV2
            type={"widgets.base"}
              responses="Features of Standard Pack +"
              color="warning"
              features={Packtype[1].modules}

            />
          </div>
          <div className="col-sm-12 col-md-4">
            <PricingBlockV2
            type={"widgets.premium"}
              responses="Features of Standard & Base Pack +"
              color="info"
              features={Packtype[2].modules}

            />
          </div>
        </div>
      </div>
		);
	}
}
