import React, {Component} from 'react'
import { connect } from 'react-redux'

import validator from 'validator'

import { sendForgotPasswordEmail, clearMessages } from '../../redux/modules/auth';

class SendEmail extends Component {

  constructor () {
    super();

    this.state = {
      canSubmit: false,
      email: {
        value: '',
        error: ''
      }
    }
  }

  componentWillMount() {
    this.props.clearMessages();
  }

  handleEmail = (e) => {
    let value = e.target.value.trim();
    if (validator.isEmail(value)) {
      this.setState({
        email: {
          error: '',
          value: value,
          valid: true
        }
      })
    } else {
      this.setState({
        email: {
          ...this.state.email,
          error: `${value} is not a valid email`
        }
      })
    }

    this.setState({
      canSubmit: validator.isEmail(value)
    })
  };

  handleClick = (e) => {
    e.preventDefault();

    if (this.state.canSubmit) {
      this.props.sendForgotPasswordEmail(this.state.email.value);
    }
  };

  render() {
    const { errorMessage, successMessage } = this.props;

    return (

      <form onSubmit={this.handleClick}>

        {
          !successMessage &&
          <span>
          <p>Please enter your email address!</p>

          <label className="login-inputgroup">
            <span>Email</span>
            <input type="text" className="login-input" onChange={this.handleEmail}
                   name="email"/>
            {this.state.email.error &&
            <p className="login-error">{this.state.email.error}</p>
            }
          </label>

          <button type="button" className="btn btn-light login-button"
                  type="submit"
                  disabled={!this.state.canSubmit} onClick={this.handleClick}>Send Email</button>
          </span>
        }

        {
          errorMessage &&
          <p className="main-signup-error">{errorMessage}</p>
        }

        {
          successMessage &&
          <p className="signup-info">{successMessage}</p>
        }
      </form>

    )
  }
}

const mapDispatchToProps = (dispatch) => ({
  sendForgotPasswordEmail: (email) => {dispatch(sendForgotPasswordEmail(email))},
  clearMessages: () => {dispatch(clearMessages())}
});

const mapStateToProps = (state) => ({
  errorMessage: state.auth.errorMessage,
  successMessage: state.auth.successMessage
});

export default connect(mapStateToProps, mapDispatchToProps)(SendEmail)
