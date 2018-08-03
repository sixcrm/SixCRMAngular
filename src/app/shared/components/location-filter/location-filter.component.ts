import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {getStates} from '../../utils/address.utils';

export interface LocationFilter {
  country: string,
  state: string
}

@Component({
  selector: 'location-filter',
  templateUrl: './location-filter.component.html',
  styleUrls: ['./location-filter.component.scss']
})
export class LocationFilterComponent implements OnInit {

  @Input() locations: Location[] = [];
  @Output() locationAdded: EventEmitter<boolean> = new EventEmitter();
  @Output() locationRemovedAtIndex: EventEmitter<number> = new EventEmitter();

  countries: string[] = ['United States'];
  states: string[] = getStates();

  constructor() { }

  ngOnInit() {
  }

}
