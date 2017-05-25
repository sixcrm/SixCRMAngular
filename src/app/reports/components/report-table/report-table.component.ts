import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {FilterTerm} from '../../../pages/dashboard-page/dashboard.component';
import {ReportColumnParams} from '../../reports-abstract.component';

@Component({
  selector: 'report-table',
  templateUrl: './report-table.component.html',
  styleUrls: ['./report-table.component.scss']
})
export class ReportTableComponent implements OnInit {

  filterString: string;
  sortParams: ReportColumnParams<any> = new ReportColumnParams();

  @Input() columnParams: ReportColumnParams<any>[] = [];
  @Input() data: any[] = [];
  @Input() title: string;
  @Output() filterSelected: EventEmitter<FilterTerm> = new EventEmitter();

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

  setSortParams(params: ReportColumnParams<any>): void {
    if (this.sortParams.label === params.label) {
      this.sortParams.sortOrder = this.sortParams.sortOrder !== 'asc' ? 'asc' : 'desc';
    } else {
      this.sortParams.sortApplied = false;
      this.sortParams = params;
      this.sortParams.sortApplied = true;
    }
  }

  cellClicked(params: ReportColumnParams<any>, entity: any): void {
    if (params.isFilter) {
      this.filterSelected.emit({id: entity.id, label: params.mappingFunction(entity).toString(), type: params.entityType});
    }
  }
}
