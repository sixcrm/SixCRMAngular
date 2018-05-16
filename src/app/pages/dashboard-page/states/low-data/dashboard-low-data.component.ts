import 'rxjs/add/operator/takeUntil';
import {DashboardIssueReportItem} from '../../dashboard-issues-report/dashboard-issues-report.component';
import {Component, OnInit} from '@angular/core';
import {AsyncSubject} from 'rxjs';
import {AuthenticationService} from '../../../../authentication/authentication.service';

@Component({
  selector: 'c-dashboard-low-data',
  templateUrl: './dashboard-low-data.component.html',
  styleUrls: ['./dashboard-low-data.component.scss']
})
export class DashboardLowDataComponent implements OnInit {

  issueReports: DashboardIssueReportItem[] = [
    {label: 'Orders', issues: []},
    {label: 'Fulfillment', issues: []},
    {label: 'Billing', issues: []},
    {label: 'MIDS', issues: []}
  ];

  name: string;
  protected unsubscribe$: AsyncSubject<boolean> = new AsyncSubject<boolean>();

  transactions = [
    {status: 'Success', amount: '$34.99', date: '05/01/18 11:16am UTC', merchantprovider: 'NMI Account 1'},
    {status: 'Success', amount: '$34.99', date: '05/01/18 11:16am UTC', merchantprovider: 'NMI Account 1'},
    {status: 'Success', amount: '$34.99', date: '05/01/18 11:16am UTC', merchantprovider: 'NMI Account 1'},
    {status: 'Success', amount: '$34.99', date: '05/01/18 11:16am UTC', merchantprovider: 'NMI Account 1'},
    {status: 'Success', amount: '$34.99', date: '05/01/18 11:16am UTC', merchantprovider: 'NMI Account 1'},
    {status: 'Success', amount: '$34.99', date: '05/01/18 11:16am UTC', merchantprovider: 'NMI Account 1'},
    {status: 'Success', amount: '$34.99', date: '05/01/18 11:16am UTC', merchantprovider: 'NMI Account 1'}
    ];

  constructor(
    private authService: AuthenticationService
  ) { }

  ngOnInit() {
    this.authService.sixUser$.takeUntil(this.unsubscribe$).subscribe(user => {
      this.name = user.firstName;
    });
  }
}
