import {Component, OnInit, EventEmitter, Output, Input, ViewChild, ViewChildren} from '@angular/core';
import {AbstractEntityService} from '../../../entity-services/services/abstract-entity.service';
import {ColumnParams} from '../../../shared/models/column-params.model';
import {CustomServerError} from '../../../shared/models/errors/custom-server-error';
import {firstIndexOf} from '../../../shared/utils/array.utils';

@Component({
  selector: 'advanced-entities-table',
  templateUrl: './advanced-entities-table.component.html',
  styleUrls: ['./advanced-entities-table.component.scss']
})
export class AdvancedEntitiesTableComponent implements OnInit {

  sortParams: ColumnParams<any> = new ColumnParams();

  // table
  @Input() columnParams: ColumnParams<any>[] = [];
  @Input() data: any[] = [];
  @Input() loaded: boolean = true;
  @Input() filterString: string;
  @Input() serverError: CustomServerError;
  @Input() customOptionText: string;
  @Output() selected: EventEmitter<any> = new EventEmitter();

  // actions
  @Input() service: AbstractEntityService<any>;

  @Input() showView: boolean = true;
  @Input() showDelete: boolean = true;
  @Input() showCopy: boolean;
  @Input() dedicatedOptions: boolean = true;

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

  @Output() filterChanged: EventEmitter<string> = new EventEmitter<string>();
  @Output() searchChanged: EventEmitter<string> = new EventEmitter<string>();

  density: number = 1;

  @ViewChild('options') options;
  @ViewChild('arrow') arrow;
  @ViewChildren('originalheader') originalHeaders;

  headerVisible: boolean = true;
  footerVisible: boolean = true;

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

  numberOfSelected() {
    return (this.data || []).filter(d => d.bulkSelected).length;
  }

  selectAll() {
    this.data = this.data.map(d => {
      d.bulkSelected = true;

      return d;
    });
  }

  deselectAll() {
    this.data = this.data.map(d => {
      d.bulkSelected = false;

      return d;
    });
  }

  deleteAll() {
    this.deleteManyClicked.emit(this.data.filter(d => d.bulkSelected));
  }

  visible(visible) {
    this.headerVisible = visible;
  }

  visibleFooter(visible) {
    this.footerVisible = visible;
  }

  getHeaderWidth(params) {
    const index = firstIndexOf(this.columnParams.filter(p => p.selected), el => el.label === params.label);

    return this.originalHeaders._results[index].nativeElement.clientWidth + 'px';
  }

  getHeaderWidthByElement(element) {
    return element.clientWidth + 'px';
  }

  globalBulkSelectChanged(event) {
    if (event.checked) {
      this.selectAll();
    } else {
      this.deselectAll();
    }
  }

}
