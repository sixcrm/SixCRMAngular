import { Component, OnInit, Input } from '@angular/core';
import {EventSummary} from '../../../shared/models/event-summary.model';

@Component({
  selector: 'events-summary',
  templateUrl: './events-summary.component.html',
  styleUrls: ['./events-summary.component.scss']
})
export class EventsSummaryComponent implements OnInit {

  colors = ['#4383CC', '#4DABF5', '#9ADDFB', '#FDAB31', '#F28933'];
  chartInstance;
  events: EventSummary[];
  loaded: boolean = false;

  @Input() set eventsSummary(data: EventSummary[]) {
    if (data) {
      this.events = data;

      if (this.chartInstance) {
        this.redrawChart();
      }
    }
  };

  options = {
    chart: {
      type: 'area'
    },
    title: {
      text: null
    },
    credits: {
      enabled: false
    },
    yAxis: {
      title: {
        text: 'Events Number'
      }
    },
    tooltip: {
      split: true
    },
    plotOptions: {
      area: {
        stacking: 'normal'
      }
    },
    series: [
      { name: 'Confirm', color: this.colors[4] },
      { name: 'Upsell', color: this.colors[3] },
      { name: 'Order', color: this.colors[2] },
      { name: 'Lead', color: this.colors[1] },
      { name: 'Click', color: this.colors[0] }
    ]
  };

  constructor() { }

  ngOnInit() {
  }

  loadChart(chartInstance) {
    this.chartInstance = chartInstance;

    if (this.events && this.events.length > 0) {
      this.redrawChart();
    }
  }

  redrawChart() {
    let parsedDates = [];
    let parsedEvents = {};

    this.events.forEach(event => {
      parsedDates.push(event.date.format('MM/DD'));

      event.events.forEach(e => {
        if (parsedEvents[e.type]) {
          parsedEvents[e.type].push(e.count);
        } else {
          parsedEvents[e.type] = [e.count];
        }
      })
    });

    this.chartInstance.chart.xAxis[0].update({categories: parsedDates}, true);
    this.chartInstance.chart.series[0].update({data: parsedEvents['confirm']}, true);
    this.chartInstance.chart.series[1].update({data: parsedEvents['upsell']}, true);
    this.chartInstance.chart.series[2].update({data: parsedEvents['order']}, true);
    this.chartInstance.chart.series[3].update({data: parsedEvents['lead']}, true);
    this.chartInstance.chart.series[4].update({data: parsedEvents['click']}, true);

    this.loaded = true;
  }
}
