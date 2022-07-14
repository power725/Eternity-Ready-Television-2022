import React, {
	Component
} from 'react'
import Search from '../Search'

import {
	browserHistory,
	Link
} from 'react-router'

import {
	connect
} from 'react-redux'
import {
	logout
} from '../../redux/modules/auth';
import UserDropDown from './UserDropDown';

// import logo from '../../commonResources/logo.png'

class HeaderDesktop extends Component {

	state = {
		dropDownVisible: false,
		hideDropDownTimer: null,
		isDark: false,
	};

	componentDidMount() {
		window.addEventListener('scroll', this.handleScroll);
	}

	componentWillUnmount() {
		window.removeEventListener('scroll', this.handleScroll);
	}

	handleLogout = () => {
		this.props.requestLogout();
		browserHistory.push('/login');
	};

	handleLogin = () => {
		browserHistory.push('/login');
	};

	handleSignup = () => {
		browserHistory.push('/signup');
	};

	handleScroll = (event) => {
		if (window.scrollY > 50) {
			this.setState({
				isDark: true
			})
		} else {
			this.setState({
				isDark: false
			})
		}
	}

	showDropDown = () => {
		this.cancelHideTimer();
		this.setState({
			dropDownVisible: true
		});
	}

	timerHide = () => {
		var self = this;
		this.setState({
			hideDropDownTimer: setTimeout(function() {
				if (self.state.hideDropDownTimer !== null) {
					self.hideDropDown();
				}
			}, 1000)
		})
	}

	dropDownTouch(e) {
		this.toggleDropDownMenu();
	}

	toggleDropDownMenu = () => {
		this.setState({
			dropDownVisible: !this.state.dropDownVisible
		})
	}

	cancelHideTimer = () => {
		this.setState({
			hideDropDownTimer: null
		})
	}

	hideDropDown = () => {
		this.setState({
			dropDownVisible: false
		});
	}

	openRadio() {
		window.open("http://eternityreadyradio.com/player/");
	}

	openDonate() {
		window.open("https://www.paypal.me/eternityready");
	}

	render() {

		const dropDownStyle = {
			'display': this.state.dropDownVisible ? 'block' : 'none'
		};

		const headerStyle = this.state.isDark ? 'headerDesktop headerDesktopOpaque' : 'headerDesktop';

		return (
			<div className={headerStyle} ref={(c) => this._header = c} >

          <img src={require("../../commonResources/logo.png")}
               style={{width: 105, cursor: 'pointer'}}
               alt="Enternity Ready Logo"
               onClick={() => {browserHistory.push('/browse')}}/>
			{
				!this.props.isAuthenticated &&
				<span style={{float: 'right'}}>
				  {
					this.props.page !== 'login' && <span
					  className="mainMenuLink" onClick={this.handleLogin}>Login</span>
				  }

				  {
					this.props.page === 'login' && <span
					  className="mainMenuLink" onClick={this.handleSignup}>Signup</span>
				  }
				</span>
			}

			<span>
			  <span className="dropdown mainMenuLink" onTouchStart={this.dropDownTouch}
					onMouseEnter={this.showDropDown} onMouseLeave={this.timerHide}></span>

			  <div className="dropdiv" style={dropDownStyle}
				   onMouseEnter={this.cancelHideTimer} onMouseLeave={this.timerHide}>
				<ul className="sectiondrop">
				  <li><a href="http://www.eternityready.org/devices" target="_blank">How to Watch</a></li>                  <li><a href=""></a></li>
				  <li><a href="http://www.eternityready.org/production" target="_blank">Originals</a></li>                  <li><a href=""></a></li>
				  <li><a href="http://www.eternityready.org/lineup.pdf" target="_blank">TV Line Up</a></li>
				</ul>
				<ul className="sectiondrop">
				  <li><a href="#">Faith &amp; Ministry</a></li>
				  <li><a href="#">Kids &amp; Family</a></li>
				  <li><a href="#">Bible Prophecy</a></li>
				  <li><a href="#">News &amp; Politics</a></li>
				  <li><a href="#">Movies &amp; Music</a></li>
				</ul>
				<ul className="sectiondrop">
				  <li><a href="#">Gaming &amp; Technology</a></li>
				  <li><a href="#">Health &amp; Sports</a></li>
				  <li><a href="#">International Networks</a></li>
				  <li><a href="#">Premium Channels</a></li>
				  <li><a href="#">All Channnels</a></li>
				</ul>
			  </div>
			  <span className="mainMenuLink" onClick={this.openRadio}>Radio</span>
			  <span className="mainMenuLink" onClick={this.openDonate}>Donate</span>

			  {
				//this.props.isAuthenticated &&
				//<span
				//  className="mainMenuLink">Hi, {this.props.user.name || this.props.user.email}!</span>
			  }

			  {
				this.props.isAuthenticated &&
				<UserDropDown user={this.props.user}
				  handleLogout={this.handleLogout} />
			  }
			  <Search device="desktop"/>

			</span>
        </div>
		);
	}
}

const mapStateToProps = (state) => ({
	isAuthenticated: state.auth.isAuthenticated || false,
	user: state.auth.user,
	page: state.auth.page
});

const mapDispatchToProps = (dispatch) => ({
	requestLogout: () => {
		return dispatch(logout())
	}
});

export default connect(mapStateToProps, mapDispatchToProps)(HeaderDesktop)
