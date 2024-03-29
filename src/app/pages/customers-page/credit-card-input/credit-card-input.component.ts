import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {CreditCard} from '../../../shared/models/credit-card.model';
import {isValidZip, isAllowedZip} from '../../../shared/utils/form.utils';
import {getStates, getCountries} from '../../../shared/utils/address.utils';
import {Address} from '../../../shared/models/address.model';
import {CreditCardsService} from '../../../entity-services/services/credit-cards.service';
import {CustomServerError} from '../../../shared/models/errors/custom-server-error';

@Component({
  selector: 'credit-card-input',
  templateUrl: 'credit-card-input.component.html',
  styleUrls: ['credit-card-input.component.scss']
})
export class CreditCardInputComponent implements OnInit {

  ccard: CreditCard;
  expirationMonth: string;
  expirationYear: string;
  isZip = isValidZip;
  isAllowedZipKey = isAllowedZip;

  months = ['01','02','03','04','05','06','07','08','09','10','11','12'];
  years = ['2017','2018','2019','2020','2021','2022','2023','2024','2025','2026','2027'];

  states: string[] = getStates();
  countries: string[] = getCountries();

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
  @Input() addMode: boolean;
  @Input() viewMode: boolean;
  @Input() standalone: boolean;
  @Output() updated: EventEmitter<CreditCard> = new EventEmitter();
  @Output() created: EventEmitter<CreditCard> = new EventEmitter();
  @Output() cancel: EventEmitter<boolean> = new EventEmitter();
  @Output() edit: EventEmitter<boolean> = new EventEmitter();

  formInvalid: boolean;

  constructor(private creditCardService: CreditCardsService) { }

  ngOnInit() { }

  createCreditCard(): void {
    this.formInvalid = !this.ccard.name || !this.ccard.ccnumber || !this.expirationMonth
      || !this.expirationYear || !this.ccard.address.line1 || !this.isValidAddress(this.ccard.address.line1)
      || !this.isValidCity(this.ccard.address.city) || !this.ccard.address.state || !this.ccard.address.zip
      || !this.isZip(this.ccard.address.zip) || !this.ccard.address.country;

    if (this.formInvalid) return;

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

  isValidAddress(address): boolean {
    let regex = /^[0-9]+\s.*/;
    return regex.test(address);
  }

  isValidCity(city): boolean {
    let regex = /^[a-zA-Z -]*$/;
    return regex.test(city) && city;
  }

}
