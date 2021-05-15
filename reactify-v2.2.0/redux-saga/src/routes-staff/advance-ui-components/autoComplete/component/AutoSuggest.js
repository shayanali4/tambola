import React from 'react';
import PropTypes from 'prop-types';
import Autosuggest from 'react-autosuggest';
import match from 'autosuggest-highlight/match';
import parse from 'autosuggest-highlight/parse';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import MenuItem from '@material-ui/core/MenuItem';
import { withStyles } from '@material-ui/core/styles';
import Input from 'reactstrap/lib/Input';
import FormHelperText from '@material-ui/core/FormHelperText';
import InputAdornment from '@material-ui/core/InputAdornment';
import CloseIcon from '@material-ui/icons/Close';
import IconButton from '@material-ui/core/IconButton';
import CustomConfig from 'Constants/custom-config';
import {getStatusColor } from 'Helpers/helpers';



function renderInput(inputProps) {
  const { classes, ref, ...other } = inputProps;
    if(inputProps.textboxtype == "1")
    {
        return (	<Input {...inputProps} classes = {inputProps.className} type = {inputProps.inputtype}   />);
    }else {
      return (
        <div>
        <TextField
          fullWidth
          error = {inputProps.error}
          inputRef={ref}
          autoFocus = {inputProps.autoFocus || false}
          label = {inputProps.label}
          disabled = {inputProps.disabled}
          inputProps={{maxLength : inputProps.maxLength}}
          InputProps={{
            classes: {
              input: classes.input,
            },
            endAdornment :<InputAdornment position="end">
            <IconButton className = "p-5" onClick = {() => inputProps.handleclear() }>
                <CloseIcon />
            </IconButton>
            </InputAdornment>,
            ...other,
          }}
          />

        {inputProps.error && <FormHelperText  error>{inputProps.error ? inputProps.error : ''}</FormHelperText>}
        </div>
      );
    }
}

function renderSuggestion(suggestion, { query, isHighlighted }) {

  const matches = match(suggestion.label, query);
  const parts = parse(suggestion.label, matches);
  return (
    <MenuItem selected={isHighlighted} component="div">
      <div>
        {parts.map((part, index) => {
          return part.highlight ? (
            <span key={String(index)} style={{ fontWeight: 300 }}>
              {part.text}
            </span>
          ) : (
              <strong key={String(index)} style={{ fontWeight: 500 }}>
                {part.text}
              </strong>
            );
        })}
      </div>
    </MenuItem>
  );
}




function renderSuggestionsContainer(options) {
  const { containerProps, children } = options;
  return (
    <Paper {...containerProps} square>
      {children }

    </Paper>
  );
}

function getSuggestionValue(suggestion) {
  return suggestion.label;
}


const styles = theme => ({
  container: {
    flexGrow: 1,
    position: "relative",
  },
  suggestionsContainerOpen: {
    position: "absolute",
    zIndex: 99,
    marginTop: theme.spacing(1),
    left: 0,
    right: 0
  },
  suggestion: {
    display: "block"
  },
  suggestionsList: {
    margin: 0,
    padding: 0,
    listStyleType: "none"
  }
});

class IntegrationAutosuggest extends React.Component {

  state={};

  handleSuggestionsFetchRequested = ({oldvalue ,value }) => {

    value = value.replace("  "," ").replace("'","").replace('"',"").replace("\\","");
    if (value == " ") {
      value = value == " " ? "" : value;
    }

    value = value.substring(0,60);
    if(oldvalue != value)
    {
      this.props.getSuggetion(value);
    }

  };

  onSuggestionSelected = (event, { suggestion, suggestionValue, suggestionIndex, sectionIndex, method }) =>
  {
    this.state.selected = 1;
    this.props.onValueChange && this.props.onValueChange(suggestion);
  }

  handleSuggestionsClearRequested = () => {

  };

  handleChange = (event, { newValue }) => {

    newValue = newValue.replace("  "," ").replace("'","").replace('"',"").replace("\\","");
    if (newValue == " ") {
      newValue = newValue == " " ? "" : newValue;
    }
      newValue = newValue.substring(0,60);
      if(this.state.selected == 1)
      {
        newValue = '';
        this.state.selected = 0;
      }

    if(event.target.name != newValue)
    {
      this.props.onChange(newValue);
    }
  };

  handleClear = () => {
      this.props.onChange("");
  };

  handleBlur = (event, { highlightedSuggestion }) => {

    if(highlightedSuggestion != null)
    {
      this.props.onChange(highlightedSuggestion.label);
    }
  };

  render() {
    const { classes, suggestions, value, label ,placeholder, textboxtype , error, autoFocus , disabled , maxLength, className ,inputtype} = this.props;

    return (
      <Autosuggest
        theme={{
          container: classes.container,
          suggestionsContainerOpen: classes.suggestionsContainerOpen,
          suggestionsList: classes.suggestionsList,
          suggestion: classes.suggestion,
        }}
        renderInputComponent={renderInput}
        suggestions={suggestions}
        onSuggestionsFetchRequested={(e) => this.handleSuggestionsFetchRequested({oldvalue : value  ,value : e.value})}
        onSuggestionsClearRequested={this.handleSuggestionsClearRequested}
        renderSuggestionsContainer={renderSuggestionsContainer}
        getSuggestionValue={getSuggestionValue}
        renderSuggestion={ renderSuggestion}
        onSuggestionSelected = {this.onSuggestionSelected}
        inputProps={{
          classes,
          placeholder: placeholder ? placeholder : 'Search a '+ label +' (start with a)',
          value: value,
          name : value,
          onChange: this.handleChange,
          onBlur : this.handleBlur,
          label : label,
          error : error,
          autoFocus : autoFocus,
          disabled : disabled,
          textboxtype : textboxtype,
          maxLength : maxLength,
          handleclear : this.handleClear,
          className : className || "",
          inputtype : inputtype || "text"
        }}
      />
    );
  }
}

IntegrationAutosuggest.propTypes = {
  classes: PropTypes.object.isRequired,
};

IntegrationAutosuggest.defaultProps = { error :false ,autoFocus : false ,disabled:false, maxLength : 100};

export default withStyles(styles)(IntegrationAutosuggest);
