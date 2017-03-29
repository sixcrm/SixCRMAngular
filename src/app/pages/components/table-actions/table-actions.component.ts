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

  private showView: boolean;
  private showCopy: boolean;
  private showExport: boolean;

  constructor() {}

  ngOnInit() {
    this.showView = this.service.hasViewPermission();
    this.showCopy = this.service.hasWritePermission();
    this.showExport = this.service.hasReadPermission();
  }

}
