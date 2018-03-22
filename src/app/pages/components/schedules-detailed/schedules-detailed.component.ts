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

  schedulesHistory: ProductSchedule[][] = [[]];
  historyIndex: number = 0;

  @Input() set productSchedules(productSchedules: ProductSchedule[]) {
    this.schedulesHistory[this.historyIndex] = productSchedules.map(ps => ps.copy());
    this.createNewState();
  }
  @Input() startDate: Moment;
  @Input() singleScheduleMode: boolean;

  @Output() detailsComponent: EventEmitter<ElementRef> = new EventEmitter();
  @Output() productSchedulesChanged: EventEmitter<ProductSchedule[]> = new EventEmitter();

  @ViewChild('details') details: ElementRef;

  products: Product[] = [];
  selectedSchedule: ProductSchedule | Schedule;
  displayMode: DisplayModes = DisplayModes.grid;
  modes = DisplayModes;
  zoomLevel: number = 7;
  sideVisible: boolean = true;
  consecutiveUndo: boolean;

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
    const productSchedules = this.schedulesHistory[this.historyIndex];
    this.selectedSchedule = null;

    for (let i = 0; i < productSchedules.length; i++) {
      productSchedules[i]['detailedListSelected'] = false;

      for (let j = 0; j < productSchedules[i].schedules.length; j++) {
        productSchedules[i].schedules[j]['detailedListSelected'] = false;
      }
    }
  }

  changeDisplayMode(mode: DisplayModes) {
    this.displayMode = mode;

    this.selectedIndex = this.displayMode === DisplayModes.grid ? 0 : 1;
  }

  addNewProductSchedule(productSchedule: ProductSchedule) {
    const productSchedules = this.schedulesHistory[this.historyIndex];

    productSchedules.push(productSchedule);

    this.createNewState(true);
  }

  removeSchedule(schedule: Schedule) {
    this.deselectSchedule();

    let productScheduleIndex = -1;
    let scheduleIndex = -1;

    const currentProductSchedules = this.schedulesHistory[this.historyIndex];

    for (let i = 0; i < currentProductSchedules.length; i++) {
      for (let j = 0; j < currentProductSchedules[i].schedules.length; j++) {
        if (currentProductSchedules[i].schedules[j] == schedule) {
          productScheduleIndex = i;
          scheduleIndex = j;
        }
      }
    }

    if (productScheduleIndex > -1 && scheduleIndex > -1) {
      currentProductSchedules[productScheduleIndex].schedules.splice(scheduleIndex, 1);
      this.createNewState(true);
    }
  }

  removeProductSchedule(productSchedule: ProductSchedule) {
    this.deselectSchedule();

    let index = -1;

    const currentProductSchedules = this.schedulesHistory[this.historyIndex];

    for (let i = 0; i < currentProductSchedules.length; i++) {
      if (currentProductSchedules[i] == productSchedule) {
        index = i;
      }
    }

    if (index > -1) {
      currentProductSchedules.splice(index, 1);
      this.createNewState(true);
    }
  }

  undo() {
    if (this.historyIndex > 0) {
      this.historyIndex -= ((this.consecutiveUndo || this.historyIndex <= 1) ? 1 : 2);

      this.consecutiveUndo = true;

      this.schedulesHistory = this.schedulesHistory.slice(0, this.historyIndex + 1);

      this.refreshSelectedItem(this.schedulesHistory[this.historyIndex]);

      if (this.historyIndex === 0) {
        this.revert();
      } else {
        this.productSchedulesChanged.emit(this.schedulesHistory[this.historyIndex]);
      }
    }
  }

  revert() {
    this.historyIndex = 0;
    this.schedulesHistory = [this.schedulesHistory[0]];
    this.createNewState(true);
    this.productSchedulesChanged.emit(this.schedulesHistory[this.historyIndex]);
  }

  createNewState(emitChangeToParent?: boolean): void {
    this.consecutiveUndo = false;
    const previousState = this.schedulesHistory[this.historyIndex];
    const newState = previousState.map(ps => ps.copy());

    this.findSelectedItem(previousState, newState);

    this.schedulesHistory.push(newState);
    this.historyIndex++;

    if (emitChangeToParent) {
      this.productSchedulesChanged.emit(this.schedulesHistory[this.historyIndex]);
    }
  }

  private findSelectedItem(previousState: ProductSchedule[], newState: ProductSchedule[]) {
    let found: boolean;

    for (let i = 0; i < previousState.length; i++) {
      newState[i]['detailedListSelected'] = previousState[i]['detailedListSelected'];
      newState[i]['detailedListOpened'] = previousState[i]['detailedListOpened'];

      if (newState[i]['detailedListSelected']) {
        found = true;
        this.selectedSchedule = newState[i];
      }

      for (let j = 0; j < previousState[i].schedules.length; j++) {
        newState[i].schedules[j]['detailedListSelected'] = previousState[i].schedules[j]['detailedListSelected'];

        if (newState[i].schedules[j]['detailedListSelected']) {
          found = true;
          this.selectedSchedule = newState[i].schedules[j];
        }
      }
    }

    if (!found) {
      this.selectDetails(null);
    }
  }

  private refreshSelectedItem(currentState: ProductSchedule[]) {
    let found: boolean;

    for (let i = 0; i < currentState.length; i++) {
      if (currentState[i]['detailedListSelected']) {
        found = true;
        this.selectedSchedule = currentState[i];
      }

      for (let j = 0; j < currentState[i].schedules.length; j++) {
        if (currentState[i].schedules[j]['detailedListSelected']) {
          found = true;
          this.selectedSchedule = currentState[i].schedules[j];
        }
      }
    }

    if (!found) {
      this.selectDetails(null);
    }
  }
}
