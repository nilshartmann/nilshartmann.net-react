// Polyfills
require('babel-polyfill');
require('whatwg-fetch');

// Styles
require('./layout/styles/styles.scss');

// React
import React from 'react';
import ReactDOM from 'react-dom';
import { Router, browserHistory as history } from 'react-router'


import createRoutes from './createRoutes';
import ModelProvider from './model/ModelProvider';
import createModel from './model/createModel';

/*global __simpleBlog_env*/
const initialState = (typeof __simpleBlog_env === 'object') ? __simpleBlog_env.INITIAL_STATE : {};
const backendUrl = (typeof __simpleBlog_env === 'object') ? __simpleBlog_env.BACKEND_URL : 'invalid';


const model = createModel({
  initialState,
  backendUrl,
  history,
  localStorage,
});

const routes = createRoutes(model);

const router = <Router history={history}>
  {routes}
</Router>;

const modelProvider = <ModelProvider model={model}>
  {router}
</ModelProvider>


ReactDOM.render(modelProvider, document.getElementById('mount'));
