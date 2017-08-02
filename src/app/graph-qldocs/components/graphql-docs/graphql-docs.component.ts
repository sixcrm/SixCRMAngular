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
    {name: 'Type', children: []}
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
      this.graphqlService.navigateByAnchor();

      let queryExamples = generateTypes(this.types, 'Query');
      for (let i = 0; i < this.types[0].fields.length; i++) {
        this.types[0].fields[i].example = queryExamples[i];
      }

      let mutationExamples = generateTypes(this.types, 'Mutation');
      for (let i = 0; i < this.types[1].fields.length; i++) {
        this.types[1].fields[i].example = mutationExamples[i];
      }
    })
  }
}

function generateTypes(types: Type[], parent: string): string[] {
  let examples = [];
  types.filter(t => t.name === parent).forEach(type => {
    examples = [...examples,...type.fields.map(t => `${type.name} { ${t.name} ${generateInput(t.args, types)} ${generateResponse(t.type, types)} }`)];
  });

  return examples;
}

function generateInput(input, types: Type[]): string {
  if (!input || input.length === 0) return '';

  return `(${input.map(i => `${i.name}: ${generateInputValue(i, types)}`)})`;
}

function generateInputValue(value, types: Type[]): string {
  let inputType = value.type ? value.type.kind : value.ofType.kind;

  if (inputType === 'LIST') return `[ ${extractScalar(value.type.ofType, value.name)} ]`;
  if (inputType === 'SCALAR') return extractScalar(value.type, value.name);
  if (inputType === 'NON_NULL') return extractScalar(value.type.ofType, value.name);
  if (inputType === 'INPUT_OBJECT') return generateInput(types.filter(t => t.name === (value.type ? value.type.name : value.ofType.name))[0].inputFields, types);

  return '';
}

function extractScalar(type, value) {
  if (type && type.name === 'String') return `"${value}"`;
  if (type && type.name === 'Boolean') return 'true';
  if (type && type.name === 'Int') return '10';

  return '""';
}

function generateResponse(type, types: Type[]) {
  let fullType = types.filter(t => t.name === type.name)[0];
  if (!fullType || !fullType.fields) return '';

  let value = fullType.fields.filter(f => f.type.kind === 'SCALAR' || f.type.kind === 'NON_NULL').map(f => f.name).reduce((a,b)=> `${a} ${b}`, '');

  return `{ ${value} }`
}
