import {Component, OnInit, EventEmitter, Input, Output} from '@angular/core';

@Component({
  selector: 'table-pagination',
  templateUrl: './table-pagination.component.html',
  styleUrls: ['./table-pagination.component.scss']
})
export class TablePaginationComponent implements OnInit {

  @Input()
  limit: number;

  @Input()
  paginationValues: number[];

  @Input()
  nextDisabled: boolean;

  @Input()
  previousDisabled: boolean;

  @Output()
  next: EventEmitter<boolean> = new EventEmitter<boolean>();

  @Output()
  previous: EventEmitter<boolean> = new EventEmitter<boolean>();

  @Output()
  updateLimit: EventEmitter<number> = new EventEmitter<number>();

  constructor() { }

  ngOnInit() {
  }

}
