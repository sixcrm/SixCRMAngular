import {FilterTerm} from '../../../pages/dashboard-page/dashboard.component';

export function transactionSummaryQuery(start: string, end: string, filterTerms: FilterTerm[], additionalFilters?: any[]): string {
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

  let additional = '';

  if (additionalFilters) {
    additionalFilters.forEach(filter => {
      if (filter.value) {
        additional += ` ${filter.key}:"${filter.value}" `;
      }
    });
  }

  return `{
		transactionsummary (analyticsfilter:{${dateRange(start, end)} ${filterString} ${additional} targetperiodcount: 24}) {
			transactions { datetime
				byprocessorresult { processor_result amount count }
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
			campaigns {
				campaign,
				campaign_name,
				percent_change_amount,
				percent_change_count
			}
		}
	}`
}

function dateRange(start: string, end: string): string {
  return `start:"${start}", end:"${end}"`;
}
