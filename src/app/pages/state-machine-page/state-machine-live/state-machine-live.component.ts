import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {AsyncSubject, Subscription, Observable} from "rxjs";
import {StateMachineService} from '../state-machine.service';
import {StateMachineQueue} from '../../../shared/models/state-machine/state-machine-queue';
import {NavigationService} from '../../../navigation/navigation.service';
import {utc} from 'moment';
import {StateMachineTimeseries} from '../../../shared/models/state-machine/state-machine-timeseries.model';
import {DateMap, flatUp} from '../../../shared/components/advanced-filter/advanced-filter.component';
import {Rebill} from '../../../shared/models/rebill.model';
import {RebillsService} from '../../../shared/services/rebills.service';
import {CustomServerError} from '../../../shared/models/errors/custom-server-error';

@Component({
  selector: 'state-machine-live',
  templateUrl: './state-machine-live.component.html',
  styleUrls: ['./state-machine-live.component.scss']
})
export class StateMachineLiveComponent implements OnInit, OnDestroy {

  date: DateMap;

  queueName: string;
  queue: StateMachineQueue;
  timeseries: StateMachineTimeseries[];
  polling: boolean;
  pollingInterval: number = 60000;
  intervalSub: Subscription;
  fetchSub: Subscription;
  enableLivePooling: boolean = false;

  private unsubscribe$: AsyncSubject<boolean> = new AsyncSubject();

  rebill: Rebill;
  sub: Subscription;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public stateMachineService: StateMachineService,
    private navigation: NavigationService,
    private rebillService: RebillsService
  ) {}

  ngOnInit() {
    this.date = {start: utc().subtract(3, 'M'), end: utc()};

    this.stateMachineService.queues$.takeUntil(this.unsubscribe$).subscribe(queues => {

      const filtered = queues.filter(q => q.label.toLowerCase() === this.queueName.toLowerCase());

      if (filtered && filtered.length === 1) {
        this.queue = filtered[0];
        this.rebill = null;
        this.fetchTimeseries();
        this.fetchQueueState();
        this.startPolling();
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

    this.rebillService.entity$.takeUntil(this.unsubscribe$).subscribe(rebill => {
      if (rebill instanceof CustomServerError) {
        this.rebill = null;
        return;
      }

      this.rebill = rebill;
    });

    this.route.queryParams.takeUntil(this.unsubscribe$).subscribe(params => {
      if (params && params['rebill']) {
        this.rebillService.getEntity(params['rebill']);
      }
    });
  }

  fetchQueueState(): void {
    this.queue.loaded = false;

    if (this.sub) {
      this.sub.unsubscribe();
    }

    this.sub = this.stateMachineService.getCurrentQueueSummary(this.queue.label).subscribe(res => {
      if (res instanceof CustomServerError) {
        this.queue.loaded = true;

        return;
      }

      let summary = res.body.response.data.currentqueuesummary.summary[0];

      this.queue.count = summary.number_of_rebills;
      this.queue.avgTimeInSeconds = summary.avg_time;
      this.queue.failureRate = summary.failure_rate;
      this.queue.avgTimeColor = summary.avg_time_color;
      this.queue.failureColor = summary.failure_rate_color;

      this.queue.loaded = true;
    })
  }

  fetchQueue(): void {
    this.stateMachineService.getQueueStates();
  }

  fetchTimeseries(): void {
    this.stateMachineService.getTimeseries(this.queue.label, this.date.start.clone().format(), flatUp(this.date.end.clone()).format())
  }

  fetchMessages(): void {
    if (this.fetchSub) {
      this.fetchSub.unsubscribe();
    }
  }

  startPolling(): void {
    this.polling = true;

    if (this.intervalSub) {
      this.intervalSub.unsubscribe();
    }

    this.fetchMessages();

    this.intervalSub = Observable.interval(this.pollingInterval).takeUntil(this.unsubscribe$).subscribe(() => {
      this.fetchMessages();
    })
  }

  pausePolling(): void {
    this.polling = false;

    if (this.intervalSub) {
      this.intervalSub.unsubscribe();
    }
  }

  changeDate(map: DateMap): void {
    this.date = {start: map.start.clone(), end: map.end.clone()};
    this.fetchTimeseries();
  }

  viewRebill(rebill: Rebill): void {
    this.router.navigate(['/state-machine', this.queueName], {queryParams: {rebill: rebill.id}});
  }

  hideRebill(): void {
    this.rebill = null;
    this.router.navigate(['/state-machine', this.queueName]);
  }

  ngOnDestroy() {
    this.unsubscribe$.next(true);
    this.unsubscribe$.complete();
  }
}
