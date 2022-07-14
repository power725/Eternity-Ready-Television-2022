import React, {
	Component
} from 'react'
import PropTypes from 'prop-types'
import {
	connect
} from 'react-redux'
import {
	browserHistory
} from 'react-router'
import debounce from 'javascript-debounce';
// import { gf, activateSearch, deactivateSearch } from '../../actions/'
import style from './style.css';

class Search extends Component {

	static defaultProps = {
		query: '',
		isActive: false,
	}

	static propTypes = {
		query: PropTypes.string.isRequired,
		isActive: PropTypes.bool.isRequired,
	}
	constructor(props) {
			super(props);
			this.state = {
				query: '',
				isActive: false,
			};
		}
		/*
		deactivateSearch = (e) => {
		  if(e.target !== this.refs.label && e.target !== this.refs.close && e.target !== this.refs.input && this._input.value === '') {
		    this.props.deactivateSearch()
		    browserHistory.push(`/browse`)
		  }
		}*/

	activateSearch = () => {

		this.setState({
			isActive: true
		}, () => {
			this._input.focus()
		})
		return false;
	}

	clearSearch = () => {
		this.setState({
			isActive: false,
			query: ''
		}, () => {});
		this._input.value = '';
		browserHistory.push(`/browse`);
	}

	updateSearch = (e) => {
		console.log(new Date().getTime(), this.state.query);
		if (this.state.query !== null && this.state.query !== '' && this.state.isActive) {
			// browserHistory.push(`/search/${e.target.value}`);
			browserHistory.push(`/search/${this.state.query}`);
		} else {
			browserHistory.push(`/browse`);
		}
	}

	handleChange = (e) => {
		//this.props.setQuery(e.target.value)
		this.setState({
			query: e.target.value
		}, () => {});
		if (e.target.value === '') {
			browserHistory.push(`/browse`);
		}
	}

	render() {

		const labelStyle = {
			'display': !this.state.isActive ? 'block' : 'none'
		};

		const closeSearchStyle = {
			'display': this.state.isActive ? 'block' : 'none'
		};

		var inputClass = this.state.isActive ? 'active' : 'inactive'

		return (
			<div className="search-input">
        <button id="search-en" onClick={this.activateSearch} style={labelStyle} ref="label">Search</button>
        <input
          type="text"
          id="inpsearch"
          className={inputClass}
          placeholder="Search..."
          onKeyUp={debounce(this.updateSearch, 500)}
          onChange={this.handleChange}
          value={this.state.query}
          ref={(c) => this._input = c}
        />
        <span style={closeSearchStyle} id="closesearch" onClick={this.clearSearch} ref="close">x</span>
      </div>
		);
	}
}

const mapStateToProps = (state, ownProps) => ({
	query: "",
	isActive: false,
})

export default connect(mapStateToProps, {
	// setQuery,
	// activateSearch,
	// deactivateSearch
})(Search)
