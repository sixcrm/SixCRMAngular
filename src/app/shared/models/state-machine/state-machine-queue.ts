export interface StateMachineQueue {
  label: string,
  count: number,
  avgTimeInSeconds: number,
  failureRate: number,
  schemaPosition: 'left' | 'right',
  selected: boolean,
  state?: 'a' | 'b' | 'c',
  description?: string
}
