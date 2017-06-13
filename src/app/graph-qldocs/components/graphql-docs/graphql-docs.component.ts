import { Component, OnInit, Input } from '@angular/core';
import {GraphqlDocsService, HeadersInput} from '../../graphql-docs.service';
import {Type} from '../../models/type.model';
import {firstIndexOf} from '../../../shared/utils/array-utils';

@Component({
  selector: 'graphql-docs',
  templateUrl: './graphql-docs.component.html',
  styleUrls: ['./graphql-docs.component.scss']
})
export class GraphqlDocsComponent implements OnInit {

  @Input() endpoint: string;
  @Input() headers: HeadersInput[];

  types: Type[];

  otherTypes: Type[];
  queryType: Type;
  mutationType: Type;

  constructor(private graphqlService: GraphqlDocsService) { }

  ngOnInit() {
    this.graphqlService.getSchemaTypes(this.endpoint, this.headers).subscribe(data => {
      this.types = data.filter(t => t.name.indexOf('__') === -1);

      let queryIndex = firstIndexOf(this.types, (el) => el.name === 'Query');
      if (queryIndex > -1) {
        this.queryType = this.types[queryIndex];
        this.types.splice(queryIndex, 1);
      }

      let mutationIndex = firstIndexOf(this.types, (el) => el.name === 'Mutation');
      if (mutationIndex > -1) {
        this.mutationType = this.types[mutationIndex];
        this.types.splice(mutationIndex, 1);
      }

      this.otherTypes = this.types;
    })
  }

}
