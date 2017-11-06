import {
  paginationParamsQuery, fullPaginationStringResponseQuery, deleteMutationQuery, addId
} from './entities-helper.queries';
import {Account} from '../../../models/account.model';

export function accountsListQuery(limit?:number, cursor?:string): string {
  return `{
    accountlist ${paginationParamsQuery(limit, cursor)} {
      accounts {
        ${accountInfoResponseQuery()}
      }
      ${fullPaginationStringResponseQuery()}
    }
  }`
}

export function accountQuery(id: string): string {
  return `{
    account (id: "${id}") {
      ${accountResponseQuery()}
    }
  }`
}

export function deleteAccountMutation(id: string): string {
  return deleteMutationQuery('account', id);
}

export function createAccountMutation(account: Account): string {
  return `
    mutation {
      createaccount (account: { ${accountInputQuery(account)} }) {
        ${accountResponseQuery()}
      }
	  }`
}

export function updateAccountMutation(account: Account): string {
  return `
    mutation {
      updateaccount (account: { ${accountInputQuery(account, true)} }) {
        ${accountResponseQuery()}
      }
	  }`
}

export function accountResponseQuery(): string {
  return 'id name active created_at updated_at acl{ id pending account {id, name} role {id, name} user {id, name}}';
}

export function accountInfoResponseQuery(): string {
  return 'id name active created_at updated_at acl{ id }';
}

export function accountInputQuery(account: Account, includeId?: boolean): string {
  return `${addId(account.id, includeId)}, name: "${account.name}", active: "${account.active || 'false'}"`;
}
