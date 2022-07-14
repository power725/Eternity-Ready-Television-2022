import React, { Component } from 'react';
import Modal from 'react-modal';

import { connect } from 'react-redux';

import { createUser, showErrorMessage, clearMessages } from '../../redux/modules/admin';


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
    minWidth: 400,
    maxWidth: '70%'
  }
};

class AddUser extends Component {

  state = {
    email: '',
    password: '',
    confirmPassword: ''
  };

  onEmailChange = (e) => {
    this.setState({ email: e.target.value })
  };

  onPasswordChange = (e) => {
    this.setState({ password: e.target.value })
  };

  onConfirmPasswordChange = (e) => {
    this.props.clearMessages();
    this.setState({ confirmPassword: e.target.value })
  };

  addUser = (e) => {
    e.preventDefault();

    if (this.state.password != this.state.confirmPassword) {
      return this.props.showErrorMessage('The confirmation password doesn\'t match the password')
    }

    this.props.createUser({
        email: this.state.email,
        password: this.state.password
      })
      .then((response) => {

        console.log('!!!!!');

        if (response.success === true) {
          console.log('call close with true');
          this.close(true);
        }
      });

  };

  close = (added) => {
    this.setState({
      email: '',
      password: '',
      confirmPassword: ''
    });

    this.props.close(added);
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
        <h1 style={{marginBottom: 50}}>Add New User</h1>


        <div className="form-signup">
          <form onSubmit={this.addUser}
                onKeyPress={(target) => target.charCode==13 && this.addUser(target)}>

            <input className="form-control email-input input"
                   value={this.state.email}
                   onChange={this.onEmailChange}
                   placeholder="Email Address" type="text" />

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
                    onClick={this.addUser}>
              Create
            </button>
          </form>
        </div>

      </Modal>
    )
  }
}


const mapDispatchToProps = (dispatch) => ({
  createUser: (params) => {return dispatch(createUser(params))},
  showErrorMessage: (message) => {return dispatch(showErrorMessage(message))},
  clearMessages: (params) => {return dispatch(clearMessages(params))}
});

const mapStateToProps = (state) => ({
});

export default connect(mapStateToProps, mapDispatchToProps)(AddUser)
