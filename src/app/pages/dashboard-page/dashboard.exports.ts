export interface DashboardQuery {
  label: string,
  selected: boolean,
  callback?: () => void
}

export interface DashboardTimeFilter {
  label: string,
  selected: boolean,
  callback?: () => void
}
