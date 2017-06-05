import {paginationQueryString, paginationString, parseFilterTerms, dateString} from './helper.queries';
import {FilterTerm} from '../../components/advanced-filter/advanced-filter.component';

export function transactionReportListQuery(start: string, end: string, filterTerms: FilterTerm[], limit: number, offset: number, order: string): string {
  let filterString = parseFilterTerms(filterTerms);

  return `
  {
		listtransactions (analyticsfilter:{${dateString(start, end)} ${filterString}} ${paginationString(limit, offset, order)}) {
			transactions{
				id datetime customer creditcard merchant_provider campaign affiliate amount processor_result account transaction_type,
			  product_schedule subaffiliate_1 subaffiliate_2 subaffiliate_3 subaffiliate_4 subaffiliate_5 transaction_subtype
			}
			${paginationQueryString()}
		}
	}`
}
