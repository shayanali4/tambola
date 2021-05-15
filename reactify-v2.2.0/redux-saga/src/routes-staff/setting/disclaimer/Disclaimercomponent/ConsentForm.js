/**
 * Employee Management Page
 */
import React, { Component } from 'react';
// Import React Table
import {cloneDeep} from 'Helpers/helpers';
import { connect } from 'react-redux';
import RctCollapsibleCard from 'Components/RctCollapsibleCard/RctCollapsibleCard';
import api from 'Api';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import {isMobile} from 'react-device-detect';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';
import classnames from 'classnames';
import Button from '@material-ui/core/Button';
import { NotificationManager } from 'react-notifications';
import { saveDisclaimer } from 'Actions';

class ConsentForm extends Component {

   constructor(props) {
      super(props);
      this.state = this.getInitialState();
   }
   getInitialState()
   {
     this.initialState = {
                     addConsentDialog:false,
                     consentformat : ''
                   }
                   return cloneDeep(this.initialState);
     }

   componentDidMount()
   {}

   onAdd()
   {
     this.setState({ addConsentDialog : true });
   }
   onClose()
   {
     this.setState({ addConsentDialog : false });
   }

	render() {

	const	{addConsentDialog, consentformat } = this.state;
  let {declaration_config} = this.props;
   	return (

     <RctCollapsibleCard fullBlock>
        <div className="table-responsive">
            <div className="d-flex justify-content-between pt-20 pb-10 px-20">
                <div>
                  <span> Declaration </span>
                </div>
                <div>
                  <a href="javascript:void(0)" onClick={() => this.onAdd()} className="btn-outline-default"><i className="ti-pencil"></i></a>
                </div>
             </div>

               <div className={classnames("card-base",'p-0','mb-0')}>
                  <div className="row row-eq-height m-0">
                      <div className="col-md-12 " >
                         <div className={"p-5"}>
                            <address style = {{whiteSpace: 'pre-line'}}>
                                {declaration_config}
                             </address>
                          </div>
                        </div>
                      </div>
                    </div>
                    <p className = "mt-10 pl-20">{'Note :  {$M_FNAME$} {$M_LNAME$} will replace by member firstname and lastname.'}</p>

        </div>

        {addConsentDialog &&

                <Dialog fullWidth
                    onClose={() => this.onClose()}
                    open={addConsentDialog}
                  >
                  <DialogTitle className = "pb-0">
                      <span className="fw-bold text-capitalize">ADD DECLARATION FORMAT</span>
                  </DialogTitle>

                  <DialogContent >
                     <RctCollapsibleCard >
                        <div className = "row p-5">

                            <TextField  required inputProps={{maxLength:4000}}  id="question" multiline rows={10} rowsMax={20} fullWidth label="Add Declaration" autoFocus = {true}  value={consentformat || declaration_config} onChange={(e) => this.setState({ consentformat : e.target.value })} />

                            <span className = "pt-10">Note : The above tagname &#123;$M_FNAME$&#125; would be replaced by member firstname and &#123;$M_LNAME$&#125; would be replaced by member lastname. </span>


                        </div>
                   </RctCollapsibleCard >
                  </DialogContent>

                  <DialogActions>
                    <Button variant="contained" onClick={() => this.onClose()} className="btn-danger text-white">
                      Cancel
                        </Button>
                    <Button variant="contained" color="primary" onClick={() => { this.props.saveDisclaimer({declaration_config : consentformat  || declaration_config});  this.onClose(); } } className="text-white">
                      Save
                        </Button>
                  </DialogActions>

               </Dialog>
             }
    </RctCollapsibleCard>

	);
  }
  }


  const mapStateToProps = ({ disclaimerReducer }) => {
  	const { declaration_config } =  disclaimerReducer;
    return { declaration_config }
  }
  export default connect(mapStateToProps,{saveDisclaimer})(ConsentForm);
