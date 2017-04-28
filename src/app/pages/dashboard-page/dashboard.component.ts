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
    series: [
      {
        color: '#F28933',
        data: [
          [1266278400000,28.30],
          [1266364800000,28.35],
          [1266451200000,28.59],
          [1266537600000,28.45],
          [1266796800000,28.63],
          [1266883200000,28.15],
          [1266969600000,28.12]
        ]
      },
      {
        color: '#407CC1',
        data: [
          [1266278400000,28.00],
          [1266364800000,28.14],
          [1266451200000,28.29],
          [1266537600000,28.91],
          [1266796800000,28.51],
          [1266883200000,28.39],
          [1266969600000,28.23]
        ]
      },
      {
        color: '#9ADDFB',
        data: [
          [1266278400000,28.10],
          [1266364800000,28.24],
          [1266451200000,28.19],
          [1266537600000,28.63],
          [1266796800000,28.41],
          [1266883200000,28.49],
          [1266969600000,28.53]
        ]
      }
    ]
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
