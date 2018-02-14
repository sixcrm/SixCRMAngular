import {Component, OnInit, EventEmitter, Input, Output, ViewChild} from '@angular/core';

@Component({
  selector: 'table-pagination',
  templateUrl: './table-pagination.component.html',
  styleUrls: ['./table-pagination.component.scss']
})
export class TablePaginationComponent implements OnInit {

  @ViewChild('checkbox') checkbox;

  @Input()
  limit: number;

  @Input()
  paginationValues: number[];

  @Input()
  nextDisabled: boolean;

  @Input()
  previousDisabled: boolean;

  @Input()
  paginationString: string;

  @Input()
  showCheckbox: boolean;

  @Output()
  next: EventEmitter<boolean> = new EventEmitter<boolean>();

  @Output()
  previous: EventEmitter<boolean> = new EventEmitter<boolean>();

  @Output()
  updateLimit: EventEmitter<number> = new EventEmitter<number>();

  @Output()
  checkboxToggled: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor() { }

  ngOnInit() {
  }

  onPrevious() {
    if (this.checkbox) {
      this.checkbox.checked = false;
    }

    this.previous.emit(true);
  }

  onNext() {
    if (this.checkbox) {
      this.checkbox.checked = false;
    }

    this.next.emit(true);
  }

  toggleCheckbox(box) {
    this.checkboxToggled.emit(box.checked)
  }
}
