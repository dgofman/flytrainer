import * as env from '@root/environment.json';

export const environment = {
  production: false,
  native: false,
  endpoint: env.endpoint,
  clientid: env.clientid
};
