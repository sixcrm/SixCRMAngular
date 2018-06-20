import { Component, OnInit } from '@angular/core';
import {AuthenticationService} from '../../../authentication/authentication.service';
import {NavigationService} from '../../../navigation/navigation.service';
import {environment} from '../../../../environments/environment';

@Component({
  selector: 'graph-docs-page',
  templateUrl: './graph-docs-page.component.html',
  styleUrls: ['./graph-docs-page.component.scss']
})
export class GraphDocsPageComponent implements OnInit {

  endpoint = environment.endpoint + '*';
  headers = [
    {key: 'Content-Type', value: 'application/json'},
    {key: 'Authorization', value: this.authService.getToken()}
  ];
  showSidenav: boolean;

  constructor(private authService: AuthenticationService, private navigationService: NavigationService) {}

  ngOnInit() {
    this.navigationService.showSidenav.subscribe(showSidenav => {
      this.showSidenav = showSidenav;
    });
  }

  ngOnDestroy() { }

}
