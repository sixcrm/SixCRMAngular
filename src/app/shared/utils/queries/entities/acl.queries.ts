import {addId, deleteMutationQuery} from './entities-helper.queries';
import {Acl} from '../../../models/acl.model';

export function createAclMutation(acl: Acl): string {
  return `
    mutation {
      createuseracl (useracl: { ${accountInputQuery(acl)} }) {
        ${accountResponseQuery()}
      }
	  }`
}

export function deleteAclMutation(id: string): string {
  return deleteMutationQuery('useracl', id);
}


export function accountResponseQuery(): string {
  return `id user { id name } role { id name } account{ id name } created_at updated_at`;
}

export function accountInputQuery(acl: Acl, includeId?: boolean): string {
  return `${addId(acl.id, includeId)}, user: "${acl.user.id}", account: "${acl.account.id}", role: "${acl.role.id}"`;
}
