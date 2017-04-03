import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'c-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  public sales: any = [];

  public pieChartLabels:string[] = ['label 1', 'label 2', 'label 3'];
  public pieChartData:number[] = [75, 20, 5];
  public pieChartType:string = 'pie';

  public barChartOptions:any = {
    scaleShowVerticalLines: false,
    responsive: true
  };
  public barChartLabels:string[] = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
  public barChartType:string = 'bar';

  public barChartData:any[] = [
    {data: [2200, 1450, 1700, 1490, 2050, 1550], label: 'Label 1'}
  ];

  public chartColors:Array<any> = [
    {
      backgroundColor: '#4C91DE',
      borderColor: '#4C91DE',
      pointBackgroundColor: '#4C91DE',
      pointBorderColor: '#4C91DE',
      pointHoverBackgroundColor: '#4C91DE',
      pointHoverBorderColor: '#4C91DE'
    }
  ];

  public lineChartData:Array<any> = [
    {data: [65, 59, 80, 81, 56, 55, 40], label: 'Series A'},
    {data: [50, 65, 83, 70, 40, 45, 50], label: 'Series A'},
  ];
  public lineChartLabels:Array<any> = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];
  public lineChartOptions:any = {
    responsive: true
  };

  public lineChartType:string = 'line';
  public lineChartColors:Array<any> = [
    {
      backgroundColor: 'rgba(83,165,218, 0.5)',
      borderColor: 'rgba(83,165,218, 0.5)',
      pointBackgroundColor: 'rgba(83,165,218, 0.5)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(83,165,218, 0.5)'
    },
    {
      backgroundColor: 'rgba(158,231,252, 0.5)',
      borderColor: 'rgba(158,231,252, 0.5)',
      pointBackgroundColor: 'rgba(158,231,252, 0.5)',
      pointBorderColor: 'rgba(158,231,252, 0.5)',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: '#fff'
    }
  ];

  constructor() { }

  ngOnInit() {
    for (let i = 0; i < 10; i++) {
      let obj = {campaign: 'Campaign 32', product: 'MygoodProduct', link: 'www.goodproduct.com', rebill: 'Rebill - $49.44'};
      this.sales.push(obj);
    }
  }

}
