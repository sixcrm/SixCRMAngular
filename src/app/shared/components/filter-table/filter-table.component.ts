import {Component, OnInit, Input, Output, EventEmitter, ViewChildren, ViewChild, OnDestroy} from '@angular/core';

import { Moment } from 'moment';
import {ColumnParams} from '../../models/column-params.model';
import {firstIndexOf} from '../../utils/array.utils';
import {MatDialog} from '@angular/material';
import {ColumnPreferencesDialogComponent} from '../../../dialog-modals/column-preferences-dialog/column-preferences-dialog.component';
import {TabPreferencesDialogComponent} from '../../../dialog-modals/tab-preferences-dialog/tab-preferences-dialog.component';
import {Subscription, Observable} from 'rxjs';

export interface FilterTableFilter {
  facet: string;
  values: string[];
}

export interface FilterTableTab {
  label: string;
  selected: boolean;
  visible: boolean;
  custom?: boolean;
  filters?: FilterTableFilter[];
}

@Component({
  selector: 'filter-table',
  templateUrl: './filter-table.component.html',
  styleUrls: ['./filter-table.component.scss']
})
export class FilterTableComponent implements OnInit, OnDestroy {
  @ViewChildren('originalheader') originalHeaders;
  @ViewChild('tabcontainer') tabContainer;
  @ViewChild('tabcontent') tabContent;

  _date: {start: Moment, end: Moment};

  @Input() set date(value: {start: Moment, end: Moment}) {
    this._date = value;
    this.updateDatepicker();
  }
  @Input() items: any[] = [];
  @Input() columnParams: ColumnParams<any>[];
  @Input() tabs: FilterTableTab[] = [];
  @Input() loading: boolean;
  @Input() singleOptions: string[] = [];
  @Input() bulkOptions: string[] = [];
  @Input() dateFilterEnabled: boolean = true;

  @Output() dateChanged: EventEmitter<{start: Moment, end: Moment}> = new EventEmitter();
  @Output() tabSelected: EventEmitter<FilterTableTab> = new EventEmitter();
  @Output() loadMore: EventEmitter<boolean> = new EventEmitter();
  @Output() filtersSelected: EventEmitter<boolean> = new EventEmitter();
  @Output() singleOptionSelected: EventEmitter<{item: any, option: string}> = new EventEmitter();
  @Output() bulkOptionSelected: EventEmitter<{items: any[], option: string}> = new EventEmitter();
  @Output() onSort: EventEmitter<ColumnParams<any>> = new EventEmitter();

  @Output() updatedTabs: EventEmitter<FilterTableTab[]> = new EventEmitter();
  @Output() updatedColumns: EventEmitter<ColumnParams<any>[]> = new EventEmitter();

  numberOfSelected: number = 0;

  intervalSub: Subscription;

  options = {};

  bulkSelected: boolean;

  constructor(private dialog: MatDialog) { }

  ngOnInit() {
    this.updateDatepicker();
  }

  ngOnDestroy() {
    if (this.intervalSub) {
      this.intervalSub.unsubscribe();
    }
  }

  updateDatepicker(): void {
    this.options = {
      parentEl: '.datepicker--custom--filters',
      startDate: this._date.start,
      endDate: this._date.end,
      locale: {
        format: 'MM/DD/YYYY',
      },
      alwaysShowCalendars: true,
      applyClass: 'btn-success-custom',
      linkedCalendars: false
    };
  }

  dateSelected(event) {
    this.dateChanged.emit({start: event.start, end: event.end});
  }

  openColumnPreferencesDialog() {
    let dialog = this.dialog.open(ColumnPreferencesDialogComponent, { disableClose : true });

    const originalParams = this.columnParams.map(p => { return {label: p.label, selected: p.selected} });

    dialog.componentInstance.columnParams = this.columnParams;

    dialog.afterClosed().take(1).subscribe(result => {
      dialog = null;

      if (!result) {
        for (let i = 0; i < this.columnParams.length; i++) {
          this.columnParams[i].selected = originalParams[i].selected;
        }
      } else {
        this.updatedColumns.emit(this.columnParams);
      }
    });
  }

  openTabPreferencesDialog() {
    let dialog = this.dialog.open(TabPreferencesDialogComponent, { disableClose : true });

    dialog.componentInstance.tabs = this.tabs.map(tab => {
      return {label: tab.label, visible: tab.visible, custom: tab.custom}
    });

    dialog.afterClosed().take(1).subscribe(result => {
      dialog = null;

      if (result && result.tabs) {
        const parsedTabs = [];

        for (let i = 0; i < this.tabs.length; i++) {
          this.tabs[i].visible = result.tabs[i].visible;

          if (!result.tabs[i].toBeRemoved) {
            parsedTabs.push(this.tabs[i])
          }
        }

        this.updatedTabs.emit(parsedTabs);
      }
    });
  }

  getHeaderWidth(params) {
    if (!this.originalHeaders) return 0;

    const index = firstIndexOf(this.columnParams.filter(p => p.selected), el => el.label === params.label);

    if (index === -1 || !this.originalHeaders._results[index]) return 0;

    return this.originalHeaders._results[index].nativeElement.clientWidth + 'px';
  }

  getHeaderWidthByElement(element) {
    return element.clientWidth + 'px';
  }

  toggleSelection(event) {
    if (event && event.checked) {
      this.numberOfSelected++;
    } else if (this.numberOfSelected > 0) {
      this.numberOfSelected--;
    }

    if (event && !event.checked && this.bulkSelected) {
      this.bulkSelected = false;
    }
  }

  toggleBulkSelection(event) {
    for (let i = 0; i < this.items.length; i++) {
      this.items[i]['bulkSelected'] = event && event.checked
    }

    if (event && event.checked) {
      this.numberOfSelected = this.items.length;
    } else {
      this.numberOfSelected = 0;
    }
  }

  moveTabsRight() {
    if (this.intervalSub) {
      this.intervalSub.unsubscribe();
    }

    const move = 80;

    const width = this.tabContent.nativeElement.clientWidth;
    const scroll = this.tabContainer.nativeElement.scrollLeft;

    const moveDelta = (scroll + move > width) ? width - scroll : move;

    this.intervalSub = Observable.interval(20).take(4).subscribe(() => {
      this.tabContainer.nativeElement.scrollLeft += (moveDelta / 4)
    })
  }

  moveTabsLeft() {
    if (this.intervalSub) {
      this.intervalSub.unsubscribe();
    }

    const move = 80;

    const scroll = this.tabContainer.nativeElement.scrollLeft;

    const moveDelta = (scroll - move < 0) ? scroll : move;

    this.intervalSub = Observable.interval(20).take(4).subscribe(() => {
      this.tabContainer.nativeElement.scrollLeft -= (moveDelta / 4)
    });
  }

  showArrows() {
    const content = this.tabContent.nativeElement.clientWidth;
    const container = this.tabContainer.nativeElement.clientWidth;

    return content > container;
  }

}
