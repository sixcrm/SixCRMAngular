import {clean} from './entities/entities-helper.queries';
export function searchQuery(query: string, createdAtRange: string, sortBy: string, start: number, size: number, entityTypes?: string[]): string {
  let entityTypesQuery: string = buildEntityTypes(entityTypes);

  let filterQuery = entityTypesQuery;
  if (createdAtRange) {
    filterQuery = `(and created_at:${createdAtRange} ${entityTypesQuery})`
  }

  let sort = buildSortBy(sortBy);

  return `{
		search (search: {query: "'${clean(query)}*'" ${filterQuery ? `filterQuery:"${filterQuery}"` : ''} ${sort} start: "${start}" size: "${size}"}) {
			status { timems rid }
			hits { found start,
				hit { id fields }
			}
		}
	}`;
}

export function searchFacets(query: string, createdAtRange: string, entityTypes?: string[]): string {
  let entityTypesQuery: string = buildEntityTypes(entityTypes);

  let filterQuery = entityTypesQuery;
  if (createdAtRange) {
    filterQuery = `(and created_at:${createdAtRange} ${entityTypesQuery})`
  }

  return `{
		search (search: {query: "'${clean(query)}*'" ${filterQuery ? `filterQuery:"${filterQuery}"` : ''} facet:"{entity_type:{}}" return:"_no_fields"}) {
			status { timems rid }
			facets
		}
	}`;
}

export function searchAdvancedQuery(options: any, createdAtRange: string, sortBy: string, start: number, size: number, entityTypes?: string[]): string {
  let fieldsQuery = '';
  if (createdAtRange) {
    fieldsQuery += ` created_at: ${createdAtRange} `;
  }

  fieldsQuery += buildQueryOptions(options);

  let entityTypesQuery: string = buildEntityTypes(entityTypes);
  let sort = buildSortBy(sortBy);

  return `
  {
    search (search: {query: "(and${fieldsQuery})" ${entityTypesQuery ? `filterQuery:"${entityTypesQuery}"` : ''} queryParser: "structured" ${sort} start: "${start}" size: "${size}"}) {
      hits {
        found start,
        hit { id fields }
      }
    }
  }`;
}

export function searchAdvancedFacets(options: any, createdAtRange: string, entityTypes?: string[]): string {

  let fieldsQuery = '';
  if (createdAtRange) {
    fieldsQuery += ` created_at: ${createdAtRange} `;
  }

  fieldsQuery += buildQueryOptions(options);

  let entityTypesQuery: string = buildEntityTypes(entityTypes);

  return `
  {
    search (search: {query: "(and${fieldsQuery})" ${entityTypesQuery ? `filterQuery:"${entityTypesQuery}"` : ''} queryParser: "structured" facet:"{entity_type:{}}" return:"_no_fields"}) {
      status { timems rid }
			facets
    }
  }`;
}

export function suggestionsQuery(query: string): string {
  return `{
		search (search: {query: "${clean(query)}*" queryOptions:"{fields:['suggestion_field_1']}" return:"suggestion_field_1" size:"10"}) {
			hits {
				found start,
				hit { fields }
			}
		}
	}`
}

export function dashboardFiltersQuery(query: string): string {
  let entityTypesQuery: string = `(or entity_type:'campaign' entity_type:'affiliate' entity_type:'merchantprovider' entity_type:'productschedule')`;

  return `{
		search (search: {query: "${query}*" filterQuery:"${entityTypesQuery}"}) {
			status { timems rid }
			hits { found start,
				hit { id fields }
			}
		}
	}`;
}

export function dashboardFiltersAdvancedQuery(query: string, type: string): string {
  let entityTypesQuery: string = `(or entity_type:'${type}')`;

  return `{
		search (search: {query: "${query}*" filterQuery:"${entityTypesQuery}"}) {
			status { timems rid }
			hits { found start,
				hit { id fields }
			}
		}
	}`;
}

export function buildEntityTypes(entityTypes?: string[]): string {
  let entityTypesQuery: string = '';

  if (entityTypes && entityTypes.length > 0) {
    entityTypesQuery = '(or ';
    entityTypes.forEach(entityType => entityTypesQuery+= ` entity_type:'${entityType}' `);
    entityTypesQuery+= ')'
  }

  return entityTypesQuery;
}

export function buildQueryOptions(options: any): string {
  let fieldsQuery: string = '';

  for (let field in options) {
    if (options[field]) {

      if (options[field] instanceof Array) {
        let key = field;

        for (let fieldInner in options[key]) {
          if (options[key][fieldInner]) {
            fieldsQuery += ` (prefix field=${key} '${options[key][fieldInner]}')`
          }
        }
      } else {
        fieldsQuery += ` (prefix field=${field} '${options[field]}')`
      }
    }
  }

  return fieldsQuery;
}

export function buildSortBy(sortBy: string): string {
  let sort = '';

  if (sortBy) {
    sort = `sort:"${sortBy}"`;
  }

  return sort;
}
