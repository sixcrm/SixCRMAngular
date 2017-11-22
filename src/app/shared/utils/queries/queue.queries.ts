export function getQueueMessages(queueName: string): string {
  return `
		query {
		  listqueuemessage ( queuename: "${queueName}" ){
		    queuemessages {id, queue, message}
      }
    }`
}
