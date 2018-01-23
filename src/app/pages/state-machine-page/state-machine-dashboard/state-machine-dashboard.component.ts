import {Component, OnDestroy, OnInit} from '@angular/core';
import {utc} from 'moment';
import {DateMap, flatUp} from "../../../shared/components/advanced-filter/advanced-filter.component";
import {AsyncSubject} from "rxjs/AsyncSubject";
import {StateMachineService} from '../state-machine.service';
import {StateMachineQueue} from '../../../shared/models/state-machine/state-machine-queue';
import {StateMachineTimeseries} from '../../../shared/models/state-machine/state-machine-timeseries.model';

@Component({
  selector: 'state-machine-dashboard',
  templateUrl: './state-machine-dashboard.component.html',
  styleUrls: ['./state-machine-dashboard.component.scss']
})
export class StateMachineDashboardComponent implements OnInit, OnDestroy {

  date: DateMap;

  queues: StateMachineQueue[];
  selectedQueue: StateMachineQueue;

  timeseries: StateMachineTimeseries[];

  private unsubscribe$: AsyncSubject<boolean> = new AsyncSubject();

  constructor(public stateMachineService: StateMachineService) { }

  ngOnInit() {
    this.date = {start: utc().subtract(3, 'M'), end: utc()};

    this.stateMachineService.queues$.takeUntil(this.unsubscribe$).subscribe(queues => {
      this.queues = queues;
    });

    this.stateMachineService.timeseries$.takeUntil(this.unsubscribe$).subscribe(timeseries => {
      this.timeseries = timeseries;
    });

    this.stateMachineService.getQueueStates();
    this.fetch();
  }

  ngOnDestroy() {
    this.unsubscribe$.next(true);
    this.unsubscribe$.complete();
  }

  fetch() {
    this.prepareFetch();
    this.stateMachineService.getTimeseries(this.selectedQueue.label, this.date.start.clone().format(), flatUp(this.date.end.clone()).format());
  }

  select(queue: StateMachineQueue) {
    this.queues = this.queues.map(i => {
      i.selected = i.label === queue.label;

      return i;
    });

    this.fetch();
  }

  prepareFetch() {
    const selected = this.queues.filter(queue => queue.selected);
    if (selected && selected.length > 0) {
      this.selectedQueue = selected[0];
    }
  }

  changeDate(map: DateMap): void {
    this.date = {start: map.start.clone(), end: map.end.clone()};
    this.fetch();
  }
}
