import { Component, OnInit, Input } from '@angular/core';
import {AffiliateEvents} from '../../../shared/models/affiliate-events.model';
import {NavigationService} from '../../../navigation/navigation.service';

@Component({
  selector: 'affiliate-events',
  templateUrl: './affiliate-events.component.html',
  styleUrls: ['./affiliate-events.component.scss']
})
export class AffiliateEventsComponent implements OnInit {

  colors: string[] = ['#1773DD', '#4484CD', '#4DABF5', '#98DBF9', '#FFAD33', '#F1862F', '#329262', '#109618', '#66AA00', '#AAAA11', '#98DBF9'];
  affEvents: AffiliateEvents;

  otherCount = 0;
  otherPercentage = 0;

  @Input() maxNumber: number;

  @Input() title: string;
  @Input() subtitle: string;

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

    // every row + header + others
    return (this.getCount() + 2) * height + 'px';
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

    if (length > 0) {
      let count = 0;
      let percentage = 0;
      for (let i = 0; i < length; i++) {
        let perc = +affs[i].percentage.substr(0, affs[i].percentage.length - 1);
        data.push({name: affs[i].affiliate.substring(0, 8) + '...', y: perc, color: this.colors[i + 1]});

        count += affs[i].count;
        percentage += perc;
      }

      this.otherCount = count;
      this.otherPercentage = Math.round((100 - percentage) * 100) / 100;
      data.push({name: 'Other', y: this.otherPercentage, color: this.colors[0]});
    }
    return data;
  }

}
