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
  @Input() products: Product[] = [];
  @Input() sideVisible: boolean;
  @Input() singleScheduleMode: boolean;
  @Input() allProducts: Product[] = [];

  @Output() selected: EventEmitter<ProductSchedule | Schedule> = new EventEmitter();
  @Output() newProductScheduleAdded: EventEmitter<ProductSchedule> = new EventEmitter();
  @Output() newProductAdded: EventEmitter<Product> = new EventEmitter();

  productScheduleToAdd: ProductSchedule = new ProductSchedule();
  productScheduleMapper = (p: ProductSchedule) => p.name;

  productToAdd: Product = new Product();
  productMapper = (p: Product) => p.name;

  allProductSchedules: ProductSchedule[] = [];
  addMode: boolean;

  productScheduleFactory = (name: string) => new ProductSchedule({name: name});

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

  addSelected(selected: ProductSchedule | Product) {
    if (selected instanceof Product) {
      this.productToAdd = selected;
    } else {
      this.productScheduleToAdd = selected;
    }
  }

  persistSelected() {
    if (this.singleScheduleMode && this.productToAdd.id) {
      this.newProductAdded.emit(this.productToAdd);
    } else if (this.productScheduleToAdd.id || this.productScheduleToAdd.name) {
      this.newProductScheduleAdded.emit(this.productScheduleToAdd);
    }

    this.toggleAddProductScheduleMode();
  }

  toggleAddProductScheduleMode() {
    this.addMode = !this.addMode;

    this.productScheduleToAdd = new ProductSchedule();
    this.productToAdd = new Product();
  }
}
