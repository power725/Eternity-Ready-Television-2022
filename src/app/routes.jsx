import React, {Component} from 'react';
import { Route, IndexRoute  } from 'react-router';

import WebApp from './WebApp';

import Browse from './Pages/Browse';
import Player from './Pages/Player';
import SearchResults from './Pages/SearchResults';
import Login from './Pages/LogIn';
import Signup from './Pages/SignUp';
import ForgotPassword from './Pages/ForgotPassword';
import ChangePassword from './Pages/ChangePassword';

export default (aProps, store) => {

  const isAlreadyAuthenticated = (nextState, replace, cb) => {
    if (!store) {
      return cb();
    }

    const { auth: { user }} = store.getState();
    if (user) {
		replace('/browse');
    }
    cb();
  };

  const requiredAuth = (nextState, replace, cb) => {
    if (!store) {
      return cb();
    }

    const { auth: { user }} = store.getState();
    if (!user) {
		replace('/login');
    }
    cb();
  };

  return (
    <Route>

      <Route component={WebApp}>
        <Route path="" component={Browse} />
        <Route path="/" component={Browse} />
		<Route path="/browse" component={Browse} />
		<Route path="/watch/:channelId" component={Player} />
		<Route path="/search/:query" component={SearchResults} />
		<Route path="/forgot-password(/:token)" component={ForgotPassword} />

        <Route onEnter={isAlreadyAuthenticated}>
			<Route path="/login" component={Login} />
			<Route path="/signup" component={Signup} />
        </Route>

        <Route onEnter={requiredAuth}>
			<Route path="/change-password" component={ForgotPassword} />
		</Route>
      </Route>

    </Route>

  );
}
