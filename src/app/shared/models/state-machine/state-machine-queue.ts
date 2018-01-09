export interface StateMachineQueue {
  label: string,
  labelkey: string,
  count: number,
  avgTimeInSeconds: number,
  avgTimeColor?: string,
  failureRate: number,
  failureColor?: string,
  schemaPosition: 'left' | 'right',
  selected: boolean,
  description?: string,
  downstreamQueues?: string[];
  loaded?: boolean
}
