import React from 'react'
import { Link } from 'react-router'

import getThumbUrl from '../../helpers/getThumbUrl'
import getChannelUrl from '../../helpers/getChannelUrl'
var createReactClass = require('create-react-class');
var ItemDetails = createReactClass({

  componentDidMount() {
    this.checkScroll();
  },

  componentWillReceiveProps(nextProps) {
    if(this.props.activeSlide !== nextProps.activeSlide) {
      this.refs.detailsContent.classList.add("reflow");
      var self = this;
      setTimeout(function() {
        self.refs.detailsContent.classList.remove("reflow");
      }, 100)
    }
  },

  checkScroll() {

  },

  render: function() {
    var className = 'slider-item-details';
    if(this.props.activeSlide) {
      className += ' slider-item-details-active';
    } else {
      className += ' slider-item-details-inactive';
    }

    var test = this.props.sliderHeight / 4 - 12;

    var detailsStyle = {
      'transform': 'translateY(-' + test + 'px)'
    };
    const thumbUrl = getThumbUrl(this.props.activeSlide);
    const channelUrl = getChannelUrl(this.props.activeSlide);
    return (
      <div className='slider-item-details-container' ref="details" style={detailsStyle}>
        <div className={className} ref="detailsContent">
          <div className='slider-details-left'>
            <h2>{this.props.activeSlide ? this.props.activeSlide.title : ''}</h2>
            <span className="stars">{ this.props.activeSlide && '★'.repeat(this.props.activeSlide.rating)}</span>
            {
              this.props.activeSlide ?
                this.props.activeSlide.age ?
                  <span className="slider-details-age">{this.props.activeSlide ?
                    this.props.activeSlide.age : ''}</span> :
                  '' :
                ''
            }

            <span className="year">{ this.props.activeSlide ? this.props.activeSlide.year : '' }</span>
            <span className="slider-details-info">{this.props.activeSlide ? this.props.activeSlide.description : ''}</span>
          </div>
          <div className='slider-details-right'>
            {this.props.activeSlide ?  <img src={thumbUrl} className='slider-details-image' role='presentation' /> : ''}
            <div className="slider-item-details-close" onClick={this.props.closeDetails}>x</div>
            <div className="gradient"></div>
            <Link to={channelUrl}>
              <div className="play"></div>
            </Link>
          </div>
        </div>
      </div>
    );
  }
});

export default ItemDetails;
