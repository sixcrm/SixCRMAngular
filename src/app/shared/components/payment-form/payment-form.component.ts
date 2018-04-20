import {Component, OnInit, Input} from '@angular/core';
import {CreditCard} from '../../models/credit-card.model';
import {Address} from '../../models/address.model';
import {
  isValidCity, isValidAddress, isValidZip, isAllowedZip, isValidCountry,
  isValidState, isAllowedNumeric
} from '../../utils/form.utils';
import {utc} from 'moment';

@Component({
  selector: 'payment-form',
  templateUrl: './payment-form.component.html',
  styleUrls: ['./payment-form.component.scss']
})
export class PaymentFormComponent implements OnInit {

  address: Address = new Address();
  defaultAddressBackup: Address;
  sameAsDefaultAddress: boolean = false;
  formInvalid: boolean = false;

  @Input() creditCard: CreditCard = new CreditCard();
  @Input() set defaultAddress(address: Address) {
    if (!address) return;

    this.address = address.copy();
    this.defaultAddressBackup = address.copy();
    this.sameAsDefaultAddress = true;
  };

  isAllowedNumericKey = isAllowedNumeric;
  isZipValid = isValidZip;
  isAllowedZipKey = isAllowedZip;
  isCityValid = isValidCity;
  isAddressValid = isValidAddress;
  isCountryValid = isValidCountry;
  isStateValid = isValidState;

  constructor() { }

  ngOnInit() {
  }

  ccNumberInvalid(creditCard: CreditCard): boolean {
    if (!creditCard.ccnumber) return true;

    return !/[0-9]/.test(creditCard.ccnumber) || creditCard.ccnumber.length < 12 || creditCard.ccnumber.length > 20;
  }

  ccvInvalid(creditCard: CreditCard): boolean {
    if (!creditCard.ccv) return true;

    return !/[0-9]/.test(creditCard.ccv) || creditCard.ccv.length < 3 || creditCard.ccv.length > 4;
  }

  expirationMonthInvalid(creditCard: CreditCard): boolean {
    if (!creditCard.expirationMonth) return true;

    if(!/[0-9]/.test(creditCard.expirationMonth)) {
      return true;
    }

    return +creditCard.expirationMonth < 1 || +creditCard.expirationMonth > 12;
  }

  expirationYearInvalid(creditCard: CreditCard): boolean {
    if (!creditCard.expirationYear) return true;

    if(!/[0-9]/.test(creditCard.expirationYear)) {
      return true;
    }

    return +creditCard.expirationYear < utc().year() || +creditCard.expirationYear > utc().year()+20;
  }

  isValid(): boolean {
    this.formInvalid = !this.creditCard.name
      || this.ccNumberInvalid(this.creditCard)
      || this.ccvInvalid(this.creditCard)
      || this.expirationMonthInvalid(this.creditCard)
      || this.expirationYearInvalid(this.creditCard)
      || !this.address.line1 || !this.isAddressValid(this.address.line1)
      || (this.address.line2 && !this.isAddressValid(this.address.line2))
      || !this.isCityValid(this.address.city)
      || !this.isStateValid(this.address.state)
      || !this.address.zip || !this.isZipValid(this.address.zip)
      || !this.isCountryValid(this.address.country);

    if (this.formInvalid) {
      return false;
    }

    this.creditCard.address = this.address.copy();
    this.creditCard.expiration = this.creditCard.expirationMonth + '/' + this.creditCard.expirationYear;

    return true;
  }

  sameAsDefaultAddressSwitched(value) {
    if (value.checked) {
      this.address = this.defaultAddressBackup.copy();
    } else {
      this.address = new Address();
    }
  }
}
