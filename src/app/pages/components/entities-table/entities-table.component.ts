import {Component, OnInit, EventEmitter, Output, Input, ViewChild} from '@angular/core';
import {AbstractEntityService} from '../../../shared/services/abstract-entity.service';
import {ColumnParams} from '../../../shared/models/column-params.model';
import {CustomServerError} from '../../../shared/models/errors/custom-server-error';

@Component({
  selector: 'entities-table',
  templateUrl: './entities-table.component.html',
  styleUrls: ['./entities-table.component.scss'],
  host: {'(document:click)': 'closeDropdown($event)'}
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
  @Input() showCopy: boolean;
  @Input() dedicatedOptions: boolean;

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

  showActionOptions: boolean = false;
  density: number = 1;

  @ViewChild('options') options;
  @ViewChild('arrow') arrow;

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

    this.showActionOptions = false;
  }

  deselectAll() {
    this.data = this.data.map(d => {
      d.bulkSelected = false;

      return d;
    });

    this.showActionOptions = false;
  }

  deleteAll() {
    this.deleteManyClicked.emit(this.data.filter(d => d.bulkSelected));
  }

  closeDropdown(event) {
    if (!this.options || !this.arrow) return;

    if (!this.options.nativeElement.contains(event.target) && !this.arrow.nativeElement.contains(event.target)) {
      this.showActionOptions = false;
    }
  }

}
