import {Component, OnInit, OnDestroy} from '@angular/core';
import {EventsBy} from '../../../shared/models/analytics/events-by.model';
import {NavigationService} from '../../../navigation/navigation.service';
import {AbstractDashboardItem} from '../abstract-dashboard-item.component';
import {AnalyticsService} from '../../../shared/services/analytics.service';
import {CustomServerError} from '../../../shared/models/errors/custom-server-error';

@Component({
  selector: 'events-by',
  templateUrl: './events-by.component.html',
  styleUrls: ['./events-by.component.scss']
})
export class EventsByComponent extends AbstractDashboardItem implements OnInit, OnDestroy {

  colors: string[] = ['#1773DD', '#4484CD', '#4DABF5', '#98DBF9', '#FFAD33', '#F1862F', '#329262', '#109618', '#66AA00', '#AAAA11', '#98DBF9'];

  maxNumber = 5;

  showTable: boolean = true;

  options = {
    chart: {
      plotBackgroundColor: null,
      plotBorderWidth: null,
      plotShadow: false,
      type: 'pie'
    },
    title: {
      text: null
    },
    credits: {
      enabled: false
    },
    tooltip: {
      pointFormat: '{series.name}: {point.percentage:.2f}%'
    },
    plotOptions: {
      pie: {
        allowPointSelect: true,
        cursor: 'pointer',
        dataLabels: {
          enabled: true,
          format: '{point.name}: {point.percentage:.2f} %',
          style: {
            color: 'black',
            fontSize: 11,
            fontWeight: 400
          }
        }
      }
    },
    series: [{
      name: 'Percentage',
      colorByPoint: true,
      data: []
    }]
  };

  loaderOptions = {
    chart: {
      plotBackgroundColor: null,
      plotBorderWidth: null,
      plotShadow: false,
      type: 'pie'
    },
    title: {
      text: null
    },
    credits: {
      enabled: false
    },
    plotOptions: {
      pie: {
        allowPointSelect: true,
        cursor: 'pointer',
        dataLabels: {
          enabled: false,
        }
      }
    },
    series: [{
      name: 'Percentage',
      colorByPoint: true,
      data: [
        {name: '', y: 40, color: '#C3C3C3'},
        {name: '', y: 25, color: '#CBCBCB'},
        {name: '', y: 15, color: '#D8D8D8'},
        {name: '', y: 12, color: '#ECECEC'},
        {name: '', y: 8, color: '#E2E2E2'}
      ]
    }]
  };

  chartInstance;
  eventsBy: EventsBy;

  constructor(private analyticsService: AnalyticsService, private navigation: NavigationService) {
    super();
  }

  ngOnInit() {
    this.analyticsService.eventsBy$.takeUntil(this.unsubscribe$).subscribe(events => {
      if (events instanceof CustomServerError) {
        this.loading = false;
        this.eventsBy = null;
        this.serverError = events;
        return;
      }

      this.serverError = null;
      this.eventsBy = events;
      if (this.chartInstance) {
        this.redrawChartData();
      }

      this.loading = false;
    })
  }

  ngOnDestroy() {
    this.destroy();
  }

  toggleTable(): void {
    this.showTable = !this.showTable;
  }

  refreshData() {
    this.shouldFetch = true;
    this.serverError = null;
    this.fetch();
  }

  fetch(): void {
    if (this.shouldFetch) {
      this.loading = true;
      this.analyticsService.getEventsBy(this.start.format(), this.end.format());
      this.shouldFetch = false;
    }
  }

  download(format: string): void {
    this.analyticsService.getEventsBy(this.start.format(), this.end.format(), format);
  }

  calculateHeight(): string {
    let height = 46;
    if (!this.navigation.isDesktop()) {
      height = 34;
    }

    // every row + header + others + none
    return (this.getCount() + 3) * height + 'px';
  }

  saveChart(chartInstance): void {
    this.chartInstance = chartInstance;

    if (this.eventsBy) {
      this.redrawChartData();
    }
  }

  getCount(): number {
    if (!this.eventsBy) return 0;

    let length = this.eventsBy.facets.length;
    if (!this.maxNumber) return length;

    return length <= this.maxNumber ? length : this.maxNumber;
  }

  private redrawChartData(): void {
    this.chartInstance.series[0].update({data: this.parseData()}, true);
  }

  private parseData(): any[] {
    if (!this.eventsBy) return [];

    let data = [];

    for (let i = 0; i < this.eventsBy.facets.length; i++) {
      let f = this.eventsBy.facets[i];

      data.push({name: f.facet.substring(0, 8) + '...', y: +f.count, color: this.colors[i]})
    }

    return data;
  }

}
