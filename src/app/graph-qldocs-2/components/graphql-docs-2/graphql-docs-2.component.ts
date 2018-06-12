import {Component, OnInit, Input, OnDestroy} from '@angular/core';
import {GraphqlDocs2Service, HeadersInput} from '../../graphql-docs-2.service';
import {Type} from '../../models/type.model';
import {sortTypes, sortFields} from '../../utils';
import {SearchItem} from '../side-search/side-search.component';
import {ResolveEnd, Router} from "@angular/router";
import {AsyncSubject} from "rxjs/AsyncSubject";
import {Field} from "../../models/field.model";

let allTypes;

@Component({
  selector: 'graphql-docs-2',
  templateUrl: './graphql-docs-2.component.html',
  styleUrls: ['./graphql-docs-2.component.scss']
})
export class GraphqlDocs2Component implements OnInit, OnDestroy {

  @Input() endpoint: string;
  @Input() headers: HeadersInput[];

  queryMutationTypes: Type[];
  types: Type[];
  searchItems: SearchItem[] = [
    {name: 'Query', children: []},
    {name: 'Mutation', children: []},
    {name: 'Type', children: []}
  ];

  isQuery : boolean;
  isMutation: boolean;
  isType : boolean;
  isAll : boolean;
  loaded: boolean = false;
  field: Field;
  type: Type;
  otherTypes: Type[];

  protected unsubscribe$: AsyncSubject<boolean> = new AsyncSubject<boolean>();

  constructor(private graphqlService: GraphqlDocs2Service, private router: Router) { }

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

      allTypes = this.types;

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
      this.determineParameters(this.router.url);

      let queryExamples = generateTypes(this.types, 'Query');
      for (let i = 0; i < this.types[0].fields.length; i++) {
        this.types[0].fields[i].example = queryExamples[i];
        this.types[0].fields[i].response = generateExampleResponse(this.types[0].fields[i], allTypes);
      }

      let mutationExamples = generateTypes(this.types, 'Mutation');
      for (let i = 0; i < this.types[1].fields.length; i++) {
        this.types[1].fields[i].example = mutationExamples[i];
        this.types[1].fields[i].response = generateExampleResponse(this.types[1].fields[i], allTypes);
      }
    })

    this.router.events.takeUntil(this.unsubscribe$).subscribe((routeEvent) => {
      if (routeEvent instanceof ResolveEnd) {
        this.determineParameters(routeEvent.url);
      }
    });

    this.determineParameters(this.router.url);
  }

  private determineParameters(url: string) {
    let baseUrl = '/documentation/graph2/';
    let query = url.replace(baseUrl + 'query/', '');
    let mutation = url.replace(baseUrl + 'mutation/', '');
    let type = url.replace(baseUrl + 'type/', '');

    this.isQuery = query !== url;
    this.isMutation = mutation !== url;
    this.isType = type !== url;
    this.isAll = !this.isQuery && !this.isMutation && !this.isType;

    let fieldName;
    if (this.types) {
      if (!this.isAll) {
        this.type = this.types.find(el => {
          let name;

          if (this.isQuery) {
            fieldName = query;
            name = 'Query';
          }

          if (this.isMutation) {
            fieldName = mutation;
            name = 'Mutation';
          }

          if (this.isType) {
            fieldName = type;
            return (!this.isQueryOrMutation(el.name) && (el.name === fieldName));
          }

          return el.name === name
        });

        if (this.isQueryOrMutation(this.type.name)) {
          this.field = this.type.fields.find(el => el.name === fieldName)
        }
      }

      if (this.isAll) {
        this.separateTypes();
      }
    }
  }

  separateTypes() {
    this.queryMutationTypes = this.types.filter(el => {
      return this.isQueryOrMutation(el.name)
    });

    this.otherTypes = this.types.filter(el => {
      return (!this.isQueryOrMutation(el.name));
    });
  }

  isQueryOrMutation(typeName: string) {
    return (typeName === 'Query') || (typeName === 'Mutation')
  }

  ngOnDestroy() {
    this.unsubscribe$.next(true);
    this.unsubscribe$.complete();
  }
}

function generateTypes(types: Type[], parent: string): string[] {
  let examples = [];
  types.filter(t => t.name === parent).forEach(type => {
    examples = [...examples,...type.fields.map(t => `{ ${t.name} ${generateInput(t.args, types)} ${generateResponse(t.type, types)} }`)];
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

function generateResponse(type, types: Type[], callChain?: string[]) {

  callChain = callChain || [];

  let typeName = type.name;
  if (!typeName) {
    typeName = type;
  }

  let fullType = types.filter(t => t.name === typeName)[0];
  if (!fullType || !fullType.fields) {
    return ''
  }

  let result: string = '';
  fullType.fields.forEach(f => {
    if (f.type.kind === 'SCALAR' || f.type.kind === 'NON_NULL') {
      result += `${f.name},`
    }

    if (f.type.kind === 'OBJECT') {

      if (callChain.indexOf(f.type.name) < 0) {
        result += `${f.name} {${generateResponse(f.type.name, allTypes, [...callChain, f.type.name])}}`
      }
    }

    if (f.type.kind === 'LIST') {
      let name = f.type.ofType.name;
      if (!name) {
        name = f.type.ofType.ofType.name;
      }
      if (callChain.indexOf(name) < 0) {
        result += `${f.name} {${generateResponse(name, allTypes, [...callChain, name])}}`
      }
    }
  });


  if (result[result.length-1] === ',') {
    result = result.slice(0, -1);
  }

  return result;
}

function generateExampleResponse(field, types) {

  let result = {
    success: true,
    code: 200,
    response: {
      data: {}
    }
  };

  let body: string = `{${responseBody(field.type, types)}}`;

  result.response.data[field.name] = JSON.parse(body);

  return JSON.stringify(result, null, 2);
}

function responseBody(type, types) {
  let typeName = type.name;
  if (!typeName) {
    typeName = type;
  }

  let fullType = types.filter(t => t.name === typeName)[0];
  if (!fullType || !fullType.fields) {
    return ''
  }

  let result: string = '';

  fullType.fields.forEach(f => {
    if (f.type.kind === 'SCALAR') {
      result += `"${f.name}": ${extractScalar(f.type, f.name)},`
    }


    if (f.type.kind === 'NON_NULL' && (f.type.ofType && f.type.ofType.kind !== 'OBJECT')) {
      result += `"${f.name}": ${extractScalar(f.type.ofType, f.name)},`
    }

    if (f.type.kind === 'OBJECT' || (f.type.ofType && f.type.ofType.kind === 'OBJECT')) {
      result += `"${f.name}": {},`
    }

    if (f.type.kind === 'LIST') {
      let name = f.type.ofType.name;
      if (!name) {
        name = f.type.ofType.ofType.name;
      }
      result += `"${f.name}": [],`
    }
  });

  if (result[result.length-1] === ',') {
    result = result.slice(0, -1);
  }

  return result;
}
