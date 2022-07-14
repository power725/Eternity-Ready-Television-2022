import React, {Component} from 'react';
import { Route, IndexRoute  } from 'react-router';

import AdminApp from './AdminApp';

import Users from './components/users/Users';
import Login from './components/login/Login';
import Channels from './components/channels/Channels';

export default (aProps, store) => {

  const requireLogin = (nextState, replace, cb) => {
    if (!store) {
      return cb();
    }

    function checkAuth() {
      const { auth: { user }} = store.getState();
      if (!user) {
        // oops, not logged in, so can't be here!
        replace('/login');
      }
      cb();
    }

    checkAuth();
  };

  return (
    <Route>

      <Route component={AdminApp}>
        <Route path="/admin/" component={Users} />
        <Route path="/admin/users" component={Users} />
        <Route path="/admin/channels" component={Channels} />
        <Route path="/admin/login" component={Login} />
      </Route>

    </Route>

  );
}