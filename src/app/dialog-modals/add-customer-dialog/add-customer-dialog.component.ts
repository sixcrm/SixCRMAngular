import { Component, OnInit } from '@angular/core';
import {Customer} from '../../shared/models/customer.model';
import {MatDialogRef} from '@angular/material';
import {
  isValidZip, isValidAddress, isValidCountry, isValidState,
  isValidCity, isAllowedZip, isValidEmail
} from '../../shared/utils/form.utils';
import {getPhoneNumberMask} from '../../shared/utils/mask.utils';
import {getCountries, getStates} from '../../shared/utils/address.utils';

@Component({
  selector: 'add-customer-dialog',
  templateUrl: './add-customer-dialog.component.html',
  styleUrls: ['./add-customer-dialog.component.scss']
})
export class AddCustomerDialogComponent implements OnInit {

  customer: Customer;

  isZipValid = isValidZip;
  isAllowedZipKey = isAllowedZip;
  isCityValid = isValidCity;
  isAddressValid = isValidAddress;
  isCountryValid = isValidCountry;
  isStateValid = isValidState;
  isEmailValid = isValidEmail;

  mask = getPhoneNumberMask();

  formInvalid: boolean;

  countries: string[] = getCountries();
  states: string[] = getStates();

  plainMapper = (el) => el;

  constructor(private dialogRef: MatDialogRef<AddCustomerDialogComponent>) { }

  ngOnInit() {
  }

  cancel() {
    this.dialogRef.close(undefined);
  }

  save() {
    this.formInvalid = this.isInfoInvalid() || this.isAddressInvalid();

    if (this.formInvalid) return;

    this.dialogRef.close({customer: this.customer})
  }

  private isInfoInvalid() {
    return !this.customer.firstName || !this.customer.lastName || !this.isEmailValid(this.customer.email);
  }

  private isAddressInvalid() {
    return !this.customer.address.line1 || !this.isAddressValid(this.customer.address.line1)
      || (this.customer.address.line2 && !this.isAddressValid(this.customer.address.line2))
      || !this.isCityValid(this.customer.address.city)
      || !this.isStateValid(this.customer.address.state)
      || !this.customer.address.zip || !this.isZipValid(this.customer.address.zip)
      || !this.isCountryValid(this.customer.address.country);
  }
}
