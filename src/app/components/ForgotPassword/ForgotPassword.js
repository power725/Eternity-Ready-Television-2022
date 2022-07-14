import React, {Component} from 'react'
import { connect } from 'react-redux'
import { browserHistory } from 'react-router'
import validator from 'validator'


import { clearMessages, logout } from '../../redux/modules/auth';

import SendEmail from './SendEmail';
import UpdatePassword from './UpdatePassword';

import './style.css'

class ForgotPassword extends Component {
  componentWillMount() {
    const path = this.props.route.path;

    this.props.clearMessages();
    if (path != '/change-password') {
      this.props.logout();
    }
  }

  componentWillReceiveProps(nextProps) {

  }

  render () {

    const isChangePassword = this.props.route.path === '/change-password';
    const token = (this.props.params || {}).token;

    return (
      <div className="forgot-passowrd-wrapper">
        { (isChangePassword === false && !token) && <SendEmail /> }
        { (isChangePassword === true || token) && <UpdatePassword token={token} isChangePassword={isChangePassword} /> }
      </div>
    )
  }
}

const mapDispatchToProps = (dispatch) => ({
  clearMessages: (creds) => {dispatch(clearMessages(creds))},
  logout: () => {dispatch(logout())}
});

const mapStateToProps = (state) => ({
});

export default connect(mapStateToProps, mapDispatchToProps)(ForgotPassword)
