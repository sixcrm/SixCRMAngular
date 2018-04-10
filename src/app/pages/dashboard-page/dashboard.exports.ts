import {HeroChartSeries} from '../../shared/models/hero-chart-series.model';

export interface DashboardQuery {
  label: string,
  selected: boolean,
  comparisonType: string,
  process: (series: HeroChartSeries[]) => void
}

export interface DashboardTimeFilter {
  label: string,
  start: string,
  end: string,
  selected: boolean,
  callback?: () => void
}
