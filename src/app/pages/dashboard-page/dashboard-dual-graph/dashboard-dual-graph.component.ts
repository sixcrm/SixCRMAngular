import {Component, OnInit, AfterViewInit, Input} from '@angular/core';
import {AuthenticationService} from '../../../authentication/authentication.service';
import {SeriesType} from '../series-type';

@Component({
  selector: 'dashboard-dual-graph',
  templateUrl: './dashboard-dual-graph.component.html',
  styleUrls: ['./dashboard-dual-graph.component.scss']
})
export class DashboardDualGraphComponent implements OnInit, AfterViewInit {

  colors = ['rgba(107, 176, 223, 1)', 'rgba(145, 213, 243, 1)'];

  chartInstance;

  data = [[],[]];

  @Input() type: SeriesType = SeriesType.amountcount;

  @Input() set graphData(value) {
    if (!value || value.length === 0) return;

    this.data = value;

    this.refreshData();
  }

  @Input() renderChart: boolean;

  initialLoad: boolean;
  options;

  constructor(private authService: AuthenticationService) { }

  ngOnInit() {}

  ngAfterViewInit() {
    setTimeout(() => this.initChart(), 1);
  }

  initChart() {
    const self = this;

    this.options = {
      chart: {
        margin: [0,0,0,0],
        spacing: [0,0,0,0],
        animation: true,
        height: '30%',
        type: 'areaspline',
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
        visible: false,
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
        formatter: function() {
          const firstPoint = this.points[0];
          const secondPoint = this.points[1];

          const first = `<div class="dashboard-tooltip-text" style="color: white; font-size: 20px; font-weight: 500">${self.type === SeriesType.amountcount || self.type === SeriesType.amount ? '$':''}${firstPoint.y}</div>`;
          const second = secondPoint ? `<div class="dashboard-tooltip-text" style="color: white; font-size: 20px;">${self.type === SeriesType.amount ? '$':''}${secondPoint.y}</div>` : null;
          const date = `<div class="dashboard-tooltip-date" style="color: #8EC9FD; font-size: 14px; font-weight: 500;">${self.calculateDate(firstPoint.x)}</div>`;

          return [date, self.displayLabel(firstPoint.x) ? '' : first, second && self.displayLabel(secondPoint.x) ? '' : second];
        }
      },
      legend: {
        enabled: false
      },
      pane: {
        size: 100
      },
      plotOptions: {
        areaspline: {
          marker: {
            enabled: false,
            fillColor: '#86FCEA',
            radius: 8
          },
          dataLabels: {
            enabled: true,
            useHTML: true,
            formatter: function() {
              if (self.displayLabel(this.x)) {
                if (!this.series) return '';

                const type = self.type;

                return `
                <div class="dashboard-tooltip-text" style="color: white">
                  ${((type === SeriesType.amountcount && this.series.index === 0) || type === SeriesType.amount) ? '$' : ''}
                  ${this.y}
                </div>
                <div class="dashboard-tooltip-date" style="color: #8EC9FD; font-size: 14px; font-weight: 500;">
                  ${self.calculateDate(this.x)}
                </div>`;

              }

              return null;
            }
          }
        },
        series: {
          lineWidth: 4,
          lineColor: '#1EB1FC'
        }
      },

      series: [
        { name: 'first',
          color: {
            linearGradient: {
              x1: 0,
              y1: 0,
              x2: 0,
              y2: 1
            },
            stops: [
              [0, 'rgba(30, 177, 252, 1)'],
              [1, 'rgba(30, 177, 252, 0)']
            ]
          },
          data: []},
        { name: 'second',
          color: {
            linearGradient: {
              x1: 0,
              y1: 0,
              x2: 0,
              y2: 1
            },
            stops: [
              [0, 'rgba(77, 171, 245, 1)'],
              [1, 'rgba(77, 171, 245, 0)']
            ]
          },
          data: []},
      ]
    };
  }

  refreshData() {
    if (!this.data || !this.chartInstance || !this.chartInstance.chart) return;

    this.chartInstance.chart.series[0].update({data: this.data[0]}, true);

    if (this.data[1].length > 0) {
      this.chartInstance.chart.series[1].setVisible(true);
      this.chartInstance.chart.series[1].update({data: this.data[1]}, true);
    } else {
      this.chartInstance.chart.series[1].setVisible(false, true);
    }

    this.initialLoad = true;
  }

  displayLabel(xValue: number) {
    return xValue === this.data[0].length - 15 || xValue === this.data[0].length - 1;
  }

  calculateDate(xValue: number) {
    const tz = this.authService.getTimezone();

    if (xValue === this.data[0].length - 1) {
      return 'Today';
    }

    const date = this.data[0][xValue][0].tz(tz).format('MMMM D, YYYY');

    if (xValue === this.data[0].length - 15) {
      return 'Last login, ' + date;
    }

    return date;
  }

  loadChart(chartInstance) {
    this.chartInstance = chartInstance;

    setTimeout(() => {
      if (!this.initialLoad) {
        this.refreshData();
      }
    },1);


  }
}
