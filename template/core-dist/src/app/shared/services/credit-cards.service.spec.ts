/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { CreditCardsService } from './credit-cards.service';

describe('CreditCardsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CreditCardsService]
    });
  });

  it('should ...', inject([CreditCardsService], (service: CreditCardsService) => {
    expect(service).toBeTruthy();
  }));
});
