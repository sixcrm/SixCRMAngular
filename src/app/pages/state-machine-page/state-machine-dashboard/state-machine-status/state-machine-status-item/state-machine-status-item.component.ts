import {Component, Input, OnInit} from '@angular/core';
import {StateMachineItem} from "../../state-machine-item";

@Component({
  selector: 'state-machine-status-item',
  templateUrl: './state-machine-status-item.component.html',
  styleUrls: ['./state-machine-status-item.component.scss']
})
export class StateMachineStatusItemComponent implements OnInit {

  @Input() item: StateMachineItem;

  constructor() { }

  ngOnInit() {
  }

}
