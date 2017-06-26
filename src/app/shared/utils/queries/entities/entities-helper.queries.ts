export function paginationStringResponseQuery(): string {
  return 'count end_cursor has_next_page last_evaluated';
}

export function fullPaginationStringResponseQuery(): string {
  return `pagination { ${paginationStringResponseQuery()} }`
}

export function deleteMutationQuery(entity: string, id: string): string {
  return `mutation { delete${entity} (id: "${id}") { id }}`
}

export function addId(id: string, includeId?: boolean): string {
  return includeId ? `id: "${id}"` : '';
}

export function paginationParamsQuery(limit?: number, cursor?: string): string {
  let lim = !!limit ? `limit: "${limit}"` : '';
  let cur = !!cursor ? `cursor: "${cursor}"` : '';

  let params = `pagination: {${lim} ${cur}}`;

  return limit || cur ? `${params}` : '';
}
