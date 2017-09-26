import { Component, ViewChild, OnInit, Input, Output, EventEmitter } from '@angular/core';
import {MerchantProvider} from '../../../../shared/models/merchant-provider/merchant-provider.model';
import {Modes} from '../../../abstract-entity-view.component';
import {isAllowedFloatNumeric, isAllowedEmail} from '../../../../shared/utils/form.utils';
import {getPhoneNumberMask} from '../../../../shared/utils/mask.utils';

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
  isEmail = isAllowedEmail;
  mask = getPhoneNumberMask();

  allCreditCards: string[] = ['American Express', 'Mastercard', 'Visa', 'Discover'];

  constructor() { }

  ngOnInit() { }

  saveProvider(valid: boolean): void {
    this.formInvalid = !valid;
    if (this.formInvalid) return;

    this.save.emit(this.entity);
  }

}
