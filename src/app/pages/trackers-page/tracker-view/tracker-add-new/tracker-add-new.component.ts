import {Component, OnInit, Input, Output, ViewChild, EventEmitter} from '@angular/core';
import {Modes} from '../../../abstract-entity-view.component';
import {Tracker} from '../../../../shared/models/tracker.model';
import {CodemirrorComponent} from 'ng2-codemirror';
import {firstIndexOf} from '../../../../shared/utils/array.utils';

@Component({
  selector: 'tracker-add-new',
  templateUrl: './tracker-add-new.component.html',
  styleUrls: ['./tracker-add-new.component.scss']
})
export class TrackerAddNewComponent implements OnInit {

  @ViewChild(CodemirrorComponent) codemirrorComponent: CodemirrorComponent;

  @Input() entity: Tracker;
  @Input() mode: Modes;

  @Output() cancel: EventEmitter<boolean> = new EventEmitter();
  @Output() save: EventEmitter<Tracker> = new EventEmitter();
  @Output() changeMode: EventEmitter<Modes> = new EventEmitter();

  modes = Modes;
  formInvalid: boolean;

  config = {
    lineNumbers: true,
    mode: {
      name: "htmlmixed"
    },
    readOnly: true
  };

  constructor() {}

  ngOnInit() {}

  cancelEdit(): void {
    if (this.codemirrorComponent) {
      this.codemirrorComponent.instance.setOption('readOnly', true);
    }
    this.cancel.emit(true);
  }

  enableEdit(): void {
    this.changeMode.emit(this.modes.Update);

    if (this.codemirrorComponent) {
      this.codemirrorComponent.instance.setOption('readOnly', false);
    }
  }

  setType(type: string): void {
    this.entity.type = type;
    this.codemirrorComponent.instance.setOption('readOnly', false);
  }

  removeEventType(type: string): void {
    let index = firstIndexOf(this.entity.eventType, (el) => el === type);

    if (index >= 0) {
      this.entity.eventType.splice(index, 1);
    }
  }

  addEventType(type: string): void {
    if (firstIndexOf(this.entity.eventType, (el) => el === type) === -1) {
      this.entity.eventType.push(type);
    }
  }

  copyUrlToClipboard(urlField): void {
    urlField.select();
    document.execCommand('copy');
  }

  saveTracker(): void {
    this.formInvalid = !this.entity.name || !this.entity.body;
    if (this.formInvalid) return;

    this.save.emit(this.entity);
  }
}
