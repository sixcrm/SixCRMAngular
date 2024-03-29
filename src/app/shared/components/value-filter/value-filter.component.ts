import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';

export enum ValueFilterOperator {
  LESS, EQUALS, CONTAINS, GREATER
}

export enum ValueFilterColumnType {
  NUMBER, STRING, CURRENCY
}

export interface ValueFilterColumn {
  name: string,
  label?: string,
  type?: ValueFilterColumnType
}

export interface ValueFilter {
  column: ValueFilterColumn,
  operator: ValueFilterOperator,
  value: string
}

@Component({
  selector: 'value-filter',
  templateUrl: './value-filter.component.html',
  styleUrls: ['./value-filter.component.scss']
})
export class ValueFilterComponent implements OnInit {

  @Input() columns: ValueFilterColumn[] = [];
  @Input() filters: ValueFilter[] = [];

  @Output() filterAdded: EventEmitter<boolean> = new EventEmitter();
  @Output() filterRemovedAtIndex: EventEmitter<number> = new EventEmitter();

  columnMapper = (column) => column.label || column.name;

  operators = [ValueFilterOperator.EQUALS];

  operatorMapper = (operator: ValueFilterOperator) => {
    if (operator === ValueFilterOperator.EQUALS) return 'Equals';
  };

  constructor() { }

  ngOnInit() {
  }

}
