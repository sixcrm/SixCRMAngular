export function transactionReportListQuery(start: string, end: string, limit: number, offset: number, order: string): string {
  return `
  {
		listtransactions (analyticsfilter:${dateString(start, end)} ${paginationString(limit, offset, order)}) {
			transactions{
				id,
			  datetime,
			  customer,
			  creditcard,
			  merchant_provider,
			  campaign,
			  affiliate,
			  amount,
			  processor_result,
			  account,
			  transaction_type,
			  product_schedule,
			  subaffiliate_1,
			  subaffiliate_2,
			  subaffiliate_3,
			  subaffiliate_4,
			  subaffiliate_5,
			  transaction_subtype
			}
			${paginationQueryString()}
		}
	}`
}

function paginationString(limit: number, offset: number, order: string): string {
  let ord = order ? `order:"${order}"` : '';
  let lim = 'limit: ' + (limit ? limit : '20');
  let off = offset ? `offset:${offset}`: '';

  return `pagination:{${ord} ${lim} ${off}}`
}

function dateString(start: string, end: string) {
  return `{start:"${start}", end:"${end}"}`;
}

function paginationQueryString(): string {
  return 'pagination { order limit offset count }';
}
