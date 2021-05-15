/**
 * User Block
 */
import React, { Component } from 'react';
import CustomConfig from 'Constants/custom-config';
import Gender  from 'Assets/data/gender';
import { RctCard } from 'Components/RctCard';
import QRCode from 'qrcode';
import {getCurrency } from 'Helpers/helpers';


class UserBlock extends Component {
    render() {
      const   {profileDetail,clientProfileDetail} = this.props;

      let gender = profileDetail ? Gender.filter(value => value.name == profileDetail.gender)[0] : null;
       gender = gender ? gender.value : '1';

       let image  = {};

       if(profileDetail)
       {
          image = profileDetail.memberprofilecoverimage && profileDetail.memberprofilecoverimage.length > 0
          ?  {backgroundImage :  "url('"+CustomConfig.serverUrl + profileDetail.memberprofilecoverimage[0]+"')"} : {backgroundImage :  "url('"+require('Assets/img/profile-banner.jpg') + "')"}

          QRCode.toDataURL(profileDetail.employeecode,  { errorCorrectionLevel: 'H' } , function (err, url) {
             profileDetail.qrcode = url;
          });

        }
        return (
          <div className="user-profile-wrapper">
          <RctCard customClasses="profile-head">
            <div className="profile-top" style={ image }>

            </div>
            <div className="profile-bottom border-bottom">
              <div className="user-image text-center mb-30 d-flex">
              {
              profileDetail &&	<img src={profileDetail.image ? CustomConfig.serverUrl + profileDetail.image : CustomConfig.serverUrl + profileDetail.memberprofileimage} alt = ""
                onError={(e)=>{
                     let gender = profileDetail.genderId ? profileDetail.genderId : '1';
                    e.target.src = (gender == '2' ? require('Assets/img/female-profile.png') : require('Assets/img/male-profile.png'))}}
                    className="rounded-circle rct-notify mx-auto" width="110" height="110"/>

              }
              { profileDetail.qrcode && <img src={profileDetail.qrcode} alt = "" />}


              </div>
              <div className="user-list-content">
                <div className="text-center">
                  <h3 className="fw-bold  text-capitalize">{(profileDetail.firstname || '')  +  " " + (profileDetail.lastname || '')}
                  </h3>

                </div>
              </div>

            </div>
            <div className="user-activity text-center">
            {clientProfileDetail && clientProfileDetail.clienttypeId != 2 && clientProfileDetail.packtypeId != 1 &&
              <ul className="list-inline d-inline-block">
                <li className="list-inline-item">
                  <span className="fw-bold">{getCurrency()}{profileDetail.totalpayment > 0 ? profileDetail.totalpayment :0}</span>
                  <span>Total Payment</span>
                </li>
                <li className="list-inline-item">
                  <span className="fw-bold">{getCurrency()}{profileDetail.payablesalary }</span>
                  <span>Payable Salary</span>
                </li>
                <li className="list-inline-item">
                  <span className="fw-bold">{getCurrency()}{profileDetail.balance > 0 ? profileDetail.balance : 0 }</span>
                  <span>Payable Commission</span>
                </li>
                <li className="list-inline-item">
                  <span className="fw-bold">{getCurrency()}{profileDetail.advancepayment > 0 ? profileDetail.advancepayment :0}</span>
                  <span>Dues</span>
                </li>
              </ul>
             }
            </div>
          </RctCard>
          </div>
        );
    }
}

export default UserBlock;
