import {Component, OnInit, Input} from '@angular/core';
import {utc} from 'moment';

@Component({
  selector: 'billing-summary',
  templateUrl: './billing-summary.component.html',
  styleUrls: ['./billing-summary.component.scss']
})
export class BillingSummaryComponent implements OnInit {

  loading: boolean = false;

  sum: {count, price};

  @Input() focused: boolean;

  filterIndex = 2;
  filterArray = [
    utc().subtract(1, 'd'),
    utc().subtract(7, 'd'),
    utc().subtract(1, 'M'),
  ];

  dateMap = {start: this.filterArray[this.filterIndex], end: utc()};

  constructor() { }

  ngOnInit() {
  }

  updateFilterIndex(index: number) {
    if (this.filterIndex === index) return;

    this.filterIndex = index;
    this.dateMap = {start: this.filterArray[index], end: utc()};
  }

  updateSum(sum) {
    this.sum = {
      count: sum,
      price: this.calculatePrice(sum)
    }
  }

  calculatePrice(price) {
    if (price < 500) {
      return 0;
    }

    return ((price - 500) * 0.6).toFixed(2);
  }
}
