import React, { Component } from 'react'
import Search from '../Search'


import { browserHistory, Link } from 'react-router'

import { connect } from 'react-redux'
import { logout } from '../../redux/modules/auth';


class HeaderMobile extends Component {

 state = {
    mobileMenuVisible: false,
  }


  toggleMobileMenu = () => {
    this.setState({
      mobileMenuVisible: !this.state.mobileMenuVisible
    })
  }


  togleRadio = (e) => {
    if(e.currentTarget.parentElement.querySelector('ul').style.display === "block") {
      e.currentTarget.parentElement.querySelector('ul').style.display="none";
    } else {
      e.currentTarget.parentElement.querySelector('ul').style.display="block";
    }
  }

  handleLogout = (e) => {
    e.preventDefault();

    this.props.requestLogout();

    this.toggleMobileMenu();
    browserHistory.push('/login');
  };

  handleLogin = (e) => {
    e.preventDefault();

    this.toggleMobileMenu();
    browserHistory.push('/login');
  };

  handleSignup = (e) => {
    e.preventDefault();

    this.toggleMobileMenu();
    browserHistory.push('/signup');
  };

  render() {

    var mobileMenuIconClass = '';
    var mobileMenuStyle = {'display': 'none'};
    if(this.state.mobileMenuVisible) {
      mobileMenuIconClass = 'open';
      mobileMenuStyle = {'display': 'block'};
    }

    return (
        <div className="header" id="header-mobile">
          <div className="mobileHeaderTop" >
            <div id="menu-icon" onClick={this.toggleMobileMenu} className={mobileMenuIconClass}>
              <span></span>
              <span></span>
              <span></span>
            </div>
            <img alt="Enternity Ready Logo" src={require("../../commonResources/logo.png")} />
            <Search />
          </div>

            <nav id="main-menu" style={mobileMenuStyle}>
              <ul className="menu" rel="Main Menu">
                <li>
                  <a href="#">
                    <span>Categories</span>
                  </a>
                  <ul className="column">
                    <li>
                      <a href="#">Faith &amp; Ministry</a>
                    </li>
                    <li>
                      <a href="#">Kids &amp; Family</a>
                    </li>
                    <li>
                      <a href="#">Bible Prophecy</a>
                    </li>
                    <li>
                      <a href="#">News &amp; Politics</a>
                    </li>
                    <li>
                      <a href="#">Movies &amp; Music</a>
                    </li>
                    <li>
                      <a href="#">Health &amp; Sports</a>
                    </li>
                    <li>
                      <a href="#">Gaming &amp; Technology</a>
                    </li>
                    <li>
                      <a href="#">Top-Channels</a>
                    </li>
                    <li>
                      <a href="#">Premium Channels</a>
                    </li>
                    <li>
                      <a href="#">Movie Trailers</a>
                    </li>
                    <li>
                      <a href="#">International Channels</a>
                    </li>
                  </ul>
                </li>
                <li>
                  <a href="#"><span>Radio Channels</span></a>
                  <ul>
                    <li>
                      <a href="#" onTouchStart={this.togleRadio}><span>Channels 11, 219 - 230</span></a>
                      <ul>
                        <li>
                          <a href="#">Channel 111 - Word Broadcasting</a>
                        </li>
                        <li>
                          <a href="#">Channel 219 - CC Music Radio</a>
                        </li>
                        <li>
                          <a href="#">Channel 220 - Alive In Chirst Radio</a>
                        </li>
                        <li>
                          <a href="#">Channel 221 - WBCL 90.3</a>
                        </li>
                        <li>
                          <a href="#">Channel 222 - The Life FM</a>
                        </li>
                        <li>
                          <a href="#">Channel 223 - The Joy FM</a>
                        </li>
                        <li>
                          <a href="#">Channel 224 - The Bridge Radio</a>
                        </li>
                        <li>
                          <a href="#">Channel 225 - The Blast Radio</a>
                        </li>
                        <li>
                          <a href="#">Channel 226 - Rejoin AM - WDRJ</a>
                        </li>
                        <li>
                          <a href="#">Channel 227 - Praise Radio</a>
                        </li>
                        <li>
                          <a href="#">Channel 228 - Moody Radio</a>
                        </li>
                        <li>
                          <a href="#">Channel 229 - Living Voice Radio</a>
                        </li>
                        <li>
                          <a href="#">Channel 230 - KSBJ89.3</a>
                        </li>
                      </ul>
                    </li>
                    <li>
                      <a href="#" onTouchStart={this.togleRadio}><span>Channels 231-240</span></a>
                      <ul>
                        <li>
                          <a href="#">Channel 231 - KNVBC</a>
                        </li>
                        <li>
                          <a href="#">Channel 232 - KFSI</a>
                        </li>
                        <li>
                          <a href="#">Channel 233 - KDIA 1640AM</a>
                        </li>
                        <li>
                          <a href="#">Channel 234 - His Kids Radio</a>
                        </li>
                        <li>
                          <a href="#">Channel 235 - Gospel Experience Radio</a>
                        </li>
                        <li>
                          <a href="#">Channel 236 - Cross Pop Radio</a>
                        </li>
                        <li>
                          <a href="#">Channel 237 - Christian Rock Radio</a>
                        </li>
                        <li>
                          <a href="#">Channel 238 - Christian Power Praise Radio</a>
                        </li>
                        <li>
                          <a href="#">Channel 239 - Christian Classic Rock Radio</a>
                        </li>
                        <li>
                          <a href="#">Channel 240 - Christian Hard Rock Radio</a>
                        </li>
                      </ul>
                    </li>
                    <li>
                      <a href="#" onTouchStart={this.togleRadio}><span>Channels 241-245</span></a>
                      <ul>
                        <li>
                          <a href="#">Channel 241 - KLTY 94.</a>
                        </li>
                        <li>
                          <a href="#">Channel 242 - K Love</a>
                        </li>
                        <li>
                          <a href="#">Channel 243 - My Bridge FM</a>
                        </li>
                        <li>
                          <a href="#">Channel 244 - Hebrew Nation Radio</a>
                        </li>
                        <li>
                          <a href="#">Channel 245 - Ref Net</a>
                        </li>
                      </ul>
                    </li>
                  </ul>
                </li>
                <li>
                  <a href="#"><span>Radio Categories</span></a>
                  <ul className="column">
                    <li>
                      <a href="#">Talk Radio</a>
                    </li>
                    <li>
                      <a href="#">Hymns</a>
                    </li>
                    <li>
                      <a href="#">Contemporary</a>
                    </li>
                    <li>
                      <a href="#">Gospel</a>
                    </li>
                    <li>
                      <a href="#">Christian Pop</a>
                    </li>
                    <li>
                      <a href="#">Christian Rock</a>
                    </li>
                    <li>
                      <a href="#">Eternity Ready Radio</a>
                    </li>
                  </ul>
                </li>
                <li>
                  <a href="#"><span>Tools</span></a>
                  <ul className="column">
                    <li>
                      <a href="http://www.eternityready.com/channels/lineup.pdf">TV Line UP</a>
                    </li>
                    <li>
                      <a href="#">All Channels</a>
                    </li>
                  </ul>
                </li>
                <ul className="menu" rel="Main Menu">
                  <li>
                    <a href="#">
                      <span>User</span>
                    </a>

					{ !this.props.isAuthenticated &&
						<ul className="column">
							<li>
							  <Link to="/login" onClick={this.handleLogin}>Login</Link>
							</li>
							<li>
							  <Link to="/signup" onClick={this.handleSignup}>Signup</Link>
							</li>
						</ul>
					}

					{ this.props.isAuthenticated &&
						<ul className="column">
						  <li>
							<Link to="/logout" onClick={this.handleLogout}>Logout</Link>
						  </li>
						</ul>
					}
                  </li>
                </ul>
              </ul>
            </nav>
        </div>
    );
  }
}

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated || false,
  user: state.auth.user
});

const mapDispatchToProps = (dispatch) => ({
  requestLogout: () => {return dispatch(logout())}
});

export default connect(mapStateToProps, mapDispatchToProps)(HeaderMobile)
