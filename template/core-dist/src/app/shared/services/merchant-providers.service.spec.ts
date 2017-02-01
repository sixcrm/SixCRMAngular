/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { MerchantProvidersService } from './merchant-providers.service';

describe('MerchantProvidersService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MerchantProvidersService]
    });
  });

  it('should ...', inject([MerchantProvidersService], (service: MerchantProvidersService) => {
    expect(service).toBeTruthy();
  }));
});
