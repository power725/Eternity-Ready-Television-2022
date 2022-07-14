import React, { Component } from 'react'
import PropTypes from 'prop-types'
import HeaderDesktop from './HeaderDesktop'
import HeaderMobile from  './HeaderMobile'
import classNames from  'classnames'
import isUserAgentMobile from '../../helpers/isUserAgentMobile'
import style from './style.css'

class Header extends Component {
  state = {
    mobileMenuVisible: isUserAgentMobile()
  }
  static contextTypes = {
    router: PropTypes.object
  }

  componentDidMount = () => {
    window.addEventListener('resize', this.handleResize)
  }

  componentWillUnmount = () => {
    window.removeEventListener('resize', this.handleResize)
  };

  handleResize = () => {
    this.setState({
      mobileMenuVisible: isUserAgentMobile()
    })
  }
  hideMenu() {
    try {
      return /\/watch\//.test(this.context.router.location.pathname)
    } catch (e) {
      return false;
    }

  }

  render() {
    return (
      <header className={classNames('App-Header', { hideTopMenu: this.hideMenu() })}  ref={(c) => this._header = c}>
        { this.state.mobileMenuVisible ? <HeaderMobile /> :<HeaderDesktop />}
      </header>
    );
  }
}

export default Header
