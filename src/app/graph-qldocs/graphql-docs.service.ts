import { Injectable } from '@angular/core';
import {HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {getSchemaQuery} from './queries/schema.query';
import {Type} from './models/type.model';
import {HttpWrapperService} from '../shared/services/http-wrapper.service';
import {ActivatedRoute} from '@angular/router';
import {navigateToFieldByString, sortFields, sortTypes} from './utils';
import {SearchItem} from "./components/side-search/side-search.component";
import {BehaviorSubject} from "rxjs";

export interface HeadersInput {
  key: string;
  value: string;
}

@Injectable()
export class GraphqlDocsService {

  hash: string;

  private schemaTypes: Type[];

  private types: Type[];
  private searchItems: SearchItem[] = [
    {name: 'Query', children: []},
    {name: 'Mutation', children: []},
    {name: 'Type', children: []}
  ];

  private parsedSchema$: BehaviorSubject<{types: Type[], searchItems: SearchItem[]}> = new BehaviorSubject(null);

  private schemaFetched: boolean = false;

  private fullWidth: BehaviorSubject<boolean> = new BehaviorSubject(false);

  constructor(private http: HttpWrapperService, private route: ActivatedRoute) { }

  navigateByAnchor() {
    this.route.fragment.take(1).subscribe(fragment => {
      this.hash = fragment;

      setTimeout(() => {
        if (this.hash) {
          navigateToFieldByString(this.hash);
        }
      }, 500);
    });
  }

  public getSchemaTypes(endpoint: string, headersInput: HeadersInput[]): Observable<{types: Type[], searchItems: SearchItem[]}> {
    if (!this.schemaFetched) {
      this.schemaFetched = true;

      this.http.post(endpoint, getSchemaQuery(), {headers: this.generateHeaders(headersInput)})
        .subscribe(response => {
          this.schemaTypes = response.body.response.data.__schema.types;

          this.parsedSchema$.next(this.parseSchemaTypes(this.schemaTypes));
        });
    }

    return this.parsedSchema$;
  }

  public getFullWidth(): BehaviorSubject<boolean> {
    return this.fullWidth;
  }

  public setFullWidth(value: boolean) {
    this.fullWidth.next(value);
  }

  private parseSchemaTypes(data: Type[]): {types: Type[], searchItems: SearchItem[]} {
    if (!this.types || !this.searchItems) {
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

      let queryExamples = generateTypes(this.types, 'Query');
      for (let i = 0; i < this.types[0].fields.length; i++) {
        this.types[0].fields[i].example = queryExamples[i];
        this.types[0].fields[i].response = generateExampleResponse(this.types[0].fields[i], this.types);
      }

      let mutationExamples = generateTypes(this.types, 'Mutation');
      for (let i = 0; i < this.types[1].fields.length; i++) {
        this.types[1].fields[i].example = mutationExamples[i];
        this.types[1].fields[i].response = generateExampleResponse(this.types[1].fields[i], this.types);
      }
    }

    return {types: this.types, searchItems: this.searchItems};
  }

  private generateHeaders(headersInput: HeadersInput[]): HttpHeaders {
    let headers = new HttpHeaders();

    if (headersInput && headersInput.length > 0) {
      for (let headerInput of headersInput) {
        headers = headers.append(headerInput.key, headerInput.value)
      }
    }

    return headers;
  }
}

function generateTypes(types: Type[], parent: string): string[] {
  let examples = [];
  types.filter(t => t.name === parent).forEach(type => {
    let typeName = type.name.toLowerCase();
    examples = [...examples,...type.fields.map(t => `${typeName} { ${t.name} ${generateInput(t.args, types)} ${generateResponse(t.type, types)} }`)];
  });

  return examples;
}

function generateInput(input, types: Type[], inner?: boolean): string {
  if (!input || input.length === 0) return '';

  let inputProperty = `${input.map(i => `${i.name}: ${generateInputValue(i, types)}`)}`;

  return inner ? `{${inputProperty}}` : `(${inputProperty})`;
}

function generateInputValue(value, types: Type[]): string {

  let inputType = value.type ? value.type.kind : value.ofType.kind;

  if (inputType === 'LIST') return `[ ${extractScalar(value.type.ofType, value.name)} ]`;
  if (inputType === 'SCALAR') return extractScalar(value.type, value.name);
  if (inputType === 'NON_NULL') return extractScalar(value.type.ofType, value.name);
  if (inputType === 'INPUT_OBJECT') return generateInput(types.filter(t => t.name === (value.type ? value.type.name : value.ofType.name))[0].inputFields, types, true);

  return '';
}

function extractScalar(type, value) {
  if (type && type.name === 'String') return `"${value}"`;
  if (type && type.name === 'Boolean') return 'true';
  if (type && type.name === 'Int') return '10';

  return `"${value}"`;
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
    if (f.type.kind === 'SCALAR' || (f.type.kind === 'NON_NULL' && f.type.ofType.kind === 'SCALAR')) {
      result += `${f.name},`
    }

    if (f.type.kind === 'OBJECT') {

      if (callChain.indexOf(f.type.name) < 0) {
        result += `${f.name} {${generateResponse(f.type.name, types, [...callChain, f.type.name])}}`
      }
    }

    if (f.type.kind === 'NON_NULL' && f.type.ofType.kind === 'OBJECT') {

      if (callChain.indexOf(f.type.ofType.name) < 0) {
        result += `${f.name} {${generateResponse(f.type.ofType.name, types, [...callChain, f.type.ofType.name])}}`
      }
    }

    if (f.type.kind === 'LIST') {
      let name = f.type.ofType.name;
      if (!name) {
        name = f.type.ofType.ofType.name;
      }
      if (callChain.indexOf(name) < 0) {
        result += `${f.name} {${generateResponse(name, types, [...callChain, name])}}`
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
