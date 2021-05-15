/**
 * Quick Links
 */
import React, {PureComponent} from 'react';
import { connect } from 'react-redux';

import { Link } from 'react-router-dom';
import Tooltip from '@material-ui/core/Tooltip';

import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import api from 'Api';
import { setEmployeeDefaultBranch } from 'Actions';
import CircularProgress from '@material-ui/core/CircularProgress';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import compose from 'recompose/compose';
import { withStyles } from '@material-ui/core/styles';
import InputBase from '@material-ui/core/InputBase';
import {isMobile} from 'react-device-detect';
import RctCollapsibleCard from 'Components/RctCollapsibleCard/RctCollapsibleCard';
import Auth from '../../Auth/Auth';

const auth = new Auth();

const BootstrapInput = withStyles(theme => ({
  input: {
    padding: '7px 26px 8px 12px',
    borderRadius: 4,
    border: '1px solid #EBEDF2',
  },
}))(InputBase);

class BranchList extends PureComponent {

  state = {
            branchList : null,
            selectedBranch : '',
            dropdownOpen : false,
          }

  componentWillMount() {
    this.getBranchList();
  }

  getBranchList()
  {
    let {userProfileDetail} =  this.props;
      if(userProfileDetail && userProfileDetail.zoneid)
      {
        api.post('branch-list', {zoneId : userProfileDetail.zoneid})
        .then(response => {
          let defaultbranch = '';

          let branchList = response.data[0];

          if(userProfileDetail.defaultbranchid)
          {
            if(branchList.filter(x => x.id == userProfileDetail.defaultbranchid).length > 0 &&  localStorage.getItem('user_defaultbranchid') == userProfileDetail.defaultbranchid)
            {
              this.setState({selectedBranch : userProfileDetail.defaultbranchid,branchList : branchList});
            }
            else if(branchList.length > 0){
              localStorage.setItem('user_defaultbranchid' , branchList[0].id);
              localStorage.setItem('user_defaultbranchname' , branchList[0].label);
              window.location.reload();
            }
            else {
              // logout
              auth.logout();
            }
          }
          else {
            // logout
            auth.logout();
          }
        }).catch(error => console.log(error) )
      }
  }

  onChange(key,value)
  {
    if(this.state.selectedBranch != value)
    {
      let branchname = this.state.branchList.filter(x => x.id == value)[0].label;

      localStorage.setItem('user_defaultbranchid' , value);
      localStorage.setItem('user_defaultbranchname' , branchname);
      window.location.reload();
    }
  }

render() {
   let {branchList,selectedBranch,dropdownOpen} = this.state;
   let {headerloading,classes} = this.props;

return (
<li className = "list-inline-item">
  {!isMobile ?
    <div >
      {headerloading ? <CircularProgress  color="secondary" size = {30}/> :

        <Select className = {"text-white bg-primary"} value={selectedBranch} onChange={(e) => this.onChange('selectedBranch', e.target.value)} variant="outlined"
          inputProps={{name: 'selectedBranch', id: 'selectedBranch', }}
          input={<BootstrapInput />}>
          {
            branchList && branchList.map((branchList, key) => (  <MenuItem  value={branchList.id} key = {'branchListOption' + key }>{branchList.label}</MenuItem>  ))
          }
        </Select>
      }
    </div>
    :
    <RctCollapsibleCard fullBlock>

        {headerloading ? <CircularProgress  color="secondary" size = {30}/> :

        <div className = " py-10 pl-30">
          <Select className = {"text-white bg-primary"} value={selectedBranch} onChange={(e) => this.onChange('selectedBranch', e.target.value)} variant="outlined"
            inputProps={{name: 'selectedBranch', id: 'selectedBranch', }}
            input={<BootstrapInput />}>
            {
              branchList && branchList.map((branchList, key) => (  <MenuItem  value={branchList.id} key = {'branchListOption' + key }>{branchList.label}</MenuItem>  ))
            }
          </Select>
         </div>
        }

    </RctCollapsibleCard>
   }
</li>
);
}
}

const mapStateToProps = ({ settings,employeeManagementReducer }) => {
  const {userProfileDetail,clientProfileDetail} = settings;
  const { headerloading } =  employeeManagementReducer;
  return { userProfileDetail,clientProfileDetail,headerloading}
}

export default connect(mapStateToProps,{setEmployeeDefaultBranch})(BranchList);
