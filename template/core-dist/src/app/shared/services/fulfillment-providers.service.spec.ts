/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { FulfillmentProvidersService } from './fulfillment-providers.service';

describe('FulfillmentProvidersService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FulfillmentProvidersService]
    });
  });

  it('should ...', inject([FulfillmentProvidersService], (service: FulfillmentProvidersService) => {
    expect(service).toBeTruthy();
  }));
});
