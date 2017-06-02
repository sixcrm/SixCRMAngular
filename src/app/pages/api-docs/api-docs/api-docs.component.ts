import { Component, OnInit } from '@angular/core';
import {AuthenticationService} from '../../../authentication/authentication.service';

declare var renderDocs: any;

@Component({
  selector: 'api-docs',
  templateUrl: './api-docs.component.html',
  styleUrls: ['./api-docs.component.scss']
})
export class ApiDocsComponent implements OnInit {

  constructor(private authService: AuthenticationService) { }

  ngOnInit() {
    let url = 'https://api.sixcrm.com/graph/*';

    renderDocs(this.authService.getToken(), url);
  }

}
