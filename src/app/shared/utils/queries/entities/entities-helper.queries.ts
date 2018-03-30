import {IndexQueryParameters} from '../index-query-parameters.model';
const uuidV4 = require('uuid/v4');

export function paginationStringResponseQuery(): string {
  return 'count end_cursor has_next_page last_evaluated';
}

export function fullPaginationStringResponseQuery(): string {
  return `pagination { ${paginationStringResponseQuery()} }`
}

export function deleteMutationQuery(entity: string, id: string): string {
  return `mutation { delete${entity} (id: "${id}") { id }}`
}

export function deleteManyMutationQuery(entity: string, id: string[]): string {
  const body = id.reduce((a,b) => `${a} ${generateRandomString(7)}: delete${entity} (id: "${b}") {id}`, '');

  return `mutation { ${body} }`;
}

export function addId(id: string, includeId?: boolean): string {
  return includeId ? `id: "${id}"` : '';
}

export function addUpdatedAtApi(entity: any, include: boolean): string {
  if (!include || !entity['updatedAtAPI']) return '';

  return ` updated_at:"${entity['updatedAtAPI']}"`;
}

export function addField(key: string, value: any, quotes?: boolean) {
  if (!value || !key) return '';

  return `${key}: ${quotes ? `"` : ''}${value}${quotes ? `"` : ''}`
}

export function clean(value: string): string {
  const cleaned = cleanEscape(value);

  return cleanQuote(cleaned);
}

function cleanEscape(value: string): string {
  if (value.indexOf('\\') === -1) return value;

  return value.replace(/\\/g, '\\\\');
}

function cleanQuote(value: string): string {
  if (value.indexOf('"') === -1) return value;

  return value.replace(/"/g, '\\"');
}

export function listQueryParams(params: IndexQueryParameters, ignoreBrackets?: boolean): string {
  if (!params.limit && !params.cursor && !params.search) return '';

  let query = ` ${paginationParamsQuery(params, true)} ${searchParamsQuery(params.search)} `;

  if (!ignoreBrackets) {
    query = `(${query})`
  }

  return query;
}

export function paginationParamsQuery(params: IndexQueryParameters, ignoreBraces?: boolean): string {
  if (!params.cursor && !params.limit) return '';

  let builder = new QueryBuilder('pagination: {');
  if (!!params.limit) builder.appendEnd(`limit:"${params.limit}"`);
  if (!!params.cursor) builder.appendEnd(`cursor:"${params.cursor}"`);
  if (!!params.exclusiveStartKey) builder.appendEnd(`exclusive_start_key:"${clean(params.exclusiveStartKey)}"`);
  builder.appendEnd('}');

  if (!ignoreBraces) {
    builder.appendStart('(').appendEnd(')')
  }

  return builder.build();
}

export function searchParamsQuery(search?: string): string {
  if (!search) return '';

  return `search: {name: "${search}"}`;
}

export function generateUUID(): string {
  return uuidV4();
}

export class QueryBuilder {
  query: string;

  constructor (query?: any) {
    this.query = query || '';
  }

  appendEnd(query: any, separator?: string) {
    this.query = `${this.query} ${separator ? separator : ''} ${query}`;

    return this;
  }

  appendStart(query: any, separator?: string) {
    this.query = `${query}${separator ? separator : ''} ${this.query}`;

    return this;
  }

  build(): string {
    return this.query;
  }
}

function generateRandomString(length: number) {
  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

  for (var i = 0; i < length; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));

  return text;
}
