import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import {MerchantProvider} from '../../../../shared/models/merchant-provider/merchant-provider.model';
import {Modes} from '../../../abstract-entity-view.component';
import {
  isAllowedFloatNumeric, isAllowedEmail, isAllowedNumeric,
  isAllowedPercentage
} from '../../../../shared/utils/form.utils';
import {getPhoneNumberMask} from '../../../../shared/utils/mask.utils';

@Component({
  selector: 'merchant-provider-add-new',
  templateUrl: './merchant-provider-add-new.component.html',
  styleUrls: ['./merchant-provider-add-new.component.scss'],
  host: {'(document:keydown)':'onKeyDown($event)'}
})
export class MerchantProviderAddNewComponent implements OnInit {

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
  allProviders: string[] = ['NMI', 'Innovio', 'Test', 'Stripe', 'AuthorizeNet', 'PaymentXP'];

  shouldEditSettings: boolean;
  shouldEditProcessing: boolean;
  shouldEditGateway: boolean;
  shouldEditCustomerService: boolean;
  shouldEditGeneral: boolean;

  constructor() { }

  ngOnInit() { }

  saveProvider(valid: boolean): void {
    this.formInvalid =
      !valid
      || !this.entity.acceptedPaymentMethods.length
      || !this.entity.gateway.isTypeSelected();

    if (this.formInvalid) return;

    this.save.emit(this.entity);
  }

  enableEdit(cardName: string) {
    this.shouldEditSettings = false;
    this.shouldEditProcessing = false;
    this.shouldEditGateway = false;
    this.shouldEditCustomerService = false;
    this.shouldEditGeneral = false;

    switch (cardName) {
      case 'shouldEditSettings':
        this.shouldEditSettings = true;
        break;
      case 'shouldEditProcessing':
        this.shouldEditProcessing = true;
        break;
      case 'shouldEditGateway':
        this.shouldEditGateway = true;
        break;
      case 'shouldEditCustomerService':
        this.shouldEditCustomerService = true;
        break;
      default:
        this.shouldEditGeneral = true;
    }
  }

  onKeyDown(key) {
    if (key && key.key === 'Escape') {
      this.cancel.emit(true);
    }
  }

}
