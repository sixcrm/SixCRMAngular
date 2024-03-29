import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import {ProductSchedule} from '../../../../shared/models/product-schedule-legacy.model';
import {Schedule} from '../../../../shared/models/schedule.model';
import {Product} from '../../../../shared/models/product.model';
import {ProductScheduleService} from '../../../../entity-services/services/product-schedule.service';

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
  @Input() editable: boolean = true;

  @Output() selected: EventEmitter<ProductSchedule | Schedule | Product> = new EventEmitter();
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

  ngOnInit() {}

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

  productToggle(checked, product: Product) {
    if (checked) {
      this.selected.emit(product);
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

  showAddButton(): boolean {
    return this.productSchedules.length === 0 || this.productSchedules[0].schedules.length === 0;
  }
}
