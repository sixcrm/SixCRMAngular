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
  clientID: 'nTFV5EwEykOuZKCJ7Pngear63udSUqNr',
  domain: 'sixcrm.auth0.com',
  auth0RedirectUrl: 'https://admin.recursix.com',
  translationsUrl: 'https://d3gac4cnrn5mn6.cloudfront.net/',
  version: '0.0.0',
  name: 'priority',
  useFeatureFlags: true,
  branding: {
    registrationLogo: 'logo-recursix-registration.svg',
    sidenavLogo: 'logo-recursix.svg',
    infoScreensLogo: 'logo-recursix.svg',
    comingSoonLogo: 'logo-recursix-collapsed.svg',
    errorLogo: 'logo-recursix-collapsed.svg',
    showGenericLoader: true
  }
};
