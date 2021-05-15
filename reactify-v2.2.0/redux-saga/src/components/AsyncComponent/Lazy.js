import * as React from "react";
import PropTypes from "prop-types";
import PreloadWidget from 'Components/PreloadLayout/PreloadWidget';

export class LazyLoadModule extends React.Component {
  constructor() {
    super();
    this.state = {
      module: null
    };
  }

  componentDidCatch(error) {
    this.setState({ hasError: error });
  }

  async componentDidMount() {
    try {
      this.mounted = true;
      const { resolve , props, moduleName } = this.props;
      const module = await resolve();
      if(this.mounted)
      {
          this.setState({ module : module[moduleName] });
      }
    } catch (error) {
      if(this.mounted)
      {
        this.setState({ hasError: error });
      }  
    }
  }

  componentWillUnmount(){
         this.mounted = false;
  }

  render() {
    const { module, hasError } = this.state;
    const { loader, props } = this.props;

//    if (hasError) return <div>{hasError.message}</div>;

    if (module)
    {
      if(props)
      {
        return React.createElement(module, props);
      }
      else {
        return React.createElement(module);
      }
   }
    return loader ? loader : <PreloadWidget />;
  }
}

LazyLoadModule.propTypes = {
  resolve: PropTypes.func
};
LazyLoadModule.defaultProps = { moduleName : 'default'};
