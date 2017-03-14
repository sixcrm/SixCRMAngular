import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';

@Component({
  selector: 'entity-view-info',
  templateUrl: './entity-view-info.component.html',
  styleUrls: ['./entity-view-info.component.scss']
})
export class EntityViewInfoComponent implements OnInit {

  @Input()
  title: string;

  @Input()
  data: any[];

  @Input()
  options: any;

  @Input()
  optionsField: string;

  @Output()
  select: EventEmitter<any> = new EventEmitter<any>();

  show: boolean = true;

  constructor() { }

  ngOnInit() {
  }

  toggle(): void {
    this.show = !this.show;
  }

  selectOption(option): void {
    this.select.emit(option);
  }

}
