import {Component, OnInit, Input, EventEmitter, Output, ElementRef} from '@angular/core';
import {ColumnParams} from '../../../shared/models/column-params.model';

@Component({
  selector: 'table-preferences',
  templateUrl: './table-preferences.component.html',
  styleUrls: ['./table-preferences.component.scss'],
  host: {'(document:click)': 'onClick($event)'}
})
export class TablePreferencesComponent implements OnInit {

  @Input() columnParams: ColumnParams<any>[] = [];

  @Output() changed: EventEmitter<boolean> = new EventEmitter();

  showParams: boolean;

  constructor(private elementRef: ElementRef) { }

  ngOnInit() {
  }

  toggleParams() {
    this.showParams = !this.showParams;

    if (!this.showParams) {
      this.changed.emit(false);
    }
  }

  cancel() {
    this.showParams = false;

    this.changed.emit(false);
  }

  apply() {
    this.showParams = false;

    this.changed.emit(true);
  }

  onClick(event): void {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      if (this.showParams) {
        this.cancel();
      }
    }
  }
}
