import { Component, OnInit } from '@angular/core';
import {MatDialogRef} from '@angular/material';
import {CreditCard} from '../../shared/models/credit-card.model';
import {getCountries, getStates} from '../../shared/utils/address.utils';
import {
  isValidZip, isAllowedZip, isValidCity, isValidAddress, isValidCountry, isValidState, isAllowedNumeric
} from '../../shared/utils/form.utils';
import {utc} from 'moment';

@Component({
  selector: 'add-credit-card-dialog',
  templateUrl: './add-credit-card-dialog.component.html',
  styleUrls: ['./add-credit-card-dialog.component.scss']
})
export class AddCreditCardDialogComponent implements OnInit {

  creditCard: CreditCard;
  isDefaultCreditCard: boolean;
  hideDefaultCardSelection: boolean;

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

  constructor(private dialogRef: MatDialogRef<AddCreditCardDialogComponent>) { }

  ngOnInit() {
  }

  submit(): void {
    this.formInvalid = this.isCardInvalid() || this.isAddressInvalid();

    if (this.formInvalid) return;

    this.creditCard.expiration = `${this.creditCard.expirationMonth}/${this.creditCard.expirationYear}`;

    this.dialogRef.close({creditCard: this.creditCard, isDefaultCard: this.isDefaultCreditCard});
  }

  private isCardInvalid() {
    return !this.creditCard.name || this.isCcNumberInvalid() || this.isCvvInvalid() || this.isExpirationMonthInvalid() || this.isExpirationYearInvalid();
  }

  isCcNumberInvalid(): boolean {
    if (this.creditCard.id) return false;

    if (!this.creditCard.ccnumber) return true;

    return !/[0-9]/.test(this.creditCard.ccnumber) || this.creditCard.ccnumber.length < 12 || this.creditCard.ccnumber.length > 20;
  }

  isCvvInvalid(): boolean {
    if (this.creditCard.id) return false;

    if (!this.creditCard.cvv) return true;

    return !/[0-9]/.test(this.creditCard.cvv) || this.creditCard.cvv.length < 3 || this.creditCard.cvv.length > 4;
  }

  isExpirationMonthInvalid(): boolean {
    if (!this.creditCard.expirationMonth) return true;

    if(!/[0-9]/.test(this.creditCard.expirationMonth)) {
      return true;
    }

    return +this.creditCard.expirationMonth < 1 || +this.creditCard.expirationMonth > 12;
  }

  isExpirationYearInvalid(): boolean {
    if (!this.creditCard.expirationYear) return true;

    if(!/[0-9]/.test(this.creditCard.expirationYear)) {
      return true;
    }

    return +this.creditCard.expirationYear < utc().year() || +this.creditCard.expirationYear > utc().year()+20;
  }

  private isAddressInvalid() {
    return !this.creditCard.address.line1 || !this.isAddressValid(this.creditCard.address.line1)
    || (this.creditCard.address.line2 && !this.isAddressValid(this.creditCard.address.line2))
    || !this.isCityValid(this.creditCard.address.city)
    || !this.isStateValid(this.creditCard.address.state)
    || !this.creditCard.address.zip || !this.isZipValid(this.creditCard.address.zip)
    || !this.isCountryValid(this.creditCard.address.country);
  }

  close(): void {
    this.dialogRef.close({});
  }

}
