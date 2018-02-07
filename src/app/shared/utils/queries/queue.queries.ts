export function getQueueSummary(queueName: string, start: string, end: string, limit?: string, offset?: string): string {
  return `
    query {
      rebillsummary (analyticsfilter:{start:"${start}", end:"${end}"}, pagination: { limit:${limit ? limit : 16}, offset:${offset ? offset: 0} }, queuename:"${queueName}", period:"day")
        {summary { datetime, count }
      }
    }`
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
