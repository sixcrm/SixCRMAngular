import {parseFilterTerms, parseAdditionalFilters} from './helper.queries';
import {FilterTerm} from '../../components/advanced-filter/advanced-filter.component';

export function transactionSummaryQuery(start: string, end: string, filterTerms: FilterTerm[], additionalFilters?: any[]): string {
  let filterString = parseFilterTerms(filterTerms);

  let additional = parseAdditionalFilters(additionalFilters);

  return `{
		transactionsummary (analyticsfilter:{${dateRange(start, end)} ${filterString} ${additional} targetperiodcount: 24}) {
			transactions { datetime byprocessorresult { processor_result amount count }
			}
		}
	}`
}

export function eventsFunelQuery(start: string, end: string): string {
  return `{
		eventfunnel (analyticsfilter:{${dateRange(start, end)}}) {
			funnel {
				click { count percentage relative_percentage }
				lead { count percentage relative_percentage }
				main { count percentage relative_percentage }
				upsell { count percentage relative_percentage }
				confirm { count percentage relative_percentage }
			}
		}}`;
}

export function transactionOverviewQuery(start: string, end: string): string {
  return `{
		transactionoverview (analyticsfilter:{${dateRange(start, end)}}) {
			overview {
				newsale { count amount }
				rebill { count amount }
				decline { count amount }
				error { count amount }
				main { count amount }
				upsell { count amount }
			}
		}
	}`
}

export function campaignDeltaQuery(start: string, end: string): string {
  return `
  {
		campaigndelta (analyticsfilter:{${dateRange(start, end)}}) {
			campaigns { campaign campaign_name percent_change_amount percent_change_count }
		}
	}`
}

export function eventsByAffiliateQuery(start: string, end: string): string {
  return `
  {
		eventsbyfacet (analyticsfilter:{${dateRange(start, end)}}, facet:"affiliate", pagination:{limit:5}) {
			count,
			facet_type,
			facets {
				facet,
				count,
				percentage
			}
		}
	}
  `
}

export function transactionsByAffiliateQuery(start: string, end: string): string {
  return `
    {
        transactionsbyfacet (analyticsfilter:{${dateRange(start, end)}}, facet:"affiliate", pagination:{limit:5}) {
          count,
          facet_type,
          facets {
            facet,
            count,
            count_percentage,
            amount,
            amount_percentage
          }
        }
      }`
}

export function eventsSummaryQuery(start: string, end: string): string {
  return `
  {
		eventsummary (analyticsfilter:{${dateRange(start, end)} targetperiodcount:24}) {
			events {
				datetime,
				byeventtype {
					event_type,
					count
				}
			}
		}
	}`
}

export function campaignsByAmountQuery(start: string, end: string): string {
  return `
  {
    campaignsbyamount (analyticsfilter:{${dateRange(start, end)}}) {
      campaigns { campaign amount }
    }
  }`
}

export function activitiesByCustomer(start: string, end: string, customer: string, limit: number, offset: number): string {
  return `
  {
		listactivitybycustomer (activityfilter:{${dateRange(start, end)}, actor:"${customer}"}, pagination: {limit:${limit} , offset:${offset}}) {
			activity { id datetime actor actor_type action acted_upon acted_upon_type associated_with associated_with_type english }
			pagination { order limit offset count }
		}
	}`
}

function dateRange(start: string, end: string): string {
  return `start:"${start}" end:"${end}"`;
}
