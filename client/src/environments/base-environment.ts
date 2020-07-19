import * as env from './environment.json';

export default {
  // tslint:disable-next-line: no-string-literal
  ...env['default'],
  production: false,
  native: false
};
