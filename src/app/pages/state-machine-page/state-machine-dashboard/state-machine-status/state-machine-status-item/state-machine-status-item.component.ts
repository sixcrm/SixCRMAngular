import {Component, Input, OnInit} from '@angular/core';
import {StateMachineQueue} from '../../../../../shared/models/state-machine/state-machine-queue';

@Component({
  selector: 'state-machine-status-item',
  templateUrl: './state-machine-status-item.component.html',
  styleUrls: ['./state-machine-status-item.component.scss']
})
export class StateMachineStatusItemComponent implements OnInit {

  @Input() queue: StateMachineQueue;

  constructor() { }

  ngOnInit() {
  }

}
