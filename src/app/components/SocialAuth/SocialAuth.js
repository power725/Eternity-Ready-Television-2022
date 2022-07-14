import React, {Component} from 'react';

import { connect } from 'react-redux';
import FontAwesome from 'react-fontawesome';

import { loginSuccess  } from '../../redux/modules/auth';
import { browserHistory } from 'react-router';

import './social-auth.css';

class SocialAuth extends Component {

  componentDidMount() {
    window.oauthHandler = this.oauthHandler;
  }

  oauthHandler = (response) => {

    if (response.success === true) {
      this.props.loginSuccess(response);

      browserHistory.push('/browse');
    } else {
      // show error
    }
  };

  render () {

    let text = 'Sign in';
    if (this.props.signup === true) {
      text = 'Sign up';
    }

    return (
      <div>
        <div className="socia-signups">
          <a className={`btn btn-default btn-facebook btn-social btn-block`}
             onClick={() => {
                      window.open('/auth/facebook')
                     }}>
            <FontAwesome name="facebook" /> {text} with Facebook
          </a>

          <a className={`btn btn-default btn-twitter btn-social btn-block`}
             onClick={() => {
                      window.open('/auth/twitter')
                     }}>
            <FontAwesome name="twitter" /> {text} with Twitter
          </a>
        </div>

        <div className="or-line">
            <span className="or-line-text">
              OR
            </span>
        </div>

      </div>
    )
  }
}


const mapStateToProps = (state) => ({

});

const mapDispatchToProps = (dispatch) => ({
  loginSuccess: (result) => { return dispatch(loginSuccess(result)) }
});

export default connect(mapStateToProps, mapDispatchToProps)(SocialAuth)
