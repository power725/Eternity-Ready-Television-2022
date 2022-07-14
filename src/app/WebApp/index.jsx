import React, { Component } from 'react';

import { connect } from 'react-redux';

import Header from '../components/Header';
import Footer from '../components/Footer';
import DonateModal from '../components/DonateModal';

import { decrementDonateCounter, logout } from '../redux/modules/auth';

import fwStyle from './resources/css/font-awesome.min.css';

import style from './style.css';
import bootstrapStyle from './resources/bootstrap/bootstrap.css';
import bootstrapThemeStyle from './resources/bootstrap/bootstrap-theme.css';


class WebApp extends Component {

  componentWillMount() {
    this.props.decrementDonateCounter();
  }

  componentWillReceiveProps(nextProps) {
    if (!this.props.isAuthenticated && nextProps.isAuthenticated) {
      this.props.decrementDonateCounter();
    }
  }

  render() {
    return (
      <div>
          {/*<h1>MAIN APP HEADER</h1>*/}

          {
            (!__SERVER__ && this.props.donateModalCounter < 0 && window.location.href.indexOf('/watch') === -1) &&
            <DonateModal />
          }

          <Header />
            {this.props.children}
          <Footer />
      </div>
    );
  }
}

const mapDispatchToProps = (dispatch) => ({
  decrementDonateCounter: () => {dispatch(decrementDonateCounter())}
})

const mapStateToProps = (state) => ({
  donateModalCounter: state.auth.donateModalCounter,
  isAuthenticated: state.auth.isAuthenticated
});

export default connect(mapStateToProps, mapDispatchToProps)(WebApp)
