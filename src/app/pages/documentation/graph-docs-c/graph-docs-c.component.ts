import {Component, OnInit, OnDestroy} from '@angular/core';
import {AuthenticationService} from '../../../authentication/authentication.service';
import {NavigationService} from '../../../navigation/navigation.service';

@Component({
  selector: 'graph-docs-c',
  templateUrl: './graph-docs-c.component.html',
  styleUrls: ['./graph-docs-c.component.scss']
})
export class GraphDocsCComponent implements OnInit, OnDestroy {

  endpoint = 'https://api.sixcrm.com/graph/*';
  headers = [
    {key: 'Content-Type', value: 'application/json'},
    {key: 'Authorization', value: this.authService.getToken()}
  ];

  constructor(private authService: AuthenticationService, private navigationService: NavigationService) {}

  ngOnInit() {
    this.navigationService.setSidenavAuto(false);
  }

  ngOnDestroy() {
    this.navigationService.resetSidenavAuto();
  }

}
