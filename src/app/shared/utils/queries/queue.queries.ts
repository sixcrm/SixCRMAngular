export function getQueueMessages(queueName: string): string {
  return `
		query {
		  listqueuemessage ( queuename: "${queueName}" ){
		    queuemessages {id, queue, message}
      }
    }`
}

export function getQueueSummary(queueName: string, start: string, end: string, limit?: string, offset?: string): string {
  return `
    query {
      queuesummary (analyticsfilter:{start:"${start}", end:"${end}"}, pagination: { limit:${limit ? limit : 16}, offset:${offset ? offset: 0} }, queuename:"${queueName}")
        {summary { datetime, count }
      }
    }`
}
