import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {CreditCard} from '../../../../shared/models/credit-card.model';
import {CreditCardsService} from '../../../../shared/services/credit-cards.service';
import {getStates} from '../../../../shared/utils/address.utils';
import {Address} from '../../../../shared/models/address.model';
import {CustomServerError} from '../../../../shared/models/errors/custom-server-error';

@Component({
  selector: 'credit-card-input',
  templateUrl: './credit-card-input.component.html',
  styleUrls: ['./credit-card-input.component.scss']
})
export class CreditCardInputComponent implements OnInit {

  ccard: CreditCard;
  expirationMonth: string;
  expirationYear: string;

  months = ['01','02','03','04','05','06','07','08','09','10','11','12'];
  years = ['2017','2018','2019','2020','2021','2022','2023','2024','2025','2026','2027'];

  states: string[] = getStates();

  backupAddress: Address;

  @Input() set creditCard(ccard: CreditCard) {
    if (ccard) {
      this.ccard = ccard;
      if (this.ccard.expiration) {
        this.expirationMonth = this.ccard.expiration.substr(0, 2);
        this.expirationYear = '20' + this.ccard.expiration.substr(2, 4);
      }
    }
  };
  @Input() defaultAddress: Address;
  @Output() updated: EventEmitter<CreditCard> = new EventEmitter();
  @Output() created: EventEmitter<CreditCard> = new EventEmitter();
  @Output() cancel: EventEmitter<boolean> = new EventEmitter();

  constructor(private creditCardService: CreditCardsService) { }

  ngOnInit() { }

  createCreditCard(): void {
    if (this.expirationMonth && this.expirationYear) {
      this.ccard.expiration = this.expirationMonth + this.expirationYear.substr(2,4);
    }

    this.creditCardService.entityCreated$.take(1).subscribe(ccard => {
      if (ccard instanceof CustomServerError) return;

      this.created.next(ccard)
    });

    this.creditCardService.createEntity(this.ccard);
  }

  updateCreditCard(): void {
    if (this.expirationMonth && this.expirationYear) {
      this.ccard.expiration = this.expirationMonth + this.expirationYear.substr(2,4);
    }

    this.creditCardService.entityUpdated$.take(1).subscribe(ccard => {
      if (ccard instanceof CustomServerError) return;

      this.updated.next(ccard)
    });

    this.creditCardService.updateEntity(this.ccard);
  }

  selectMonth(month: string): void {
    this.expirationMonth = month;
  }

  selectYear(year: string): void {
    this.expirationYear = year;
  }

  toggleSameShippingAddress(value) {
    if (value.checked) {
      this.backupAddress = this.ccard.address;
      this.ccard.address = this.defaultAddress;
    } else  {
      this.ccard.address = this.backupAddress;
    }
  }

}
