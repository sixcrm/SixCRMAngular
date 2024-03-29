import {Component, OnInit, Input} from '@angular/core';
import {MerchantAnalytics} from '../../shared/models/analytics/merchant-analytics.model';
import {TranslationService} from '../../translation/translation.service';
import {Currency} from '../../shared/utils/currency/currency';

@Component({
  selector: 'merchant-report-chart',
  templateUrl: './merchant-report-chart.component.html',
  styleUrls: ['./merchant-report-chart.component.scss']
})
export class MerchantReportChartComponent implements OnInit {

  chartInstance;
  reportsToDisplay: MerchantAnalytics[];

  @Input() set reports(merchantReports: MerchantAnalytics[]) {
    if (merchantReports && merchantReports.length > 0) {
      this.reportsToDisplay = merchantReports;
    }

    if (this.chartInstance) {
      this.redrawChart();
    }
  }

  colors = ['#4DABF5', '#9ADDFB', '#FDAB31', '#F28933', '#4383CC'];
  loaderColors = ['#C3C3C3', '#CBCBCB', '#D8D8D8', '#ECECEC', '#E2E2E2'];

  chartOptions;
  loaderOptions;

  loaded: boolean = false;

  constructor(private translationService: TranslationService) {
    this.initCharts();
  }

  ngOnInit() {
  }

  initCharts() {
    this.chartOptions = {
      chart: { type: 'column' },
      title: {text: null},
      credits: {enabled: false},
      tooltip: {
        formatter: function () {
          return `${this.x} <br> Sales Gross Revenue: <b>${new Currency(this.y).usd()}</b>`;
        }
      },
      xAxis: {
        categories: [ ]
      },
      yAxis: {
        title: {text: this.translationService.translate('MERCHANTREPORT_CHART_DOLLAR') }
      },
      series: [
        { name: this.translationService.translate('MERCHANTREPORT_CHART_REVENUE') }
      ]
    };

    this.loaderOptions = {
      chart: { type: 'column' },
      title: {text: null},
      credits: {enabled: false},
      xAxis: {
        categories: [ ]
      },
      yAxis: {
        title: {text: this.translationService.translate('Dollars') }
      },
      tooltip: {
        enabled: false
      },
      series: [
        {
          showInLegend: false,
          data: [
            {y: 5, color: this.loaderColors[0]},
            {y: 6, color: this.loaderColors[1]},
            {y: 7, color: this.loaderColors[2]},
            {y: 4, color: this.loaderColors[3]},
            {y: 3, color: this.loaderColors[4]},
            {y: 5, color: this.loaderColors[3]},
            {y: 2, color: this.loaderColors[2]},
            {y: 3, color: this.loaderColors[1]},
            {y: 5, color: this.loaderColors[0]},
            {y: 3, color: this.loaderColors[4]},
          ]
        }
      ]
    };
  }

  saveChart(chartInstance): void {
    this.chartInstance = chartInstance;

    if (this.reportsToDisplay) {
      this.redrawChart();
    }
  }

  redrawChart(): void {
    if (!this.reportsToDisplay || this.reportsToDisplay.length === 0) return;

    this.loaded = true;

    this.chartInstance.axes[0].categories = this.reportsToDisplay.map(r => r.gateway);
    this.chartInstance.series[0].setData(
      this.reportsToDisplay.map((r, i) => {
        return {y: +r.salesRevenue.amount, color: this.colors[i % 5]}
      }), true);
  }

  download() {

  }
}
