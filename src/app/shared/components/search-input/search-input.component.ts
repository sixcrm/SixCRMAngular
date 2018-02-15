import {Component, EventEmitter, OnInit, Output} from '@angular/core';

@Component({
  selector: 'search-input',
  templateUrl: './search-input.component.html',
  styleUrls: ['./search-input.component.scss']
})
export class SearchInputComponent implements OnInit {

  searchValue: string;
  searchVisible: boolean;

  @Output() onSearch: EventEmitter<string> = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

  toggleSearchInput(input: HTMLInputElement): void {
    this.searchVisible = !this.searchVisible;
    if (this.searchVisible) {
      window.setTimeout(() => {
        input.focus();
      }, 0);
    }
  }

  onKey(event) {
    if (event && event.key === 'Enter') {
      this.onSearch.emit(this.searchValue);
    }
  }
}
