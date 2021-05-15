/* eslint-disable no-use-before-define */
import React , { PureComponent } from 'react';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import Checkbox from '@material-ui/core/Checkbox';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import MenuItem from '@material-ui/core/MenuItem';
const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;


class MultiCombobox extends PureComponent {


  constructor(props) {
    super(props);
            this.state = {
                };
       }
       render() {
        let {label, placeholder , options , value , onChange , disabled, displayEmpty} = this.props;

  return (
      <Autocomplete
        options={options || []}
        getOptionLabel={option =>   option.label || ""}
        value={options ? options.filter(x => x.value == value)[0] || {} : {}}
        getOptionSelected = {option =>   option.value}
        onChange={(event, newValue) => {
          onChange(newValue ? newValue.value : "");
        }}
        disabled = {disabled || false}
        renderInput={params => (
          <TextField
            {...params}
            variant="standard"
            label={label || ""}
            placeholder= {placeholder || ""}
            fullWidth
          />
        )}

        renderOption={(option, { selected }) =>
        {
        return  option.label ;
        }
        }
        renderTags = {(option,{ selected }) => {
          return (
          <span style = {{overflow: 'hidden',whiteSpace : 'nowrap',textOverflow: 'ellipsis',maxWidth : 'calc(100% - 80px)'}}>
           {option ? option.map(x=> x.label).join()+',' : ""}
           </span>);
      }}
      />

  );
}
}

export default MultiCombobox;
