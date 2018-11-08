// The file for the current environment will overwrite this one during build.
// Different environments can be found in ./environment.{dev|prod}.ts, and
// you can create your own and use it with the --env flag.
// The build system defaults to the dev environment.

import {EnvironmentModel} from './environment-model';

export const environment: EnvironmentModel = {
  production: false,
  bareEndpoint: 'http://localhost:3000/',
  endpoint: 'http://localhost:3000/graph/',
  publicendpoint: 'http://localhost:3000/publicgraph',
  jwtEndpoint: 'http://localhost:3000/token/acquire',
  clientID: 'U01RPXdYl63RE_4ACtr1znLWzNXCZMAY',
  domain: 'sixcrm-development.auth0.com',
  auth0RedirectUrl: 'http://localhost:4200',
  translationsUrl: 'https://d3gac4cnrn5mn6.cloudfront.net/',
  version: '0.0.0',
  name: 'local',
  useFeatureFlags: true
};
