import {
  paginationQueryString, paginationString, parseFilterTerms, dateString,
  paginationFullString
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
  let filterString = parseFilterTerms(filterTerms);

  let pagination = !download ? paginationQueryString() : '';

  return `
  {
		merchantreport (analyticsfilter:{${dateString(start, end)} ${filterString}} ${paginationString(limit, offset, order)}) {
			merchants {
				merchant_provider {id name}, sale_count, sale_gross_revenue, refund_expenses, refund_count, net_revenue, mtd_sales_count, mtd_gross_count
			}
			${pagination}
		}
	}`
}

export function affiliteReportSummaryQuery(start: string, end: string, filterTerms: FilterTerm[]): string {
  let filterString = parseFilterTerms(filterTerms);

  return `
  {
		affiliatereportsummary (analyticsfilter:{${dateString(start, end)} ${filterString}} ) {
      count_click, count_partials, partials_percent, decline_count, declines_percent, count_sales, sales_percent, count_upsell, upsell_percent, sum_upsell, sum_amount
		}
	}`
}

export function affiliateReportListQuery(start: string, end: string, filterTerms: FilterTerm[], download: boolean, limit: number, offset: number, order: string): string {
  let filterString = parseFilterTerms(filterTerms);

  let pagination = !download ? paginationQueryString() : '';

  return `
  {
		affiliatereport (analyticsfilter:{${dateString(start, end)} ${filterString}} ${paginationString(limit, offset, order)}) {
			affiliates {
			  affiliate { id, name, affiliate_id },
				count_click, count_partials, partials_percent, decline_count, declines_percent, count_sales, sales_percent, count_upsell, upsell_percent, sum_upsell, sum_amount
			}
			${pagination}
		}
	}`
}

export function subaffiliateReportListQuery(start: string, end: string, filterTerms: FilterTerm[], download: boolean, limit: number, offset: number, order: string): string {
  let filterString = parseFilterTerms(filterTerms);

  let pagination = !download ? paginationQueryString() : '';

  return `
  {
		affiliatereportsubaffiliates (analyticsfilter:{${dateString(start, end)} ${filterString}} ${paginationFullString(limit, offset, order)}) {
			subaffiliates {
			  affiliate { id },
				count_click, count_partials, partials_percent, decline_count, declines_percent, count_sales, sales_percent, count_upsell, upsell_percent, sum_upsell, sum_amount
			}
			${pagination}
		}
	}`
}
