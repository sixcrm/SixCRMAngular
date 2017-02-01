/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { LoadBalancersService } from './load-balancers.service';

describe('LoadBalancersService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LoadBalancersService]
    });
  });

  it('should ...', inject([LoadBalancersService], (service: LoadBalancersService) => {
    expect(service).toBeTruthy();
  }));
});
