import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {AsyncSubject} from "rxjs/AsyncSubject";
import {StateMachineService} from '../state-machine.service';
import {StateMachineQueue} from '../../../shared/models/state-machine/state-machine-queue';
import {NavigationService} from '../../../navigation/navigation.service';
import {utc} from 'moment';
import {StateMachineTimeseries} from '../../../shared/models/state-machine/state-machine-timeseries.model';

@Component({
  selector: 'state-machine-live',
  templateUrl: './state-machine-live.component.html',
  styleUrls: ['./state-machine-live.component.scss']
})
export class StateMachineLiveComponent implements OnInit, OnDestroy {

  queueName: string;
  queue: StateMachineQueue;
  timeseries: StateMachineTimeseries[];
  polling: boolean = true;
  private unsubscribe$: AsyncSubject<boolean> = new AsyncSubject();

  constructor(
    private route: ActivatedRoute,
    public stateMachineService: StateMachineService,
    private navigation: NavigationService
  ) {}

  ngOnInit() {
    this.stateMachineService.queues$.takeUntil(this.unsubscribe$).subscribe(queues => {

      const filtered = queues.filter(q => q.label.toLowerCase() === this.queueName.toLowerCase());

      if (filtered && filtered.length === 1) {
        this.queue = filtered[0];
        this.fetchTimeseries();
      } else {
        this.navigation.goToNotFoundPage();
      }

    });

    this.stateMachineService.timeseries$.takeUntil(this.unsubscribe$).subscribe(timeseries => {
      this.timeseries = timeseries;
    });

    this.route.params.takeUntil(this.unsubscribe$).subscribe(params => {
      if (params && params['queue']) {
        this.queueName = params['queue'];

        this.fetchQueue();
      }
    });
  }

  fetchQueue(): void {
    this.stateMachineService.getQueues();
  }

  fetchTimeseries(): void {
    this.stateMachineService.getTimeseries(this.queue.label, utc().subtract(3, 'M'), utc())
  }

  startPolling(): void {
    this.polling = true;
  }

  pausePolling(): void {
    this.polling = false;
  }

  ngOnDestroy() {
    this.unsubscribe$.next(true);
    this.unsubscribe$.complete();
  }
}
