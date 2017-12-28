import { Injectable } from '@angular/core';
import {Moment, utc} from 'moment';
import {StateMachineTimeseries} from '../../shared/models/state-machine/state-machine-timeseries.model';
import {Subject, Observable} from 'rxjs';
import {StateMachineQueue} from '../../shared/models/state-machine/state-machine-queue';
import {AuthenticationService} from '../../authentication/authentication.service';
import {
  RequestBehaviourOptions, generateHeaders, HttpWrapperService,
  FailStrategy
} from '../../shared/services/http-wrapper.service';
import {CustomServerError} from '../../shared/models/errors/custom-server-error';
import {Response} from '@angular/http';
import {environment} from '../../../environments/environment';
import {getQueueSummary, getQueueState} from '../../shared/utils/queries/queue.queries';

@Injectable()
export class StateMachineService {

  timeseries$: Subject<StateMachineTimeseries[]> = new Subject();
  queues$: Subject<StateMachineQueue[]> = new Subject();

  constructor(private authService: AuthenticationService, private http: HttpWrapperService) { }

  getTimeseries(queue: string, start: string, end: string): void {
    this.queryRequest(getQueueSummary(queue, start, end)).subscribe(res => {
      if (res instanceof CustomServerError) {
        this.timeseries$.next([]);
        return;
      }

      this.timeseries$.next(res.json().response.data.rebillsummary.summary.map(t => new StateMachineTimeseries(t)))
    });
  }

  getQueueStates(): void {
    this.queues$.next(generateQueues());
  }

  getQueueState(queueName: string): Observable<Response> {
    const start = utc();
    const end = utc().subtract(1, 'd');

    return this.queryRequest(getQueueState(queueName, start.format(), end.format()), {failStrategy: FailStrategy.Soft});
  }

  protected queryRequest(query: string, requestBehaviourOptions?: RequestBehaviourOptions): Observable<Response | CustomServerError> {
    let endpoint = environment.endpoint;

    if (this.authService.getActingAsAccount()) {
      endpoint += this.authService.getActingAsAccount().id;
    } else if (this.authService.getActiveAcl() && this.authService.getActiveAcl().account) {
      endpoint += this.authService.getActiveAcl().account.id;
    } else {
      endpoint += '*';
    }

    return this.http.postWithError(endpoint, query, { headers: generateHeaders(this.authService.getToken())}, requestBehaviourOptions);
  }
}

function generateTimeseries(start: Moment, end: Moment): StateMachineTimeseries[] {
  let timeseries: StateMachineTimeseries[] = [];

  let step = end.diff(start, 'd') / 10;
  if (step < 1) {
    step = 1;
  }

  while (start.isBefore(end)) {
    timeseries.push(new StateMachineTimeseries({period: start.clone(), count: Math.floor(Math.random() * 201) + 1000}));
    start = start.clone().add(step, 'd');
  }

  if (step % 1 !== 0) {
    timeseries.push(new StateMachineTimeseries({period: end.clone(), count: Math.floor(Math.random() * 501) + 1000}));
  }

  return timeseries;
}

function generateQueues(): StateMachineQueue[] {
  return [
    {
      label: 'recover',
      count: 0,
      schemaPosition: 'left',
      selected:false,
      avgTimeInSeconds: 0,
      failureRate: 0,
      downstreamQueues: ['BILL', 'FAILED'],
      loaded: false
    },
    {
      label: 'failed',
      count: 0,
      schemaPosition: 'left',
      selected:false,
      avgTimeInSeconds: 0,
      failureRate: 0,
      downstreamQueues: ['PENDING'],
      loaded: false
    },
    {
      label: 'bill',
      count: 0,
      schemaPosition: 'right',
      selected:true,
      avgTimeInSeconds: 0,
      failureRate: 0,
      description: 'This section of the SIX state machine is the entry point for all of the orders coming into your SIX account.',
      downstreamQueues: ['HOLD'],
      loaded: false
    },
    {
      label: 'hold',
      count: 0,
      schemaPosition: 'right',
      selected:false,
      avgTimeInSeconds: 0,
      failureRate: 0,
      downstreamQueues: ['PENDING'],
      loaded: false
    },
    {
      label: 'pending',
      count: 0,
      schemaPosition: 'right',
      selected:false,
      avgTimeInSeconds: 0,
      failureRate: 0,
      downstreamQueues: ['SHIPPED'],
      loaded: false
    },
    {
      label: 'shipped',
      count: 0,
      schemaPosition: 'right',
      selected:false,
      avgTimeInSeconds: 0,
      failureRate: 0,
      downstreamQueues: ['DELIVERED'],
      loaded: false
    },
    {
      label: 'delivered',
      count: 0,
      schemaPosition: 'right',
      selected:false,
      avgTimeInSeconds: 0,
      failureRate: 0,
      loaded: false
    }
  ];
}
