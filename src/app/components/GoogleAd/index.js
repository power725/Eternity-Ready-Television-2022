import React, {Component} from 'react'
import PropTypes from 'prop-types'
import style from './style.css';
class GoogleAd extends Component{
  static defaultProps = {
    style: { display: 'inline-block' }
  }

  static propTypes = {
    style: PropTypes.object,
    client: PropTypes.string.isRequired,
    slot: PropTypes.string.isRequired,
    format: PropTypes.string,
    classNames: PropTypes.string
  }

  componentDidMount = () => {
    (window.adsbygoogle = window.adsbygoogle || []).push({})
  }

  render() {
    return (
      <ins className={ "adsbygoogle " + this.props.classNames }
        style={this.props.style}
        data-ad-client={this.props.client}
        data-ad-slot={this.props.slot}></ins>
    );
  }
}

export default GoogleAd
