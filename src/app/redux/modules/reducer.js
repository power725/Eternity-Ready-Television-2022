import { combineReducers } from 'redux';
import { reducer as reduxAsyncConnect } from 'redux-connect'

import channels from './channels';
import auth from './auth';

export default combineReducers({
  auth,
  channels,

  reduxAsyncConnect,
});
