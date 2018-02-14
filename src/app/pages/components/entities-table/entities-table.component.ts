import {Component, OnInit, EventEmitter, Output, Input} from '@angular/core';
import {AbstractEntityService} from '../../../shared/services/abstract-entity.service';
import {ColumnParams} from '../../../shared/models/column-params.model';
import {CustomServerError} from '../../../shared/models/errors/custom-server-error';

@Component({
  selector: 'entities-table',
  templateUrl: './entities-table.component.html',
  styleUrls: ['./entities-table.component.scss']
})
export class EntitiesTableComponent implements OnInit {

  sortParams: ColumnParams<any> = new ColumnParams();

  // table
  @Input() columnParams: ColumnParams<any>[] = [];
  @Input() data: any[] = [];
  @Input() filterString: string;
  @Input() serverError: CustomServerError;
  @Input() customOptionText: string;
  @Output() selected: EventEmitter<any> = new EventEmitter();

  // actions
  @Input() service: AbstractEntityService<any>;

  @Input() showView: boolean = true;
  @Input() showDelete: boolean = true;

  @Output() viewClicked: EventEmitter<any> = new EventEmitter<any>();
  @Output() copyClicked: EventEmitter<any> = new EventEmitter<any>();
  @Output() exportClicked: EventEmitter<any> = new EventEmitter<any>();
  @Output() deleteClicked: EventEmitter<any> = new EventEmitter<any>();
  @Output() deleteManyClicked: EventEmitter<any[]> = new EventEmitter<any[]>();
  @Output() editClicked: EventEmitter<any> = new EventEmitter<any>();
  @Output() refreshData: EventEmitter<any> = new EventEmitter<any>();
  @Output() customOptionClicked: EventEmitter<any> = new EventEmitter<any>();

  // pagination
  @Input() limit: number;
  @Input() paginationValues: number[];
  @Input() nextDisabled: boolean;
  @Input() previousDisabled: boolean;
  @Input() paginationString: string;
  @Output() next: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() previous: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() updateLimit: EventEmitter<number> = new EventEmitter<number>();

  constructor() { }

  ngOnInit() {
  }

  setSortParams(params: ColumnParams<any>): void {
    if (this.sortParams.label === params.label) {
      this.sortParams.sortOrder = this.sortParams.sortOrder !== 'asc' ? 'asc' : 'desc';
    } else {
      this.sortParams.sortApplied = false;
      this.sortParams = params;
      this.sortParams.sortApplied = true;
    }
  }

  isMultipleSelected() {
    return (this.data || []).filter(d => d.bulkSelected).length > 0;
  }

  selectAll() {
    this.data = this.data.map(d => {
      d.bulkSelected = true;

      return d;
    })
  }

  deselectAll() {
    this.data = this.data.map(d => {
      d.bulkSelected = false;

      return d;
    })
  }

  deleteAll() {
    this.deleteManyClicked.emit(this.data.filter(d => d.bulkSelected));
  }

  performSelectAction(value: boolean) {
    if (value) {
      this.selectAll();
    } else {
      this.deselectAll();
    }
  }
}
