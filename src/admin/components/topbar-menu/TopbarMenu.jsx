import React, { Component } from 'react';
import ReactDOM             from 'react-dom';

import FontAwesome          from 'react-fontawesome';
import { connect }          from 'react-redux';
import { browserHistory }   from 'react-router'
import { Link }             from 'react-router';

import style          from './topbar-menu.css'
import { logout }     from '../../redux/modules/admin';

import Dropdown from '../dropdown/Dropdown';


class TopbarMenu extends Component {

  constructor(props) {
    super(props);

    this.defaultColor = '#3b5998';

    this.state = {
      topbarHeight: 60,
      backgroundColor: this.props.landingPage ? 'transparent':
        this.defaultColor,
      smallDevice: !__SERVER__ ? window.innerWidth < 768: false,
      expanded: false,
    };

  }

  componentWillMount() {
    if (!__SERVER__) {
      window.addEventListener('resize', this.resizeHandler);

      if (this.props.landingPage) {
        window.addEventListener('scroll', this.scrollHandler);
      }
    }
  }

  componentWillUnmount() {
    if (!__SERVER__) {

      window.removeEventListener('resize', this.resizeHandler);

      if (this.props.landingPage) {
        window.removeEventListener('scroll', this.scrollHandler);
      }
    }
  }

  scrollHandler = () => {
    if (window.scrollY >= this.state.topbarHeight + 50 &&
      this.state.backgroundColor != this.defaultColor) {
      this.setState({backgroundColor: this.defaultColor})
    }

    if (window.scrollY < this.state.topbarHeight + 50 &&
      this.state.backgroundColor != 'transparent') {
      this.setState({backgroundColor: 'transparent'})
    }
  };

  resizeHandler = () => {
    if (window.innerWidth < 768 && this.state.smallDevice === false) {
      this.setState({smallDevice: true});
    }

    if (window.innerWidth >= 768 && this.state.smallDevice === true) {
      this.setState({smallDevice: false, expanded: false});
    }
  };

  handleLogout = (event) => {
    event.preventDefault();

    this.props.logout();

    browserHistory.push("/admin/login");
  };

  render() {

    var topbarStyle = {
      height: this.state.topbarHeight,
      backgroundColor: this.state.backgroundColor
    };

    // fixed
    topbarStyle.position = 'fixed';
    topbarStyle.top = 0;
    topbarStyle.width = '100%';

    if (this.state.expanded) {
      topbarStyle.height = 'auto';
    }

    var className = "hide-small-device";
    if (this.state.smallDevice) {
      className = "show-small-device";
    }

    if (this.state.expanded) {
      topbarStyle.backgroundColor = this.defaultColor;
    }

    let dropdown, expandButton,leftMenu, rightMenu;
    if (this.state.smallDevice) {
      expandButton =
        <div className="expand-button"
             onClick={() => {this.setState({expanded: !this.state.expanded})}}
        >
          <FontAwesome name="expand" />
        </div>
    }

    if (this.props.isAuthenticated &&
       (!this.state.smallDevice || (this.state.smallDevice && this.state.expanded))){
      dropdown = {
        title:
          <a>
            {this.props.user.name || this.props.user.email} <FontAwesome name="caret-down"/>
          </a>,
        content: {
          items: [
            <li key={1}><Link to="/admin/logout" onClick={this.handleLogout}>Logout</Link></li>
          ]
        }
      };

      rightMenu =
        <ul className="right ul">
          <Dropdown title={dropdown.title}
                    items={dropdown.content.items}
                    smallDevice={this.state.smallDevice}
          />
        </ul>;

      leftMenu =
        <ul className="left ul">
          <li><Link to="/admin/users/">Users</Link></li>
          <li><Link to="/admin/channels/">Channels</Link></li>
        </ul>
    }

    return (

      <div className="topbar" style={topbarStyle}>
        <div className="container">

          <div className="brand">
            <Link to="/"><img src={require("../../../app/commonResources/logo.png")} /></Link>
          </div>

          <div className={className}>
            {leftMenu}
            {rightMenu}
            {expandButton}
          </div>


        </div>

      </div>

    )
  }
}


const mapDispatchToProps = (dispatch) => ({
  logout: (params) => {return dispatch(logout(params))}
});

const mapStateToProps = (state) => ({
  isAuthenticated: state.admin.isAuthenticated || false,
  authToken: state.admin.token,
  user: state.admin.user
});

export default connect(mapStateToProps, mapDispatchToProps)(TopbarMenu)