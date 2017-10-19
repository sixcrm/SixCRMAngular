import {Component, OnInit, Input} from '@angular/core';
import {MerchantReport} from '../../shared/models/analytics/merchant-report.model';

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

  chartOptions = {
    chart: { type: 'column' },
    title: {text: null},
    credits: {enabled: false},
    xAxis: {
      categories: [ ]
    },
    yAxis: {
      title: {text: 'Dollars' }
    },
    series: [
      { name: 'Sale Gross Revenue' }
    ]
  };

  loaded: boolean = false;

  constructor() { }

  ngOnInit() {
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
