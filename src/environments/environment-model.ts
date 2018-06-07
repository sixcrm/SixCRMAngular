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
  name: string;
  useFeatureFlags: boolean
}

export interface Branding {
  registrationLogo: string,
  sidenavLogo: string,
  sidenavCollapsedLogo: string,
  sidenavFooterLogo: string,
  infoScreensLogo: string,
  comingSoonLogo: string,
  errorLogo: string,
  showGenericLoader: boolean
}
