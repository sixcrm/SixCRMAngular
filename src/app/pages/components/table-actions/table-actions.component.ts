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

  @Input()
  customText: string;

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

  @Output()
  customClicked: EventEmitter<boolean> = new EventEmitter<boolean>();

  @Input()
  showView: boolean = true;

  @Input()
  showDelete: boolean = true;

  @Input()
  showCopy: boolean;

  @Input()
  dedicatedOptions: boolean;

  showEdit: boolean;
  showExport: boolean;

  constructor() {}

  ngOnInit() {
    this.showView = this.showView && this.service.hasViewPermission();
    this.showDelete = this.showDelete && this.service.hasWritePermission();
    this.showCopy = this.showCopy && this.service.hasWritePermission();
    this.showExport = false;
    this.showEdit = false;
  }

}
