import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {ColumnParams} from '../../../../shared/models/column-params.model';

@Component({
  selector: 'table-advanced-header',
  templateUrl: './table-advanced-header.component.html',
  styleUrls: ['./table-advanced-header.component.scss']
})
export class TableAdvancedHeaderComponent implements OnInit {

  @Input() textOptions;
  @Input() hasWritePermission: boolean;
  @Input() columnParams: ColumnParams<any>[] = [];
  @Input() density: number = 1;

  @Output() addModeSelected: EventEmitter<boolean> = new EventEmitter();
  @Output() filterStringChanged: EventEmitter<string> = new EventEmitter();
  @Output() densitySelected: EventEmitter<number> = new EventEmitter();

  filterString: string;

  constructor() { }

  ngOnInit() { }

  filterChanged() {
    this.filterStringChanged.emit(this.filterString);
  }

}
