import React, { Component } from 'react';
import Modal from 'react-modal';

import { connect } from 'react-redux';

import { changePassword, showErrorMessage, clearMessages } from '../../redux/modules/admin';

const customStyles = {
  overlay: {
    background: 'rgba(17, 17, 17, 0.80)',
    zIndex: 500
  },
  content : {
    top: '30%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    padding: 40,
    minWidth: 350,
    maxWidth: '70%',
  }
};

class ChangePassword extends Component {

  state = {
    password: '',
    confirmPassword: ''
  };

  onPasswordChange = (e) => {
    this.props.clearMessages();
    this.setState({ password: e.target.value })
  };

  onConfirmPasswordChange = (e) => {
    this.props.clearMessages();
    this.setState({ confirmPassword: e.target.value })
  };

  changePassword = (e) => {
    e.preventDefault();

    if (this.state.password != this.state.confirmPassword) {
      return this.props.showErrorMessage('The confirmation password doesn\'t match the password')
    }

    this.props.changePassword({
      password: this.state.password,
      userId: this.props.user._id
    })
      .then((response) => {
        if (response.success === true) {
          this.close();
        }
      });

  };

  close = () => {
    this.setState({
      password: '',
      confirmPassword: ''
    });

    this.props.close();
  };

  render() {

    return (
      <Modal
        isOpen={this.props.isOpen}
        onAfterOpen={() => {}}
        onRequestClose={this.close}
        style={customStyles}
        contentLabel="Modal"
      >
        <h4 style={{marginBottom: 30}}>
          {this.props.user.name || this.props.user.email} <br />
        </h4>

        <div className="form-signup">
          <form onSubmit={this.changePassword}
                onKeyPress={(target) => target.charCode==13 && this.changePassword(target)}>

            <input className="form-control email-input input"
                   value={this.state.password}
                   onChange={this.onPasswordChange}
                   placeholder="Password" type="password" />

            <input className="form-control password-input input"
                   value={this.state.confirmPassword}
                   onChange={this.onConfirmPasswordChange}
                   placeholder="Confirm Password" type="password" />


            <button className="btn btn-lg btn-primary btn-block"
                    type="submit"
                    onClick={this.changePassword}>
              Change Password
            </button>
          </form>
        </div>

      </Modal>
    )
  }
}


const mapDispatchToProps = (dispatch) => ({
  changePassword: (params) => {return dispatch(changePassword(params))},
  showErrorMessage: (message) => {return dispatch(showErrorMessage(message))},
  clearMessages: (params) => {return dispatch(clearMessages(params))}
});

const mapStateToProps = (state) => ({
});

export default connect(mapStateToProps, mapDispatchToProps)(ChangePassword)