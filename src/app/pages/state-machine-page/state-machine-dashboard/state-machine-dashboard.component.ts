import {Component, OnDestroy, OnInit} from '@angular/core';
import {utc} from 'moment';
import {DateMap, FilterTerm} from "../../../shared/components/advanced-filter/advanced-filter.component";
import {AsyncSubject} from "rxjs/AsyncSubject";
import {ActivatedRoute} from "@angular/router";
import {StateMachineItem} from "./state-machine-item";

@Component({
  selector: 'state-machine-dashboard',
  templateUrl: './state-machine-dashboard.component.html',
  styleUrls: ['./state-machine-dashboard.component.scss']
})
export class StateMachineDashboardComponent implements OnInit, OnDestroy {

  date: DateMap;

  items: StateMachineItem[] = [
    {
      label: 'RECOVER',
      count: 1200,
      schemaPosition: 'left',
      selected:false,
      avgTimeInSeconds: 30,
      failureRate: 14,
      state: 'a'
    },
    {
      label: 'FAILED',
      count: 80,
      schemaPosition: 'left',
      selected:false,
      avgTimeInSeconds: 25,
      failureRate: 17,
      state: 'a'
    },
    {
      label: 'BILL',
      count: 1134,
      schemaPosition: 'right',
      selected:true,
      avgTimeInSeconds: 26,
      failureRate: 15,
      state: 'b',
      description: 'This section of the SIX state machine is the entry point for all of the orders coming into your SIX account.'
    },
    {
      label: 'HOLD',
      count: 125,
      schemaPosition: 'right',
      selected:false,
      avgTimeInSeconds: 20,
      failureRate: 8,
      state: 'a'
    },
    {
      label: 'PENDING',
      count: 5534,
      schemaPosition: 'right',
      selected:false,
      avgTimeInSeconds: 22,
      failureRate: 12,
      state: 'c'
    },
    {
      label: 'SHIPPED',
      count: 6135,
      schemaPosition: 'right',
      selected:false,
      avgTimeInSeconds: 15,
      failureRate: 18,
      state: 'a'
    },
    {
      label: 'DELIVERED',
      count: 7175,
      schemaPosition: 'right',
      selected:false,
      avgTimeInSeconds: 35,
      failureRate: 20,
      state: 'a'
    }
  ];

  selectedItem: StateMachineItem;

  private unsubscribe$: AsyncSubject<boolean> = new AsyncSubject();

  constructor(private route: ActivatedRoute) { }

  fetchFunction() {
    this.prepareFetch();
  }

  ngOnInit() {

    this.route.queryParams.takeUntil(this.unsubscribe$).subscribe(params => {
      this.date = {start: utc().subtract(3, 'M'), end: utc()};
      this.fetchFunction();
    });

  }

  ngOnDestroy() {
    this.unsubscribe$.next(true);
    this.unsubscribe$.complete();
  }

  select(item: StateMachineItem) {
    this.items = this.items.map(i => {
      i.selected = i.label === item.label;

      return i;
    });

    this.prepareFetch();
  }

  prepareFetch() {
    const selected = this.items.filter(item => item.selected);
    if (selected && selected.length > 0) {
      this.selectedItem = selected[0];
    }
  }

  changeDate(map: DateMap): void {
    this.date = {start: map.start.clone(), end: map.end.clone()};
  }
}
