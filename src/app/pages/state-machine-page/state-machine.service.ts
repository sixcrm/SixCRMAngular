import { Injectable } from '@angular/core';
import {Moment} from 'moment';
import {StateMachineTimeseries} from '../../shared/models/state-machine/state-machine-timeseries.model';
import {Subject} from 'rxjs';
import {StateMachineQueue} from '../../shared/models/state-machine/state-machine-queue';

@Injectable()
export class StateMachineService {

  timeseries$: Subject<StateMachineTimeseries[]> = new Subject();
  queues$: Subject<StateMachineQueue[]> = new Subject();

  constructor() { }

  getTimeseries(type: string, start: Moment, end: Moment): void {
    this.timeseries$.next(generateTimeseries(start.clone(), end.clone()));
  }

  getQueues(): void {
    this.queues$.next(generateQueues());
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
      count: 1200,
      schemaPosition: 'left',
      selected:false,
      avgTimeInSeconds: 30,
      failureRate: 14,
      state: 'a',
      downstreamQueues: ['BILL', 'FAILED']
    },
    {
      label: 'failed',
      count: 80,
      schemaPosition: 'left',
      selected:false,
      avgTimeInSeconds: 25,
      failureRate: 17,
      state: 'a',
      downstreamQueues: ['PENDING']
    },
    {
      label: 'bill',
      count: 1134,
      schemaPosition: 'right',
      selected:true,
      avgTimeInSeconds: 26,
      failureRate: 15,
      state: 'b',
      description: 'This section of the SIX state machine is the entry point for all of the orders coming into your SIX account.',
      downstreamQueues: ['HOLD']
    },
    {
      label: 'hold',
      count: 125,
      schemaPosition: 'right',
      selected:false,
      avgTimeInSeconds: 20,
      failureRate: 8,
      state: 'a',
      downstreamQueues: ['PENDING']
    },
    {
      label: 'pending',
      count: 5534,
      schemaPosition: 'right',
      selected:false,
      avgTimeInSeconds: 22,
      failureRate: 12,
      state: 'c',
      downstreamQueues: ['SHIPPED']
    },
    {
      label: 'shipped',
      count: 6135,
      schemaPosition: 'right',
      selected:false,
      avgTimeInSeconds: 15,
      failureRate: 18,
      state: 'a',
      downstreamQueues: ['DELIVERED']
    },
    {
      label: 'delivered',
      count: 7175,
      schemaPosition: 'right',
      selected:false,
      avgTimeInSeconds: 35,
      failureRate: 20,
      state: 'a'
    }
  ];
}
