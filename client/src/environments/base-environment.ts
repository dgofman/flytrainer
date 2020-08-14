import * as env from './environment.json';
import * as proxy from './proxy-config.json';

export default {
  // tslint:disable-next-line: no-string-literal
  ...env['default'],
  proxy,
  secure: false,
  production: false,
  native: false
};
