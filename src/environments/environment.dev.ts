import {EnvironmentModel} from './environment-model';

export const environment: EnvironmentModel = {
  production: true,
  bareEndpoint: 'https://development-api.sixcrm.com/',
  endpoint: 'https://development-api.sixcrm.com/graph/',
  publicendpoint: 'https://development-api.sixcrm.com/publicgraph',
  jwtEndpoint: 'https://development-api.sixcrm.com/token/acquire',
  clientID: 'U01RPXdYl63RE_4ACtr1znLWzNXCZMAY',
  domain: 'sixcrm-development.auth0.com',
  auth0RedirectUrl: 'https://development-admin.sixcrm.com',
  translationsUrl: 'https://d3gac4cnrn5mn6.cloudfront.net/',
  version: '0.0.0',
  name: 'development',
  useFeatureFlags: true
};
