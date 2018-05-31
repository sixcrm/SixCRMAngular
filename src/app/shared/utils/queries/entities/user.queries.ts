import {
  fullPaginationStringResponseQuery, paginationParamsQuery, deleteMutationQuery,
  deleteManyMutationQuery, addUpdatedAtApi
} from './entities-helper.queries';
import {User} from '../../../models/user.model';
import {Acl} from '../../../models/acl.model';
import {IndexQueryParameters} from '../index-query-parameters.model';

export function usersListQuery(params: IndexQueryParameters): string {
  return `{
    userlist ${paginationParamsQuery(params)} {
			users {
			  ${userInfoResponseQuery()}
			}
			${fullPaginationStringResponseQuery()}
		}}`
}

export function userQuery(id: string): string {
  return `
    {
      user (id: "${id}") {
        ${userResponseQuery()}
      }
    }`
}

export function userIntrospection(): string {
  return `{
    userintrospection {
      ${userIntrospectionResponseQuery()},
      usersetting { id, timezone, language, column_preferences }
    }
  }`
}

export function deleteUserMutation(id: string): string {
  return deleteMutationQuery('user', id);
}

export function deleteUsersMutation(id: string[]): string {
  return deleteManyMutationQuery('user', id);
}

export function createUserMutation(user: User): string {
  return `
    mutation {
      createuser (user: { ${userInputQuery(user, true)} }) {
        ${userResponseQuery()}
      }
    }`
}

export function updateUserMutation(user: User): string {
  return `
    mutation {
      updateuser (user: { ${userInputQuery(user, true)} }) {
        ${userResponseQuery()}
		  }
    }`;
}

export function registerUser(user: User): string {
  return `
    mutation {
		  updateuser (
		    user: { ${userInputQuery(user, true)} }) {
			    ${userResponseQuery()}
			}
	}`
}

export function latestTermsAndConditions(accountId?: string, role?: string): string {
  if (accountId && role) {
    return `
    {
      latesttermsandconditions ( account: "${accountId}", role: "${role}") {
        version,
        title,
        body
      }
    }`
  }

  return `
    {
      latesttermsandconditions {
        version,
        title,
        body
      }
    }`
}

export function inviteUserMutation(email: string, firstName: string, lastName: string, accountId: string, roleId: string): string {
  return `
    mutation {
		  inviteuser (userinvite: {email: "${email}" account:"${accountId}" ${firstName ? `firstname: "${firstName}"`:''} ${lastName ? `lastname: "${lastName}"`: ''} role:"${roleId}"}) {
			  link
		  }
	  }`
}

export function inviteResendMutation(acl: Acl): string {
  return `
    mutation {
		inviteresend (userinvite: {acl: "${acl.id}"}) {
			link
		}
	}`
}

export function acknowledgeInviteQuery(hash: string): string {
  return `
    query {
      acknowledgeinvite (hash: "${hash}") {
        hash, email, acl, invitor, account, account_name, role, signature
      }
	  }`
}

export function acceptInviteMutation(hash: string, signature: string): string {
  return `
    mutation {
      acceptinvite (hash: "${hash}", signature: "${signature}") {
        is_new, account
      }
    }
  `
}

export function userResponseQuery(): string {
  return `
    id name alias first_name last_name auth0_id active termsandconditions created_at updated_at,
    acl {
      id, created_at, updated_at
      account { id name active }
      user {id name }
      role { id name active,
        permissions {allow deny} 
      }
      pending
    }
    address { line1 line2 city state zip country }`
}

export function userIntrospectionResponseQuery(): string {
  return `
    id name alias first_name last_name auth0_id active termsandconditions termsandconditions_outdated created_at updated_at,
    acl {
      id,
      pending,
      created_at,
      updated_at,
      termsandconditions_outdated
      account { id name active created_at updated_at,
        billing { plan, session, disable }
      }
      role { id name active updated_at,
        permissions {allow deny} 
      }
    }
    address { line1 line2 city state zip country }`
}

export function userInfoResponseQuery(): string {
  return `id name termsandconditions auth0_id active created_at updated_at`;
}

export function userInputQuery(user: User, light?: boolean): string {
  let address = `
    ,address:{
      line1: "${user.address.line1}",
      ${user.address.line2 ? `line2:"${user.address.line2}",` : ''}
      city:"${user.address.city}",
      state:"${user.address.state}",
      zip:"${user.address.zip}",
      country:"${user.address.country}"}
  `;

  return `
    id: "${user.id}",
    auth0_id: "${user.auth0Id || user.id}",
    name: "${user.name}",
    ${user.firstName ? `first_name: "${user.firstName}",` : ''}
    ${user.lastName ? `last_name: "${user.lastName}",` : ''}
    ${user.alias ? `alias: "${user.alias}",`: ''}
    active:${user.active || 'false'},
    ${user.termsAndConditions ? `termsandconditions:"${user.termsAndConditions}",`: ''}
    ${light ? '' : address},
    ${addUpdatedAtApi(user, true)}
  `
}
