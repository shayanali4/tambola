import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import ListItemText from '@material-ui/core/ListItemText';
import Select from '@material-ui/core/Select';
import Checkbox from '@material-ui/core/Checkbox';
import Chip from '@material-ui/core/Chip';

const styles = theme => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  formControl: {

    minWidth: 120,
  },
  chips: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  chip: {
    margin: theme.spacing(1/4),
  },
  noLabel: {
    marginTop: theme.spacing(3),
  },
});

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};


class MultipleSelect extends React.Component {


  	constructor(props) {
  		 super(props);
  			 this.state = {isSelectedAll : false};
  	 }

  handleChange = event => {

    let selectValues = event.target.value;
    let {options} = this.props;
      if(event.target.value.filter(x => x == "all").length > 0)
      {
        this.setState({isSelectedAll : true});
        this.props.onChange(options.map(x => x.value).join(',') );
      }
      else if(event.target.value.filter(x => x == "none").length > 0)
      {
        this.setState({isSelectedAll : false});
        this.props.onChange("");
      }
      else {
          this.setState({isSelectedAll : false});
          this.props.onChange(event.target.value.filter(x => x != '' && x != "all" && x != "none").join(',') );
      }

    };

  render() {
    let { classes, options ,value, placeholder,label, theme , selectAll } = this.props;
    let {isSelectedAll} = this.state;

    options = options || [];
    let selectedList = value ? value.split(',') : []

    return (
        <FormControl fullWidth className={classes.formControl}>
        {label && <InputLabel htmlFor="select-multiple-placeholder">{label}</InputLabel>}

          <Select
            multiple
            value={value && typeof(value) == "string" ? value.split(',') : []}
            onChange={this.handleChange}
            input={<Input id="select-multiple-placeholder" />}
            renderValue={(selected) => {
              if (selected.length === 0 && placeholder) {
                return <em>{placeholder}</em>;
              }
              return options.filter(x => selected.indexOf(x.value.toString()) > -1).map(x => x.label).join(',');
            }}
            MenuProps={MenuProps}
          >
            {placeholder &&<MenuItem disabled value="">
              <em>{placeholder}</em>
            </MenuItem>
            }


            {selectAll && <MenuItem value={!isSelectedAll ? "all" : "none" }>
              <Checkbox color="primary" checked={isSelectedAll} />
              Select All
              </MenuItem>
            }

            {options.map(option =>
              {
                let isSelected = selectedList.indexOf(option.value.toString()) === -1 ? false : true;
                let fontWeight =  isSelected
                                    ? theme.typography.fontWeightRegular
                                    : theme.typography.fontWeightMedium;

              return (
              <MenuItem key={option.value} value={option.value.toString()} style={{fontWeight : fontWeight}}>

              <Checkbox color="primary" checked={isSelected} />

                {option.label}
              </MenuItem>
            )
          })}
          </Select>
        </FormControl>

    );
  }
}

MultipleSelect.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles, { withTheme: true })(MultipleSelect);
