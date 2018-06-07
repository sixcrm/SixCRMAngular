import { Component, OnInit } from '@angular/core';
import {AuthenticationService} from '../../../authentication/authentication.service';
import {NavigationService} from '../../../navigation/navigation.service';
import {environment} from '../../../../environments/environment';

@Component({
  selector: 'graph-docs-2',
  templateUrl: './graph-docs-2.component.html',
  styleUrls: ['./graph-docs-2.component.scss']
})
export class GraphDocs2Component implements OnInit {

  endpoint = environment.endpoint + '*';
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
