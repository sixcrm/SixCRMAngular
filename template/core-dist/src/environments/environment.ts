// The file for the current environment will overwrite this one during build.
// Different environments can be found in ./environment.{dev|prod}.ts, and
// you can create your own and use it with the --env flag.
// The build system defaults to the dev environment.

export const environment = {
  production: false,
  endpoint: 'https://api.sixcrm.com/graph',
  jwtEndpoint: 'https://api.sixcrm.com/token/acquire',
  clientID: 'SgDFx52uZuW4zYuqRDitS1iDUaP1geUU',
  domain: 'nikolabosic.eu.auth0.com',
  auth0RedirectUrl: 'http://localhost:4200'
};
