import {Component, OnInit, OnDestroy} from '@angular/core';
import {EventSummary} from '../../../shared/models/event-summary.model';
import {Observable} from 'rxjs';
import {AnalyticsService} from '../../../shared/services/analytics.service';
import {AbstractDashboardItem} from '../abstract-dashboard-item.component';
import {CustomServerError} from '../../../shared/models/errors/custom-server-error';
import {TranslationService} from '../../../translation/translation.service';
import {AuthenticationService} from '../../../authentication/authentication.service';

@Component({
  selector: 'events-summary',
  templateUrl: './events-summary.component.html',
  styleUrls: ['./events-summary.component.scss']
})
export class EventsSummaryComponent extends AbstractDashboardItem implements OnInit, OnDestroy {

  colors = ['#4383CC', '#4DABF5', '#9ADDFB', '#FDAB31', '#F28933'];
  loaderColors = ['#C3C3C3', '#CBCBCB', '#D8D8D8', '#ECECEC', '#E2E2E2'];

  chartInstance;
  events: EventSummary[];
  loaded: boolean = false;

  options;
  loaderOptions;

  constructor(
    private analyticsService: AnalyticsService,
    private translationService: TranslationService,
    private authService: AuthenticationService
  ) {
    super();

    if (this.authService.getUserSettings().language) {
      this.initCharts();
    } else {
      this.authService.userSettings$.take(1).subscribe(settings => this.initCharts());
    }

  };

  initCharts() {

    this.options = {
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
          text: this.translationService.translate('DASHBOARD_EVENTSUMMARY_EVENTS')
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
        { name: this.translationService.translate('DASHBOARD_EVENTSUMMARY_CONFIRM'), color: this.colors[4] },
        { name: this.translationService.translate('DASHBOARD_EVENTSUMMARY_UPSELL'), color: this.colors[3] },
        { name: this.translationService.translate('DASHBOARD_EVENTSUMMARY_ORDER'), color: this.colors[2] },
        { name: this.translationService.translate('DASHBOARD_EVENTSUMMARY_LEAD'), color: this.colors[1] },
        { name: this.translationService.translate('DASHBOARD_EVENTSUMMARY_CLICK'), color: this.colors[0] }
      ]
    };

    this.loaderOptions  = {
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
          text: this.translationService.translate('DASHBOARD_EVENTSUMMARY_EVENTS')
        },
        labels: {
          enabled: false
        }
      },
      xAxis: {
        labels: {
          enabled: false
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
        { name: this.translationService.translate('DASHBOARD_EVENTSUMMARY_CONFIRM'), color: this.loaderColors[4] },
        { name: this.translationService.translate('DASHBOARD_EVENTSUMMARY_UPSELL'), color: this.loaderColors[3] },
        { name: this.translationService.translate('DASHBOARD_EVENTSUMMARY_ORDER'), color: this.loaderColors[2] },
        { name: this.translationService.translate('DASHBOARD_EVENTSUMMARY_LEAD'), color: this.loaderColors[1] },
        { name: this.translationService.translate('DASHBOARD_EVENTSUMMARY_CLICK'), color: this.loaderColors[0] }
      ]
    };

  }

  ngOnInit() {
    this.analyticsService.eventsSummary$.takeUntil(this.unsubscribe$).subscribe(events => {
      if (events instanceof CustomServerError) {
        this.serverError = events;
        this.events = null;
        this.loaded = true;
        return;
      }

      this.serverError = null;
      this.events = events;
      this.redraw();
    })
  }

  ngOnDestroy() {
    this.destroy();
  }

  refreshData() {
    this.shouldFetch = true;
    this.serverError = null;
    this.fetch();
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
