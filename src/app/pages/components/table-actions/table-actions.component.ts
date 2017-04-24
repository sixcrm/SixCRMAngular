import {Component, OnInit, EventEmitter, Output, Input} from '@angular/core';
import {AbstractEntityService} from '../../../shared/services/abstract-entity.service';

@Component({
  selector: 'table-actions',
  templateUrl: './table-actions.component.html',
  styleUrls: ['./table-actions.component.scss']
})
export class TableActionsComponent implements OnInit {

  @Input()
  service: AbstractEntityService<any>;

  @Output()
  viewClicked: EventEmitter<boolean> = new EventEmitter<boolean>();

  @Output()
  copyClicked: EventEmitter<boolean> = new EventEmitter<boolean>();

  @Output()
  exportClicked: EventEmitter<boolean> = new EventEmitter<boolean>();

  @Output()
  deleteClicked: EventEmitter<boolean> = new EventEmitter<boolean>();

  @Output()
  editClicked: EventEmitter<boolean> = new EventEmitter<boolean>();

  showView: boolean;
  showCopy: boolean;
  showExport: boolean;
  showDelete: boolean;
  showEdit: boolean;

  constructor() {}

  ngOnInit() {
    this.showView = this.service.hasViewPermission();
    this.showCopy = this.service.hasWritePermission();
    this.showExport = this.service.hasReadPermission();
    this.showDelete = this.service.hasWritePermission();
    this.showEdit = this.service.hasWritePermission();
  }

}
