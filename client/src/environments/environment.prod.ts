import * as env from '@root/environment.json';

export const environment = {
  production: true,
  native: false,
  endpoint: env.endpoint,
  clientid: env.clientid
};
