import {Component, OnInit, OnDestroy} from '@angular/core';
import {EventFunnel} from '../../../shared/models/event-funnel.model';
import {NavigationService} from '../../../navigation/navigation.service';
import {AbstractDashboardItem} from '../abstract-dashboard-item.component';
import {AnalyticsService} from '../../../shared/services/analytics.service';
import {CustomServerError} from '../../../shared/models/errors/custom-server-error';

const hc = require('highcharts');

@Component({
  selector: 'funnel-graph',
  templateUrl: './funnel-graph.component.html',
  styleUrls: ['./funnel-graph.component.scss']
})
export class FunnelGraphComponent extends AbstractDashboardItem implements OnInit, OnDestroy {

  colors = ['#4383CC', '#4DABF5', '#9ADDFB', '#FDAB31', '#F28933'];

  chartOptions: any = {
    title: { text: null },
    credits: { enabled: false },
    chart: { type: 'solidgauge', marginTop: 50 },
    tooltip: {
      borderWidth: 0,
      backgroundColor: 'none',
      shadow: false,
      style: { fontSize: '16px' },
      pointFormat: '{series.name}<br><span style="font-size:2em; color: {point.color}; font-weight: bold">{point.y}%</span>',
      positioner: function (labelWidth) {
        return {
          x: 305 - labelWidth / 2,
          y: 180
        };
      }
    },

    pane: {
      startAngle: 0,
      endAngle: 360,
      background: [{ // Track for Move
        outerRadius: '112%',
        innerRadius: '98%',
        backgroundColor: hc.Color(this.colors[0]).setOpacity(0.3).get(),
        borderWidth: 0
      }, {
        outerRadius: '97%',
        innerRadius: '83%',
        backgroundColor: hc.Color(this.colors[1]).setOpacity(0.3).get(),
        borderWidth: 0
      }, {
        outerRadius: '82%',
        innerRadius: '68%',
        backgroundColor: hc.Color(this.colors[2]).setOpacity(0.3).get(),
        borderWidth: 0
      }, {
        outerRadius: '67%',
        innerRadius: '53%',
        backgroundColor: hc.Color(this.colors[3]).setOpacity(0.3).get(),
        borderWidth: 0
      },{
        outerRadius: '52%',
        innerRadius: '38%',
        backgroundColor: hc.Color(this.colors[4]).setOpacity(0.3).get(),
        borderWidth: 0
      }]
    },

    yAxis: { min: 0, max: 100, lineWidth: 0, tickPositions: [] },

    plotOptions: {
      solidgauge: {
        dataLabels: {
          enabled: false
        },
        linecap: 'round',
        stickyTracking: false,
        rounded: true
      }
    },

    series: [
      {
        name: 'Clicks',
        data: [{ color: this.colors[0], radius: '112%', innerRadius: '98%', y: 0}]
      },
      {
        name: 'Leads',
        data: [{ color: this.colors[1], radius: '97%', innerRadius: '83%', y: 0 }]
      },
      {
        name: 'Mains',
        data: [{ color: this.colors[2], radius: '82%', innerRadius: '68%', y: 0 }]
      },
      {
        name: 'Upsells',
        data: [{ color: this.colors[3], radius: '67%', innerRadius: '53%', y: 0 }]
      },
      {
        name: 'Confirms',
        data: [{ color: this.colors[4], radius: '52%', innerRadius: '38%', y: 0 }]
      }
    ]
  };

  chart;
  funnel: EventFunnel;
  showTable: boolean = true;

  constructor(private navigation: NavigationService, private analyticsService: AnalyticsService) {
    super();
  }

  ngOnInit() {
    this.analyticsService.eventFunnel$.takeUntil(this.unsubscribe$).subscribe((funnel: EventFunnel | CustomServerError) => {
      if (funnel instanceof CustomServerError) {
        this.serverError = funnel;
        this.funnel = null;
        return;
      }

      this.serverError = null;
      this.funnel = funnel;

      if (this.chart && this.funnel) {
        this.redrawChartData();
      }
    })
  }

  ngOnDestroy() {
    this.destroy();
  }

  refresh(): void {
    this.shouldFetch = true;
    this.serverError = null;
    this.fetch();
  }

  fetch(): void {
    if (this.shouldFetch) {
      this.analyticsService.getEventFunnel(this.start.format(), this.end.format());
      this.shouldFetch = false;
    }
  }

  download(format: string): void {
    this.analyticsService.getEventFunnel(this.start.format(), this.end.format(), format);
  }

  saveChart(chartInstance): void {
    this.chart = chartInstance;

    if (this.funnel) {
      this.redrawChartData();
    }
  }

  toggleTable(): void {
    this.showTable = !this.showTable;
  }

  calculateHeight(): string {
    let height = 46;
    if (!this.navigation.isDesktop()) {
      height = 34;
    }

    // funnel graph has 5 rows + header + some extra space between button and data
    return 7 * height + 'px';
  }

  redrawChartData(): void {
    this.chart.series[0].points[0].update(this.funnel.click.percentage, true);
    this.chart.series[1].points[0].update(this.funnel.lead.percentage, true);
    this.chart.series[2].points[0].update(this.funnel.main.percentage, true);
    this.chart.series[3].points[0].update(this.funnel.upsell.percentage, true);
    this.chart.series[4].points[0].update(this.funnel.confirm.percentage, true);
  }
}
