import * as env from './environment.json';

export default {
  // tslint:disable-next-line: no-string-literal
  ...env['default'],
  secure: false,
  production: false,
  native: false
};
