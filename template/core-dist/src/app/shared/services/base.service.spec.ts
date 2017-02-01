/* tslint:disable:no-unused-variable */

import { inject, TestBed } from '@angular/core/testing';
import { BaseService } from './base.service';

describe('BaseService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [BaseService]
    });
  });

  it('should ...', inject([BaseService], (service: BaseService) => {
    expect(service).toBeTruthy();
  }));
});
