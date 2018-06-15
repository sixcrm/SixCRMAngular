import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {ProductSchedule} from '../../../../shared/models/product-schedule.model';
import {Modes} from '../../../abstract-entity-view.component';
import {MerchantProviderGroupsService} from '../../../../entity-services/services/merchant-provider-groups.service';
import {MerchantProviderGroup} from '../../../../shared/models/merchant-provider-group.model';

@Component({
  selector: 'product-schedule-add-new',
  templateUrl: './product-schedule-add-new.component.html',
  styleUrls: ['./product-schedule-add-new.component.scss']
})
export class ProductScheduleAddNewComponent implements OnInit {

  @Input() entity: ProductSchedule;
  @Input() mode: Modes;

  @Output() changeMode: EventEmitter<Modes> = new EventEmitter();
  @Output() save: EventEmitter<ProductSchedule> = new EventEmitter();
  @Output() cancel: EventEmitter<ProductSchedule> = new EventEmitter();

  add = Modes.Add;
  update = Modes.Update;
  view = Modes.View;

  formInvalid: boolean;

  merchantProviderGroupMapper = (merchantProviderGroup: MerchantProviderGroup) => merchantProviderGroup.name || merchantProviderGroup.id;

  constructor(public merchantProviderGroupService: MerchantProviderGroupsService) { }

  ngOnInit() {
    this.merchantProviderGroupService.getEntities();
  }

  saveSchedule(valid: boolean) {
    this.formInvalid = !valid;
    if (this.formInvalid) return;

    this.save.emit(this.entity)
  }
}
