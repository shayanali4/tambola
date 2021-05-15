/**
* Main App
*/
import React from 'react';
import { Provider } from 'react-redux'
import { Route, Switch } from 'react-router-dom';
import MomentUtils from '@date-io/moment';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
 import {configureStore ,history } from './store';
import { ConnectedRouter   as Router} from 'connected-react-router';

// css
import './lib/reactifyCss';

// firebase
//import './firebase';

// app component
import App from './container/App';


const MainApp = () => (
	<Provider store={configureStore()}>
		<MuiPickersUtilsProvider utils={MomentUtils}>
			<Router history={history}>
				<Switch>
					<Route path="/" component={App} />
				</Switch>
			</Router>
		</MuiPickersUtilsProvider>
	</Provider>
);

export default MainApp;
