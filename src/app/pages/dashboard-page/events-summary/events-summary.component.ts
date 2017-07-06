import {Component, OnInit, OnDestroy} from '@angular/core';
import {EventSummary} from '../../../shared/models/event-summary.model';
import {Observable} from 'rxjs';
import {AnalyticsService} from '../../../shared/services/analytics.service';
import {AbstractDashboardItem} from '../abstract-dashboard-item.component';

@Component({
  selector: 'events-summary',
  templateUrl: './events-summary.component.html',
  styleUrls: ['./events-summary.component.scss']
})
export class EventsSummaryComponent extends AbstractDashboardItem implements OnInit, OnDestroy {

  colors = ['#4383CC', '#4DABF5', '#9ADDFB', '#FDAB31', '#F28933'];
  chartInstance;
  events: EventSummary[];
  loaded: boolean = false;

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
        text: 'Events'
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

  constructor(private analyticsService: AnalyticsService) {
    super();
  }

  ngOnInit() {
    this.analyticsService.eventsSummary$.takeUntil(this.unsubscribe$).subscribe(events => {
      this.events = events;
      this.redraw();
    })
  }

  ngOnDestroy() {
    this.destroy();
  }

  fetch() {
    if (this.shouldFetch) {
      if (!this.events || this.events.length === 0) {
        this.loaded = false;
      }

      this.analyticsService.getEventsSummary(this.start.format(), this.end.format());
      this.shouldFetch = false;
    }
  }

  download(format: string): void {
    this.analyticsService.getEventsSummary(this.start.format(), this.end.format(), format);
  }

  loadChart(chartInstance) {
    this.chartInstance = chartInstance;
  }

  redraw(): void {
    if (this.chartInstance) {
      this.redrawChart();
    } else {

      let sub = Observable.interval(50).subscribe(() => {
        if (this.chartInstance) {
          sub.unsubscribe();
          this.redrawChart();
        }
      })

    }
  }

  redrawChart(): void {
    if (!this.events) return;

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
