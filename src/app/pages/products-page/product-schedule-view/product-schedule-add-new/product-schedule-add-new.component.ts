import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {ProductSchedule} from '../../../../shared/models/product-schedule.model';
import {Modes} from '../../../abstract-entity-view.component';
import {MerchantProviderGroupsService} from '../../../../entity-services/services/merchant-provider-groups.service';

@Component({
  selector: 'product-schedule-add-new',
  templateUrl: 'product-schedule-add-new.component.html',
  styleUrls: ['product-schedule-add-new.component.scss'],
  host: {'(document:keydown)':'onKeyDown($event)'}
})
export class ProductScheduleAddNewComponent implements OnInit {

  @Input() entity: ProductSchedule;
  @Input() mode: Modes;

  @Output() changeMode: EventEmitter<Modes> = new EventEmitter();
  @Output() save: EventEmitter<ProductSchedule> = new EventEmitter();
  @Output() cancel: EventEmitter<boolean> = new EventEmitter();

  add = Modes.Add;
  update = Modes.Update;
  view = Modes.View;

  formInvalid: boolean;

  constructor(public merchantProviderGroupService: MerchantProviderGroupsService) { }

  ngOnInit() {
    this.merchantProviderGroupService.getEntities();
  }

  saveSchedule(valid: boolean) {
    this.formInvalid = !valid;
    if (this.formInvalid) return;

    this.save.emit(this.entity)
  }


  onKeyDown(key) {
    if (key && key.key === 'Escape') {
      this.cancel.emit(true);
    }
  }
}
