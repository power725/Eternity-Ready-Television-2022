import React, { Component } from 'react'
import ForgotPasswordComponent from '../../components/ForgotPassword/ForgotPassword'

class ChangePassword extends Component {

  render() {
    const props = {
      ...this.props,
      auth: true
    };

    return (
      <ForgotPasswordComponent {...props} />
    )
  }
}

export default ChangePassword
