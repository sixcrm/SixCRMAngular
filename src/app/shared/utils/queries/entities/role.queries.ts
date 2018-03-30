import {
  fullPaginationStringResponseQuery, listQueryParams, deleteManyMutationQuery,
  deleteMutationQuery, addId, addUpdatedAtApi
} from './entities-helper.queries';
import {Role} from '../../../models/role.model';
import {IndexQueryParameters} from '../index-query-parameters.model';

export function rolesListQuery(params: IndexQueryParameters): string {
  return `{
		rolelist ${listQueryParams(params)} {
			roles {
			  ${roleResponseQuery()}
			}
			${fullPaginationStringResponseQuery()}
		}
  }`
}

export function rolesSharedListQuery(params: IndexQueryParameters): string {
  return `{
		sharedrolelist ${listQueryParams(params)} {
			roles {
			  ${roleResponseQuery()}
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

export function roleSharedQuery(id: string): string {
  return `{
		sharedrole (id: "${id}") {
			${roleResponseQuery()}
    }
  }`
}

export function deleteRoleMutation(id: string): string {
  return deleteMutationQuery('role', id);
}

export function deleteRolesMutation(id: string[]): string {
  return deleteManyMutationQuery('role', id);
}

export function updateRoleMutation(role: Role): string {
  return `
    mutation {
      updaterole ( role: { ${roleInputQuery(role, true)} } ) {
        ${roleResponseQuery()}
      }
    }`;
}

export function createRoleMutation(role: Role): string {
  return `
    mutation {
      createrole ( role: { ${roleInputQuery(role)} } ) {
        ${roleResponseQuery()}
      }
    }`;
}

export function roleResponseQuery(): string {
  return `id name active permissions { allow deny } created_at updated_at`;
}

export function roleInputQuery(role: Role, includeId?: boolean): string {
  const allowed = role.permissions.allow.reduce((a,b) => `${a}${a?',':''}"${b}"`, '');
  const denied = role.permissions.deny.reduce((a,b) => `${a}${a?',':''}"${b}"`, '');

  return `${addId(role.id, includeId)} name:"${role.name}", active: ${role.active}, permissions: { allow:[${allowed}], deny:[${denied}] }, ${addUpdatedAtApi(role, includeId)}`
}

