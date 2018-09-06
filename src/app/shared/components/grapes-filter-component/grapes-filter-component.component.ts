import {Component, OnInit, Output, EventEmitter} from '@angular/core';
import {Subject} from 'rxjs';

@Component({
  selector: 'grapes-filter-component',
  templateUrl: './grapes-filter-component.component.html',
  styleUrls: ['./grapes-filter-component.component.scss']
})
export class GrapesFilterComponentComponent implements OnInit {

  @Output() valueChanged: EventEmitter<string> = new EventEmitter();

  debouncer: Subject<string> = new Subject();
  filterValue: string;

  constructor() { }

  ngOnInit() {
    this.debouncer.debounceTime(250).subscribe(value => this.valueChanged.emit(value));
  }

  onInput() {
    this.debouncer.next(this.filterValue);
  }

}
