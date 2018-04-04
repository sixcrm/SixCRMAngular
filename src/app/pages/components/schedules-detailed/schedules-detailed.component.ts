import {Component, OnInit, Output, EventEmitter, ViewChild, Input, ElementRef, AfterViewInit} from '@angular/core';
import {ProductSchedule} from '../../../shared/models/product-schedule.model';
import {Schedule} from '../../../shared/models/schedule.model';
import {Product} from '../../../shared/models/product.model';
import {ProductsService} from '../../../shared/services/products.service';
import {CustomServerError} from '../../../shared/models/errors/custom-server-error';
import {Moment} from 'moment';
import {YesNoDialogComponent} from '../../yes-no-dialog.component';
import {MdDialog} from '@angular/material';

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

  @Input() singleScheduleMode: boolean;
  @Input() set productSchedules(productSchedules: ProductSchedule[]) {
    const ps = productSchedules.map(ps => ps.copy());

    if (ps.length === 1 && this.singleScheduleMode) {
      ps[0]['detailedListOpened'] = true
    }

    this.schedulesHistory[this.historyIndex] = ps;
    this.createNewState();
  }
  @Input() products: Product[] = [];
  @Input() startDate: Moment;
  @Input() statusMessage: string;

  @Output() detailsComponent: EventEmitter<ElementRef> = new EventEmitter();
  @Output() productSchedulesChanged: EventEmitter<ProductSchedule[]> = new EventEmitter();

  @ViewChild('details') details: ElementRef;

  infoEnabled: boolean = true;

  allProducts: Product[] = [];
  selectedSchedule: ProductSchedule | Schedule | Product;
  displayMode: DisplayModes = DisplayModes.grid;
  modes = DisplayModes;
  zoomLevel: number = 5;
  sideVisible: boolean = true;
  consecutiveUndo: boolean;
  numberOfDays: number = 365;

  productScheduleFilterMapper = (ps: ProductSchedule) => ps.name;
  filterProductSchedulesValue: string;

  selectedIndex: number = 0;
  scrollToElement: ProductSchedule | Schedule | Product;

  constructor(private productService: ProductsService, private dialog: MdDialog) { }

  ngOnInit() {
    this.fetchProducts();
  }

  private fetchProducts() {
    this.productService.entities$.take(1).subscribe(allProducts => {
      if (allProducts instanceof CustomServerError) return;

      this.allProducts = allProducts;
    });
    this.productService.getEntities();
  }

  ngAfterViewInit() {
    this.detailsComponent.emit(this.details);
  }

  selectDetailsAndScroll(selected: ProductSchedule | Schedule | Product) {
    this.scrollToElement = selected;
    this.selectDetails(selected);
  }

  selectDetails(selected: ProductSchedule | Schedule | Product) {
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

    for (let i = 0; i < this.products.length; i++) {
      this.products[i]['detailedListSelected'] = false;
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

  addNewProduct(product: Product) {
    if (!this.singleScheduleMode) return;

    const state = this.schedulesHistory[this.historyIndex];

    let last = new Schedule({product: product.copy(), start: 0, end: 30, period: 30});

    if (state[0].schedules.length > 0) {
      last = state[0].schedules[state[0].schedules.length - 1];
    }

    const start = last.end || 0;
    const period = last.period || 30;
    const end = start + period;

    const schedule = new Schedule({product: product.copy(), start: start, end: end, period: period});

    state[0].schedules.push(schedule);

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

      this.refreshSelectedItem(this.schedulesHistory[this.historyIndex]);

      if (this.historyIndex === 0) {
        this.performRevert();
      } else {
        this.productSchedulesChanged.emit(this.schedulesHistory[this.historyIndex]);
      }
    }
  }

  redo() {
    if (this.historyIndex < (this.schedulesHistory.length - 1)) {
      if (this.historyIndex === this.schedulesHistory.length - 3) {
        this.historyIndex += 2;
      } else {
        this.historyIndex++;
      }

      this.consecutiveUndo = false;

      this.productSchedulesChanged.emit(this.schedulesHistory[this.historyIndex]);
    }
  }

  revert() {
    if (this.historyIndex === 0 || (!this.consecutiveUndo && this.historyIndex === 1)) return;

    let yesNoDialogRef = this.dialog.open(YesNoDialogComponent, { disableClose : true });
    yesNoDialogRef.componentInstance.text = 'Revert changes?';
    yesNoDialogRef.componentInstance.secondaryText = 'Reverting changes is permanent and cannot be undone.';
    yesNoDialogRef.componentInstance.yesText = 'REVERT';
    yesNoDialogRef.componentInstance.noText = 'CANCEL';

    yesNoDialogRef.afterClosed().take(1).subscribe(result => {
      yesNoDialogRef = null;

      if (result.success) {
        this.performRevert();
      }
    });
  }

  private performRevert() {
    this.historyIndex = 0;
    this.schedulesHistory = [this.schedulesHistory[0]];
    this.createNewState(true);
    this.productSchedulesChanged.emit(this.schedulesHistory[this.historyIndex]);
  }

  createNewState(emitChangeToParent?: boolean): void {
    this.consecutiveUndo = false;
    const previousState = this.schedulesHistory[this.historyIndex];
    const newState = previousState.map(ps => ps.copy(this.numberOfDays));

    this.findSelectedItem(previousState, newState);

    this.schedulesHistory.splice(this.historyIndex+1, 0, newState);
    this.historyIndex++;

    this.schedulesHistory = this.schedulesHistory.slice(0, this.historyIndex + 1);

    this.calculateCyclesOrderAndStack(newState);

    if (emitChangeToParent) {
      this.productSchedulesChanged.emit(this.schedulesHistory[this.historyIndex]);
    }
  }

  private calculateCyclesOrderAndStack(productSchedules: ProductSchedule[]) {
    for (let i = 0; i < productSchedules.length; i++) {
      let cycles = [];

      for (let j = 0; j < productSchedules[i].schedules.length; j++) {
        cycles = [...cycles, ...productSchedules[i].schedules[j].cycles]
      }

      cycles.sort((a, b) => a.start - b.start);

      for (let i = 0; i < cycles.length; i++) {
        cycles[i].order = i + 1;

        for (let j = 0; j < cycles.length; j++) {
          if (cycles[j].start <= cycles[i].start && cycles[i].start < cycles[j].end) {
            cycles[i].stack++;
          }
        }
      }
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

  loadMore() {
    if (this.shouldLoadMore()) {
      const days = this.numberOfDays + 92;

      for (let i = 0; i < this.schedulesHistory.length; i++) {
        for (let j = 0; j < this.schedulesHistory[i].length; j++) {
          for (let k = 0; k < this.schedulesHistory[i][j].schedules.length; k++) {
            this.schedulesHistory[i][j].schedules[k].recalculateCyclesForDays(days)
          }

          this.calculateCyclesOrderAndStack(this.schedulesHistory[i]);
        }
      }

      this.numberOfDays = days;
    }
  }

  shouldLoadMore() {
    if (this.numberOfDays > 1010) return false;

    const currentState = this.schedulesHistory[this.historyIndex];

    for (let i = 0 ; i < currentState.length; i++) {
      for (let j = 0; j < currentState[i].schedules.length; j++) {
        if (currentState[i].schedules[j].end !== 0
            && (!currentState[i].schedules[j].end || currentState[i].schedules[j].end > this.numberOfDays)
        ) {
          return true;
        }
      }
    }

    return false;
  }
}
