import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {ColumnParams} from '../../../shared/models/column-params.model';
import {MdDialogRef, MdDialog} from '@angular/material';
import {AssociateDialogComponent} from '../../associate-dialog.component';
import {firstIndexOf} from '../../../shared/utils/array.utils';
import {DeleteDialogComponent} from '../../delete-dialog.component';
export interface TableMemoryTextOptions {
  title?: string,
  viewOptionText?: string,
  associateOptionText?: string,
  disassociateOptionText?: string,
  associateModalTitle?: string,
  disassociateModalTitle?: string,
  associateModalButtonText?: string,
  editOptionText?: string,
  noDataText?: string
}

export interface CustomMenuOption {
  label: string,
  option?: string
  show?: (el: any) => boolean;
}

export interface CustomMenuOptionResult {
  entity: any,
  option: string
}

@Component({
  selector: 'table-memory',
  templateUrl: './table-memory.component.html',
  styleUrls: ['./table-memory.component.scss']
})
export class TableMemoryComponent implements OnInit {

  @Input() set data(data: any[]) {
    this.entitiesHolder = data;
    this.reshuffle();
  };
  @Input() columnParams: ColumnParams<any>[] = [];
  @Input() associateData: any[] = [];
  @Input() associateDataMapper: (el: any) => string = (el) => el;
  @Input() title: string;
  @Input() filterEnabled: boolean = true;
  @Input() viewEnabled: boolean = true;
  @Input() associationEnabled: boolean = true;
  @Input() dissociationEnabled: boolean = true;
  @Input() sortEnabled: boolean = true;
  @Input() showHeader: boolean = true;
  @Input() showPagination: boolean = true;
  @Input() showMenuOptions: boolean = true;
  @Input() textOptions: TableMemoryTextOptions = {};
  @Input() customAssociation: boolean = false;
  @Input() editEnabled: boolean = false;
  @Input() ignoreDisassociate: (el: any) => boolean = (el: any) => false;
  @Input() hasWritePermission: boolean = true;
  @Input() customTopMenuOptions: string[] = [];
  @Input() customMenuOptions: CustomMenuOption[] = [];
  @Input() loading: boolean;
  @Input() loadingNumberOfRows: number = 3;
  @Input() columnPreferencesEnabled: boolean = true;

  @Output() view: EventEmitter<boolean> = new EventEmitter();
  @Output() disassociate: EventEmitter<any> = new EventEmitter();
  @Output() associate: EventEmitter<any> = new EventEmitter();
  @Output() edit: EventEmitter<any> = new EventEmitter();
  @Output() customTopMenuOptionSelected: EventEmitter<string> = new EventEmitter();
  @Output() customMenuOptionSelected: EventEmitter<CustomMenuOptionResult> = new EventEmitter();

  entitiesHolder: any[] = [];

  filterString: string = '';

  entities: any[] = [];
  sortedColumnParams: ColumnParams<any> = new ColumnParams();

  limit: number = 10;
  page: number = 0;
  paginationValues: number[] = [5, 10, 25, 50, 75, 100];
  filterValue: string = '';

  associateDialogRef: MdDialogRef<AssociateDialogComponent<any>>;
  disassociateDialogRef: MdDialogRef<DeleteDialogComponent>;

  constructor(private dialog: MdDialog) { }

  ngOnInit() { }

  updateLimit(lim: number): void {
    if (!lim) return;

    let firstElement: number = this.page * this.limit;
    this.page = Math.floor(firstElement / lim);
    this.limit = lim;

    this.reshuffle();
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

  reshuffle(): void {
    this.entities = this.entitiesHolder.slice(this.page * this.limit, this.page * this.limit + this.limit);
  }

  showAssociateDialog(): void {
    if (this.customAssociation) {
      this.associate.emit(true);
      return;
    }

    this.associateDialogRef = this.dialog.open(AssociateDialogComponent);
    this.associateDialogRef.componentInstance.options = this.associateData.filter(a => firstIndexOf(this.entities, (el) => el.id === a.id) === -1);
    this.associateDialogRef.componentInstance.text = this.textOptions.associateModalTitle || `Select ${this.title} to associate`;
    this.associateDialogRef.componentInstance.associateButtonText = this.textOptions.associateModalButtonText || `Associate`;
    this.associateDialogRef.componentInstance.mapper = this.associateDataMapper;

    this.associateDialogRef.afterClosed().take(1).subscribe(result => {
      this.associateDialogRef = null;
      if (result && result.entity) {
        this.associate.emit(result.entity);
      }
    });
  }

  showDisassociateDialog(entity): void {
    if (this.ignoreDisassociate(entity)) {
      this.disassociate.emit(entity);
      return;
    }

    this.disassociateDialogRef = this.dialog.open(DeleteDialogComponent, { disableClose : true });
    this.disassociateDialogRef.componentInstance.text =  `${this.textOptions.disassociateModalTitle || 'Are you sure you want to dissociate?'}`;

    this.disassociateDialogRef.afterClosed().take(1).subscribe(result => {
      this.disassociateDialogRef = null;
      if (result.success) {
        this.disassociate.emit(entity);
      }
    });
  }

  setSortedColumnParams(params: ColumnParams<any>): void {
    if (!this.sortEnabled) return;

    if (params.sortApplied) {
      params.sortOrder = params.sortOrder === 'asc' ? 'desc' : 'asc';
    } else if (this.sortedColumnParams) {
      this.sortedColumnParams.sortApplied = false;
    }

    params.sortApplied = true;
    this.sortedColumnParams = params;
  }

}
