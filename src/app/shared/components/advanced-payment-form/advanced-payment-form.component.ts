import {Component, OnInit, Input} from '@angular/core';
import {CreditCard} from '../../models/credit-card.model';
import {getCountries, getStates} from '../../utils/address.utils';
import {
  isValidZip, isAllowedZip, isValidCity, isValidAddress, isValidCountry,
  isValidState, isAllowedNumeric
} from '../../utils/form.utils';
import {utc} from 'moment';

@Component({
  selector: 'advanced-payment-form',
  templateUrl: './advanced-payment-form.component.html',
  styleUrls: ['./advanced-payment-form.component.scss']
})
export class AdvancedPaymentFormComponent implements OnInit {
  _creditCard: CreditCard = new CreditCard();

  @Input() set creditCard(card: CreditCard) {
    this._creditCard = card ? card.copy() : new CreditCard();
  }
  @Input() showSensitiveData: boolean;

  formInvalid: boolean;

  plainMapper = (el) => el;
  countries: string[] = getCountries();
  states: string[] = getStates();

  isZipValid = isValidZip;
  isAllowedZipKey = isAllowedZip;
  isCityValid = isValidCity;
  isAddressValid = isValidAddress;
  isCountryValid = isValidCountry;
  isStateValid = isValidState;
  isAllowedNumericKey = isAllowedNumeric;

  months = ['01','02','03','04','05','06','07','08','09','10','11','12'];
  years = ['2018','2019','2020','2021','2022','2023','2024','2025','2026','2027','2028'];

  constructor() { }

  ngOnInit() {
  }

  public getValidCreditCard(): CreditCard {
    this.formInvalid = !this.isFormValid();

    if (this.formInvalid) return;

    this._creditCard.expiration = `${this._creditCard.expirationMonth}/${this._creditCard.expirationYear}`;

    return this._creditCard.copy();
  }

  public isFormValid(): boolean {
    return !this.isCardInvalid() && !this.isAddressInvalid();
  }

  private isCardInvalid(): boolean {
    return !this._creditCard.name
      || this.isCcNumberInvalid()
      || this.isCvvInvalid()
      || this.isExpirationMonthInvalid()
      || this.isExpirationYearInvalid();
  }

  private isAddressInvalid() {
    return !this._creditCard.address.line1 || !this.isAddressValid(this._creditCard.address.line1)
      || !this.isCityValid(this._creditCard.address.city)
      || !this.isStateValid(this._creditCard.address.state)
      || !this._creditCard.address.zip || !this.isZipValid(this._creditCard.address.zip)
      || !this.isCountryValid(this._creditCard.address.country);
  }

  isCcNumberInvalid(): boolean {
    if (this._creditCard.id) return false;

    if (!this._creditCard.ccnumber) return true;

    return !/[0-9]/.test(this._creditCard.ccnumber) || this._creditCard.ccnumber.length < 12 || this._creditCard.ccnumber.length > 20;
  }

  isCvvInvalid(): boolean {
    if (this._creditCard.id) return false;

    if (!this._creditCard.cvv) return true;

    return !/[0-9]/.test(this._creditCard.cvv) || this._creditCard.cvv.length < 3 || this._creditCard.cvv.length > 4;
  }

  isExpirationMonthInvalid(): boolean {
    if (!this._creditCard.expirationMonth) return true;

    if(!/[0-9]/.test(this._creditCard.expirationMonth)) {
      return true;
    }

    return +this._creditCard.expirationMonth < 1 || +this._creditCard.expirationMonth > 12;
  }

  isExpirationYearInvalid(): boolean {
    if (!this._creditCard.expirationYear) return true;

    if(!/[0-9]/.test(this._creditCard.expirationYear)) {
      return true;
    }

    return +this._creditCard.expirationYear < utc().year() || +this._creditCard.expirationYear > utc().year()+20;
  }

  setMonth(month) {
    this._creditCard.expirationMonth = month;
  }

  setYear(year) {
    this._creditCard.expirationYear = year;
  }

}
