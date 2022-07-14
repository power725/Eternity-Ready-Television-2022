import superagent from 'superagent';
import cookie from 'react-cookie';

const methods = ['get', 'post', 'put', 'patch', 'del'];

function formatUrl(path, req) {
  const adjustedPath = path[0] !== '/' ? '/' + path : path;

  if (__SERVER__) {
    // Prepend host and port of the API server to the path.
    return req.WEPAPP_URI + adjustedPath;
  }

  return adjustedPath;
}

export default class ApiClient {
  constructor(req) {
    methods.forEach((method) =>
      this[method] = (path, { params, data, fields } = {}) => new Promise((resolve, reject) => {
        var request = superagent[method](formatUrl(path, req));

        if (params) {
          request.query(params);
        }

        if (__SERVER__ && req.get('cookie')) {
          request.set('cookie', req.get('cookie'));
        }

        //if (!__SERVER__) {
        //  let token = cookie.load('auth/token') || null;
        //  if (token) {
        //    request.set('Authorization', `${token}`);
        //  }
        //}

        if (data) {
          request.send(data);
        }

        if (fields) {
          Object.keys(fields).forEach(function (field) {
            request = request.field(field, fields[field])
          });
        }

        request.end((err, { body } = {}) => err ? reject(body || err) : resolve(body));
      }));
  }
  /*
   * There's a V8 bug where, when using Babel, exporting classes with only
   * constructors sometimes fails. Until it's patched, this is a solution to
   * "ApiClient is not defined" from issue #14.
   * https://github.com/erikras/react-redux-universal-hot-example/issues/14
   *
   * Relevant Babel bug (but they claim it's V8): https://phabricator.babeljs.io/T2455
   *
   * Remove it at your own risk.
   */
  empty() {}
}
