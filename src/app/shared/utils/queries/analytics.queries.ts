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

export function heroChartQuery(start: string, end: string, period: string, comparisonType: string, campaignId?: string): string {
  let facets = `{ facet: "start", values: ["${start}"] }, { facet: "end", values: ["${end}"] }, { facet: "period", values: ["${period}"] }`;
  if (campaignId) {
    facets += `, { facet: "campaign", values: ["${campaignId}"]}`
  }

  return `{
		analytics ( reportType: ${comparisonType} facets: [ ${facets} ] ) {
			records { key, value }
		}
  }`;
}

export function eventsFunnelQuery(start: string, end: string): string {
  return `
    query {
      analytics (
        reportType: eventFunnel
        facets: [{
        facet: "start"
          values: ["${start}"]
        },
        {
          facet: "end"
          values: ["${end}"]
        }
      ]) {records { key value }}
    }
  `;
}

export function campaignsByAmountQuery(start: string, end: string): string {
  return `
    query {
      analytics (
        reportType: campaignsByAmount
        facets: [{
          facet: "start"
            values: ["${start}"]
          },
          {
            facet: "end"
            values: ["${end}"]
          }
        ],
        pagination: {
          limit: 10,
          offset: 0,
          order: ["amount"],
          direction: "desc"
        }
      ) {records { key value }}
    }
  `;
}

export function activitiesByCustomer(start: string, end: string, customer: string, limit: number, offset: number): string {
  return  `
  {
		analytics (
		  reportType: activities
		  facets: [{
        facet: "start"
          values: ["${start}"]
        },
        {
          facet: "end"
          values: ["${end}"]
        },
        {
          facet: "actor"
          values: ["${customer}"]
        },
        {
          facet: "actorType"
          values: ["customer"]
        },
        {
          facet: "actedUpon"
          values: ["${customer}"]
        },
        {
          facet: "actedUponType"
          values: ["customer"]
        },
        {
          facet: "associatedWith"
          values: ["${customer}"]
        },
        {
          facet: "associatedWithType"
          values: ["customer"]
        }
        ]
      pagination: {
        limit: 10,
        offset: ${offset},
        order: ["datetime"]
      }
    ) {
			records { key value }
		}
	}`;
}

function dateRange(start: string, end: string): string {
  return `start:"${start}" end:"${end}"`;
}
