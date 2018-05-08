export function getQueueSummary(queueName: string, start: string, end: string, period: string, limit?: string, offset?: string): string {
  return `
    query {
      analytics (
        reportType: rebillSummary
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
          facet: "queueName"
          values: ["${queueName}"]
        }]
        pagination: {
          limit: ${limit ? limit : 16}
          offset: ${offset ? offset : 0}
          direction: "ASC"
        }
     ) {records { key value }}
    }
  `;
}

export function getCurrentQueueSummary(queuename: string) : string {
  return `
    query {
      currentqueuesummary (queuename: "${queuename}"){
        summary { queuename, avg_time, number_of_rebills, failure_rate, failure_rate_color, avg_time_color}
      }
    }
  `
}
