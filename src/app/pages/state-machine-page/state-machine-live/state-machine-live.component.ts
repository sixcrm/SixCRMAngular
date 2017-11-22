import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {AsyncSubject} from "rxjs/AsyncSubject";
import {StateMachineService} from '../state-machine.service';
import {StateMachineQueue} from '../../../shared/models/state-machine/state-machine-queue';
import {NavigationService} from '../../../navigation/navigation.service';
import {utc} from 'moment';
import {StateMachineTimeseries} from '../../../shared/models/state-machine/state-machine-timeseries.model';
import {DateMap} from '../../../shared/components/advanced-filter/advanced-filter.component';
import {Subscription, Observable} from 'rxjs';
import {ColumnParams} from '../../../shared/models/column-params.model';
import {TableMemoryTextOptions} from '../../components/table-memory/table-memory.component';
import {QueueMessage} from '../../../shared/models/state-machine/queue-message.model';
import {AuthenticationService} from '../../../authentication/authentication.service';
import {firstIndexOf} from '../../../shared/utils/array.utils';

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
  messages: QueueMessage[] = [];

  private unsubscribe$: AsyncSubject<boolean> = new AsyncSubject();

  messageColumnParams = [];

  tableTextOptions: TableMemoryTextOptions = {title: 'Queue Messages', viewOptionText: 'Show Messages'};

  showMessage: boolean;
  messageToShow: QueueMessage;

  constructor(
    private route: ActivatedRoute,
    public stateMachineService: StateMachineService,
    private navigation: NavigationService,
    private authService: AuthenticationService
  ) {}

  ngOnInit() {
    let f = this.authService.getTimezone();

    this.messageColumnParams = [
      new ColumnParams('Transaction ID', (e: QueueMessage) => e.transactionId),
      new ColumnParams('Created at', (e: QueueMessage) => e.createdAt.tz(f).format('MM/DD [at] h:mm:ss a')),
      new ColumnParams('Faults', (e: QueueMessage) => e.faults),
      new ColumnParams('Account ID', (e: QueueMessage) => e.accountId),
      new ColumnParams('Merchant ID', (e: QueueMessage) => e.merchantId)
    ];

    this.date = {start: utc().subtract(3, 'M'), end: utc()};

    this.stateMachineService.queues$.takeUntil(this.unsubscribe$).subscribe(queues => {

      const filtered = queues.filter(q => q.label.toLowerCase() === this.queueName.toLowerCase());

      if (filtered && filtered.length === 1) {
        this.queue = filtered[0];
        this.messages = [];
        this.showMessage = false;
        this.messageToShow = null;
        this.fetchTimeseries();
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
  }

  fetchQueue(): void {
    this.stateMachineService.getQueues();
  }

  fetchTimeseries(): void {
    this.stateMachineService.getTimeseries(this.queue.label, this.date.start.clone(), this.date.end.clone())
  }

  fetchMessages(): void {
    if (this.fetchSub) {
      this.fetchSub.unsubscribe();
    }

    this.fetchSub = this.stateMachineService.getMessages(this.queueName).take(1).subscribe(data => {
      data.forEach(m => {
        if (firstIndexOf(this.messages, (e) => e.id === m.id) === -1) {
          this.messages.push(m);
        }
      });

      this.messages = this.messages.slice();
    });
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

  viewMessage(message: QueueMessage): void {
    this.messageToShow = message;
    this.showMessage = true;
  }

  hideMessage(): void {
    this.showMessage = false;
  }

  ngOnDestroy() {
    this.unsubscribe$.next(true);
    this.unsubscribe$.complete();
  }
}
