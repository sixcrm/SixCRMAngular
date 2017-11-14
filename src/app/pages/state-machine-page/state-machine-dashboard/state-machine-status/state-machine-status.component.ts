import {Component, Input, OnInit} from '@angular/core';
import {StateMachineQueue} from '../../../../shared/models/state-machine/state-machine-queue';

@Component({
  selector: 'state-machine-status',
  templateUrl: './state-machine-status.component.html',
  styleUrls: ['./state-machine-status.component.scss']
})
export class StateMachineStatusComponent implements OnInit {

  @Input() queues: StateMachineQueue[] = [];

  constructor() { }

  ngOnInit() {
  }

}
