import {Component, OnInit, Input} from '@angular/core';

@Component({
  selector: 'table-loader',
  templateUrl: './table-loader.component.html',
  styleUrls: ['./table-loader.component.scss']
})
export class TableLoaderComponent implements OnInit {

  @Input() numberOfRows: number = 3;
  @Input() rowMarginVertical: number = 12;
  @Input() rowMarginHorizontal: number = 12;
  @Input() rowHeight: number = 16;

  rows: number[];

  constructor() { }

  ngOnInit() {
    this.rows = new Array(this.numberOfRows);
  }

}
