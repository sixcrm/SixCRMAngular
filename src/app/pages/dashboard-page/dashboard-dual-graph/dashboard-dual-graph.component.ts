import {Component, OnInit, AfterViewInit, Input} from '@angular/core';
import {SeriesType} from '../series-type';
import {NumberLocalePipe} from "../../../translation/number-locale.pipe";
import {TranslationService} from "../../../translation/translation.service";
import {Moment, utc} from 'moment';

@Component({
  selector: 'dashboard-dual-graph',
  templateUrl: './dashboard-dual-graph.component.html',
  styleUrls: ['./dashboard-dual-graph.component.scss']
})
export class DashboardDualGraphComponent implements OnInit, AfterViewInit {

  chartInstance;

  data = [[],[]];
  numberOfDays = 30;
  startDate: Moment;

  @Input() type: SeriesType = SeriesType.amountcount;

  @Input() set graphData(value) {
    if (!value || value.length === 0) return;

    this.data = value;

    this.refreshData();
  }

  @Input() set graphTimeFilter(value) {
    if (!value || value.length === 0) return;

    this.numberOfDays = value;

    this.refreshData();
  }

  @Input() renderLowChart: boolean;

  initialLoad: boolean;
  options;
  numberLocale: NumberLocalePipe;

  constructor(private translationService: TranslationService) {
    this.numberLocale = new NumberLocalePipe(translationService);
  }

  ngOnInit() {}

  ngAfterViewInit() {
    setTimeout(() => this.initChart(), 1);
  }

  initChart() {
    const self = this;

    this.options = {
      chart: {
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
        title: { enabled: false },
        gridLineWidth: 1,
        gridLineColor: '#3967A8',
        tickAmount: 4,
        labels: {
          style: {
            color: '#8EC9FD',
            fontSize: '14px'
          },
          format: '${value}'
        },
        lineColor: '#3967A8'
      },
      xAxis: {
        type: 'datetime',
        dateTimeLabelFormats: {
          day: '%m/%e/%y',
          week: '%m/%e/%y',
          month: '%m/%e/%y',
          year: '%m/%e/%y'
        },
        labels: {
          style: {
            color: '#8EC9FD',
            fontSize: '14px'
          }
        },
        lineColor: '#3967A8',
        tickLength: 0,
        tickPixelInterval: 200,
        showLastLabel: true
      },
      tooltip: {
        useHTML: true,
        split: true,
        backgroundColor: 'rgba(0,0,0,0)',
        borderWidth: 0,
        shadow: false,
        formatter: function() {
          const days = utc().diff(this.x, 'd');
          const firstPoint = this.points[0];
          const first = `<div class="dashboard-tooltip-text" style="color: white; font-size: 20px; font-weight: 500">$${self.numberLocale.transform(firstPoint.y)}</div>`;

          return ['', days === 1 ? '' : first];
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
            formatter: function () {

              const days = utc().diff(this.x, 'd');

              if (days === 1) {
                if (!this.series) return '';
                const type = self.type;

                return `
                <div class="dashboard-tooltip-text" style="color: white; font-size: 20px; font-weight: 500">
                  ${((type === SeriesType.amountcount && this.series.index === 0) || type === SeriesType.amount) ? '$' : ''}
                  ${self.numberLocale.transform(this.y)}
                </div>`;
              }
              return null;
            }
          }
        },
        series: {
          lineWidth: 12,
          lineColor: '#2DB2F9'
        }
      },

      series: [
        { name: '',
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
          data: [],
          lineWidth: 2,
          pointStart: utc().subtract(this.numberOfDays, 'd'),
          pointInterval: 24 * 3600 * 1000
        }
      ]
    };
  }

  refreshData() {
    if (!this.data || !this.chartInstance || !this.chartInstance.chart || !this.data[0].length) return;

    let revenue = this.data[0];

    revenue.pop(); //remove today's data

    this.startDate = revenue[0][0];

    this.chartInstance.chart.series[0].update({
      data: revenue,
      pointStart: utc(this.startDate)
    }, true);

    this.initialLoad = true;
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
