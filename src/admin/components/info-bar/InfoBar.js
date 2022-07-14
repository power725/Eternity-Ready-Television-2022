import React, { Component } from 'react';

import { connect } from 'react-redux';


import { clearMessages } from '../../redux/modules/admin';


class InfoBar extends Component {

  render() {

    const { errorMessage, successMessage } = this.props;

    var styleWrapper = {
      position: 'fixed',
      bottom: 0,
      padding: 15,
      backgroundColor: 'red',
      width: '100%',
      textAlign: 'center',
      color: 'white',
      fontSize: 18,
      borderTop: '2px solid white',
      zIndex: 1001,
      opacity: 0.7
    };

    var styleClose = {
      float: 'right',
      marginRight: 10,
      cursor: 'pointer'
    };

    if (!errorMessage && successMessage) {
      styleWrapper.backgroundColor = 'green';
    }

    const message = errorMessage || successMessage;

    if (!message) {
      return <div></div>
    }

    return (
      <div style={styleWrapper}>
        {message}
        <div style={styleClose}
             onClick={this.props.clearMessages}>
          X
        </div>
      </div>
    )
  }
}

const mapDispatchToProps = (dispatch) => ({
  clearMessages: () => {return dispatch(clearMessages())}
});

const mapStateToProps = (state) => ({
  errorMessage: state.admin.errorMessage,
  successMessage: state.admin.successMessage
});

export default connect(mapStateToProps, mapDispatchToProps)(InfoBar)