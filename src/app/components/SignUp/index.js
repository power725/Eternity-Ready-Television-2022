import React, {Component} from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { browserHistory, Link } from 'react-router'
import validator from 'validator'

import { signup, clearMessages, setPage } from '../../redux/modules/auth';

import SocialAuth from '../SocialAuth/SocialAuth';

import './style.css'

class Signup extends Component {
  constructor () {
    super();
    this.state = {
      canSubmit: false,
      email: {
        value: '',
        error: ''
      },
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
    this.props.setPage('signup');
  }

  componentWillReceiveProps(nextProps) {
    if (!this.props.isAuthenticated && nextProps.isAuthenticated) {
      browserHistory.push('/browse');
    }
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
      canSubmit: validator.isEmail(value) && !this.state.password.error && !this.state.passwordConfirm.error && this.state.password.value.length > 0
    })
  };


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
      canSubmit: !this.state.email.error && value.length >= 4 && value.length <= 60 && !this.state.passwordConfirm.error && this.state.passwordConfirm.value.length > 0
    })
  };

  handlePasswordConfirm = (e) => {
    let value = e.target.value.trim()
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
      canSubmit: !this.state.email.error && !this.state.password.error && value === this.state.password.value
    })
  };

  handleClick = (event) => {
    event.preventDefault();

    if (this.state.canSubmit){
      const creds = { email: this.state.email.value, password: this.state.password.value };
      this.props.onSignupClick(creds)
    }
  };

  render () {
    const { errorMessage, successMessage } = this.props;
    const linkStyle = {
      color: '#daedf9',
      textDecoration: 'underline'
    };

    return (
      <div className="signup">
        <form onSubmit={this.handleClick}>
          <h1 className="login-heading">Sign Up</h1>

          <SocialAuth signup={true}/>

          <label className="login-inputgroup">
            <span>Email</span>
            <input type="text" className="login-input" onChange={this.handleEmail} name="email"/>
            {this.state.email.error &&
              <p className="login-error">{this.state.email.error}</p>
            }
          </label>
          <label  className="login-inputgroup">
            <span>Password</span>
            <input type="password" className="login-input"  onChange={this.handlePassword} name="password"/>
            {this.state.password.error &&
              <p className="login-error">{this.state.password.error}</p>
            }
          </label>
          <label  className="login-inputgroup">
            <span>Password Confirm</span>
            <input type="password" className="login-input"  onChange={this.handlePasswordConfirm}/>
            {this.state.passwordConfirm.error &&
              <p className="login-error">{this.state.passwordConfirm.error}</p>
            }
          </label>
          <button type="button" className="btn btn-light login-button"
                  type="submit"
                  disabled={!this.state.canSubmit} onClick={this.handleClick}>Sign Up</button>
          {
            errorMessage &&
            <p className="main-signup-error">{errorMessage}</p>
          }
          {
            successMessage &&
            <p className="signup-info">{successMessage}</p>
          }
        </form>

        <p className="signup-page-link">Already on Rapture Ready TV?&nbsp;<Link style={linkStyle} to={`/login`}>Log in now.</Link></p>

      </div>
    )
  }
}

Signup.propTypes = {
  onSignupClick: PropTypes.func.isRequired,
  errorMessage: PropTypes.string
};

const mapDispatchToProps = (dispatch) => ({
  onSignupClick: (creds) => {dispatch(signup(creds))},
  clearMessages: () => {dispatch(clearMessages())},
  setPage: (page) => {dispatch(setPage(page))}
});

const mapStateToProps = (state) => ({
  successMessage: state.auth.successMessage,
  errorMessage: state.auth.errorMessage,
  isAuthenticated: state.auth.isAuthenticated
});

export default connect(mapStateToProps, mapDispatchToProps)(Signup)
