import { Component, OnInit, Input } from '@angular/core';
import {CustomServerError} from '../../shared/models/errors/custom-server-error';
import {Moment} from 'moment';

export interface BillChartItem {
  time: Moment;
  count: number;
}

@Component({
  selector: 'billing-chart',
  templateUrl: './billing-chart.component.html',
  styleUrls: ['./billing-chart.component.scss']
})
export class BillingChartComponent implements OnInit {

  loaded: boolean = false;

  serverError: CustomServerError;

  items: BillChartItem[];

  @Input() set data(data: any) {
    if (data instanceof CustomServerError) {
      this.serverError = data;
    }

    this.serverError = null;
    this.items = data;
    this.loaded = true;

    this.render();
  }

  chartInstance;

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

  constructor() { }

  ngOnInit() {
  }

  render() {
    if (!this.chartInstance) return;

    const values = this.items.map(s => s.count);
    const dates = this.items.map(s => s.time.clone().format('DD.[ ]MMM'));

    this.chartInstance.xAxis[0].update({categories: dates}, true);
    this.chartInstance.series[0].setData(values, true);
  }

  saveChart(chartInstance): void {
    this.chartInstance = chartInstance;

    if (this.items && this.loaded) {
      this.render();
    }
  }

}
