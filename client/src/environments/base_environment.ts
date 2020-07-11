import * as env from '@root/environment.json';

export default {
  // tslint:disable-next-line: no-string-literal
  ...env['default'],
  production: false,
  native: false
};
