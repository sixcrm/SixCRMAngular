/* tslint:disable:no-unused-variable */

import { inject } from '@angular/core/testing';
import { AuthenticationService } from './authentication.service';

describe('Service: Login', () => {
  beforeEach(() => {
  });

  it('should ...',
    inject([AuthenticationService],
      (service: AuthenticationService) => {
        expect(service).toBeTruthy();
      }));
});
