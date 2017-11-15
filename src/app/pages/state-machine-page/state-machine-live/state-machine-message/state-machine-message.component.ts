import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {QueueMessage} from '../../../../shared/models/state-machine/queue-message.model';

@Component({
  selector: 'state-machine-message',
  templateUrl: './state-machine-message.component.html',
  styleUrls: ['./state-machine-message.component.scss']
})
export class StateMachineMessageComponent implements OnInit {

  @Input() message: QueueMessage;

  @Output() close: EventEmitter<boolean> = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

}
