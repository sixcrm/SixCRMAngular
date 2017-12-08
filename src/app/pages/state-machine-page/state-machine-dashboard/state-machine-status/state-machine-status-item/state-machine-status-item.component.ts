import {Component, Input, OnInit, OnDestroy} from '@angular/core';
import {StateMachineQueue} from '../../../../../shared/models/state-machine/state-machine-queue';
import {StateMachineService} from '../../../state-machine.service';
import {Subscription} from 'rxjs';

@Component({
  selector: 'state-machine-status-item',
  templateUrl: './state-machine-status-item.component.html',
  styleUrls: ['./state-machine-status-item.component.scss']
})
export class StateMachineStatusItemComponent implements OnInit, OnDestroy {

  @Input() queue: StateMachineQueue;

  sub: Subscription;

  constructor(private stateMachineService: StateMachineService) { }

  ngOnInit() {
    this.sub = this.stateMachineService.getQueueState(this.queue.label).subscribe(res => {
      const state = res.json().response.data.queuestate;

      this.queue.count = state.count;
      this.queue.avgTimeInSeconds = state.average_time;
      this.queue.failureRate = state.failure_rate;
      this.queue.loaded = true;
    })
  }

  ngOnDestroy() {
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }

}
