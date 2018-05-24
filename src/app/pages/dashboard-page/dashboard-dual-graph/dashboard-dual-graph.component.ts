import {Component, OnInit, AfterViewInit, Input} from '@angular/core';
import {AuthenticationService} from '../../../authentication/authentication.service';
import {SeriesType} from '../series-type';
import {NumberLocalePipe} from "../../../translation/number-locale.pipe";
import {TranslationService} from "../../../translation/translation.service";

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
  numberLocale: NumberLocalePipe;

  constructor(private authService: AuthenticationService,
              private translationService: TranslationService) {
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
          const first = `<div class="dashboard-tooltip-text" style="color: white; font-size: 20px; font-weight: 500">$${self.numberLocale.transform(firstPoint.y)}</div>`;
          const date = `<div class="dashboard-tooltip-date" style="color: #8EC9FD; font-size: 14px; font-weight: 500;">${self.calculateDate(firstPoint.x)}</div>`;

          return [date, first];
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
          data: []}
      ]
    };
  }

  refreshData() {
    if (!this.data || !this.chartInstance || !this.chartInstance.chart) return;

    this.chartInstance.chart.series[0].update({data: this.data[0]}, true);

    this.initialLoad = true;
  }

  calculateDate(xValue: number) {
    const tz = this.authService.getTimezone();

    return this.data[0][xValue][0].tz(tz).format('MMMM D, YYYY');
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
