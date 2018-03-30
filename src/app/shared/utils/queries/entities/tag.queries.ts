import {
  fullPaginationStringResponseQuery, deleteMutationQuery,
  addId, deleteManyMutationQuery, listQueryParams, addUpdatedAtApi
} from './entities-helper.queries';
import {Tag} from '../../../models/tag.model';
import {IndexQueryParameters} from '../index-query-parameters.model';

export function tagsListQuery(params: IndexQueryParameters): string {
  return `{
		taglist ${listQueryParams(params)} {
			tags {
			  ${tagResponseQuery()}
			}
			${fullPaginationStringResponseQuery()}
		}
  }`
}

export function tagsByEntityQuery(entity: string, params: IndexQueryParameters): string {
  return `{
		taglistbyentity ( id: "${entity}", ${listQueryParams(params, true)} ) {
			tags {
			  ${tagResponseQuery()}
			}
			${fullPaginationStringResponseQuery()}
		}
  }`
}

export function tagQuery(id: string): string {
  return `{
		tag (id: "${id}") {
			${tagResponseQuery()}
    }
  }`
}

export function deleteTagMutation(id: string): string {
  return deleteMutationQuery('tag', id);
}

export function deleteTagsMutation(id: string[]): string {
  return deleteManyMutationQuery('tag', id);
}

export function createTagMutation(tag: Tag): string {
  return `
    mutation {
      createtag ( tag: { ${tagInputQuery(tag)} } ) {
        ${tagResponseQuery()}
      }
    }`;
}

export function updateTagMutation(tag: Tag): string {
  return `
    mutation {
      updatetag ( tag: { ${tagInputQuery(tag, true)} } ) {
        ${tagResponseQuery()}
      }
    }`;
}

export function tagResponseQuery(): string {
  return `id entity key value created_at updated_at`
}

export function tagInputQuery(tag: Tag, includeId?: boolean): string {
  return `${addId(tag.id, includeId)} entity: "${tag.entity}", key: "${tag.key}", value: "${tag.value}" ${addUpdatedAtApi(tag, includeId)}`
}
