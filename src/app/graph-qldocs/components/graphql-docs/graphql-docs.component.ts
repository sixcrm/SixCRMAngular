import { Component, OnInit, Input } from '@angular/core';
import {GraphqlDocsService, HeadersInput} from '../../graphql-docs.service';
import {Type} from '../../models/type.model';

@Component({
  selector: 'graphql-docs',
  templateUrl: './graphql-docs.component.html',
  styleUrls: ['./graphql-docs.component.scss']
})
export class GraphqlDocsComponent implements OnInit {

  @Input() endpoint: string;
  @Input() headers: HeadersInput[];

  types: Type[];
  filterString: string;

  constructor(private graphqlService: GraphqlDocsService) { }

  ngOnInit() {
    this.graphqlService.getSchemaTypes(this.endpoint, this.headers).subscribe((data: Type[]) => {
      // filter out meta types
      this.types = data.filter(type => type.name.indexOf('__') === -1).sort((a, b) => {

        // query should be on top of the list, then mutation, and then sort alphabetically
        if (a.name === 'Query') return -1;
        if (b.name === 'Query') return 1;

        if (a.name === 'Mutation') return -1;
        if (b.name === 'Mutation') return 1;

        if (a.name < b.name) return -1;

        if (a.name > b.name) return 1;

        return 0;
      });
    })
  }

}
