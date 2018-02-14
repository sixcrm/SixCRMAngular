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

export function paginationParamsQuery(limit?: number, cursor?: string, ignoreBraces?: boolean): string {
  if (!cursor && !limit) return '';

  let builder = new QueryBuilder('pagination: {');
  if (!!limit) builder.appendEnd(`limit:"${limit}"`);
  if (!!cursor) builder.appendEnd(`cursor:"${cursor}"`);
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
