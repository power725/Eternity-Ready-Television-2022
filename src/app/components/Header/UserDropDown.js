// npm libs
import ReactDOM from 'react-dom';
import React, {
	Component
} from 'react';
import {
	browserHistory
} from 'react-router';

class UserDropDown extends Component {

	constructor(props) {
		super(props);
		this.state = {
			dropDownVisible: false,
			hideDropDownTimer: null,
			maxNameLength: !__SERVER__ && window.innerWidth >= 880 ? 22 : 13
		};
	}

	componentDidMount = () => {
		window.addEventListener('resize', this.handleResize);
	};

	componentWillUnmount = () => {
		window.removeEventListener('resize', this.handleResize);
	};

	handleResize = () => {
		const newLength = window.innerWidth >= 880 ? 22 : 13;
		if (newLength != this.state.maxNameLength) {
			this.setState({
				maxNameLength: newLength
			});
		}
	};

	showDropDown = () => {
		this.cancelHideTimer();
		this.setState({
			dropDownVisible: true
		});
	};

	timerHide = () => {
		var self = this;
		this.setState({
			hideDropDownTimer: setTimeout(function() {
				if (self.state.hideDropDownTimer !== null) {
					self.hideDropDown();
				}
			}, 1000)
		});
	};

	dropDownTouch(e) {
		this.toggleDropDownMenu();
	}

	toggleDropDownMenu = () => {
		this.setState({
			dropDownVisible: !this.state.dropDownVisible
		});
	};

	cancelHideTimer = () => {
		this.setState({
			hideDropDownTimer: null
		});
	};

	hideDropDown = () => {
		this.setState({
			dropDownVisible: false
		});
	};

	handleChangePassword = () => {
		browserHistory.push('/change-password');
		this.hideDropDown();
	};

	render() {

		const maxLength = this.state.maxNameLength;
		const username = (this.props.user.email || '').split('@')[0];
		var name = (this.props.user.name || username) || 'Account';

		if (name.length > maxLength) {
			name = name.slice(0, maxLength - 3) + "...";
		}

		return (

			<span className="mainMenuLink"
            style={{position: 'relative', float: 'right'}}>

            <span
	            onTouchStart={this.dropDownTouch}
	            onMouseEnter={this.showDropDown}
	            onMouseLeave={this.timerHide}>
        			▾ {name}
            </span>

        		{
					this.state.dropDownVisible &&
					<ul className="userdropdown-content-ul"
					onMouseEnter={this.cancelHideTimer}
					onMouseLeave={this.timerHide}>
						<li onClick={this.props.handleLogout}>Logout</li>
						{
							this.props.user.auth.provider === 'email' &&
							<li onClick={this.handleChangePassword}>Change Password</li>
						}
					</ul>
        		}

      	</span>
		);
	}
}

export default UserDropDown;