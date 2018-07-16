import {browser} from 'protractor';
import {EnvironmentModel} from '../../src/environments/environment-model';
import {environment} from '../../src/environments/environment';
import * as environmentStage from '../../src/environments/environment.stage';
import * as environmentProd from '../../src/environments/environment.prod';

export function getEnvModel(): EnvironmentModel {
  const baseUrl = browser.baseUrl;
  const environments: EnvironmentModel[] = [environment, environmentStage.environment, environmentProd.environment];

  for (let env of environments) {
    if (env.auth0RedirectUrl === baseUrl) {
      return env;
    }
  }

  return environment;
}

export function getApiEndpoint(): string {
  return getEnvModel().bareEndpoint;
}