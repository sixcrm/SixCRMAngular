import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {Modes} from '../../../abstract-entity-view.component';
import {EventHook} from '../../../../shared/models/event-hook.model';

@Component({
  selector: 'event-hook-add-new',
  templateUrl: './event-hook-add-new.component.html',
  styleUrls: ['./event-hook-add-new.component.scss']
})
export class EventHookAddNewComponent implements OnInit {

  @Input() entity: EventHook;
  @Input() mode: Modes;
  @Input() shared: boolean;

  @Output() cancel: EventEmitter<boolean> = new EventEmitter();
  @Output() save: EventEmitter<EventHook> = new EventEmitter();
  @Output() changeMode: EventEmitter<Modes> = new EventEmitter();

  modes = Modes;
  formInvalid: boolean;
  types: string[] = ['test','click','lead','order','confirm'];

  constructor() { }

  ngOnInit() {}

  saveEventHook() {
    this.formInvalid = !this.entity.name || !this.entity.eventType;

    if (this.formInvalid) return;

    this.save.emit(this.entity);
  }
}
