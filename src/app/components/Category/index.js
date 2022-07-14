/* @flow */

import React, { Component } from 'react';
import PropTypes from 'prop-types'
// not working with server render
import Slider from '../Slider'
import ItemDetails from '../Slider/ItemDetails'

import style from './style.scss';

class CarouselSlide extends React.Component {
    render() {
        return (
            <div {...this.props}>
                {this.props.children}
            </div>
        );
    }
}

class Category extends Component {
    static propTypes = {
        category: PropTypes.object
    }
    render() {
        const settings = {
            slidesToShow: 5,
            slidesToMove: 1,
        };

        const { category } = this.props;
        category.channels = category.channels ? category.channels : [];
        return (
            <div className="Category">
                {/*category.name*/}
                {category.channels.length ? (
                    <div>
                        {/*<Frame
                            ref={c => this.pager = c}
                            viewsToShow="auto"
                            infinite
                            className="frame"
                        >
                            <Track className="track">
                                {category.channels.map((channel, index) => <ChannelSliderItem key={index} channel={channel} />)}
                            </Track>
                        </Frame>
                        <button onClick={() => this.refs.pager.prev()}>P</button>
                        <button onClick={() => this.refs.pager.next()}>N</button>*/}

                        {/*<button onClick={() => this.refs.slider.prev()}>P</button>
                        <Slider {...settings} ref="slider">
                            {category.channels.map((channel, index) => <ChannelSliderItem key={index} channel={channel}/>)}
                        </Slider>
                        <button onClick={() => this.refs.slider.next()}>N</button>*/}

                        <Slider key={category.name} items={category.channels} sliderTitle={category.name}/>
                    </div>
                ) : false }
            </div>
        );
    }
}

export default Category;
