import {
  paginationParamsQuery, fullPaginationStringResponseQuery, deleteMutationQuery, addId, deleteManyMutationQuery,
  addUpdatedAtApi
} from './entities-helper.queries';
import {Account} from '../../../models/account.model';
import {IndexQueryParameters} from '../index-query-parameters.model';

export function accountsListQuery(params: IndexQueryParameters): string {
  return `{
    accountlist ${paginationParamsQuery(params)} {
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

export function deleteAccountsMutation(id: string[]): string {
  return deleteManyMutationQuery('account', id);
}

export function createAccountMutation(account: Account): string {
  return `
    mutation {
      createaccount (account: { ${accountInputQuery(account)} }) {
        ${accountResponseQuery()}
      }
	  }`
}

export function createNewAccountMutation(accountName: string): string {
  return `
    mutation {
      createnewaccount (account: {name: "${accountName}"}) {
        id name
      }
    }
  `
}

export function updateAccountMutation(account: Account): string {
  return `
    mutation {
      updateaccount (account: { ${accountInputQuery(account, true)} }) {
        ${accountResponseQuery()}
      }
	  }`
}

export function activateAccountMutation(accountId: string, sessionId: string): string {
  return `
    mutation {
      activateaccount (account: "${accountId}", session: "${sessionId}") {
        activated, message
      }
    }
  `
}

export function updateAccountForRegistrationMutation(account: Account, name: string): string {
  return `
    mutation { 
      updateaccount (account: { id: "${account.id}", name: "${name}", active: ${!!account.active}, updated_at:"${account.updatedAtAPI}"}) { 
        id, name, active, created_at, updated_at
      } 
    }`
}

export function accountResponseQuery(): string {
  return 'id name active created_at updated_at billing {plan, disable, limited_at, deactivated_at, session} acl{ id updated_at, created_at, pending account {id, name} role {id, name} user {id, name, first_name, last_name}}';
}

export function accountInfoResponseQuery(): string {
  return 'id name active created_at updated_at acl{ id } billing {plan, session, disable, limited_at, deactivated_at}';
}

export function accountInputQuery(account: Account, includeId?: boolean): string {
  let billing = '';
  if (account.billing) {
    billing = `, billing { plan: "${account.billing}" ${account.billing.disable ? `, disable: "${account.billing.disable.format()}"` : ''} ${account.billing.deactivatedAt ? `, deactivated_at: "${account.billing.deactivatedAt.format()}"` : ''} ${account.billing.limitedAt ? `, limited_at: "${account.billing.limitedAt.format()}"` : ''} ${account.billing.session ? `, session: "${account.billing.session}"`: ''} }`;
  }

  return `${addId(account.id, includeId)}, name: "${account.name}", active: ${account.active || 'false'}, ${addUpdatedAtApi(account, includeId)}`;
}
