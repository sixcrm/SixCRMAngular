import {Component, OnInit, EventEmitter, Output, Input} from '@angular/core';
import {AbstractEntityService} from '../../../shared/services/abstract-entity.service';
import {ColumnParams} from '../../../shared/models/column-params.model';

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
  @Output() selected: EventEmitter<any> = new EventEmitter();

  // actions
  @Input() service: AbstractEntityService<any>;

  @Output() viewClicked: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() copyClicked: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() exportClicked: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() deleteClicked: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() editClicked: EventEmitter<boolean> = new EventEmitter<boolean>();

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

}
