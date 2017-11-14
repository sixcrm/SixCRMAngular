import { Component, OnInit, Input } from '@angular/core';
import {StateMachineTimeseries} from '../../shared/models/state-machine/state-machine-timeseries.model';

@Component({
  selector: 'state-machine-details-chart',
  templateUrl: './state-machine-details-chart.component.html',
  styleUrls: ['./state-machine-details-chart.component.scss']
})
export class StateMachineDetailsChartComponent implements OnInit {

  chartInstance;
  stateMachineTimeseries: StateMachineTimeseries[] = [];

  @Input() set timeseries(timeseries: StateMachineTimeseries[]) {
    if (timeseries && timeseries.length > 0) {
      this.stateMachineTimeseries = timeseries;
    }

    if (this.chartInstance) {
      this.redrawChart();
    }
  }

  chartOptions = {
    title: {
      text: null
    },
    credits: {
      enabled: false
    },
    yAxis: {
      title: {
        enabled: false
      }
    },
    series: [
      { showInLegend: false, name: 'count', color: '#F28933' },
    ]
  };

  constructor() { }

  ngOnInit() {
  }

  saveChart(chartInstance): void {
    this.chartInstance = chartInstance;

    this.redrawChart();
  }

  redrawChart() {
    if (!this.stateMachineTimeseries) return;

    const values = this.stateMachineTimeseries.map(s => s.count);
    const dates = this.stateMachineTimeseries.map(s => s.period.clone().format('MM/DD'));
    this.chartInstance.xAxis[0].update({categories: dates}, true);
    this.chartInstance.series[0].setData(values, true);
  }

}
