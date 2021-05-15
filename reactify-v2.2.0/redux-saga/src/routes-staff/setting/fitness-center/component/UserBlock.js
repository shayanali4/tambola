/**
 * User Block
 */
import React, { Component } from 'react';
import CustomConfig from 'Constants/custom-config';
import Gender  from 'Assets/data/gender';


class UserBlock extends Component {
    render() {
      const   {profileDetail} = this.props;

      let gender = profileDetail ? Gender.filter(value => value.name == profileDetail.gender)[0] : null;
       gender = gender ? gender.value : '1';
        return (
            <div className="profile-top mb-20">
                <img src={require('Assets/img/profile-bg.jpg')} alt="profile banner" className="img-fluid" width="1920" height="345" />
                <div className="profile-content">
                    <div className="media">

        { profileDetail &&  <img src={profileDetail.image ? CustomConfig.serverUrl + profileDetail.image : (gender == '2' ? require('Assets/img/female-profile.png') : require('Assets/img/male-profile.png'))}  alt="" className="rounded-circle mr-30 bordered" width="140" height="140"
        	onError={(e)=>{e.target.src = (gender == '2' ? require('Assets/img/female-profile.png') : require('Assets/img/male-profile.png'))}}/>}

                        <div className="media-body pt-25">
                            <div className="mb-20">
                                <h2>{profileDetail ? profileDetail.name : ''}</h2>
                                <p>{profileDetail ? profileDetail.emailid : ''}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default UserBlock;
