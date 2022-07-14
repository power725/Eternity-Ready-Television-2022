import React from 'react'
import Card from './Card'
import { browserHistory, Link } from 'react-router'
import getThumbUrl from '../../helpers/getThumbUrl'
import getChannelUrl from '../../helpers/getChannelUrl'
const slideHoverScale = 190
const delayItemHover = 0
var createReactClass = require('create-react-class');
const Item = createReactClass({

  getInitialState(){
    return {
      hoverTimer: null,
      activeItem: null
    }
  },

  isActiveItem(){
    if(this.props.index === this.props.activeSlide)
      return true
    return false
  },

  itemHovered() {

    if(this.props.isTouch) {
      return;
    }

    if(!this.props.detailsSlide) {
      var self = this;
      this.setState({
        hoverTimer: setTimeout(function(){
          if(self.state.hoverTimer) {
            self.props.setActiveSlide(self.props.index);
          }
        }, delayItemHover),
      });
    } else {
      this.props.setDetailsSlide(this.props.item, this.props.index);
    }
  },

  itemMouseOut() {

    if(this.props.isTouch) {
      return;
    }

    this.setState({
      hoverTimer: null,
      activeStyle: false
    });
    this.props.setActiveSlide(null);
  },


  openUrl(url, event) {
    event.preventDefault()
    if(!this.props.isTouch) {
      return;
    };
    browserHistory.push(url)
  },

  componentWillReceiveProps(nextProps) {

    var self = this;
    if(nextProps.activeSlide !== nextProps.index) {
      if(this.state.sliderWidth !== nextProps.sliderWidth) {

        var itemWidth = self.refs.item.getBoundingClientRect().width;
        var itemsCount = parseInt(nextProps.sliderWidth / itemWidth, 10);

        this.setState({
          sliderWidth: nextProps.sliderWidth,
          visibleItems: itemsCount
        });

        self.props.setSliderHeight(itemWidth);
        self.props.setVisibleItems(itemsCount);
      }
    }
  },

  render: function() {
    var self = this;

    var itemClass = 'carousel-item';
    if(this.props.activeSlide === this.props.index) {
      itemClass += ' hovered';
    }

    var itemTransform = "translateY(-50%)";
    if(this.props.activeSlide !== null) {

      if(this.props.index < this.props.activeSlide) {
        if(this.state.visibleItems - 1 === this.props.activeSlide) {
          itemTransform  += ' translateX(-' + (slideHoverScale - 100) + '%)';
        } else if(this.props.activeSlide !== 0) {
          itemTransform += ' translateX(-' + (slideHoverScale - 100) / 2 + '%)';
        }
      } else if(this.props.index > this.props.activeSlide) {
        if(this.props.activeSlide === 0) {
          itemTransform  += ' translateX(' + (slideHoverScale - 100) + '%)';
        } else {
          if(this.props.activeSlide !== this.state.visibleItems - 1) {
            itemTransform  += ' translateX(' + (slideHoverScale - 100) / 2 + '%)';
          }
        }
      } else {
        if(this.props.index === 0) {
          itemTransform += " translateX(" + (slideHoverScale -100) / 2 + "%) scale(" + slideHoverScale / 100+ ")";
        } else if(this.props.index === this.state.visibleItems - 1) {
          itemTransform += " translateX(-" + (slideHoverScale - 100) / 2 + "%) scale(" + slideHoverScale / 100 + ")";
        } else {
          itemTransform += " scale(" + slideHoverScale / 100 + ")";
        }
      }
    }

    var itemStyle = {
      'transform': itemTransform,
    };

    if(this.props.selectedSlide === this.props.index && this.props.detailsSlide !== null) {
      itemClass += ' active'
    }

    const thumbUrl = getThumbUrl(this.props.item);
    const channelUrl = getChannelUrl(this.props.item);
    var itemWrapperStyle = {
      'backgroundImage': `url(${thumbUrl})`,
    };

    return (
      <div className={itemClass} ref='item'
           style={itemStyle}
           onMouseEnter={self.itemHovered}
           onMouseLeave={self.itemMouseOut}
           onClick={this.openUrl.bind(self, channelUrl)}
      >
        <div className='item-wrapper' style={itemWrapperStyle}>
          <Link to={channelUrl}>
            <img src={thumbUrl} />
          </Link>
          {this.isActiveItem() &&
            <div className="carousel-item-ring"></div>
          }
          <span>
            {this.isActiveItem() &&
              <Card
                _id={this.props.item._id}
                picture={this.props.item.picture}
                href={this.props.item.href}
                title={this.props.item.title}
                age={this.props.item.age}
                year={this.props.item.year}
                description={this.props.item.description}
                rating={this.props.item.rating}
                thumb={this.props.item.thumb}
                slug={this.props.item.slug}
              />
            }
          </span>
          <span className="details-arrow" onClick={function() {self.props.setDetailsSlide(self.props.item, self.props.index)}}>
              <b className="arrow"></b>
          </span>
        </div>
      </div>
    );
  }
});

export default Item
