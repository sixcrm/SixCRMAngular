export function getQueueMessages(queueName: string): string {
  return `
		listqueuemessage ( queuename: "${queueName}" ){
			queuemessages {id, message}
		}`
}
