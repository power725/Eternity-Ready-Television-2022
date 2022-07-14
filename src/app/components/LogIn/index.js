import React, {Component} from 'react';
import PropTypes from 'prop-types'
import validator from 'validator';
import { connect } from 'react-redux';
import { browserHistory, Link } from 'react-router';

import { authenticate, clearMessages, logout, setPage } from '../../redux/modules/auth';
import SocialAuth from '../SocialAuth/SocialAuth';

import './style.css'

class Login extends Component {
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
      }
    }
  }

  componentWillMount() {
    this.props.clearMessages();
    this.props.logout();
    this.props.setPage('login');
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
      canSubmit: validator.isEmail(value) && !this.state.password.error && this.state.password.value.length > 0
    })
  };

  handlePassword = (e) => {
    let value = e.target.value.trim()
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
          value: value,
          error: `Your password must contain between 4 and 60 characters`
        }
      })
    }

    this.setState({
      canSubmit: !this.state.email.error && value.length >= 4 && value.length <= 60
    })
  };

  handleClick = (event) => {
    event.preventDefault();

    if (this.state.canSubmit){
      const creds = { email: this.state.email.value, password: this.state.password.value }
      this.props.authenticate(creds);
    } else {
      this.setState({
        password: {
          ...this.state.password,
          error: `Please correctly input your email and password`
        }
      })
    }
  };

  render () {

    const { errorMessage } = this.props;
    const linkStyle = {
      color: '#daedf9',
      textDecoration: 'underline'
    };

    return (
      <div className="login">
        <form onSubmit={this.handleClick}>
          <h1 className="login-heading">Log in</h1>

          <SocialAuth />

          <label className="login-inputgroup">
            <span>Email</span>
            <input type="text" className="login-input"
                   autoComplete="off"
                   onChange={this.handleEmail} name="email"/>
            {this.state.email.error &&
              <p className="login-error">{this.state.email.error}</p>
            }
          </label>
          <label  className="login-inputgroup">
            <span>Password</span>
            <input type="password" className="login-input"
                   autoComplete="off"
                   onChange={this.handlePassword} name="password"/>
            {this.state.password.error &&
              <p className="login-error">{this.state.password.error}</p>
            }
          </label>
          <button type="button"
                  type="submit"
                  className="btn btn-light login-button"
                  onClick={this.handleClick}>Log In</button>
          {
            this.props.errorMessage &&
            <p className="main-login-error">{errorMessage}</p>
          }

        </form>

        <p className="forget-link"><Link style={linkStyle} to={`/forgot-password`}>Forgot your password?</Link></p>
        <p className="signup-link">New to Rapture Ready TV?&nbsp;<Link to={`/signup`} style={linkStyle}>Sign up now.</Link></p>


      </div>
    )
  }
}

Login.propTypes = {
  authenticate: PropTypes.func.isRequired,
  errorMessage: PropTypes.string
};

const mapDispatchToProps = (dispatch) => ({
  authenticate: (creds) => {
    dispatch(authenticate(creds))
  },
  clearMessages: (creds) => {dispatch(clearMessages(creds))},
  logout: (creds) => {dispatch(logout(creds))},
  setPage: (page) => {dispatch(setPage(page))}
});

const mapStateToProps = (state) => ({
  errorMessage: state.auth.errorMessage,
  isAuthenticated: state.auth.isAuthenticated
});

export default connect(mapStateToProps, mapDispatchToProps)(Login)
