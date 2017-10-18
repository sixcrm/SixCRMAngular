import {
  paginationParamsQuery, fullPaginationStringResponseQuery, deleteMutationQuery, addId
} from './entities-helper.queries';
import {AccessKey} from '../../../models/access-key.model';

export function accessKeysListQuery(limit?:number, cursor?:string): string {
  return `{
    accesskeylist ${paginationParamsQuery(limit, cursor)} {
      accesskeys {
        ${accessKeyResponseQuery()}
      }
      ${fullPaginationStringResponseQuery()}
    }
  }`
}

export function accessKeyQuery(id: string): string {
  return `{
    accesskey (id: "${id}") {
      ${accessKeyResponseQuery()}
    }
  }`
}

export function deleteAccessKeyMutation(id: string): string {
  return deleteMutationQuery('accesskey', id);
}

export function createAccessKeyMutation(accessKey: AccessKey): string {
  return `
    mutation {
      createaccesskey (accesskey: { ${accessKeyInputQuery(accessKey)} }) {
        ${accessKeyResponseQuery()}
      }
	  }`
}

export function updateAccessKeyMutation(accessKey: AccessKey): string {
  return `
    mutation {
      updateaccesskey (accesskey: { ${accessKeyInputQuery(accessKey, true)} }) {
        ${accessKeyResponseQuery()}
      }
	  }`
}

export function accessKeyResponseQuery(): string {
  return 'id, access_key, secret_key, name, notes, created_at, updated_at';
}

export function accessKeyInputQuery(accessKey: AccessKey, includeId?: boolean): string {
  return `${addId(accessKey.id, includeId)}, name:"${accessKey.name}", access_key:"${accessKey.accessKey}", secret_key:"${accessKey.secretKey}", ${accessKey.notes ? `notes:"${accessKey.notes}"`: '' }`;
}
