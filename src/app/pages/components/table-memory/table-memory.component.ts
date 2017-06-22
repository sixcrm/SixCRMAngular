import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {ColumnParams} from '../../../shared/models/column-params.model';
import {MdDialogRef, MdDialog} from '@angular/material';
import {AssociateDialogComponent} from '../../associate-dialog.component';
import {firstIndexOf} from '../../../shared/utils/array-utils';
import {DeleteDialogComponent} from '../../delete-dialog.component';

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

  @Output() view: EventEmitter<boolean> = new EventEmitter();
  @Output() disassociate: EventEmitter<any> = new EventEmitter();
  @Output() associate: EventEmitter<any> = new EventEmitter();

  entitiesHolder: any[] = [];

  filterString: string = '';

  entities: any[] = [];
  sortedColumnParams: ColumnParams<any> = new ColumnParams();

  limit: number = 10;
  page: number = 0;
  paginationValues: number[] = [5, 10, 15, 20, 30, 40, 50];
  filterValue: string = '';

  associateDialogRef: MdDialogRef<AssociateDialogComponent<any>>;
  disassociateDialogRef: MdDialogRef<DeleteDialogComponent>;

  constructor(private dialog: MdDialog) { }

  ngOnInit() { }

  updateLimit(limit: number): void {
    this.limit = limit;
  }

  next(): void {
    this.page++;
  }

  previous(): void {
    this.page++;
  }

  hasMorePages(): boolean {
    return this.entities.length > this.page * this.limit + this.limit;
  }

  reshuffle(): void {
    this.entities = this.entitiesHolder.slice(this.page * this.limit, this.page * this.limit + this.limit);
  }

  showAssociateDialog(): void {
    this.associateDialogRef = this.dialog.open(AssociateDialogComponent);
    this.associateDialogRef.componentInstance.options = this.associateData.filter(a => firstIndexOf(this.entities, (el) => el.id === a.id) === -1);
    this.associateDialogRef.componentInstance.text = `Select ${this.title} to associate`;
    this.associateDialogRef.componentInstance.mapper = this.associateDataMapper;

    this.associateDialogRef.afterClosed().take(1).subscribe(result => {
      this.associateDialogRef = null;
      if (result && result.entity) {
        this.associate.emit(result.entity);
      }
    });
  }

  showDisassociateDialog(entity): void {
    this.disassociateDialogRef = this.dialog.open(DeleteDialogComponent, { disableClose : true });
    this.disassociateDialogRef.componentInstance.text = `Are you sure you want to dissociate ${entity.name || entity.id}?`;

    this.disassociateDialogRef.afterClosed().take(1).subscribe(result => {
      this.disassociateDialogRef = null;
      if (result.success) {
        this.disassociate.emit(entity);
      }
    });
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


}
