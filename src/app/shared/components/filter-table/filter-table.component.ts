import {Component, OnInit, Input, Output, EventEmitter, ViewChildren} from '@angular/core';

import { Moment } from 'moment';
import {ColumnParams} from '../../models/column-params.model';
import {firstIndexOf} from '../../utils/array.utils';
import {MatDialog} from '@angular/material';
import {ColumnPreferencesDialogComponent} from '../../../dialog-modals/column-preferences-dialog/column-preferences-dialog.component';
import {DaterangepickerConfig} from 'ng2-daterangepicker';
import {TabPreferencesDialogComponent} from '../../../dialog-modals/tab-preferences-dialog/tab-preferences-dialog.component';

export interface FilterTableFilter {

}

export interface FilterTableTab {
  label: string;
  selected: boolean;
  visible: boolean;
  filter?: FilterTableFilter;
}

@Component({
  selector: 'filter-table',
  templateUrl: './filter-table.component.html',
  styleUrls: ['./filter-table.component.scss']
})
export class FilterTableComponent implements OnInit {
  @ViewChildren('originalheader') originalHeaders;

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
  @Output() singleOptionSelected: EventEmitter<{item: any, option: string}> = new EventEmitter();
  @Output() bulkOptionSelected: EventEmitter<{items: any[], option: string}> = new EventEmitter();

  numberOfSelected: number = 0;

  constructor(private dialog: MatDialog, private daterangepickerOptions: DaterangepickerConfig) { }

  ngOnInit() {
    this.updateDatepicker();
  }

  updateDatepicker(): void {
    this.daterangepickerOptions.settings = {
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
      }
    });
  }

  openTabPreferencesDialog() {
    let dialog = this.dialog.open(TabPreferencesDialogComponent, { disableClose : true });

    let tabs = this.tabs.map(tab => { return {label: tab.label, visible: tab.visible} });

    dialog.componentInstance.tabs = tabs;

    dialog.afterClosed().take(1).subscribe(result => {
      dialog = null;

      if (result) {
        for (let i = 0; i < this.tabs.length; i++) {
          this.tabs[i].visible = tabs[i].visible;
        }
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
}
