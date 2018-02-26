import {Component, OnInit, Input, Output, EventEmitter, ElementRef} from '@angular/core';

@Component({
  selector: 'table-density',
  templateUrl: './table-density.component.html',
  styleUrls: ['./table-density.component.scss'],
  host: {'(document:click)': 'onClick($event)'}
})
export class TableDensityComponent implements OnInit {

  @Input() small: boolean;
  @Input() density: number = 1;

  @Output() densityChanged: EventEmitter<number> = new EventEmitter();

  showMenu: boolean;

  constructor(private elementRef: ElementRef) { }

  ngOnInit() {}

  toggleMenu() {
    this.showMenu = !this.showMenu;
  }

  onClick(event): void {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      if (this.showMenu) {
        this.showMenu = false;
      }
    }
  }

  changed(density: number) {
    this.densityChanged.emit(density);

    this.showMenu = false;
  }

}
