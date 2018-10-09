import {Component, OnInit, Output, EventEmitter} from '@angular/core';

@Component({
  selector: 'filter-input',
  templateUrl: './filter-input.component.html',
  styleUrls: ['./filter-input.component.scss']
})
export class FilterInputComponent implements OnInit {

  filterVisible: boolean;
  filterValue: string;

  @Output() valueChanged: EventEmitter<string> = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

  toggleFilterInput(input: HTMLInputElement): void {
    this.filterVisible = !this.filterVisible;
    if (this.filterVisible) {
      window.setTimeout(() => {
        input.focus();
      }, 0);
    }
  }

  onInput() {
    this.valueChanged.emit(this.filterValue)
  }
}
