import { combineReducers } from 'redux';
import { reducer as reduxAsyncConnect } from 'redux-connect'

import admin from './admin';

export default combineReducers({
  admin,

  reduxAsyncConnect,
});
