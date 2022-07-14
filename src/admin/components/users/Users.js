import React, { Component } from 'react';

import { connect } from 'react-redux';
import FontAwesome from 'react-fontawesome';
import { Link } from 'react-router';

import style from './users.css';
import AddUser from './AddUser';
import ChangePassword from './ChangePassword';
import Search from '../search/Search';

import { getUsers, createUser, deleteUser,
  updateUser, clearMessages } from '../../redux/modules/admin';

class UserRow extends Component {

  constructor(props) {
    super(props);

    this.state = {
      hover: false
    };

    this.deleteUser = this.deleteUser.bind(this);
    this.onMouseEnter = this.onMouseEnter.bind(this);
    this.onMouseLeave = this.onMouseLeave.bind(this);
  }

  onMouseEnter() {
    this.setState({hover: true});
  }


  onMouseLeave() {
    this.setState({hover: false});
  }

  deleteUser() {

    this.props.deleteUser({id: this.props.user._id});
  }

  updateAdminFlag = (event) => {
    this.props.updateUser({
      id: this.props.user._id,
      isAdmin: !this.props.user.isAdmin
    });
  };

  updateValidatedFlag = (event) => {
    this.props.updateUser({
      id: this.props.user._id,
      validated: !this.props.user.validated
    });
  };

  updateSuspendedFlag = (event) => {
    this.props.updateUser({
      id: this.props.user._id,
      suspended: !this.props.user.suspended
    });
  };

  openChangePassword = () => {
    this.props.openChangePassword(this.props.user);
  };

  render() {
    var user = this.props.user;

    var rowStyle = {
      backgroundColor: 'white'
    };

    if (this.state.hover) {
      rowStyle.backgroundColor = '#f9f9f9';
    }

    if (this.state.loading) {
      rowStyle.backgroundColor = 'yellow';
    }


    return (
      <tr className="user-row"
          style={rowStyle}
          onMouseEnter={() => this.onMouseEnter()}
          onMouseLeave={() => this.onMouseLeave()}
      >

        <td className="td-index">
          {this.state.hover && <FontAwesome name="remove"
                                            style={{cursor: 'pointer', color: 'rgb(115, 115, 115)'}}
                                            onClick={this.deleteUser} />
          }
          {
            !this.state.hover &&
            <span style={{color: 'rgb(115, 115, 115)', fontSize: 18}}>
              {user.index}
            </span>
          }

        </td>

        <td className="td-avatar">
          <img src={user.avatar}/>
        </td>

        <td className="td-name">
          <div>{user.name}</div>
        </td>

        <td>{user.email}</td>

        <td>
          {user.auth && user.auth.provider}

          {
            user.auth && user.auth.provider === 'email' &&
            <span>
              &nbsp;(<a onClick={this.openChangePassword}>change pass</a>)
            </span>
          }
        </td>

        <td>
          <input
                 onClick={this.updateAdminFlag}
                 checked={user.isAdmin}
                 type="checkbox" />
        </td>

        <td>
          <input
            onClick={this.updateValidatedFlag}
            checked={user.validated}
            type="checkbox" />

        </td>

        <td>
          <input
            onClick={this.updateSuspendedFlag}
            checked={user.suspended}
            type="checkbox" />

        </td>


      </tr>

    )
  }
}

class UsersTable extends Component {


