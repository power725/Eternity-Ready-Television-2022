import React from 'react'
import Item from './Slider/Item'
import ItemDetails from './Slider/ItemDetails'
var createReactClass = require('create-react-class');
var SearchRow = createReactClass({

  getInitialState() {
    return {
      trackPosition: 0,
      activeSlide: null,
      goingNext: false,
      goingPrev: false,
      sliderHeight: 250,
      indexModifier: 0,
      preparePrev: false,
      mouseDown: false,
      detailsSlide: null,
      sliderHovered: false
    }
  },



  componentDidMount() {
    window.addEventListener('resize' , this.reInit);

    this.setState({
      items: this.props.items,
      isTouch: this.isTouchDevice()
    });

    var self = this;

    setTimeout(function() {
      self.reInit();

      // var track = self.refs.track;
      //     track.addEventListener('touchstart', self.onMouseDown);
      //     track.addEventListener('touchend', self.onMouseUp);
      //     track.addEventListener('touchmove', self.onMouseMove);

    }, 0)
  },

  componentWillReceiveProps(nextProps) {
    this.setState({
      items: nextProps.items
    });
  },

  isTouchDevice() {
    return (('ontouchstart' in window)
    || (navigator.MaxTouchPoints > 0)
    || (navigator.msMaxTouchPoints > 0));
  },



  componentWillUnmount() {
    window.removeEventListener('resize', this.reInit);
  },

  reInit() {
    this.setState({
      isTouch: this.isTouchDevice(),
      sliderWidth: document.body.getBoundingClientRect().width
    });
  },

  setSliderHeight(newHeight) {
    this.setState({
      sliderHeight: newHeight * 1.1
    });
  },

  setSliderHover() {
    this.setState({
      sliderHovered: true
    })
  },

  removeSliderHover() {
    this.setState({
      sliderHovered: false
    })
  },

  setActiveSlide(slide) {
    this.setState({
      activeSlide: slide
    })
  },

  setDetailsSlide(slide, index) {
    this.setState({
      activeSlide: null,
      detailsSlide: slide,
      selectedSlide: index
    })
  },

  closeDetails() {
    this.setState({
      detailsSlide: null
    })
  },

  render: function() {
    if(!this.state.items) {
      return false;
    }

    var self = this;

    var items = this.state.items.map(function(elem, index) {
      return <Item
                   key={`item_${index - self.state.indexModifier}`}
                   item={elem}
                   setSliderHeight={self.setSliderHeight}
                   sliderWidth={self.state.sliderWidth}
                   setActiveSlide={self.setActiveSlide}
                   detailsSlide={self.state.detailsSlide}
                   selectedSlide={self.state.selectedSlide}
                   setDetailsSlide={self.setDetailsSlide}
                   activeSlide={self.state.activeSlide}
                   index={index - self.state.indexModifier}
                   setVisibleItems={self.props.setVisibleItems}
                   moving={self.state.goingNext || self.state.goingPrev}
                   isTouch={self.state.isTouch}
      />
    });

    var carouselStyle = {
      'height': this.state.sliderHeight + 'px'
    };

    return (
      <div>
        <div className='slider-container' ref='container' style={carouselStyle}>
          <span className='slider-title'>{this.props.sliderTitle.toUpperCase()}</span>
          <div className='carousel'
               ref="carousel" style={carouselStyle}
               onMouseEnter={this.setSliderHover}
               onMouseLeave={this.removeSliderHover}
          >
            <div className='carousel-track' ref="track">
              {items}
            </div>
          </div>
        </div>
        {
          this.state.detailsSlide?
            <ItemDetails
              key={`item_details_${this.props.index}`}
              sliderHeight={this.state.sliderHeight}
              activeSlide={this.state.detailsSlide}
              closeDetails={this.closeDetails}
            /> : ''
        }
      </div>
    );
  }
});
export default SearchRow
