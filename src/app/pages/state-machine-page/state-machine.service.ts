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
import {getQueueSummary, getCurrentQueueSummary} from '../../shared/utils/queries/queue.queries';

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

      this.timeseries$.next(
        res.json().response.data.rebillsummary.summary
          .map(t => new StateMachineTimeseries(t))
          .sort((a,b) => {
            if (a.datetime.isBefore(b.datetime)) return -1;
            if (a.datetime.isAfter(b.datetime)) return 1;

            return 0;
          })
      )
    });
  }

  getQueueStates(): void {
    this.queues$.next(generateQueues());
  }

  getCurrentQueueSummary(queueName: string): Observable<Response> {
    return this.queryRequest(getCurrentQueueSummary(queueName), {failStrategy: FailStrategy.Soft});
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

function generateQueues(): StateMachineQueue[] {
  return [
    {
      label: 'recover',
      labelkey: 'ORDERENGINE_ITEM_RECOVER',
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
      labelkey: 'ORDERENGINE_ITEM_FAILED',
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
      labelkey: 'ORDERENGINE_ITEM_BILL',
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
      labelkey: 'ORDERENGINE_ITEM_HOLD',
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
      labelkey: 'ORDERENGINE_ITEM_PENDING',
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
      labelkey: 'ORDERENGINE_ITEM_SHIPPED',
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
      labelkey: 'ORDERENGINE_ITEM_DELIVERED',
      count: 0,
      schemaPosition: 'right',
      selected:false,
      avgTimeInSeconds: 0,
      failureRate: 0,
      loaded: false
    }
  ];
}
