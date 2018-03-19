import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import {ProductSchedule} from '../../../../shared/models/product-schedule.model';
import {Schedule} from '../../../../shared/models/schedule.model';
import {Product} from '../../../../shared/models/product.model';
import {ProductScheduleService} from '../../../../shared/services/product-schedule.service';

@Component({
  selector: 'schedule-detailed-list',
  templateUrl: './schedule-detailed-list.component.html',
  styleUrls: ['./schedule-detailed-list.component.scss']
})
export class ScheduleDetailedListComponent implements OnInit {

  @Input() productSchedules: ProductSchedule[] = [];
  @Input() sideVisible: boolean;
  @Input() products: Product[] = [];
  @Output() selected: EventEmitter<ProductSchedule | Schedule> = new EventEmitter();
  @Output() newProductScheduleAdded: EventEmitter<ProductSchedule> = new EventEmitter();

  productScheduleToAdd: ProductSchedule = new ProductSchedule();
  productScheduleMapper = (p: ProductSchedule) => p.name;

  constructor(public productScheduleService: ProductScheduleService) { }

  ngOnInit() {
    this.productScheduleService.getEntities();
  }

  productScheduleToggle(checked, productSchedule: ProductSchedule) {
    if (checked) {
      this.selected.emit(productSchedule);
    } else {
      this.selected.emit(null);
    }
  }

  scheduleToggle(checked, schedule: Schedule) {
    if (checked) {
      this.selected.emit(schedule);
    } else {
      this.selected.emit(null);
    }
  }

  scheduleCollapseToggle(productSchedule: ProductSchedule) {
    productSchedule['detailedListOpened'] = !productSchedule['detailedListOpened'];
  }

  addProductSchedule(productSchedule: ProductSchedule) {
    this.productScheduleToAdd = productSchedule;
  }

  persistProductSchedule() {
    this.newProductScheduleAdded.emit(this.productScheduleToAdd);

    this.productScheduleToAdd = new ProductSchedule();
  }
}
