//import { LOGOUT } from '../modules/auth';
import { browserHistory } from 'react-router'

export default function clientMiddleware(client) {
  return ({dispatch, getState}) => {
    return next => action => {

      if (typeof action === 'function') {
        return action(dispatch, getState);
      }

      const { promise, types, ...rest } = action; // eslint-disable-line no-redeclare
      if (!promise) {
        return next(action);
      }

      const [REQUEST, SUCCESS, FAILURE] = types;
      next({...rest, type: REQUEST});

      const actionPromise = promise(client);
      actionPromise.then(
        (result) => {
          if (result.success === true) {
            next({...rest, result, type: SUCCESS})
          } else {
            next({...rest, result, type: FAILURE})
          }
        },
        (error) => {
          if (error.status === 401) {
            // TODO: move this to a better place
            // Unauthorized

            return next({...rest, error, type: 'LOGOUT'});
            //return browserHistory.push('/admin/login');
          }

          next({...rest, error, type: FAILURE})
        }
      ).catch((error)=> {

        console.error('MIDDLEWARE ERROR:', error);
        next({...rest, error, type: FAILURE});
      });

      return actionPromise;
    };
  };
}
