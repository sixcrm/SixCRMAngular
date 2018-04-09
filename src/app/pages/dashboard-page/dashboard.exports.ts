export interface DashboardQuery {
  label: string,
  selected: boolean,
  callback?: () => void
}

export interface DashboardTimeFilter {
  label: string,
  start: string,
  end: string,
  selected: boolean,
  callback?: () => void
}
