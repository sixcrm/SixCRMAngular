import {Component, Input, OnInit} from '@angular/core';
import {StateMachineItem} from "../state-machine-item";

@Component({
  selector: 'state-machine-status',
  templateUrl: './state-machine-status.component.html',
  styleUrls: ['./state-machine-status.component.scss']
})
export class StateMachineStatusComponent implements OnInit {

  @Input() items: StateMachineItem[] = [];

  constructor() { }

  ngOnInit() {
  }

}
