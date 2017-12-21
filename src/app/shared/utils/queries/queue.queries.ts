export function getQueueSummary(queueName: string, start: string, end: string, limit?: string, offset?: string): string {
  return `
    query {
      rebillsummary (analyticsfilter:{start:"${start}", end:"${end}"}, pagination: { limit:${limit ? limit : 16}, offset:${offset ? offset: 0} }, queuename:"${queueName}", period:"day")
        {summary { datetime, count }
      }
    }`
}

export function getQueueState(queuename: string, start: string, end: string): string {
  return `
    query {
      queuestate (analyticsfilter:{start:"${start}", end:"${end}"}, pagination: { limit:1, offset:0 }, queuename:"${queuename}", period:"minute")
        { count, failure_rate, success_rate, error_rate, expired_rate, average_time, average_time_color, failure_rate_color }
    }`
}