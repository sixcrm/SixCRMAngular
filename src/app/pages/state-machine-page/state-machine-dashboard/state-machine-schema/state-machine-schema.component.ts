import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {StateMachineQueue} from '../../../../shared/models/state-machine/state-machine-queue';

@Component({
  selector: 'state-machine-schema',
  templateUrl: './state-machine-schema.component.html',
  styleUrls: ['./state-machine-schema.component.scss']
})
export class StateMachineSchemaComponent implements OnInit {

  @Input() queues: StateMachineQueue[] = [];
  @Output() queueSelected: EventEmitter<StateMachineQueue> = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

  select(item: StateMachineQueue) {
    this.queueSelected.emit(item);
  }

}
