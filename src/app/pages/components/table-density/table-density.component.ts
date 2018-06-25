import {Component, OnInit, Input, Output, EventEmitter, ElementRef} from '@angular/core';

@Component({
  selector: 'table-density',
  templateUrl: './table-density.component.html',
  styleUrls: ['./table-density.component.scss']
})
export class TableDensityComponent implements OnInit {

  @Input() small: boolean;
  @Input() density: number = 1;

  @Output() densityChanged: EventEmitter<number> = new EventEmitter();

  constructor(private elementRef: ElementRef) { }

  ngOnInit() {}

  changed(density: number) {
    this.densityChanged.emit(density);
  }

}
