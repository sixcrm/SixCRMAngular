import {EnvironmentModel} from './environment-model';

export const environment: EnvironmentModel = {
  production: true,
  bareEndpoint: 'https://staging-api.sixcrm.com/',
  endpoint: 'https://staging-api.sixcrm.com/graph/',
  publicendpoint: 'https://staging-api.sixcrm.com/publicgraph',
  jwtEndpoint: 'https://staging-api.sixcrm.com/token/acquire',
  clientID: 'JM1tC2j7tycbu62el3oBhyklpNbk5x6F',
  domain: 'sixcrm.auth0.com',
  auth0RedirectUrl: 'https://staging-admin.sixcrm.com',
  translationsUrl: 'https://d3gac4cnrn5mn6.cloudfront.net/',
  version: '0.0.0'
};
