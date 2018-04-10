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

          const first = `<div class="dashboard-tooltip-text" style="color: white">${self.type === SeriesType.amountcount || self.type === SeriesType.amount ? '$':''}${firstPoint.y}</div>`;
          const second = secondPoint ? `<div class="dashboard-tooltip-text" style="color: white">${self.type === SeriesType.amount ? '$':''}${secondPoint.y}</div>` : null;
          const date = `<div class="dashboard-tooltip-date" style="color: white">${self.calculateDate(firstPoint.x)}</div>`;

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
        area: {
          marker: {
            enabled: false
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
                  ${((type === SeriesType.amountcount && this.series.index === 0) || type == SeriesType.amount)
                  ? `<div class="dashboard-label-icon-holder"> <div>$</div></div>`
                  : `<div class="dashboard-label-icon-holder"><i class="material-icons">shopping_cart</i></div>`}
                </div>`;
              }

              return null;
            }
          }
        }
      },
      series: [
        { name: 'first', color: '#4383CC', data: []},
        { name: 'second', color: '#4DABF5', data: []},
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

    if (!this.initialLoad) {
      this.refreshData();
    }
  }
}
