import {Component, OnInit, Input, EventEmitter, Output} from '@angular/core';
import {ColumnParams} from '../../../shared/models/column-params.model';

@Component({
  selector: 'table-preferences',
  templateUrl: './table-preferences.component.html',
  styleUrls: ['./table-preferences.component.scss']
})
export class TablePreferencesComponent implements OnInit {

  @Input() columnParams: ColumnParams<any>[] = [];

  @Output() changed: EventEmitter<boolean> = new EventEmitter();

  showParams: boolean;

  constructor() { }

  ngOnInit() {
  }

  toggleParams() {
    this.showParams = !this.showParams;
  }

  cancel() {
    this.showParams = false;

    this.changed.emit(false);
  }

  apply() {
    this.showParams = false;

    this.changed.emit(true);
  }
}
