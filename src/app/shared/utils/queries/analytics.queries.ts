import {parseFilterTerms, parseAdditionalFilters} from './helper.queries';
import {FilterTerm} from '../../components/advanced-filter/advanced-filter.component';

export function transactionSummaryQuery(start: string, end: string, filterTerms: FilterTerm[], additionalFilters?: any[]): string {
  return `
    query {
      analytics (
        reportType: transactionSummary
        facets: [{
        facet: "start"
          values: ["${start}"]
        },
        {
          facet: "end"
          values: ["${end}"]
        },
        {
          facet: "period"
          values: ["DAY"]
        }
      ]) {records { key value }}
    }`;
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

export function eventsFunnelTimeseriesQuery(start: string, end: string, period: string, eventType: string): string {
  return `
    query {
      analytics (
        reportType: eventFunnelTimeseries
        facets: [{
          facet: "start"
            values: ["${start}"]
          },
          {
            facet: "end"
            values: ["${end}"]
          },
          {
            facet: "period"
            values: ["${period}"]
          },
          {
            facet: "eventType"
            values: ["${eventType}"]
          }]
      ) {records { key value }}
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

export function transactionsQuery(params: {
  start: string,
  end: string,
  limit?: number,
  offset?: number,
  orderBy?: string,
  sort?: string,
  facets?: {facet: string, values: string[]}[]
}): string {
  const additionalFacets = (params.facets || []).reduce((a,b) =>
    `${a},
    {
      facet: "${b.facet}"
      values: [${b.values.reduce((f,g) => `${f}${f?',':''} "${g}"`, '')}]
    }`, '');

  return `
    query {
      analytics (
        reportType: transactionDetail
        facets: [{
          facet: "start"
            values: ["${params.start}"]
          },
          {
            facet: "end"
            values: ["${params.end}"]
          }${additionalFacets}
        ],
        pagination: {
          limit: ${params.limit || 99999},
          offset: ${params.offset || 0},
          order: ["${params.orderBy || 'datetime'}"],
          direction: "${[params.sort || 'desc']}"
        }
      ) {records { key value }}
    }
  `;
}

export function productSchedulesByAmountQuery(start: string, end: string): string {
  return `
    query {
      analytics (
        reportType: productSchedulesByAmount
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
          facet: "actedUpon"
          values: ["${customer}"]
        },
        {
          facet: "actedUponType"
          values: ["customer"]
        }
      ]
      pagination: {
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
