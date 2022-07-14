import React, { Component } from 'react';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router'

import { authenticate, logout } from '../../redux/modules/admin';

import './login.css';

class Login extends Component {

  constructor(props) {
    super(props);

    this.state = {
      email: '',
      password: ''
    };

    this.onEmailChange    = this.onEmailChange.bind(this);
    this.onPasswordChange = this.onPasswordChange.bind(this);
    this.login            = this.login.bind(this);
  }

  componentWillMount() {
    this.props.logout();
  }

  componentWillReceiveProps(nextProps) {
    if (!this.props.isAuthenticated && nextProps.isAuthenticated) {
      browserHistory.push('/admin/');
    }
  }

  onEmailChange(event) {
    this.setState({email: event.target.value.trim()});

  }

  onPasswordChange(event) {
    this.setState({password: event.target.value.trim()});
  }

  login(event) {
    event.preventDefault();

    this.props.authenticate({email: this.state.email, password: this.state.password});
  }

  render() {
    return (
      <div style={{backgroundColor: '#FFF', height: '100%'}}>
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="wrapper">

                <div className="form-signin-heading">
                  Admin Login
                </div>

                  <div className="form-signin">
                    <form onSubmit={this.login}
                      onKeyPress={(target) => target.charCode==13 && this.login(target)}>
                      <input className="form-control email-input input"
                             value={this.state.email}
                             onChange={this.onEmailChange}
                             name="username" placeholder="Email Address" type="text" />
                      <input className="form-control password-input input"
                             value={this.state.password}
                             onChange={this.onPasswordChange}
                             name="password"  placeholder="Password" type="password" />
                      <button className="btn btn-lg btn-primary btn-block"
                              type="submit">
                        Login
                      </button>
                    </form>
                  </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}


const mapDispatchToProps = (dispatch) => ({
  authenticate: (email, password) => {return dispatch(authenticate(email, password))},
  logout: () => {return dispatch(logout())}
});

const mapStateToProps = (state) => ({
  isAuthenticated: state.admin.isAuthenticated || false,
  authToken: state.admin.token,
  errorMessage: state.admin.errorMessage,
  user: state.admin.user
});

export default connect(mapStateToProps, mapDispatchToProps)(Login)