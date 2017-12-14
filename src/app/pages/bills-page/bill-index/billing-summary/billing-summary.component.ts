import {Component, OnInit, Input} from '@angular/core';
import {utc} from 'moment';

@Component({
  selector: 'billing-summary',
  templateUrl: './billing-summary.component.html',
  styleUrls: ['./billing-summary.component.scss']
})
export class BillingSummaryComponent implements OnInit {

  loading: boolean = false;

  counts = [
    {time: utc().subtract(14,'d'), count: 20},
    {time: utc().subtract(13,'d'), count: 25},
    {time: utc().subtract(12,'d'), count: 26},
    {time: utc().subtract(11,'d'), count: 29},
    {time: utc().subtract(10,'d'), count: 29},
    {time: utc().subtract(9,'d'), count: 29},
    {time: utc().subtract(8,'d'), count: 29},
    {time: utc().subtract(7,'d'), count: 31},
    {time: utc().subtract(6,'d'), count: 32},
    {time: utc().subtract(5,'d'), count: 45},
    {time: utc().subtract(4,'d'), count: 57},
    {time: utc().subtract(3,'d'), count: 80},
    {time: utc().subtract(2,'d'), count: 81},
    {time: utc().subtract(1,'d'), count: 85},
    {time: utc(), count: 88},
  ];

  @Input() focused: boolean;

  constructor() { }

  ngOnInit() {
  }

}
