import * as env from '@root/environment.json';

export const environment = {
  production: true,
  native: true,
  endpoint: env.endpoint,
  clientid: env.clientid
};
