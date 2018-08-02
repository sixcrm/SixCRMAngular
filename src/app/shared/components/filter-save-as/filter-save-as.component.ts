import {Component, OnInit, Output, EventEmitter} from '@angular/core';

@Component({
  selector: 'filter-save-as',
  templateUrl: './filter-save-as.component.html',
  styleUrls: ['./filter-save-as.component.scss']
})
export class FilterSaveAsComponent implements OnInit {

  @Output() back: EventEmitter<boolean> = new EventEmitter();
  @Output() saveAs: EventEmitter<{name: string, apply: boolean}> = new EventEmitter();

  name: string;
  apply: boolean = true;

  constructor() { }

  ngOnInit() {
  }

  save() {
    if (this.name) {
      this.saveAs.emit({name: this.name, apply: this.apply});
    }
  }

}
