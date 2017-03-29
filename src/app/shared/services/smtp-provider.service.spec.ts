/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { SmtpProvidersService } from './smtp-providers.service';

describe('SmtpProvidersService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SmtpProvidersService]
    });
  });

  it('should ...', inject([SmtpProvidersService], (service: SmtpProvidersService) => {
    expect(service).toBeTruthy();
  }));
});
