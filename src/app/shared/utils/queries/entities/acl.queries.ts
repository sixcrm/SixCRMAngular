import {
  addId, deleteMutationQuery, deleteManyMutationQuery, paginationParamsQuery,
  fullPaginationStringResponseQuery, addUpdatedAtApi
} from './entities-helper.queries';
import {Acl} from '../../../models/acl.model';

export function aclListQuery(limit?:number, cursor?:string): string {
  return `{
    useracllist ${paginationParamsQuery(limit, cursor)} {
      useracls {
        ${userAclResponseQuery()}
      }
      ${fullPaginationStringResponseQuery()}
    }
  }`
}

export function aclListByRoleQuery(roleId: string, limit?:number, cursor?:string): string {
  return `{
    useracllistbyrole (${paginationParamsQuery(limit, cursor, true)} role: "${roleId}") {
      useracl {
        ${userAclResponseQuery()}
      }
      ${fullPaginationStringResponseQuery()}
    }
  }`
}

export function createAclMutation(acl: Acl): string {
  return `
    mutation {
      createuseracl (useracl: { ${userAclInputQuery(acl)} }) {
        ${userAclResponseQuery()}
      }
	  }`
}

export function updateAclMutation(acl: Acl): string {
  return `
    mutation {
      updateuseracl (useracl: { ${userAclInputQuery(acl, true)} }) {
        ${userAclResponseQuery()}
      }
	  }`
}

export function updateUserAclTermsAndConditions(userAcl: Acl, version: string): string {
  return `
    mutation {
		  updateuseracltermsandconditions (useracltermsandconditions: { useracl: "${userAcl.id}", version: "${version}"}) {
			  id
		  }
	}`
}

export function deleteAclMutation(id: string): string {
  return deleteMutationQuery('useracl', id);
}

export function deleteAclsMutation(id: string[]): string {
  return deleteManyMutationQuery('useracl', id);
}

export function userAclResponseQuery(): string {
  return `id user { id name } role { id name } account{ id name } created_at updated_at`;
}

export function userAclInputQuery(acl: Acl, includeId?: boolean): string {
  return `${addId(acl.id, includeId)}, user: "${acl.user.id}", account: "${acl.account.id}", role: "${acl.role.id}", ${addUpdatedAtApi(acl, includeId)}`;
}
