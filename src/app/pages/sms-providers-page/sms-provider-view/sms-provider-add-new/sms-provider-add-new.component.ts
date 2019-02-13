import {Component, OnInit, EventEmitter, Input, Output} from '@angular/core';
import {Modes} from '../../../abstract-entity-view.component';
import {SmsProvider} from '../../../../shared/models/sms-provider.model';

@Component({
  selector: 'sms-provider-add-new',
  templateUrl: './sms-provider-add-new.component.html',
  styleUrls: ['./sms-provider-add-new.component.scss'],
  host: {'(document:keydown)':'onKeyDown($event)'}
})
export class SmsProviderAddNewComponent implements OnInit {

  @Input() entity: SmsProvider;
  @Input() mode: Modes;

  @Output() cancel: EventEmitter<boolean> = new EventEmitter();
  @Output() save: EventEmitter<SmsProvider> = new EventEmitter();
  @Output() changeMode: EventEmitter<Modes> = new EventEmitter();

  modes = Modes;
  formInvalid: boolean;

  constructor() { }

  ngOnInit() { }

  enterEditMode() {
    this.changeMode.emit(this.modes.Update);
  }

  saveProvider(value: boolean): void {
    this.formInvalid = !value;
    if (this.formInvalid) return;

    this.save.emit(this.entity);
  }

  onKeyDown(key) {
    if (key && key.key === 'Escape') {
      this.cancel.emit(true);
    }
  }
}
