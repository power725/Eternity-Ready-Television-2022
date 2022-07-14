import React, {Component} from 'react'
import { connect } from 'react-redux'
import { browserHistory } from 'react-router'

import { changePassword, resetPassword, clearMessages } from '../../redux/modules/auth';


class UpdatePassword extends Component {
  constructor () {
    super();

    this.state = {
      canSubmit: false,
      password: {
        value: '',
        error: ''
      },
      passwordConfirm: {
        value: '',
        error: ''
      }
    }
  }

  componentWillMount() {
    this.props.clearMessages();
  }


  componentWillReceiveProps(nextProps) {

  }

  handlePassword = (e) => {
    let value = e.target.value.trim();
    if (value.length >= 4 && value.length <= 60) {
      this.setState({
        password: {
          error: '',
          value: value,
          valid: true
        }
      })
    } else {
      this.setState({
        password: {
          ...this.state.password,
          error: `Your password must contain between 4 and 60 characters`
        }
      })
    }
    this.setState({
      canSubmit: value.length >= 4 && value.length <= 60 && !this.state.passwordConfirm.error && this.state.passwordConfirm.value.length > 0
    })
  };

  handlePasswordConfirm = (e) => {
    let value = e.target.value.trim();
    if (value === this.state.password.value) {
      this.setState({
        passwordConfirm: {
          error: '',
          value: value,
          valid: true
        }
      })
    } else {
      this.setState({
        passwordConfirm: {
          ...this.state.passwordConfirm,
          error: `Your passwords must match`
        }
      })
    }
    this.setState({
      canSubmit: !this.state.password.error && value === this.state.password.value
    })
  };

  handleClick = (event) => {
    event.preventDefault();

    if (this.state.canSubmit){

      if(this.props.isChangePassword === true) {
        return this.props.changePassword({
          password: this.state.password.value
        });
      }

      this.props.resetPassword({
        token: this.props.token,
        password: this.state.password.value
      });

    }
  };

  render () {
    const { errorMessage, successMessage } = this.props;

    return (
      <form onSubmit={this.handleClick}>

        {
          !successMessage &&
          <span>
            <label  className="login-inputgroup">
              <span>New Password</span>
              <input type="password" className="login-input"  onChange={this.handlePassword} name="password"/>
              {this.state.password.error &&
              <p className="login-error">{this.state.password.error}</p>
              }
            </label>

            <label  className="login-inputgroup">
              <span>Confirm New Password</span>
              <input type="password" className="login-input"  onChange={this.handlePasswordConfirm}/>
              {this.state.passwordConfirm.error &&
              <p className="login-error">{this.state.passwordConfirm.error}</p>
              }
            </label>

            <button type="button" className="btn btn-light login-button"
                    type="submit"
                    disabled={!this.state.canSubmit} onClick={this.handleClick}>Update Password</button>
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
  resetPassword: (creds) => {dispatch(resetPassword(creds))},
  changePassword: (creds) => {dispatch(changePassword(creds))},
  clearMessages: () => {dispatch(clearMessages())}
});

const mapStateToProps = (state) => ({
  errorMessage: state.auth.errorMessage,
  successMessage: state.auth.successMessage
});

export default connect(mapStateToProps, mapDispatchToProps)(UpdatePassword)
