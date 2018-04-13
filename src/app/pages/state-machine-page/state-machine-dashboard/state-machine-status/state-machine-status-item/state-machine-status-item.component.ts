import {Component, Input, OnInit, OnDestroy} from '@angular/core';
import {StateMachineQueue} from '../../../../../shared/models/state-machine/state-machine-queue';
import {StateMachineService} from '../../../state-machine.service';
import {Subscription} from 'rxjs';
import {CustomServerError} from '../../../../../shared/models/errors/custom-server-error';

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
    this.sub = this.stateMachineService.getCurrentQueueSummary(this.queue.label).subscribe(res => {
      if (res instanceof CustomServerError) {
        this.queue.loaded = true;

        return;
      }

      let summary = res.body.json().response.data.currentqueuesummary.summary[0];

      this.queue.count = summary.number_of_rebills;
      this.queue.avgTimeInSeconds = summary.avg_time;
      this.queue.failureRate = summary.failure_rate;
      this.queue.avgTimeColor = summary.avg_time_color;
      this.queue.failureColor = summary.failure_rate_color;

      this.queue.loaded = true;
    })
  }

  ngOnDestroy() {
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }

}
