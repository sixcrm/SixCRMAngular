// The file for the current environment will overwrite this one during build.
// Different environments can be found in ./environment.{dev|prod}.ts, and
// you can create your own and use it with the --env flag.
// The build system defaults to the dev environment.

import {EnvironmentModel} from './environment-model';

export const environment: EnvironmentModel = {
  production: false,
  bareEndpoint: 'https://development-api.sixcrm.com/',
  endpoint: 'https://development-api.sixcrm.com/graph/',
  publicendpoint: 'https://development-api.sixcrm.com/publicgraph',
  jwtEndpoint: 'https://development-api.sixcrm.com/token/acquire',
  clientID: 'JM1tC2j7tycbu62el3oBhyklpNbk5x6F',
  domain: 'sixcrm.auth0.com',
  auth0RedirectUrl: 'http://localhost:4200',
  translationsUrl: 'https://d3gac4cnrn5mn6.cloudfront.net/',
  version: '0.0.0',
  branding: {
    sidenavLogo: 'logo-recursix.png',
    registrationLogo: 'logo-recursix-registration.png'
  }
};
