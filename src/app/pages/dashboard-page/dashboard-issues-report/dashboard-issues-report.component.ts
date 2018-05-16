import {Component, OnInit, Input} from '@angular/core';

export interface DashboardIssueReportItem {
  label: string,
  issues: any[]
}

@Component({
  selector: 'dashboard-issues-report',
  templateUrl: './dashboard-issues-report.component.html',
  styleUrls: ['./dashboard-issues-report.component.scss']
})
export class DashboardIssuesReportComponent implements OnInit {

  @Input() reports: DashboardIssueReportItem[] = [];
  @Input() background: boolean = false;

  constructor() { }

  ngOnInit() {
  }

}
