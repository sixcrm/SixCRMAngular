import {Component, OnInit, EventEmitter, Input, Output} from '@angular/core';
import {Modes} from '../../../abstract-entity-view.component';
import {SmtpProvider} from '../../../../shared/models/smtp-provider.model';
import {isAllowedNumeric, isValidEmail} from '../../../../shared/utils/form.utils';

@Component({
  selector: 'smtp-provider-add-new',
  templateUrl: './smtp-provider-add-new.component.html',
  styleUrls: ['./smtp-provider-add-new.component.scss'],
  host: {'(document:keydown)':'onKeyDown($event)'}
})
export class SmtpProviderAddNewComponent implements OnInit {

  @Input() entity: SmtpProvider;
  @Input() mode: Modes;

  @Output() cancel: EventEmitter<boolean> = new EventEmitter();
  @Output() save: EventEmitter<SmtpProvider> = new EventEmitter();
  @Output() changeMode: EventEmitter<Modes> = new EventEmitter();

  modes = Modes;
  formInvalid: boolean;
  isNumeric = isAllowedNumeric;

  validEmail = isValidEmail;

  constructor() { }

  ngOnInit() {
  }

  enterEditMode() {
    this.changeMode.emit(this.modes.Update);
  }

  saveProvider(value: boolean): void {
    this.formInvalid = !value || this.entity.password.length < 3 || !this.validEmail(this.entity.fromEmail);
    if (this.formInvalid) return;

    this.save.emit(this.entity);
  }

  onKeyDown(key) {
    if (key && key.key === 'Escape') {
      this.cancel.emit(true);
    }
  }
}
