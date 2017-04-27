import { Component, OnInit } from '@angular/core';
import {utc} from 'moment';

@Component({
  selector: 'c-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  filterTerms: any[] = [];
  currentFilterTerm: string;

  dateFilters: any = [
    {label: '1M', start: utc().subtract(1,'M'), end: utc()},
    {label: '3M', start: utc().subtract(3,'M'), end: utc()},
    {label: '6M', start: utc().subtract(6,'M'), end: utc()},
    {label: 'YTD', start: utc().startOf('year'), end: utc()},
    {label: '1Y', start: utc().subtract(1,'y'), end: utc()},
    {label: 'ALL', start: utc().subtract(10,'y'), end: utc()}
  ];

  activeDataFilterIndex: number = 1;

  chartOptions = {
    credits: {enabled: false},
    rangeSelector: {enabled: false},
    series: [{
      data: [
        [1266278400000,29.06],
        [1266364800000,28.94],
        [1266451200000,28.99],
        [1266537600000,28.81],
        [1266796800000,28.63],
        [1266883200000,28.15],
        [1266969600000,28.66]
    ]}]
  };

  constructor() { }

  ngOnInit() { }

  removeFilterTerm(filterTerm: string): void {
    let index = this.filterTerms.indexOf(filterTerm);

    if (index > -1) {
      this.filterTerms.splice(index,1);
    }
  }

  filterTermInput(event): void {
    this.currentFilterTerm = event.target.value;
  }

  onFilterKey(event): void {
    if (event.key === 'Enter' && this.currentFilterTerm) {
      this.filterTerms.push(this.currentFilterTerm);
      this.currentFilterTerm = '';
    }
  }

  setActiveDateFilterIndex(index: number): void {
    this.activeDataFilterIndex = index;
  }

}
