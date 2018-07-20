import {Component, OnInit, Input, Output, EventEmitter, ViewChildren} from '@angular/core';

import { Moment } from 'moment';
import {ColumnParams} from '../../models/column-params.model';
import {firstIndexOf} from '../../utils/array.utils';

@Component({
  selector: 'filter-table',
  templateUrl: './filter-table.component.html',
  styleUrls: ['./filter-table.component.scss']
})
export class FilterTableComponent implements OnInit {

  @Input() date: {start: Moment, end: Moment};
  @Input() data: any[];
  @Input() columnParams: ColumnParams<any>[];

  @Output() dateChanged: EventEmitter<{start: Moment, end: Moment}> = new EventEmitter();
  @Output() loadMore: EventEmitter<boolean> = new EventEmitter();

  @ViewChildren('originalheader') originalHeaders;

  constructor() { }

  ngOnInit() { }

  getHeaderWidth(params) {
    const index = firstIndexOf(this.columnParams.filter(p => p.selected), el => el.label === params.label);

    return this.originalHeaders._results[index].nativeElement.clientWidth + 'px';
  }

  getHeaderWidthByElement(element) {
    return element.clientWidth + 'px';
  }
}
