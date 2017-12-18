import {
  paginationParamsQuery, fullPaginationStringResponseQuery, deleteMutationQuery, addId
} from './entities-helper.queries';
import {UserSigningString} from "../../../models/user-signing-string.model";

export function userSigningStringsListQuery(limit?:number, cursor?:string): string {
  return `{
    usersigningstringlist ${paginationParamsQuery(limit, cursor)} {
      usersigningstrings {
        ${userSigningStringResponseQuery()}
      }
      ${fullPaginationStringResponseQuery()}
    }
  }`
}

export function userSigningStringQuery(id: string): string {
  return `{
    usersigningstring (id: "${id}") {
      ${userSigningStringResponseQuery()}
    }
  }`
}

export function deleteUserSigningStringMutation(id: string): string {
  return deleteMutationQuery('usersigningstring', id);
}

export function createUserSigningStringMutation(userSigningString: UserSigningString): string {
  return `
    mutation {
      createusersigningstring (usersigningstring: { ${userSigningStringInputQuery(userSigningString)} }) {
        ${userSigningStringResponseQuery()}
      }
	  }`
}

export function updateUserSigningStringMutation(userSigningString: UserSigningString): string {
  return `
    mutation {
      updateusersigningstring (usersigningstring: { ${userSigningStringInputQuery(userSigningString, true)} }) {
        ${userSigningStringResponseQuery()}
      }
	  }`
}

export function userSigningStringResponseQuery(): string {
  return 'id, user, name, signing_string, used_at, created_at, updated_at';
}

export function userSigningStringInputQuery(userSigningString: UserSigningString, includeId?: boolean): string {
  return `${addId(userSigningString.id, includeId)}, user:"${userSigningString.user}", name:"${userSigningString.name}"`;
}
