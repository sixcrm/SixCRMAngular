import {
  fullPaginationStringResponseQuery, paginationParamsQuery, deleteMutationQuery,
  addId, deleteManyMutationQuery, addUpdatedAtApi
} from './entities-helper.queries';
import {User} from '../../../models/user.model';
import {Acl} from '../../../models/acl.model';

export function usersListQuery(limit?: number, cursor?: string): string {
  return `{
    userlist ${paginationParamsQuery(limit,cursor)} {
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
  if (!user.termsAndConditions) user.termsAndConditions = '0.1';

  return `
    mutation {
		  updateuser (
		    user: { ${userInputQuery(user, true)} }) {
			    ${userResponseQuery()}
			}
	}`
}

export function updateUserForActivation(user: User): string {
  if (!user.termsAndConditions) user.termsAndConditions = '0.0';

  return `
    mutation {
		  updateuser (
		    user: { ${userInputQuery(user, true)} } ) {
			    ${userInfoResponseQuery()}
			}
	}`
}

export function latestTermsAndConditions(role?: string): string {
  return `
    {
      latesttermsandconditions ${role ? `( role: "${role}" )` : ''} {
        version,
        title,
        body
      }
    }`
}

export function inviteUserMutation(email: string, accountId: string, roleId: string): string {
  return `
    mutation {
		  inviteuser (userinvite: {email: "${email}" account:"${accountId}" role:"${roleId}"}) {
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

export function acceptInviteMutation(token: string, parameters: string): string {
  return `
    mutation {
		acceptinvite (invite: {token: "${token}", parameters:"${parameters}"}) {
			${userResponseQuery()}
		}
	}`
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
      id
      created_at,
      updated_at,
      termsandconditions_outdated
      account { id name active created_at updated_at }
      role { id name active created_at updated_at,
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
