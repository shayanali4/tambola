/**
 * Redux Store
 */
import {createStore, applyMiddleware , compose} from 'redux';
import { routerMiddleware } from 'connected-react-router'
import createSagaMiddleware from "redux-saga";
import reducers from '../reducers';
import RootSaga from "../sagas";

import {createBrowserHistory} from 'history';
export const history = createBrowserHistory()



// create the saga middleware
const sagaMiddleware = createSagaMiddleware();

const middlewares = [sagaMiddleware, routerMiddleware(history)];


export function configureStore(initialState) {

    const store = createStore(
        reducers(history),
        initialState,
        compose(applyMiddleware(...middlewares))
    );

    sagaMiddleware.run(RootSaga);

    if (module.hot) {
        // Enable Webpack hot module replacement for reducers
        module.hot.accept('../reducers/index', () => {
            const nextRootReducer = require('../reducers/index');
            store.replaceReducer(nextRootReducer);
        });
    }

    return store;
}
