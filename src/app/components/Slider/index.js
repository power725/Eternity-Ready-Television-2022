import React from 'react'
import Item from './Item'
import ItemDetails from './ItemDetails'
import Rx from 'rx'
var createReactClass = require('create-react-class');
const nextPrevSpeed = 0.8
function cloneItem(obj) {
  return obj;
  if (obj === null || typeof(obj) !== 'object' || 'isActiveClone' in obj)
    return obj;

  var temp
  if (obj instanceof Date)
    temp = new obj.constructor(); //or new Date(obj);
  else
    temp = obj.constructor();

  for (var key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      obj['isActiveClone'] = null;
      temp[key] = cloneItem(obj[key]);
      delete obj['isActiveClone'];
    }
  }

  return temp;
}

function isTouchDevice() {
  return !__SERVER__ && (
      ('ontouchstart' in window)
      || (navigator.MaxTouchPoints > 0)
      || (navigator.msMaxTouchPoints > 0)
    );
}
var Slider = createReactClass({

  getInitialState() {
    return {
      trackPosition: 0,
      activeSlide: null,
      goingNext: false,
      goingPrev: false,
      sliderHeight: 180,
      indexModifier: 0,
      preparePrev: false,
      mouseDown: false,
      detailsSlide: null,
      sliderHovered: false,
      isTouch: isTouchDevice(),
      items: cloneItem(this.props.items).concat(cloneItem(this.props.items))
    }
  },

  componentDidMount() {
    window.addEventListener('resize' , this.reInit);

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
    var items = cloneItem(nextProps.items).concat(cloneItem(nextProps.items));
    this.setState({
      items: items
    });
  },

  componentWillUnmount() {
    window.removeEventListener('resize', this.reInit);
  },

  reInit() {
    var self = this;

    var track = this.refs.track;
    if (!track) {
      return;
    }

    var mouseDown = Rx.Observable.fromEvent(track, 'touchstart');
    var mouseMove = Rx.Observable.fromEvent(track, 'touchmove');
    var mouseUp = Rx.Observable.fromEvent(track, 'touchend');

    var mouseDrag = mouseDown.selectMany( function (downEvent) {
      var start = downEvent.touches[0].clientX;
      return mouseMove.takeUntil(mouseUp).select(function(moveEvent) {
        moveEvent.preventDefault();
        if(moveEvent.touches[0].clientX - start > 70) {
          start = moveEvent.touches[0].clientX;
        }

        return {
          delta: moveEvent.touches[0].clientX - start
        };
      });
    });

    mouseDrag.subscribe( function (position) {
      var delta = position.delta;

      if(!self.state.goingNext && !self.state.goingPrev && !self.state.preparePrev) {
        if(delta > 30) {
          if(!self.state.goingPrev) {
            self.setState({
              mouseDown: false
            }, function() {
              self.goToPrev();
            });
          }
        }

        if(delta < -30) {
          if(!self.state.goingNext) {
            self.setState({
              mouseDown: false
            }, function() {
              self.goToNext();
            });
          }
        }

      }
    });


    this.setState({
      isTouch: isTouchDevice(),
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

  setVisibleItems(visibleItems) {
    this.setState({
      visibleItems: visibleItems
    })
  },

  closeDetails() {
    this.setState({
      detailsSlide: null
    })
  },

  goToNext() {

    if(this.state.goingNext) {
      return;
    }

    var self = this;

    this.setState({
      goingNext: true
    }, function() {

      var items = self.state.items;
      for(var i=0; i < self.state.visibleItems; i++) {
        items.push(items.shift());
      }

      var waitTime = nextPrevSpeed * 1000 + 10;

      setTimeout(function() {
        self.setState({
          goingNext: false,
          items: items,
          indexModifier: 1
        });
      }, waitTime);
    });
  },

  goToPrev() {
    if(this.state.goingPrev) {
      return;
    }

    var self = this;
    let items = self.state.items;
    for(var i=0; i < self.state.visibleItems; i++) {
      var last = items[items.length - 1];
      items.pop(last);
      items.unshift(last);
    }

    this.setState({
      preparePrev: true,
      items: items,
      goingPrev: false
    }, function() {
      setTimeout(function(){
        self.setState({
          preparePrev: false,
          goingPrev: true
        }, function() {
          var waitTime = nextPrevSpeed * 1000 + 10;

          setTimeout(function() {
            self.setState({
              goingPrev: false,
              indexModifier: 1
            });
          }, waitTime);
        })
      }, 0)

    });
  },

  showPrev() {
    if(this.state.indexModifier && this.state.sliderHovered && !this.state.isTouch){
      return true
    }
    return false
  },

  showNext() {
    if(this.state.sliderHovered && !this.state.isTouch){
      return true
    }
    return false
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
                   setVisibleItems={self.setVisibleItems}
                   moving={self.state.goingNext || self.state.goingPrev}
                   isTouch={self.state.isTouch}
      />
    });

    var carouselStyle = {
      'height': this.state.sliderHeight + 'px'
    };

    var trackStyle;

    if(this.state.goingNext && !this.state.goingPrev) {
      trackStyle = {
        'transition': 'all ' + nextPrevSpeed + 's',
        'transform': 'translateX(-' + (100 + 100 / this.state.visibleItems) + '%)',
        'WebkitTransitionTimingFunction': 'cubic-bezier(0.5, 0, 0.1, 1)'
      };
    } else if(!this.state.goingNext && !this.state.goingPrev && this.state.preparePrev) {
      trackStyle = {
        'transition': 'none',
        'transform': 'translateX(-' + (100 + 100 / this.state.visibleItems) + '%)',
      };
    } else if(!this.state.goingNext && this.state.goingPrev && !this.state.preparePrev) {
      trackStyle = {
        'transition': 'all ' + nextPrevSpeed + 's',
        'transform': 'translateX(-' + 100 / this.state.visibleItems + '%)',
        'WebkitTransitionTimingFunction': 'cubic-bezier(0.5, 0, 0.1, 1)'
      }
    } else if(!this.state.goingNext){
      trackStyle = {
        'transform': this.state.indexModifier === 0? 'translateX(0%)' : 'translateX(-' + 100 / this.state.visibleItems + '%)',
        'transition': 'none',
      };
    }

    return (
      <div>
        <div className='slider-container' ref='container' style={carouselStyle}>
          <span className='slider-title'>{this.props.sliderTitle.toUpperCase()}</span>
          <div className='carousel'
               ref="carousel" style={carouselStyle}
               onMouseEnter={this.setSliderHover}
               onMouseLeave={this.removeSliderHover}
          >
            <div className='carousel-track' ref="track" style={trackStyle}>
              {items}
            </div>

            {
              this.showNext() ? <div className='next' onClick={this.goToNext}></div> : ''
            }
            {
              this.showPrev() ? <div className='prev' onClick={this.goToPrev}></div> : ''
            }
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
export default Slider
