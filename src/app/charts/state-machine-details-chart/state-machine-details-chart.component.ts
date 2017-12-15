import { Component, OnInit, Input } from '@angular/core';
import {StateMachineTimeseries} from '../../shared/models/state-machine/state-machine-timeseries.model';
import {Moment, utc} from 'moment';

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
    tooltip: {
      enabled: false
    },
    series: [
      { showInLegend: false, name: 'count', color: 'rgba(0,0,0,0.12)' },
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

    const values = [50,40,45,30,40,35,40,35,50,60,55,60];
    const dates = this.getTimesBetween(this.date.start.clone(), this.date.end.clone()).map(t => t.clone().format('DD.[ ]MMM'));
    this.chartEmptyInstance.xAxis[0].update({categories: dates}, true);
    this.chartEmptyInstance.series[0].setData(values, true);
  }

  getTimesBetween(start: Moment, end: Moment) {
    const diffInHours = end.diff(start, 'hours');
    const step = diffInHours / 12;

    const times = [start.clone()];

    for (let i = 1; i < 11; i++) {
      times.push(times[i-1].clone().add(step, 'h'));
    }

    times.push(end.clone());

    return times;
  }

}
