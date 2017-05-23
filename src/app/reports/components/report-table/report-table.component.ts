import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {ColumnParams} from '../../../shared/models/column-params.model';

@Component({
  selector: 'report-table',
  templateUrl: './report-table.component.html',
  styleUrls: ['./report-table.component.scss']
})
export class ReportTableComponent implements OnInit {

  filterString: string;
  sortParams: ColumnParams<any> = new ColumnParams();

  @Input() columnParams: ColumnParams<any>[] = [];
  @Input() data: any[] = [];
  @Input() title: string;
  @Output() selected: EventEmitter<any> = new EventEmitter();

  @Input() paginationValues: number[] = [5, 10, 15, 20, 30, 50];
  @Input() page: number;
  @Input() nextDisabled: boolean = false;
  @Input() limit: number = 10;
  @Input() paginationString: string = '';

  @Output() next: EventEmitter<boolean> = new EventEmitter();
  @Output() previous: EventEmitter<boolean> = new EventEmitter();
  @Output() updateLimit: EventEmitter<number> = new EventEmitter();

  constructor() { }

  ngOnInit() { }

  setSortParams(params: ColumnParams<any>): void {
    if (this.sortParams.label === params.label) {
      this.sortParams.sortOrder = this.sortParams.sortOrder !== 'asc' ? 'asc' : 'desc';
    } else {
      this.sortParams.sortApplied = false;
      this.sortParams = params;
      this.sortParams.sortApplied = true;
    }
  }
}
