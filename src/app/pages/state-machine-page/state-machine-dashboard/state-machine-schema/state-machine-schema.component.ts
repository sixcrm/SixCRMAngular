import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {StateMachineItem} from "../state-machine-item";

@Component({
  selector: 'state-machine-schema',
  templateUrl: './state-machine-schema.component.html',
  styleUrls: ['./state-machine-schema.component.scss']
})
export class StateMachineSchemaComponent implements OnInit {

  @Input() items: StateMachineItem[] = [];
  @Output() itemSelected: EventEmitter<StateMachineItem> = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

  select(item: StateMachineItem) {
    this.itemSelected.emit(item);
  }

}
