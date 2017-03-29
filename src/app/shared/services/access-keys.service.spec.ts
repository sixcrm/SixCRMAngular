/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { AccessKeysService } from './access-keys.service';

describe('AccessKeysService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AccessKeysService]
    });
  });

  it('should ...', inject([AccessKeysService], (service: AccessKeysService) => {
    expect(service).toBeTruthy();
  }));
});
