import { createStore, applyMiddleware, compose, combineReducers } from 'redux'
import { reducer as reduxAsyncConnect } from 'redux-connect'

import thunk from 'redux-thunk'
import createLogger from 'redux-logger'
import rootReducer from './modules/reducer'
import clientMiddleware from '../../app/redux/middleware/clientMiddleware';

export default function create(client) {


  let store, preloadedState;

  const middleware = [clientMiddleware(client), thunk];

  let finalCreateStore;
  finalCreateStore = applyMiddleware(...middleware)(createStore);

  store = finalCreateStore(
    rootReducer,
    !__SERVER__ ? window.__data : {}
  );

  return store;

  //if (module.hot) {
  //  // Enable Webpack hot module replacement for reducers
  //  module.hot.accept('../reducers', () => {
  //    const nextRootReducer = require('../reducers').default
  //    store.replaceReducer(nextRootReducer)
  //  })
  //}
}