  render() {
    var users = this.props.users;
    for (var i = 0; i < users.length; i++) {
      users[i].index = i + 1;
    }

    return (
      <div className="users-table-wrapper">
        {
          !this.props.loading &&
          <table className="table">
            <thead>
              <tr>
                <th className="td-index">#</th>
                <th>Avatar</th>
                <th>Name</th>
                <th>Email</th>
                <th>Auth</th>
                <th>Admin</th>
                <th>Activated</th>
                <th>Suspended</th>
              </tr>
            </thead>
            <tbody>
            {
              users.map((user) => {
                return <UserRow key={user._id}
                                deleteUser={this.props.deleteUser}
                                updateUser={this.props.updateUser}
                                openChangePassword={this.props.openChangePassword}
                                user={user}/>
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

class Users extends Component {

  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      users: [],
      filteredUsers: [],
      query: '',

      changePassword: {
        isOpen: false,
        user: {}
      },

      addUser: {
        isOpen: false
      }
    };

    this.createUser = this.createUser.bind(this);
  }

  componentWillMount() {
    this.getUsers()
  }

  componentDidUpdate(prevProps, prevState) {

  }

  getUsers () {
    this.setState({loading: true});

    console.log('get userss');

    this.props.getUsers({})
      .then((response) => {

        this.setState({users: response.users});
        this.updatedFilteredUsers();
        this.setState({loading: false});

      })
      .catch(() => this.setState({loading: false}))
  }

  deleteUser = (params) => {
    this.props.deleteUser(params)
      .then(() => {
        this.getUsers();
      });
  };

  updateUser = (params) => {
    this.setState({loading: true});

    return this.props.updateUser(params)
      .then(() => {
        this.getUsers();
      })
      .catch(() => {
        this.setState({loading: false})
      })
  };

  createUser(data) {

    var promise = this.props.createUser(data);

    promise
      .then((response) => {
        if (response.success) {
          this.getUsers();
        }
      })
      .catch(() => {});

    return promise;
  }

  openChangePassword = (user) => {
    this.setState({
      changePassword: { isOpen: true, user: user }
    });
  };

  closeChangePassword = () => {
    this.setState({
      changePassword: { isOpen: false, user: {} }
    });
  };

  openAddUser = () => {
    this.setState({
      addUser: { isOpen: true }
    })
  };

  addNewUser = () => {
    this.setState({
      addUser: { isOpen: false }
    });
  };

  closeAddUser = (added) => {

    console.log('IN CLOSE ADD');

    this.setState({
      addUser: { isOpen: false }
    });

    if (added) {
      this.getUsers();
    }
  };

  updatedFilteredUsers = (query) => {
    query = (query != null && typeof query != 'undefined' ? query : this.state.query).toLowerCase();


    if (!query) {
      return this.setState({ filteredUsers: this.state.users });
    }

    this.setState({
      filteredUsers: this.state.users.filter((user) => {
        return (user.name || '').toLowerCase().indexOf(query) >= 0 ||
          (user.email || '').toLowerCase().indexOf(query) >= 0
      })
    })
  };

  onQueryChange = (query) => {
    this.setState({
      query: query
    });

    this.updatedFilteredUsers(query);
  };

  render() {

    return (
      <div className="container admin" style={{marginTop: 100}}>

        <AddUser isOpen={this.state.addUser.isOpen}
                 close={this.closeAddUser}
                 addNewUser={this.addNewUser}/>

        <ChangePassword isOpen={this.state.changePassword.isOpen}
                        user={this.state.changePassword.user}
                        close={this.closeChangePassword}/>

        <div className="row">

          <div className="col-md-12">

            <button style={{marginBottom: 20, float: 'left'}}
                    onClick={this.openAddUser}
                    className="btn btn-default">
              Add New User
            </button>

            <div style={{float: 'right'}}>
              <Search query={this.state.query}
                      onQueryChange={this.onQueryChange}/>
            </div>

          </div>
        </div>

        <div className="row">

          <div className="col-md-12">
            <UsersTable users={this.state.filteredUsers}
                        loading={this.state.loading}
                        deleteUser={this.deleteUser}
                        updateUser={this.updateUser}
                        openChangePassword={this.openChangePassword}/>
          </div>

        </div>
      </div>
    )
  }
}

const mapDispatchToProps = (dispatch) => ({
  getUsers: (params) => {return dispatch(getUsers(params))},
  createUser: (params) => {return dispatch(createUser(params))},
  deleteUser: (params) => {return dispatch(deleteUser(params))},
  updateUser: (params) => {return dispatch(updateUser(params))},
  clearMessages: () => {return dispatch(clearMessages())}
});

const mapStateToProps = (state) => ({
});

export default connect(mapStateToProps, mapDispatchToProps)(Users)
