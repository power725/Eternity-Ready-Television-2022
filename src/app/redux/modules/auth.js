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

const AUTHENTICATE_REQUEST = 'auth/AUTHENTICATE_REQUEST';
const AUTHENTICATE_SUCCESS = 'auth/AUTHENTICATE_SUCCESS';

const LOGOUT = 'LOGOUT';

const SIGNUP_REQUEST = 'auth/SIGNUP_REQUEST';

const SHOW_SUCCESS = 'auth/SHOW_SUCCESS';
const SHOW_ERROR = 'auth/SHOW_ERROR';
const IGNORE_ACTION = 'auth/IGNORE_ACTION';

const CLEAR_MESSAGES = 'auth/CLEAR_MESSAGES';

const RESET_DONATE_MODAL_COUNTER = 'auth/RESET_DONATE_MODAL_COUNTER';
const DECREMENT_DONATE_MODAL_COUNTER = 'auth/DECREMENT_DONATE_MODAL_COUNTER';

const SET_PAGE = 'auth/SET_PAGE';

const DONATE_INTERVAL = 2;

let donateCounter = -1;
if(localStorage.getItem('auth/donateCounter')) {
  donateCounter = parseInt(localStorage.getItem('auth/donateCounter'));
}

donateCounter = Math.min(donateCounter, DONATE_INTERVAL);

const initialState = {
  token: cookie.load('auth/token'),
  user: cookie.load('auth/user'),
  isAuthenticated: !!cookie.load('auth/token'),

  errorMessage: '',
  successMessage: '',

  donateModalCounter: donateCounter,
  page: ''
};

export default function auth(state = initialState, action) {
  switch (action.type) {

    case AUTHENTICATE_REQUEST:

      //localStorage.removeItem('auth/token');
      //localStorage.removeItem('auth/user');

      cookie.remove('auth/token', {path: '/'});
      cookie.remove('auth/user', {path: '/'});

      return {
        ...state,
        errorMessage: '',
        user: null,
        token: '',
        isAuthenticated: false
      };

    case AUTHENTICATE_SUCCESS:
      //localStorage.setItem('auth/token', action.result.token);
      cookie.save('auth/token', action.result.token, {path: '/'});
      if (action.result.user) {
        //localStorage.setItem('auth/user', JSON.stringify(action.result.user));
        cookie.save('auth/user', action.result.user, {path: '/'});
      }

      return {
        ...state,
        loginErrorMessage: '',
        isAuthenticated: true,
        user: action.result.user,
        token: action.result.token
      };


    case LOGOUT:
      // delete from local storage
      //localStorage.removeItem('auth/token');
      //localStorage.removeItem('auth/user');

      cookie.remove('auth/token', {path: '/'});
      cookie.remove('auth/user', {path: '/'});

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

    case RESET_DONATE_MODAL_COUNTER:
      localStorage.setItem('auth/donateCounter', DONATE_INTERVAL);

      return {
        ...state,
        donateModalCounter: DONATE_INTERVAL
      };

    case DECREMENT_DONATE_MODAL_COUNTER:
      localStorage.setItem('auth/donateCounter', state.donateModalCounter - 1);

      return {
        ...state,
        donateModalCounter: state.donateModalCounter - 1
      };

    case SET_PAGE:
      return {
        ...state,
        page: action.page
      };

    default:
      return state
  }
};

export function authenticate({ email, password }) {
  return {
    types: [AUTHENTICATE_REQUEST, AUTHENTICATE_SUCCESS, SHOW_ERROR],
    promise: (client) => client.post('/api/user/authenticate', {
      data: {
        email,
        password
      }
    })
  };
}

export function loginSuccess({ user, token }) {
  return {
    type: AUTHENTICATE_SUCCESS,
    result: {
      user,
      token
    }
  }
}

export function signup({ email, password }) {
  return {
    types: [CLEAR_MESSAGES, SHOW_SUCCESS, SHOW_ERROR],
    promise: (client) => client.post('/api/user/signup', {
      data: {
        email,
        password
      }
    })
  };
}

export function sendForgotPasswordEmail(email) {
  return {
    types: [CLEAR_MESSAGES, SHOW_SUCCESS, SHOW_ERROR],
    promise: (client) => client.post('/api/user/send-forgot-password-email', {
      data: {
        email
      }
    })
  };
}

export function changePassword({ password }) {
  return {
    types: [CLEAR_MESSAGES, SHOW_SUCCESS, SHOW_ERROR],
    promise: (client) => client.post('/api/user/change-password', {
      data: {
        password
      }
    })
  };
}

export function resetPassword({ token, password }) {
  return {
    types: [CLEAR_MESSAGES, SHOW_SUCCESS, SHOW_ERROR],
    promise: (client) => client.post('/api/user/reset-password', {
      data: {
        token,
        password
      }
    })
  };
}

export function clearMessages() {
  return {
    type: CLEAR_MESSAGES
  }
}

export function logout() {
  return {
    type: LOGOUT
  }
}

export  function resetDonateCounter() {
  return {
    type: RESET_DONATE_MODAL_COUNTER
  }
}

export  function decrementDonateCounter() {
  return {
    type: DECREMENT_DONATE_MODAL_COUNTER
  }
}


export function createUser(data) {
  return {
    types: [IGNORE_ACTION, IGNORE_ACTION, SHOW_ERROR],
    promise: (client) => client.post('/api/user/create-user', {
      data
    })
  };
}

export function updateUser(data) {
  return {
    types: [IGNORE_ACTION, IGNORE_ACTION, SHOW_ERROR],
    promise: (client) => client.post('/api/user/update-user', {
      data
    })
  };
}

export function getUsers(params) {
  return {
    types: [IGNORE_ACTION, IGNORE_ACTION, SHOW_ERROR],
    promise: (client) => client.get('/api/user/list', {
      params: params
    })
  };
}

export function deleteUser(params) {
  return {
    types: [IGNORE_ACTION, IGNORE_ACTION, SHOW_ERROR],
    restaurantId: params.id,
    promise: (client) => client.get('/api/user/delete', {
      params: params
    })
  };
}

export function setPage(page) {
  return {
    type: SET_PAGE,
    page
  }
}