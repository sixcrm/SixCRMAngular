import {Component, Input, OnInit, Output, EventEmitter} from '@angular/core';
import {StateMachineTimeseries} from '../../../../shared/models/state-machine/state-machine-timeseries.model';
import {StateMachineQueue} from '../../../../shared/models/state-machine/state-machine-queue';
import {DateMap} from '../../../../shared/components/advanced-filter/advanced-filter.component';

@Component({
  selector: 'state-machine-details',
  templateUrl: './state-machine-details.component.html',
  styleUrls: ['./state-machine-details.component.scss']
})
export class StateMachineDetailsComponent implements OnInit {

  @Input() queue: StateMachineQueue;
  @Input() standalone: boolean;
  @Input() isPolling: boolean;
  @Input() timeseries: StateMachineTimeseries[];
  @Input() date: DateMap;

  @Output() togglePolling: EventEmitter<boolean> = new EventEmitter();
  @Output() dateChanged: EventEmitter<DateMap> = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

}
