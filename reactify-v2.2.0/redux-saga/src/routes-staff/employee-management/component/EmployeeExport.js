/**
 * Employee Management Page
 */
import React, { Component } from 'react';

import {downloadFile} from 'Helpers/helpers';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import api, {fileDownloadConfig} from 'Api';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import {required} from 'Validations';
import { NotificationManager } from 'react-notifications';

export default class EmployeeExport extends Component {


  constructor(props) {
     super(props);
      this.state = {

        tableInfo : {},
        disabled : false,
        errors : { },
         validated : false,


      };
   }



   handleChange(key, value,isRequired) {
     let error= isRequired ? required(value) : '';
       this.setState({
        [key]: value,
      });
     }

   saveFile({exportXLSX})
   {
     let {tableInfo }  = this.state ;

        tableInfo.exportXLSX 	= exportXLSX;
        tableInfo.branchid 	= this.props.branchid;
              if(exportXLSX)
              {
                api.post('get-employees' ,tableInfo, fileDownloadConfig)
                  .then(response =>
                    {
                      NotificationManager.success('Excel File Will Download Soon!');
                        downloadFile(response.data, 'Employee Export.xlsx');
                        this.setState({disabled : false,tableInfo : {...this.state.tableInfo}});
                    }).catch(error =>  {  NotificationManager.error('No data found.');
                             this.setState({disabled : false,}); } )
              }
              this.props.onCancel();

             }

	render() {

	 const	{ exportemployeeialog,onCancel } = this.props;

		return (

                      <Dialog open={exportemployeeialog} onClose={this.props.onCancel} aria-labelledby="form-dialog-title">
                        <DialogTitle id="form-dialog-title">Export Employee</DialogTitle>
                        <DialogContent>


                        </DialogContent>
                        <DialogActions>
                          <Button variant="contained" onClick={this.props.onCancel} color="primary" className="text-white">
                            Cancel
                              </Button>
                          <Button variant="contained" onClick={() => this.saveFile({exportXLSX : true})} className="btn-info text-white">
                            Download .xlsx
                              </Button>
                        </DialogActions>

                      </Dialog>



	);
  }
  }
