import {Component, Input, OnInit, Output} from '@angular/core';
import {GraphqlDocs2Service, HeadersInput} from "../../graphql-docs-2.service";
import {Type} from "../../models/type.model";
import {SearchItem} from "../side-search/side-search.component";

@Component({
  selector: 'graphql-docs-layout',
  templateUrl: './graphql-docs-layout.component.html',
  styleUrls: ['./graphql-docs-layout.component.scss']
})
export class GraphqlDocsLayoutComponent implements OnInit {

  @Input() endpoint: string;
  @Input() headers: HeadersInput[];
  @Input() set showSidenav(value: boolean) {
    this.graphqlService.setFullWidth(!value);
  };

  @Output() types: Type[];

  searchItems: SearchItem[] = [
    {name: 'Query', children: []},
    {name: 'Mutation', children: []},
    {name: 'Type', children: []}
  ];

  constructor(private graphqlService: GraphqlDocs2Service) { }

  ngOnInit() {
    this.graphqlService.getSchemaTypes(this.endpoint, this.headers).subscribe((response: {types: Type[], searchItems: SearchItem[]}) => {
      if (!response) return;

      this.types = response.types;
      this.searchItems = response.searchItems;
    });
  }
}
