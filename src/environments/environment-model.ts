export interface EnvironmentModel {
  production: boolean,
  bareEndpoint: string,
  endpoint: string,
  publicendpoint: string,
  jwtEndpoint: string,
  clientID: string,
  domain: string,
  auth0RedirectUrl: string,
  translationsUrl: string,
  version: string,
  branding?: Branding;
}

export interface Branding {
  sidenavLogo?: string,
  sidenavCollapsedLogo?: string,
  registrationLogo: string
}
