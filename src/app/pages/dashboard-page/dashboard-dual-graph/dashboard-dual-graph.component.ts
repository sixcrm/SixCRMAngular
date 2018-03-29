import {Component, OnInit, AfterViewInit} from '@angular/core';

@Component({
  selector: 'dashboard-dual-graph',
  templateUrl: './dashboard-dual-graph.component.html',
  styleUrls: ['./dashboard-dual-graph.component.scss']
})
export class DashboardDualGraphComponent implements OnInit, AfterViewInit {

  colors = ['rgba(107, 176, 223, 1)', 'rgba(145, 213, 243, 1)'];

  options;
  chartInstance;
  constructor() { }

  ngOnInit() {}

  ngAfterViewInit() {
    this.initChart()
  }

  initChart() {
    this.options  = {
      chart: {
        height: '35%',
        type: 'area',
        backgroundColor: 'rgba(0,0,0,0)'
      },
      title: {
        text: null
      },
      credits: {
        enabled: false
      },
      yAxis: {
        title: {
          enabled: false
        },
        labels: {
          enabled: false
        },
        gridLineWidth: 0
      },
      xAxis: {
        labels: {
          enabled: false
        }
      },
      tooltip: {
        useHTML: true,
        split: true,
        backgroundColor: 'rgba(0,0,0,0)',
        borderWidth: 0,
        shadow: false,
        formatter: function(value) {
          const firstPoint = this.points[0];
          const secondPoint = this.points[1];

          const first = `<div class="dashboard-tooltip-text" style="color: white">$ ${firstPoint.y}</div>`;
          const second = `<div class="dashboard-tooltip-text" style="color: white">${secondPoint.y}</div>`;

          return [this.x, first, second];
        }
      },
      legend: {
        enabled: false
      },
      pane: {
        size: 100
      },
      series: [
        { name: 'first', color: '#4383CC', data: [0, 10, 12, 15, 26, 28, 30, 31, 36, 52] },
        { name: 'second', color: '#4DABF5', data: [0, 5, 10, 12, 20, 21, 22, 25, 26, 30] },
      ]
    };
  }

  loadChart(chartInstance) {
    this.chartInstance = chartInstance;
  }
}
