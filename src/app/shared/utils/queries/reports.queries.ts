import {paginationQueryString, paginationString, parseFilterTerms, dateString} from './helper.queries';
import {FilterTerm} from '../../components/advanced-filter/advanced-filter.component';

export function transactionReportListQuery(start: string, end: string, filterTerms: FilterTerm[], download: boolean, limit: number, offset: number, order: string): string {
  let filterString = parseFilterTerms(filterTerms);

  let pagination = !download ? paginationQueryString() : '';

  return `
  {
		listtransactions (analyticsfilter:{${dateString(start, end)} ${filterString}} ${paginationString(limit, offset, order)}) {
			transactions{
				id datetime customer creditcard merchant_provider campaign affiliate amount processor_result account transaction_type,
			  product_schedule subaffiliate_1 subaffiliate_2 subaffiliate_3 subaffiliate_4 subaffiliate_5 transaction_subtype
			}
			${pagination}
		}
	}`
}

export function transactionsSumReport(start: string, end: string, filterTerms: FilterTerm[], download: boolean, limit: number, offset: number, order: string): string {
  let filterString = parseFilterTerms(filterTerms);

  return `
  {
		transactionreport (analyticsfilter:{${dateString(start, end)} ${filterString}} ${paginationString(limit, offset, order)}) {
			periods {
        period, sale_count, sale_revenue, rebill_count, rebill_revenue, refund_expenses, refund_count, gross_revenue, declines_count, declines_revenue, chargeback_count, current_active_customer, count_alert_count
      }
		}
	}`
}
