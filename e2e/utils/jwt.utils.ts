import {sign} from 'jsonwebtoken';
import {createTimestampSeconds} from './time.utils';

export function generateJWT(body: any, secretKey: string): string {
  return sign(body, secretKey);
}

export function createTestAuth0JWT(email: string): string {
  let secretKey = 'J-LR3RIOxrHIe-MH-NftFYr7VFTB8xO8W8T451s35hJ0-V55aGdUQGCl1hGZ1OG1';

  return generateJWT(getJwtContent(email), secretKey);
}

export function getJwtContent(email: string): any {
  let now = createTimestampSeconds();

  switch (email) {
    case 'super.user@test.com':
      return {
        "email": email,
        "email_verified": true,
        "picture": "",
        "iss": "https://sixcrm.auth0.com/",
        "sub": "google-oauth2|115021313586107803846",
        "aud": "",
        "exp": (now + 3600),
        "iat": now
      };

    case 'owner.user@test.com':
      return {
        "email": email,
        "email_verified": true,
        "picture": "",
        "iss": "https://sixcrm.auth0.com/",
        "sub": "",
        "aud": "",
        "exp": (now + 3600),
        "iat": now
      };

    case 'admin.user@test.com':
      return {
        "email": email,
        "email_verified": true,
        "picture": "",
        "iss": "https://sixcrm.auth0.com/",
        "sub": "",
        "aud": "",
        "exp": (now + 3600),
        "iat": now
      };

    case 'customerservice.user@test.com':
      return {
        "email": email,
        "email_verified": true,
        "picture": "",
        "iss": "https://sixcrm.auth0.com/",
        "sub": "",
        "aud": "",
        "exp": (now + 3600),
        "iat": now
      };

    case 'testingregistration@example.com':
      return {
        "email": email,
        "email_verified": false,
        "iss": "https://sixcrm.auth0.com/",
        "sub": "",
        "aud": "",
        "exp": (now + 3600),
        "iat": now
      };

    case 'e2e-test-admin@sixcrm.com':
      return {
        "email": email,
        "email_verified": false,
        "iss": "https://sixcrm.auth0.com/",
        "sub": "",
        "aud": "",
        "exp": (now + 3600),
        "iat": now
      };

    case 'unknown.user@test.com':
      return {
        "email": email,
        "email_verified": false,
        "iss": "https://sixcrm.auth0.com/",
        "sub": "1238109231",
        "aud": "",
        "exp": (now + 3600),
        "iat": now
      };
  }

  return '';
}
