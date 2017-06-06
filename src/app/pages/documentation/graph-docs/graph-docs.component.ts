import { Component, OnInit } from '@angular/core';
import {AuthenticationService} from '../../../authentication/authentication.service';

declare var renderDocs: any;

@Component({
  selector: 'graph-docs',
  templateUrl: './graph-docs.component.html',
  styleUrls: ['./graph-docs.component.scss']
})
export class GraphDocsComponent implements OnInit {

  constructor(private authService: AuthenticationService) { }

  ngOnInit() {
    let url = 'https://api.sixcrm.com/graph/*';

    renderDocs(this.authService.getToken(), url);
  }

}
