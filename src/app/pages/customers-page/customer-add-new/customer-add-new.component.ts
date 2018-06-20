import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {Customer} from '../../../shared/models/customer.model';
import {getCountries, getStates} from '../../../shared/utils/address.utils';
import {getPhoneNumberMask} from '../../../shared/utils/mask.utils';
import {isValidZip, isAllowedZip} from '../../../shared/utils/form.utils';

@Component({
  selector: 'customer-add-new',
  templateUrl: 'customer-add-new.component.html',
  styleUrls: ['customer-add-new.component.scss']
})
export class CustomerAddNewComponent implements OnInit {

  @Input() customer: Customer;
  @Output() save: EventEmitter<Customer> = new EventEmitter();
  @Output() cancel: EventEmitter<boolean> = new EventEmitter();

  states: string[] = getStates();
  countries: string[] = getCountries();

  formInvalid: boolean = false;
  mask = getPhoneNumberMask();

  isZip = isValidZip;
  isAllowedZipKey = isAllowedZip;

  constructor() { }

  ngOnInit() { }

  saveCustomer(form) {
    this.formInvalid = !form.valid || !this.customer.address.country || !this.customer.address.state || !this.isZip(this.customer.address.zip);

    if (this.formInvalid) return;

    this.save.emit(this.customer);
  }

}
