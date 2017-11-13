import {Component, Input, OnInit} from '@angular/core';
import {StateMachineItem} from "../state-machine-item";

@Component({
  selector: 'state-machine-details',
  templateUrl: './state-machine-details.component.html',
  styleUrls: ['./state-machine-details.component.scss']
})
export class StateMachineDetailsComponent implements OnInit {

  @Input() item: StateMachineItem;

  constructor() { }

  ngOnInit() {
  }

}
