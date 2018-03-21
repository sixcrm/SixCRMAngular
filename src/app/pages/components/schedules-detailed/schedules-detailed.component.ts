import {Component, OnInit, Output, EventEmitter, ViewChild, Input, ElementRef, AfterViewInit} from '@angular/core';
import {ProductSchedule} from '../../../shared/models/product-schedule.model';
import {Schedule} from '../../../shared/models/schedule.model';
import {Product} from '../../../shared/models/product.model';
import {ProductsService} from '../../../shared/services/products.service';
import {CustomServerError} from '../../../shared/models/errors/custom-server-error';
import {Moment} from 'moment';

export enum DisplayModes {
  grid,
  list
}

@Component({
  selector: 'schedules-detailed',
  templateUrl: './schedules-detailed.component.html',
  styleUrls: ['./schedules-detailed.component.scss']
})
export class SchedulesDetailedComponent implements OnInit, AfterViewInit {

  @Input() productSchedules: ProductSchedule[] = [];
  @Input() startDate: Moment;
  @Input() singleScheduleMode: boolean;

  @Output() detailsComponent: EventEmitter<ElementRef> = new EventEmitter();
  @Output() save: EventEmitter<boolean> = new EventEmitter();
  @Output() deleteSchedule: EventEmitter<Schedule> = new EventEmitter();

  @ViewChild('details') details: ElementRef;

  products: Product[] = [];
  selectedSchedule: ProductSchedule | Schedule;
  displayMode: DisplayModes = DisplayModes.grid;
  modes = DisplayModes;
  zoomLevel: number = 7;
  sideVisible: boolean = true;

  productScheduleFilterMapper = (ps: ProductSchedule) => ps.name;
  filterProductSchedulesValue: string;

  selectedIndex: number = 0;

  constructor(private productService: ProductsService) { }

  ngOnInit() {
    this.fetchProducts();
  }

  private fetchProducts() {
    this.productService.entities$.take(1).subscribe(products => {
      if (products instanceof CustomServerError) return;

      this.products = products;
    });
    this.productService.getEntities();
  }

  ngAfterViewInit() {
    this.detailsComponent.emit(this.details);
  }

  selectDetails(selected: ProductSchedule | Schedule) {
    this.deselectSchedule();

    if (!selected) return;

    this.selectedSchedule = selected;
    this.selectedSchedule['detailedListSelected'] = true;

    this.detailsComponent.emit(this.details);
  }

  deselectSchedule() {
    this.selectedSchedule = null;

    for (let i = 0; i < this.productSchedules.length; i++) {
      this.productSchedules[i]['detailedListSelected'] = false;

      for (let j = 0; j < this.productSchedules[i].schedules.length; j++) {
        this.productSchedules[i].schedules[j]['detailedListSelected'] = false;
      }
    }
  }

  changeDisplayMode(mode: DisplayModes) {
    this.displayMode = mode;

    this.selectedIndex = this.displayMode === DisplayModes.grid ? 0 : 1;
  }

  addNewProductSchedule(productSchedule: ProductSchedule) {
    this.productSchedules.push(productSchedule);
  }

  removeSchedule(schedule: Schedule) {
    this.deselectSchedule();
    this.deleteSchedule.emit(schedule);
  }
}
