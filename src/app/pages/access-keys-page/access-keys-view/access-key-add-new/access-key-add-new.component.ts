import {Component, OnInit, EventEmitter, Input, Output} from '@angular/core';
import {AccessKey} from '../../../../shared/models/access-key.model';
import {Modes} from '../../../abstract-entity-view.component';

@Component({
  selector: 'access-key-add-new',
  templateUrl: './access-key-add-new.component.html',
  styleUrls: ['./access-key-add-new.component.scss']
})
export class AccessKeyAddNewComponent implements OnInit {

  @Input() entity: AccessKey;
  @Input() mode: Modes;

  @Output() cancel: EventEmitter<boolean> = new EventEmitter();
  @Output() save: EventEmitter<Account> = new EventEmitter();
  @Output() changeMode: EventEmitter<Modes> = new EventEmitter();

  modes = Modes;
  formInvalid: boolean;

  constructor() {}

  ngOnInit() {}

  saveAccessKey(valid) {
    this.formInvalid = !valid;
    if (this.formInvalid) return;

    this.save.emit(this.entity);
  }

}
