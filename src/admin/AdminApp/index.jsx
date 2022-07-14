import React, { Component } from 'react';

import { connect } from 'react-redux';

import bootstrap from './resources/bootstrap/bootstrap.css';
import fwStyle from './resources/css/font-awesome.min.css';
import generalStyle from './style.css';

import TopbarMenu from '../components/topbar-menu/TopbarMenu.jsx';
import InfoBar from '../components/info-bar/InfoBar';

class AdminApp extends Component {

  render() {
    return (
      <div>

        <TopbarMenu />

        {this.props.children}

        <InfoBar />

      </div>
    );
  }
}


export default AdminApp;