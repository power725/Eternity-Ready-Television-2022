import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import style from './dropdown.css';

class Dropdown extends Component {

  constructor(props) {
    super(props);
    this.state = {
      opened: false
    }
  }

  componentWillMount() {
    window.addEventListener('click', this.windowsClickHandler);
  }

  componentWillUnmount() {
    window.removeEventListener('click', this.windowsClickHandler);
  }

  toggle = () => {
    this.setState({opened: !this.state.opened});
  };

  windowsClickHandler = (event) => {
    var target = event.target;
    var dropdownElement = ReactDOM.findDOMNode(this.refs.dropdown);

    if (dropdownElement && target != dropdownElement &&
      !dropdownElement.contains( event.target ) && this.state.opened) {
      this.setState({opened: false})
    }
  };

  render() {

    const title = React.cloneElement(this.props.title, {
      onClick: this.toggle
    });

    const items = this.props.items;
    var contentUlClasses = "content-ul";
    if (this.props.smallDevice) {
      contentUlClasses += ' small-device';
    }

    return (
      <li style={{position: 'relative'}} ref='dropdown'>
        { title }

        {
          this.state.opened &&
          <ul className={contentUlClasses}>
            { items }
          </ul>
        }
      </li>
    )
  }
}

export default Dropdown;