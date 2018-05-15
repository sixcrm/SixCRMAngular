import 'rxjs/add/operator/takeUntil';

import { Component, OnInit } from '@angular/core';
import {AsyncSubject} from 'rxjs';
import {AuthenticationService} from '../../../../authentication/authentication.service';

@Component({
  selector: 'c-dashboard-setup',
  templateUrl: './dashboard-setup.component.html',
  styleUrls: ['./dashboard-setup.component.scss']
})
export class DashboardSetupComponent implements OnInit {

  name: string;
  protected unsubscribe$: AsyncSubject<boolean> = new AsyncSubject<boolean>();

  constructor(
    private authService: AuthenticationService
  ) { }

  ngOnInit() {
    this.authService.sixUser$.takeUntil(this.unsubscribe$).subscribe(user => {
      this.name = user.firstName;
    });
  }
}
