import { Component, OnInit } from '@angular/core';
import {AuthenticationService} from '../../../authentication/authentication.service';

@Component({
  selector: 'graph-docs-c',
  templateUrl: './graph-docs-c.component.html',
  styleUrls: ['./graph-docs-c.component.scss']
})
export class GraphDocsCComponent implements OnInit {

  endpoint = 'https://api.sixcrm.com/graph/*';
  headers = [
    {key: 'Content-Type', value: 'application/json'},
    {key: 'Authorization', value: this.authService.getToken()}
  ];

  constructor(private authService: AuthenticationService) {}

  ngOnInit() {
  }

}
