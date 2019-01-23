import {Component, OnInit, Input} from '@angular/core';
import {CreditCard} from '../../models/credit-card.model';
import {getCountries, getStates} from '../../utils/address.utils';
import {
  isValidZip, isAllowedZip, isValidCity, isValidAddress, isValidCountry,
  isValidState, isAllowedNumeric
} from '../../utils/form.utils';
import {utc} from 'moment';
import {Address} from '../../models/address.model';

@Component({
  selector: 'payment-form',
  templateUrl: './payment-form.component.html',
  styleUrls: ['./payment-form.component.scss']
})
export class PaymentFormComponent implements OnInit {

  _creditCard: CreditCard = new CreditCard();
  _defaultAddress: Address;
  useDefaultAddress: boolean;

  @Input() set creditCard(card: CreditCard) {
    this._creditCard = card ? card.copy() : new CreditCard();
  }
  @Input() set stickyDefaultAddress(address: Address) {
    this._defaultAddress = address;

    if (this.useDefaultAddress && this._defaultAddress) {
      this._creditCard.address = this._defaultAddress;
    } else {
      this._creditCard.address = new Address();
      this.useDefaultAddress = false;
    }
  }
  @Input() set defaultAddress(address: Address) {
    this._defaultAddress = address ? address.copy() : undefined;
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
  years = Array.from({length: 10}, (x,i) => i + utc().year() + '');

  constructor() { }

  ngOnInit() {
  }

  public getValidCreditCard(): CreditCard {
    this.formInvalid = !this.isFormValid();

    if (this.formInvalid) return;

    this._creditCard.expiration = `${this._creditCard.expirationMonth}/${this._creditCard.expirationYear}`;

    return this._creditCard.copy();
  }

  public getValidCreditCardSticky(): CreditCard {
    this.formInvalid = !this.isFormValid();

    if (this.formInvalid) return;

    this._creditCard.expiration = `${this._creditCard.expirationMonth}/${this._creditCard.expirationYear}`;

    return this._creditCard;
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

  defaultAddressSwitched(value) {
    if (value.checked) {
      this._creditCard.address = this._defaultAddress;
    } else {
      this._creditCard.address = new Address();
    }
  }

}
