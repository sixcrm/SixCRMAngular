import {Component, OnInit, EventEmitter, Input, Output} from '@angular/core';
import {Modes} from '../../../abstract-entity-view.component';
import {SmtpProvider} from '../../../../shared/models/smtp-provider.model';
import {isAllowedNumeric} from '../../../../shared/utils/form.utils';

@Component({
  selector: 'smtp-provider-add-new',
  templateUrl: './smtp-provider-add-new.component.html',
  styleUrls: ['./smtp-provider-add-new.component.scss']
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

  constructor() { }

  ngOnInit() {
  }

  enterEditMode() {
    this.changeMode.emit(this.modes.Update);
    this.entity.username = '';
    this.entity.password = '';
  }

  saveProvider(value: boolean): void {
    this.formInvalid = !value;
    if (this.formInvalid) return;

    this.save.emit(this.entity);
  }

}
