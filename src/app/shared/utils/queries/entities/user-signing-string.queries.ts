import {
  paginationParamsQuery, fullPaginationStringResponseQuery, deleteMutationQuery, addId, deleteManyMutationQuery,
  addUpdatedAtApi
} from './entities-helper.queries';
import {UserSigningString} from "../../../models/user-signing-string.model";
import {IndexQueryParameters} from '../index-query-parameters.model';

export function userSigningStringsListQuery(params: IndexQueryParameters): string {
  return `{
    usersigningstringlist ${paginationParamsQuery(params)} {
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

export function deleteUserSigningStringsMutation(id: string[]): string {
  return deleteManyMutationQuery('usersigningstring', id);
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
  return `${addId(userSigningString.id, includeId)}, user:"${userSigningString.user}", name:"${userSigningString.name}", ${addUpdatedAtApi(userSigningString, includeId)}`;
}
