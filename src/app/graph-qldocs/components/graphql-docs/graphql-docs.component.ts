import { Component, OnInit, Input } from '@angular/core';
import {GraphqlDocsService, HeadersInput} from '../../graphql-docs.service';
import {Type} from '../../models/type.model';
import {sortTypes, sortFields} from '../../utils';
import {SearchItem} from '../side-search/side-search.component';

@Component({
  selector: 'graphql-docs',
  templateUrl: './graphql-docs.component.html',
  styleUrls: ['./graphql-docs.component.scss']
})
export class GraphqlDocsComponent implements OnInit {

  @Input() endpoint: string;
  @Input() headers: HeadersInput[];

  types: Type[];
  searchItems: SearchItem[] = [
    {name: 'Query', children: []},
    {name: 'Mutation', children: []},
    {name: 'Types', children: []}
  ];

  loaded: boolean = false;

  constructor(private graphqlService: GraphqlDocsService) { }

  ngOnInit() {
    this.graphqlService.getSchemaTypes(this.endpoint, this.headers).subscribe((data: Type[]) => {
      this.types = data
        .filter(type => type.name.indexOf('__') === -1) // filter out meta types
        .sort(sortTypes)  // sort types
        .map(type => {  // sort fields
          if (type.fields) {
            type.fields = type.fields.sort(sortFields);
          }
          return type;
        });

      // parse side search items
      Object.keys(this.types).forEach(key => {
        if (this.types[key].name === 'Query') {
          this.searchItems[0].children = this.types[key].fields.map(field => field.name);
        } else if (this.types[key].name === 'Mutation') {
          this.searchItems[1].children = this.types[key].fields.map(field => field.name);
        } else {
          this.searchItems[2].children.push(this.types[key].name)
        }
      });

      this.loaded = true;
    })
  }
}
