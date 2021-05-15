import React, { Fragment, PureComponent,Component } from 'react';
import FormControl from '@material-ui/core/FormControl';
import FormGroup from 'reactstrap/lib/FormGroup';
import Label from 'reactstrap/lib/Label';
import Col from 'reactstrap/lib/Col';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';

export default class PageSize extends Component {


    constructor (props) {
          super(props);

      }
      state = {
                  pagesize: '10'
            };

      handleChangeSelect = event => {
          this.setState({ [event.target.name]: event.target.value });
          this.props.onChange(event.target.value);
        };


  render() {
    return (
            <FormGroup row style={{marginBottom:0,marginRight:0}}>

            	<Label for="pagesize" sm={4}>Shows</Label>
              	<Col sm={8}>

                <Select value={this.state.pagesize} onChange={this.handleChangeSelect}
                  inputProps={{name: 'pagesize', id: 'page_size', }}>

                  <MenuItem value="5">5 Records</MenuItem>
                  <MenuItem value="10">10 Records</MenuItem>
                  <MenuItem value="20">20 Records</MenuItem>
                  <MenuItem value="50">50 Records</MenuItem>
                  <MenuItem value="100">100 Records</MenuItem>
                </Select>
                	</Col>
            </FormGroup>

    );
  }
}
