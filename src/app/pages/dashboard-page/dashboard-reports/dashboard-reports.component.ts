import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'dashboard-reports',
  templateUrl: './dashboard-reports.component.html',
  styleUrls: ['./dashboard-reports.component.scss']
})
export class DashboardReportsComponent implements OnInit {

  @Input() params: string;

  constructor() { }

  ngOnInit() {
  }

}
