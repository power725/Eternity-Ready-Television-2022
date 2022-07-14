import cookie from 'react-cookie';

if (typeof window === "undefined" || window === null) {
  var localStorage = {
    getItem: () => {},
    setItem: () => {},
    removeItem: () => {}
  };
} else {
  var localStorage = window.localStorage;
}

const AUTHENTICATE_REQUEST = 'admin/auth/AUTHENTICATE_REQUEST';
const AUTHENTICATE_SUCCESS = 'admin/auth/AUTHENTICATE_SUCCESS';

const LOGOUT = 'LOGOUT';

const SIGNUP_REQUEST = 'admin/auth/SIGNUP_REQUEST';

const SHOW_SUCCESS = 'admin/auth/SHOW_SUCCESS';
const SHOW_ERROR = 'admin/auth/SHOW_ERROR';
const IGNORE_ACTION = 'admin/auth/IGNORE_ACTION';

const CLEAR_MESSAGES = 'admin/auth/CLEAR_MESSAGES';

const FETCH_CHANNELS_REQUEST = 'admin/FETCH_CHANNELS_REQUEST';
const FETCH_CHANNELS_SUCCESS = 'admin/FETCH_CHANNELS_SUCCESS';
const FETCH_CHANNELS_FAIL = 'admin/FETCH_CHANNELS_FAIL';

const initialState = {
  token: cookie.load('admin/auth/token'),
  user: cookie.load('admin/auth/user'),
  isAuthenticated: !!cookie.load('admin/auth/token'),

  errorMessage: '',
  successMessage: '',

  channels: [],
  fetchingChannels: false
};

export default function auth(state = initialState, action) {
  switch (action.type) {

    case AUTHENTICATE_REQUEST:

      //localStorage.removeItem('auth/token');
      //localStorage.removeItem('auth/user');

      cookie.remove('admin/auth/token', {path: '/'});
      cookie.remove('admin/auth/user', {path: '/'});

      return {
        ...state,
        errorMessage: '',
        successMessage: '',
        user: null,
        token: '',
        isAuthenticated: false
      };

    case AUTHENTICATE_SUCCESS:

      cookie.save('admin/auth/token', action.result.token, {path: '/'});
      if (action.result.user) {
        cookie.save('admin/auth/user', action.result.user, {path: '/'});
      }

      return {
        ...state,
        errorMessage: '',
        isAuthenticated: true,
        user: action.result.user,
        token: action.result.token
      };


    case LOGOUT:
      // delete from local storage

      console.log('remove cookieee', 'admin/auth/token');

      cookie.remove('admin/auth/token', {path: '/'});
      cookie.remove('admin/auth/user', {path: '/'});

      return {
        ...state,
        isAuthenticated: false,
        user: null,
        token: ''
      };

    case CLEAR_MESSAGES:
      return {
        ...state,
        errorMessage: '',
        successMessage: ''
      };

    case SHOW_ERROR:
      return {
        ...state,
        errorMessage: action.message || (action.result || {}).message || 'Ups!'
      };

    case SHOW_SUCCESS:
      return {
        ...state,
        successMessage: action.message || (action.result || {}).message
      };

    case FETCH_CHANNELS_REQUEST:
      return {
        ...state,
        successMessage: '',
        errorMessage: '',
        channels: [],
        fetchingChannels: true
      };

    case FETCH_CHANNELS_SUCCESS: {
      return {
        ...state,
        fetchingChannels: false,
        channels: action.result.channels || []
      }
    }

    case FETCH_CHANNELS_FAIL: {
      return {
        ...state,
        fetchingChannels: false,
        errorMessage: action.message || (action.result || {}).message || 'Ups!'
      }
    }

    default:
      return state
  }
};

export function authenticate({ email, password }) {
  return {
    types: [AUTHENTICATE_REQUEST, AUTHENTICATE_SUCCESS, SHOW_ERROR],
    promise: (client) => client.post('/api/admin/authenticate', {
      data: {
        email,
        password
      }
    })
  };
}

export function logout() {
  return {
    type: LOGOUT
  }
}


export function createUser(data) {
  return {
    types: [CLEAR_MESSAGES, SHOW_SUCCESS, SHOW_ERROR],
    promise: (client) => client.post('/api/admin/create-user', {
      data
    })
  };
}

export function updateUser(data) {
  return {
    types: [CLEAR_MESSAGES, SHOW_SUCCESS, SHOW_ERROR],
    promise: (client) => client.post('/api/admin/update-user', {
      data
    })
  };
}

export function getUsers(params) {
  return {
    types: [IGNORE_ACTION, IGNORE_ACTION, SHOW_ERROR],
    promise: (client) => client.get('/api/admin/list', {
      params: params
    })
  };
}

export function deleteUser(params) {
  return {
    types: [CLEAR_MESSAGES, SHOW_SUCCESS, SHOW_ERROR],
    restaurantId: params.id,
    promise: (client) => client.get('/api/admin/delete', {
      params: params
    })
  };
}

export function changePassword(data) {
  return {
    types: [CLEAR_MESSAGES, SHOW_SUCCESS, SHOW_ERROR],
    promise: (client) => client.post('/api/admin/change-password', {
      data
    })
  };
}

export function clearMessages() {
  return {
    type: CLEAR_MESSAGES
  }
}

export function showErrorMessage(message) {
  return {
    type: SHOW_ERROR,
    message
  }
}

export function getChannels(params) {
  params = params || {};

  return {
    types: [FETCH_CHANNELS_REQUEST, FETCH_CHANNELS_SUCCESS, FETCH_CHANNELS_FAIL],
    promise: (client) => client.get('/api/admin/get-channels', {
      params
    })
  };

}