import {Component, OnInit, OnDestroy} from '@angular/core';
import {NavigationService} from '../../../navigation/navigation.service';
import {AbstractDashboardItem} from '../abstract-dashboard-item.component';
import {AnalyticsService} from '../../../shared/services/analytics.service';
import {TransactionsBy} from '../../../shared/models/analytics/transaction-by.model';

@Component({
  selector: 'transaction-by',
  templateUrl: './transaction-by.component.html',
  styleUrls: ['./transaction-by.component.scss']
})
export class TransactionByComponent extends AbstractDashboardItem implements OnInit, OnDestroy {

  colors: string[] = ['#1773DD', '#4484CD', '#4DABF5', '#98DBF9', '#FFAD33', '#F1862F', '#329262', '#109618', '#66AA00', '#AAAA11', '#98DBF9'];
  transactionBy: TransactionsBy;

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

  chartInstance;

  constructor(private navigation: NavigationService, private analyticsService: AnalyticsService) {
    super();
  }

  ngOnInit() {
    this.analyticsService.transactionsBy$.takeUntil(this.unsubscribe$).subscribe(events => {
      this.transactionBy = events;
      if (this.chartInstance) {
        this.redrawChartData();
      }
    })
  }

  ngOnDestroy() {
    this.destroy();
  }

  toggleTable(): void {
    this.showTable = !this.showTable;
  }

  fetch(): void {
    if (this.shouldFetch) {
      this.analyticsService.getTransactionsBy(this.start.format(), this.end.format());
      this.shouldFetch = false;
    }
  }

  download(format: string): void {
    this.analyticsService.getTransactionsBy(this.start.format(), this.end.format(), format);
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

    if (this.transactionBy) {
      this.redrawChartData();
    }
  }

  getCount(): number {
    if (!this.transactionBy) return 0;

    let affLength = this.transactionBy.facets.length;
    if (!this.maxNumber) return affLength;

    return affLength <= this.maxNumber ? affLength : this.maxNumber;
  }

  private redrawChartData(): void {
    this.chartInstance.series[0].update({data: this.parseData()}, true);
  }

  private parseData(): any[] {
    if (!this.transactionBy) return [];

    let data = [];

    for (let i = 0; i < this.transactionBy.facets.length; i++) {
      let f = this.transactionBy.facets[i];

      data.push({name: f.facet.substring(0, 8) + '...', y: +f.amount.amount, color: this.colors[i]})
    }

    return data;
  }

}
