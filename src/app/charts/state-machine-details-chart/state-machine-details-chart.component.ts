import { Component, OnInit, Input } from '@angular/core';
import {StateMachineTimeseries} from '../../shared/models/state-machine/state-machine-timeseries.model';

@Component({
  selector: 'state-machine-details-chart',
  templateUrl: './state-machine-details-chart.component.html',
  styleUrls: ['./state-machine-details-chart.component.scss']
})
export class StateMachineDetailsChartComponent implements OnInit {

  chartInstance;
  chartEmptyInstance;
  stateMachineTimeseries: StateMachineTimeseries[] = [];
  showNoData: boolean;

  @Input() set timeseries(timeseries: StateMachineTimeseries[]) {
    if (timeseries) {
      this.stateMachineTimeseries = timeseries;
    }

    this.showNoData = this.stateMachineTimeseries.length === 0;

    if (this.chartInstance && this.chartEmptyInstance) {
      this.redrawChart();
    }
  }

  @Input() date: any;

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

  chartEmptyOptions = {
    title: {
      text: null
    },
    credits: {
      enabled: false
    },
    xAxis: {
      type: 'datetime'
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

  saveEmptyChart(chartInstance): void {
    this.chartEmptyInstance = chartInstance;

    this.redrawChart();
  }

  redrawChart() {
    if (!this.stateMachineTimeseries) return;

    if (this.stateMachineTimeseries.length > 0) {
      this.updateChart();
    } else {
      this.updateEmptyChart();
    }
  }

  updateChart() {
    if (!this.chartEmptyInstance) return;

    const values = this.stateMachineTimeseries.map(s => s.count);
    const dates = this.stateMachineTimeseries.map(s => s.datetime.clone().format('DD.[ ]MMM'));
    this.chartInstance.xAxis[0].update({categories: dates}, true);
    this.chartInstance.series[0].setData(values, true);
  }

  updateEmptyChart() {
    if (!this.chartEmptyInstance) return;

    this.chartEmptyInstance.xAxis[0].update({min: this.date.start.clone().valueOf(), max: this.date.end.clone().valueOf()}, true);
    this.chartEmptyInstance.yAxis[0].update({min: 0, max: 1000}, true);
  }

}
