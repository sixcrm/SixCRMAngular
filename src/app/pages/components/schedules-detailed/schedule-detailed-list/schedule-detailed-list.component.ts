import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import {ProductSchedule} from '../../../../shared/models/product-schedule.model';
import {Schedule} from '../../../../shared/models/schedule.model';
import {Product} from '../../../../shared/models/product.model';
import {ProductScheduleService} from '../../../../shared/services/product-schedule.service';
import {CustomServerError} from '../../../../shared/models/errors/custom-server-error';

@Component({
  selector: 'schedule-detailed-list',
  templateUrl: './schedule-detailed-list.component.html',
  styleUrls: ['./schedule-detailed-list.component.scss']
})
export class ScheduleDetailedListComponent implements OnInit {

  @Input() productSchedules: ProductSchedule[] = [];
  @Input() sideVisible: boolean;
  @Input() products: Product[] = [];
  @Input() singleScheduleMode: boolean;

  @Output() selected: EventEmitter<ProductSchedule | Schedule> = new EventEmitter();
  @Output() newProductScheduleAdded: EventEmitter<ProductSchedule> = new EventEmitter();

  productScheduleToAdd: ProductSchedule = new ProductSchedule();
  productScheduleMapper = (p: ProductSchedule) => p.name;

  allProductSchedules: ProductSchedule[] = [];
  addProductScheduleMode: boolean;

  constructor(public productScheduleService: ProductScheduleService) { }

  ngOnInit() {
    if (!this.singleScheduleMode) {
      this.productScheduleService.entities$.take(1).subscribe(productSchedules => {
        if (productSchedules instanceof CustomServerError) return;

        this.allProductSchedules = productSchedules;
      });

      this.productScheduleService.getEntities();
    }
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
    if (!this.productScheduleToAdd.id) return;

    this.newProductScheduleAdded.emit(this.productScheduleToAdd);

    this.toggleAddProductScheduleMode();
  }

  toggleAddProductScheduleMode() {
    this.addProductScheduleMode = !this.addProductScheduleMode;

    this.productScheduleToAdd = new ProductSchedule();
  }
}
