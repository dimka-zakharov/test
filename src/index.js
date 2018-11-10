import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import {Provider} from 'react-redux';
import {applyMiddleware, createStore} from 'redux';
import promise from "redux-promise-middleware"
import thunk from "redux-thunk";
import logger from "redux-logger";
import reducers from './reducers'

const middleware = applyMiddleware(promise(), thunk, logger);
const store = createStore(reducers, middleware);

ReactDOM.render(
    <Provider store={store}>
        <App/>
    </Provider>,
    document.getElementById('root'));
