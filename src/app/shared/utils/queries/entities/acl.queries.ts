import {addId, deleteMutationQuery} from './entities-helper.queries';
import {Acl} from '../../../models/acl.model';

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

export function deleteAclMutation(id: string): string {
  return deleteMutationQuery('useracl', id);
}


export function userAclResponseQuery(): string {
  return `id user { id name } role { id name } account{ id name } created_at updated_at`;
}

export function userAclInputQuery(acl: Acl, includeId?: boolean): string {
  return `${addId(acl.id, includeId)}, user: "${acl.user.id}", account: "${acl.account.id}", role: "${acl.role.id}"`;
}
