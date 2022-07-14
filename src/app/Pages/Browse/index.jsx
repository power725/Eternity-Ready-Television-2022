/* @flow */

import React, { Component } from 'react';
import { connect } from 'react-redux';

import { listCategories } from '../../redux/modules/channels';

import Loader from '../../components/Loader';
import Category from '../../components/Category';
import Billboard from '../../components/Billboard';
import GoogleAd from '../../components/GoogleAd';
import Slider from '../../components/Slider'

class Browse extends Component {

  componentWillMount() {
    this.props.listCategories();
  }

  render() {
    const { isFetching, categories } = this.props;

    if (isFetching) {
      return <Loader />;
    }

    return (
      <div className="Browse">

        <Billboard />

        <div style={{display: 'flex', justifyContent: 'center', padding: '30px 15%'}} >
          <div style={{flex: 1}} >
            <GoogleAd
              classNames="adslot_1"
              client="ca-pub-8022147088754346"
              slot="4861967110"
            />
          </div>
        </div>

        {
          categories.map((category) =>
            <Category key={category._id} category={category} />
          )
        }

      </div>
    );
  }
}

const mapDispatchToProps = (dispatch) => ({
  listCategories: () => {dispatch(listCategories())}
});

const mapStateToProps = (state) => ({
  isFetching: state.channels.isFetching,
  categories: state.channels.categories
});

export default connect(mapStateToProps, mapDispatchToProps)(Browse)
