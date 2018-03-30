import {
  fullPaginationStringResponseQuery, deleteManyMutationQuery, listQueryParams, addUpdatedAtApi
} from './entities-helper.queries';
import {EntityAcl} from '../../../models/entityacl.model';
import {IndexQueryParameters} from '../index-query-parameters.model';

export function entityAclsListQuery(params: IndexQueryParameters): string {
  return `{
		entityacllist ${listQueryParams(params)} {
			entityacls {
			  ${entityAclResponseQuery()}
			}
			${fullPaginationStringResponseQuery()}
		}
  }`
}

export function entityAclQuery(id: string): string {
  return `{
		entityacl (entity: "${id}") {
			${entityAclResponseQuery()}
    }
  }`
}

export function deleteEntityAclMutation(id: string): string {
  return `mutation { deleteentityacl (entity: "${id}") { entity }}`;
}

export function deleteEntityAclsMutation(id: string[]): string {
  return deleteManyMutationQuery('entityacl', id);
}

export function createEntityAclMutation(entityAcl: EntityAcl): string {
  return `
    mutation {
      createentityacl ( entityacl: { ${entityAclInputQuery(entityAcl)} } ) {
        ${entityAclResponseQuery()}
      }
    }`;
}

export function updateEntityAclMutation(entityAcl: EntityAcl): string {
  return `
    mutation {
      updateentityacl ( entityacl: { ${entityAclInputQuery(entityAcl, true)} } ) {
        ${entityAclResponseQuery()}
      }
    }`;
}

export function entityAclResponseQuery(): string {
  return `entity type allow deny created_at updated_at`
}

export function entityAclInputQuery(entityAcl: EntityAcl, includeId?: boolean): string {
  return `entity: "${entityAcl.entity}", type: "${entityAcl.type}", allow: [${entityAcl.allow.map(a => `"${a}"`)}], deny: [${entityAcl.deny.map(d => `"${d}"`)}] ${addUpdatedAtApi(entityAcl, includeId)}`
}
