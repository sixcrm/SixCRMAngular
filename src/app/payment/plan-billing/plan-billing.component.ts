import {Component, OnInit, Input, EventEmitter, Output} from '@angular/core';
import {Plan} from '../plans/plan.model';
import {CreditCard} from '../../shared/models/credit-card.model';
import {
  isAllowedNumeric, isShorterThan, isValidZip, isAllowedZip, isValidCity,
  isValidAddress, isValidCountry, isValidState
} from '../../shared/utils/form.utils';
import {getCountries, getStates} from '../../shared/utils/address.utils';

@Component({
  selector: 'plan-billing',
  templateUrl: 'plan-billing.component.html',
  styleUrls: ['plan-billing.component.scss']
})
export class PlanBillingComponent implements OnInit {

  @Input() plan: Plan;
  @Input() creditCard: CreditCard = new CreditCard();

  @Output() creditCardSelected: EventEmitter<CreditCard> = new EventEmitter();
  @Output() changePlan: EventEmitter<boolean> = new EventEmitter();

  months = ['01','02','03','04','05','06','07','08','09','10','11','12'];
  years = ['2018','2019','2020','2021','2022','2023','2024','2025','2026','2027','2028'];
  countries = getCountries();
  states = getStates();
  plainMapper = (el) => el;

  formInvalid: boolean;

  isAllowedNumericKey = isAllowedNumeric;
  isShorterThan = isShorterThan;
  isZipValid = isValidZip;
  isAllowedZipKey = isAllowedZip;
  isCityValid = isValidCity;
  isAddressValid = isValidAddress;
  isCountryValid = isValidCountry;
  isStateValid = isValidState;

  constructor() { }

  ngOnInit() { }

  setMonth(month) {
    this.creditCard.expirationMonth = month;
  }

  setYear(year) {
    this.creditCard.expirationYear = year;
  }

  submitCreditCard() {
    this.formInvalid = this.isDataInvalid();

    if (this.formInvalid) return;

    this.creditCard.expiration = `${this.creditCard.expirationMonth}/${this.creditCard.expirationYear}`;

    this.creditCardSelected.emit(this.creditCard);
  }

  isCcNumberInvalid(): boolean {
    if (!this.creditCard.ccnumber) return true;

    return !/[0-9]/.test(this.creditCard.ccnumber) || this.creditCard.ccnumber.length < 12 || this.creditCard.ccnumber.length > 20;
  }

  isCvvInvalid(): boolean {
    if (!this.creditCard.cvv) return true;

    return !/[0-9]/.test(this.creditCard.cvv) || this.creditCard.cvv.length < 3 || this.creditCard.cvv.length > 4;
  }

  isDataInvalid() {
    return this.isCcNumberInvalid()
    || this.isCvvInvalid()
    || !this.creditCard.expirationMonth
    || !this.creditCard.expirationYear
    || !this.creditCard.name
    || this.creditCard.name.length < 2
    || !this.isAddressValid(this.creditCard.address.line1)
    || (this.creditCard.address.line2 && !this.isAddressValid(this.creditCard.address.line2))
    || !this.isCityValid(this.creditCard.address.city)
    || !this.isZipValid(this.creditCard.address.zip)
    || !this.isStateValid(this.creditCard.address.state)
    || !this.isCountryValid(this.creditCard.address.country)
  }
}
