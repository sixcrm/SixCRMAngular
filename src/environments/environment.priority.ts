// The file for the current environment will overwrite this one during build.
// Different environments can be found in ./environment.{dev|prod}.ts, and
// you can create your own and use it with the --env flag.
// The build system defaults to the dev environment.

import {EnvironmentModel} from './environment-model';

export const environment: EnvironmentModel = {
  production: true,
  bareEndpoint: 'https://api.recursix.com/',
  endpoint: 'https://api.recursix.com/graph/',
  publicendpoint: 'https://api.recursix.com/publicgraph',
  jwtEndpoint: 'https://api.recursix.com/token/acquire',
  clientID: 'JM1tC2j7tycbu62el3oBhyklpNbk5x6F',
  domain: 'recursix.auth0.com',
  auth0RedirectUrl: 'https://admin.recursix.com',
  translationsUrl: 'https://d35owrek0vay6q.cloudfront.net',
  version: '0.0.0',
  branding: {
    registrationLogo: 'logo-recursix-registration.png',
    sidenavLogo: 'logo-recursix.png',
    sidenavCollapsedLogo: 'logo-recursix-collapsed.png',
    infoScreensLogo: 'logo-recursix.png'
  }
};
