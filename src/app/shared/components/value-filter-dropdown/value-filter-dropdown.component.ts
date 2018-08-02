import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';

@Component({
  selector: 'value-filter-dropdown',
  templateUrl: './value-filter-dropdown.component.html',
  styleUrls: ['./value-filter-dropdown.component.scss']
})
export class ValueFilterDropdownComponent implements OnInit {

  @Input() selectedOption: any;
  @Input() placeholder: string;
  @Input() options: any[] = [];
  @Input() mapper: (el: any) => string = (el) => el;

  @Output() optionSelected: EventEmitter<any> = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

}
