import {Component, EventEmitter, OnInit, Output} from '@angular/core';

@Component({
  selector: 'features-side-card',
  templateUrl: './features-side-card.component.html',
  styleUrls: ['./features-side-card.component.scss']
})
export class FeaturesSideCardComponent implements OnInit {

  @Output() fetchDefaultSettings: EventEmitter<boolean> = new EventEmitter();

  constructor() { }

  ngOnInit() { }
}
