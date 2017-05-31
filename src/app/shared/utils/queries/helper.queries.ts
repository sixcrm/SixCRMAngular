
import {FilterTerm} from '../../components/advanced-filter/advanced-filter.component';

export function parseFilterTerms(filterTerms: FilterTerm[]): string {
  let filters = {};

  filterTerms.forEach(term => {
    if (filters[term.type]) {
      filters[term.type].push(term.id);
    } else {
      filters[term.type] = [];
      filters[term.type].push(term.id);
    }
  });

  let filterString = '';

  Object.keys(filters).forEach(key => {
    let ids = '';

    filters[key].forEach(id => ids += `"${id}",`);
    filterString += ` ${key}:[${ids}]`;
  });

  return filterString;
}

export function parseAdditionalFilters(additionalFilters?: any[]): string {
  let additional = '';

  if (additionalFilters) {
    additionalFilters.forEach(filter => {
      if (filter.value) {
        additional += ` ${filter.key}:"${filter.value}" `;
      }
    });
  }

  return additional;
}

export function paginationString(limit: number, offset: number, order: string): string {
  let ord = order ? `order:"${order}"` : '';
  let lim = 'limit: ' + (limit ? limit : '20');
  let off = offset ? `offset:${offset}`: '';

  return `pagination:{${ord} ${lim} ${off}}`
}

export function dateString(start: string, end: string) {
  return `start:"${start}", end:"${end}"`;
}

export function paginationQueryString(): string {
  return 'pagination { order limit offset count }';
}
