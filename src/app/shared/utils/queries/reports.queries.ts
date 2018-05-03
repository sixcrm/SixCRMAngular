import {
  paginationQueryString, paginationString, parseFilterTerms, dateString,
  paginationFullString, createFacets
} from './helper.queries';
import {FilterTerm} from '../../components/advanced-filter/advanced-filter.component';

export function transactionReportListQuery(start: string, end: string, filterTerms: FilterTerm[], download: boolean, limit: number, offset: number, order: string): string {
  let filterString = parseFilterTerms(filterTerms);

  let pagination = !download ? paginationQueryString() : '';

  return `
  {
		transactionsreport (analyticsfilter:{${dateString(start, end)} ${filterString}} ${paginationString(limit, offset, order)}) {
			transactions {
				id, datetime, amount, processor_result, transaction_type, cycle, recycle, gateway_response, transaction_id_gateway,
	      customer{ id firstname lastname },
	      merchant_provider { id name },
	      campaign { id name },
	      affiliate { id name },
			}
			${pagination}
		}
	}`
}

export function transactionsSumReport(start: string, end: string, filterTerms: FilterTerm[], download: boolean, limit: number, offset: number, order: string): string {
  let filterString = parseFilterTerms(filterTerms);

  return `
  {
		transactionsummaryreport (analyticsfilter:{${dateString(start, end)} ${filterString}} ${paginationString(limit, offset, order)}) {
			periods {
        period, sale_count, sale_revenue, rebill_count, rebill_revenue, refund_expenses, refund_count, gross_revenue, declines_count, declines_revenue, chargeback_count, current_active_customer, count_alert_count
      }
		}
	}`
}

export function transactionsSumTotalReport(start: string, end: string, filterTerms: FilterTerm[]): string {
  let filterString = parseFilterTerms(filterTerms);

  return `
  {
		transactionsummaryreportsummary (analyticsfilter:{${dateString(start, end)} ${filterString}}) {
      sale_count, sale_revenue, rebill_count, rebill_revenue, refund_expenses, refund_count, gross_revenue, declines_count, declines_revenue, chargeback_count, current_active_customer, count_alert_count
		}
	}`
}

export function merchantReportListQuery(start: string, end: string, filterTerms: FilterTerm[], download: boolean, limit: number, offset: number, order: string): string {
  let filterFacets = createFacets(filterTerms);

  return `
  {
		analytics (
		  reportType: merchantReport
		  facets: [{
      facet: "start"
        values: ["${start}"]
      },
      {
        facet: "end"
        values: ["${end}"]
      }
      ${filterFacets}
    ]) {
			records { key value }
		}
	}`
}

export function affiliateReportListQuery(start: string, end: string, filterTerms: FilterTerm[], download: boolean, limit: number, offset: number, order: string): string {
  let filterFacets = createFacets(filterTerms);

  return `
  {
		analytics (
		  reportType: affiliateTraffic
		  facets: [{
      facet: "start"
        values: ["${start}"]
      },
      {
        facet: "end"
        values: ["${end}"]
      }
      ${filterFacets}
    ]) {
			records { key value }
		}
	}`
}
