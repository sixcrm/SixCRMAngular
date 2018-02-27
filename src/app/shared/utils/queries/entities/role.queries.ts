import { fullPaginationStringResponseQuery, listQueryParams} from './entities-helper.queries';

export function rolesListQuery(limit?: number, cursor?: string, search?: string): string {
  return `{
		rolelist ${listQueryParams(limit, cursor, search)} {
			roles {
			  ${rolesInfoResponseQuery()}
			}
			${fullPaginationStringResponseQuery()}
		}
  }`
}

export function roleQuery(id: string): string {
  return `{
		role (id: "${id}") {
			${roleResponseQuery()}
    }
  }`
}

export function rolesInfoResponseQuery(): string {
  return `id name active created_at updated_at`;
}


export function roleResponseQuery(): string {
  return `id name active permissions { allow deny } created_at updated_at`;
}

