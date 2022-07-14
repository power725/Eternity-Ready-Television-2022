import React, { Component } from 'react';

import { connect } from 'react-redux';
import FontAwesome from 'react-fontawesome';
import { Link } from 'react-router';

import Search from '../search/Search';

import { getChannels, clearMessages } from '../../redux/modules/admin';

class ChannelRow extends Component {

  constructor(props) {
    super(props);

  }

  render() {
    var channel = this.props.channel;

    var rowStyle = {
      backgroundColor: 'white'
    };

    return (
      <tr className="user-row"
          style={rowStyle}
      >

        <td className="td-index">
            <span style={{color: 'rgb(115, 115, 115)', fontSize: 18}}>
              {channel.index}
            </span>
        </td>

        <td className="td-name">
          <div>{channel.title}</div>
        </td>

        <td>{
          (channel.categories || []).map(function (category) {
            return category.name
          }).join(' ')
        }</td>

        <td>{channel.views || 0}</td>

      </tr>

    )
  }
}

class ChannelsTable extends Component {

  render() {
    var channels = this.props.channels;
    for (var i = 0; i < channels.length; i++) {
      channels[i].index = i + 1;
    }

    return (
      <div className="users-table-wrapper">
        {
          !this.props.loading &&
          <table className="table">
            <thead>
            <tr>
              <th className="td-index">#</th>
              <th>Title</th>
              <th>Categories</th>
              <th onClick={this.props.onOrderChange}
                  style={{cursor: 'pointer'}}>Views</th>
            </tr>
            </thead>
            <tbody>
            {
              channels.map((channel) => {
                return <ChannelRow key={channel._id}
                                channel={channel}/>
              })
            }
            </tbody>
          </table>
        }

        {
          this.props.loading &&
          <div className="Loader">
            <img src={require("../../AdminApp/resources/loading.svg")} />
          </div>
        }
      </div>
    );
  }
}

class Channels extends Component {

  state = {
    channels: [],
    query: '',

    order: 0
  };

  componentWillMount() {
    this.props.getChannels();
  }

  componentWillReceiveProps(nextProps) {
    if (this.state.channels != nextProps.channels) {
      this.updateChannels(nextProps.channels);
    }
  }

  updateChannels(channels, query, order) {
    if (!channels) {
      channels = this.props.channels;
    }

    if (query == null || typeof query == 'undefined') {
      query = this.state.query;
    }

    if (order == null || typeof order == 'undefined') {
      order = this.state.order;
    }

    channels = channels.filter(function (channel) {
      const categories = (channel.categories || []).map(function (category) {
        return category.name
      }).join(' ').toLowerCase();

      return (channel.title || '').toLowerCase().indexOf(query) >= 0 ||
        categories.indexOf(query) >= 0
    });

    //channels = channels.map(function (channel) {
    //  channel.views = parseInt(Math.random() * 10);
    //  return channel;
    //});

    if (order === 1) {
      channels.sort((a, b) => (a.views || 0) - (b.views || 0));
    } else {
      channels.sort((a, b) => (b.views || 0) - (a.views || 0));
    }

    this.setState({
      channels: channels.filter(function (channel) {
        const categories = (channel.categories || []).map(function (category) {
          return category.name
        }).join(' ').toLowerCase();

        return (channel.title || '').toLowerCase().indexOf(query) >= 0 ||
            categories.indexOf(query) >= 0
      })
    });
  }

  onQueryChange = (query) => {
    this.setState({
      query: query
    });

    this.updateChannels(null, query);
  };

  onOrderChange = () => {
    this.setState({
      order: 1 - this.state.order
    });

    this.updateChannels(null, null, 1 - this.state.order);
  };

  render() {

    return (
      <div className="container admin" style={{marginTop: 100}}>
        <div className="row">
          <div className="col-md-12">
            <div style={{float: 'right', marginBottom: 20}}>
              <Search query={this.state.query}
                      onQueryChange={this.onQueryChange}/>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-md-12">
            <ChannelsTable channels={this.state.channels}
                           loading={this.props.loading}
                           onOrderChange={this.onOrderChange}/>
          </div>
        </div>
      </div>
    );
  }
}

const mapDispatchToProps = (dispatch) => ({
  getChannels: (params) => {return dispatch(getChannels(params))},
  clearMessages: () => {return dispatch(clearMessages())}
});

const mapStateToProps = (state) => ({
  channels: state.admin.channels,
  loading: state.admin.fetchingChannels
});

export default connect(mapStateToProps, mapDispatchToProps)(Channels)