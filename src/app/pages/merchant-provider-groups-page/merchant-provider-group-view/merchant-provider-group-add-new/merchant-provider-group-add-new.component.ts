import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {MerchantProviderGroup} from '../../../../shared/models/merchant-provider-group.model';
import {Modes} from '../../../abstract-entity-view.component';

@Component({
  selector: 'merchant-provider-group-add-new',
  templateUrl: './merchant-provider-group-add-new.component.html',
  styleUrls: ['./merchant-provider-group-add-new.component.scss']
})
export class MerchantProviderGroupAddNewComponent implements OnInit {

  @Input() entity: MerchantProviderGroup;

  @Output() cancel: EventEmitter<boolean> = new EventEmitter();
  @Output() save: EventEmitter<MerchantProviderGroup> = new EventEmitter();

  modes = Modes;
  formInvalid: boolean;

  constructor() { }

  ngOnInit() { }

  saveMerchantProviderGroup(): void {
    this.formInvalid = !this.entity.name;
    if (this.formInvalid) return;

    this.save.emit(this.entity);
  }

}
