import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {ColumnParams, ColumnParamsInputType} from '../../../shared/models/column-params.model';
import {isAllowedFloatNumeric} from '../../../shared/utils/form.utils';

@Component({
  selector: 'table-advanced',
  templateUrl: './table-advanced.component.html',
  styleUrls: ['./table-advanced.component.scss']
})
export class TableAdvancedComponent implements OnInit {

  @Input() set data(data: any[]) {
    this.assignEntities(data);
    this.reshuffle();

    if (this.entity) {
      this.setAddMode()
    }
  };

  @Input() columnParams: ColumnParams<any>[] = [];
  @Input() hasWritePermission: boolean = true;
  @Input() addEnabled: boolean = true;
  @Input() viewEnabled: boolean = true;
  @Input() editEnabled: boolean = true;
  @Input() deleteEnabled: boolean = true;
  @Input() showPagination: boolean = true;
  @Input() entityFactory: (data: any) => any;
  @Input() textOptions = {};

  @Output() update: EventEmitter<any> = new EventEmitter();
  @Output() add: EventEmitter<any> = new EventEmitter();
  @Output() deleteEntity: EventEmitter<any> = new EventEmitter();
  @Output() deleteMultipleEntities: EventEmitter<any[]> = new EventEmitter();
  @Output() viewEntity: EventEmitter<any> = new EventEmitter();

  entitiesHolder: any[] = [];
  entitiesHolderBackup: any[] = [];
  entities: any[] = [];

  entity: any;

  sortedColumnParams: ColumnParams<any> = new ColumnParams();

  limit: number = 10;
  page: number = 0;
  paginationValues: number[] = [5, 10, 25, 50, 75, 100];

  inputTypes = ColumnParamsInputType;

  filterString: string;

  addInvalid: boolean;
  editInvalid: boolean;

  density: number = 1;

  isNumeric = isAllowedFloatNumeric;

  constructor() { }

  ngOnInit() {
  }

  next(): void {
    this.page++;
    this.reshuffle();
  }

  previous(): void {
    this.page--;
    this.reshuffle();
  }

  hasMorePages(): boolean {
    return this.entitiesHolder.length > this.page * this.limit + this.limit;
  }

  updateLimit(limit: number): void {
    this.limit = limit;
    this.reshuffle();
  }

  reshuffle(): void {
    this.entities = this.entitiesHolder.slice(this.page * this.limit, this.page * this.limit + this.limit);
  }

  assignEntities(data: any[]): void {
    this.entitiesHolder = data.slice();

    for (let i = 0; i < this.entitiesHolder.length; i++) {
      this.entitiesHolder[i]['tableAdvancedIdentifier'] = i;
    }

    this.entitiesHolderBackup = this.entitiesHolder.map(e => e.copy());
  }

  view(entity) {
    this.viewEntity.emit(entity);
  }

  edit(entity) {
    this.editInvalid = false;

    this.cancelAddMode();

    for (let i = 0; i < this.entitiesHolder.length; i++) {
      if (this.entitiesHolder[i].inlineEditMode) {
        const identifier = this.entitiesHolder[i].tableAdvancedIdentifier;

        this.entitiesHolder[i] = this.entitiesHolderBackup[i].copy();
        this.entitiesHolder[i].tableAdvancedIdentifier = identifier;
      }

      this.entitiesHolder[i].inlineEditMode = this.entitiesHolder[i].tableAdvancedIdentifier === entity.tableAdvancedIdentifier;
    }

    this.reshuffle();
  }

  cancelEditMode() {
    this.editInvalid = false;

    for (let i = 0; i < this.entitiesHolder.length; i++) {
      if (this.entitiesHolder[i].inlineEditMode) {
        const identifier = this.entitiesHolder[i].tableAdvancedIdentifier;

        this.entitiesHolder[i] = this.entitiesHolderBackup[i].copy();
        this.entitiesHolder[i].tableAdvancedIdentifier = identifier;
        this.entitiesHolder[i].inlineEditMode = false;
      }
    }

    this.reshuffle();
  }

  del(entity) {
    this.deleteEntity.emit(entity);
  }

  delMultiple(entities) {
    this.deleteMultipleEntities.emit(entities);
  }

  setSortedColumnParams(params: ColumnParams<any>): void {
    if (params.sortApplied) {
      params.sortOrder = params.sortOrder === 'asc' ? 'desc' : 'asc';
    } else if (this.sortedColumnParams) {
      this.sortedColumnParams.sortApplied = false;
    }

    params.sortApplied = true;
    this.sortedColumnParams = params;
  }

  updateEntity(entity) {
    this.editInvalid = this.columnParams.map(p => p.validator(entity)).filter(v => !v).length > 0;

    if (this.editInvalid) return;

    this.update.emit(entity);
  }

  addEntity() {
    this.addInvalid = this.columnParams.map(p => p.validator(this.entity)).filter(v => !v).length > 0;

    if (this.addInvalid) return;

    this.add.emit(this.entity);
  }

  setAddMode() {
    this.addInvalid = false;

    this.cancelEditMode();

    this.entity = this.entityFactory({});
  }

  cancelAddMode() {
    this.addInvalid = false;

    this.entity = null;
  }

  keydown(event, params: ColumnParams<any>) {
    if (params.inputType === this.inputTypes.NUMERIC) {
      return isAllowedFloatNumeric(event);
    }
  }
}
