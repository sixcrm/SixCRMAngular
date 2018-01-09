import {Component, OnInit, Input} from '@angular/core';
import {MerchantReport} from '../../shared/models/analytics/merchant-report.model';
import {AuthenticationService} from '../../authentication/authentication.service';
import {TranslationService} from '../../translation/translation.service';

@Component({
  selector: 'merchant-report-chart',
  templateUrl: './merchant-report-chart.component.html',
  styleUrls: ['./merchant-report-chart.component.scss']
})
export class MerchantReportChartComponent implements OnInit {

  chartInstance;
  reportsToDisplay: MerchantReport[];

  @Input() set reports(merchantReports: MerchantReport[]) {
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

  constructor(private authService: AuthenticationService, private translationService: TranslationService) {
    if (this.authService.getUserSettings().language) {
      this.initCharts();
    } else {
      this.authService.userSettings$.take(1).subscribe(settings => this.initCharts());
    }
  }

  ngOnInit() {
  }

  initCharts() {
    this.chartOptions = {
      chart: { type: 'column' },
      title: {text: null},
      credits: {enabled: false},
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
    this.loaded = true;
    if (this.reportsToDisplay.length === 0) return;

    this.chartInstance.axes[0].categories = this.reportsToDisplay.map(r => r.merchantProvider);
    this.chartInstance.series[0].setData(
      this.reportsToDisplay.map((r, i) => {
        return {y: +r.saleGrossRevenue.amount, color: this.colors[i % 5]}
      }), true);
  }

  download() {

  }
}
