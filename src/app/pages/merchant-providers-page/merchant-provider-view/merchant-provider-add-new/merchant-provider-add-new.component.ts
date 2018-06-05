import { Component, ViewChild, OnInit, Input, Output, EventEmitter } from '@angular/core';
import {MerchantProvider} from '../../../../shared/models/merchant-provider/merchant-provider.model';
import {Modes} from '../../../abstract-entity-view.component';
import {
  isAllowedFloatNumeric, isAllowedEmail, isAllowedNumeric,
  isAllowedPercentage
} from '../../../../shared/utils/form.utils';
import {getPhoneNumberMask} from '../../../../shared/utils/mask.utils';
import {ActivatedRoute, UrlSegment} from '@angular/router';

@Component({
  selector: 'merchant-provider-add-new',
  templateUrl: './merchant-provider-add-new.component.html',
  styleUrls: ['./merchant-provider-add-new.component.scss']
})
export class MerchantProviderAddNewComponent implements OnInit {

  @ViewChild('merchantProviderForm') inputForm;

  @Input() entity: MerchantProvider;
  @Input() mode: Modes;
  @Input() formInvalid: boolean;

  @Output() cancel: EventEmitter<boolean> = new EventEmitter();
  @Output() save: EventEmitter<MerchantProvider> = new EventEmitter();
  @Output() changeMode: EventEmitter<Modes> = new EventEmitter();

  modes = Modes;

  isFloatNumeric = isAllowedFloatNumeric;
  isPercentage = isAllowedPercentage;
  isNumeric = isAllowedNumeric;
  isEmail = isAllowedEmail;
  mask = getPhoneNumberMask();

  allCreditCards: string[] = ['American Express', 'Mastercard', 'Visa', 'Discover', 'LOCAL CARD'];
  allProviders: string[] = ['NMI', 'Innovio', 'Test', 'Stripe', 'AuthorizeNet'];

  constructor() { }

  ngOnInit() { }

  saveProvider(valid: boolean): void {
    this.formInvalid = !valid || !this.entity.acceptedPaymentMethods.length;
    if (this.formInvalid) return;

    this.save.emit(this.entity);
  }

}
