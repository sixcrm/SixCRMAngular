import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {FilterTerm} from '../../../shared/components/advanced-filter/advanced-filter.component';
import {ColumnParams} from '../../../shared/models/column-params.model';

export class ReportColumnParams<T> extends ColumnParams<T> {
  isFilter: boolean;
  isLink: boolean;
  entityType: string;

  constructor(label?: string, mappingFunction?: (e: T) => string | number,  align?: string, order?: string, applied?: boolean) {
    super(label, mappingFunction, align, order, applied);
  }

  setIsLink(value: boolean) {
    this.isLink = value;

    return this;
  }

  setIsFilter(value: boolean) {
    this.isFilter = value;

    return this;
  }

  setEntityType(value: string) {
    this.entityType = value;

    return this;
  }
}

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
  @Input() showFilter: boolean = true;
  @Output() filterSelected: EventEmitter<FilterTerm> = new EventEmitter();
  @Output() cellClicked: EventEmitter<{params: ReportColumnParams<any>, entity: any}> = new EventEmitter();

  @Input() paginationValues: number[] = [5, 10, 15, 20, 30, 50];
  @Input() page: number;
  @Input() nextDisabled: boolean = false;
  @Input() limit: number = 10;
  @Input() paginationString: string = '';

  @Output() next: EventEmitter<boolean> = new EventEmitter();
  @Output() previous: EventEmitter<boolean> = new EventEmitter();
  @Output() updateLimit: EventEmitter<number> = new EventEmitter();
  @Output() download: EventEmitter<string> = new EventEmitter();

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

  onCellClicked(params: ReportColumnParams<any>, entity: any): void {
    if (params.isFilter) {
      this.filterSelected.emit({id: entity.id, label: params.mappingFunction(entity).toString(), type: params.entityType});
    }

    this.cellClicked.emit({params: params, entity: entity});
  }
}
