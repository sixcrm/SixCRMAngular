import { Component, OnInit, Input } from '@angular/core';
import {AffiliateEvents} from '../../../shared/models/affiliate-events.model';
import {NavigationService} from '../../../navigation/navigation.service';

@Component({
  selector: 'affiliate-events',
  templateUrl: './affiliate-events.component.html',
  styleUrls: ['./affiliate-events.component.scss']
})
export class AffiliateEventsComponent implements OnInit {

  colors: string[] = ['#1773DD', '#4484CD', '#4DABF5', '#98DBF9', '#FFAD33', '#F1862F', '#329262', '#109618', '#66AA00', '#AAAA11'];
  affEvents: AffiliateEvents;

  @Input() maxNumber: number;

  @Input() set affiliateEvents(events: AffiliateEvents) {
    if (events) {
      this.affEvents = events;
      if (this.chartInstance) {
        this.redrawChartData();
      }
    }
  }

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

  chartInstance;

  constructor(private navigation: NavigationService) { }

  ngOnInit() {
  }

  toggleTable(): void {
    this.showTable = !this.showTable;
  }

  calculateHeight(): string {
    let height = 46;
    if (!this.navigation.isDesktop()) {
      height = 34;
    }

    // every row + header
    return (this.getCount() + 1) * height + 'px';
  }

  saveChart(chartInstance): void {
    this.chartInstance = chartInstance;

    if (this.affEvents) {
      this.redrawChartData();
    }
  }

  getCount(): number {
    if (!this.affEvents) return 0;

    let affLength = this.affEvents.affiliates.length;
    if (!this.maxNumber) return affLength;

    return affLength <= this.maxNumber ? affLength : this.maxNumber;
  }

  calculateRelativePercentage(affiliate): string {
    let percentage = (affiliate.count / this.affEvents.count) * 100;

    return Math.round( percentage * 100 ) / 100 + '%';
  }

  private redrawChartData(): void {
    this.chartInstance.series[0].update({data: this.parseData()}, true);
  }

  private parseData(): any[] {
    if (!this.affEvents) return [];

    let data = [];
    let affs = this.affEvents.affiliates;
    let length = affs.length <= this.maxNumber ? affs.length : this.maxNumber;

    for (let i = 0 ; i < length; i++) {
      data.push({name: affs[i].affiliate.substring(0, 8) + '...', y: affs[i].count, color: this.colors[i]});
    }

    return data;
  }

}
