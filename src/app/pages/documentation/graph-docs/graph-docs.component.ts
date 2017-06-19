import { Component, OnInit } from '@angular/core';
import {AuthenticationService} from '../../../authentication/authentication.service';
import {NavigationService} from '../../../navigation/navigation.service';

@Component({
  selector: 'graph-docs',
  templateUrl: './graph-docs.component.html',
  styleUrls: ['./graph-docs.component.scss']
})
export class GraphDocsComponent implements OnInit {

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
