import {Component, OnInit, EventEmitter, Input, Output} from '@angular/core';
import {Modes} from '../../../abstract-entity-view.component';
import {Account} from '../../../../shared/models/account.model';

@Component({
  selector: 'account-add-new',
  templateUrl: './account-add-new.component.html',
  styleUrls: ['./account-add-new.component.scss']
})
export class AccountAddNewComponent implements OnInit {

  @Input() entity: Account;
  @Input() mode: Modes;
  @Input() editEnabled: boolean = true;
  @Input() actingAsEnabled: boolean = false;

  @Output() cancel: EventEmitter<boolean> = new EventEmitter();
  @Output() save: EventEmitter<Account> = new EventEmitter();
  @Output() actAs: EventEmitter<boolean> = new EventEmitter();
  @Output() changeMode: EventEmitter<Modes> = new EventEmitter();

  modes = Modes;
  formInvalid: boolean;

  constructor() {}

  ngOnInit() {}

  saveAccount() {
    this.formInvalid = !this.entity || !this.entity.name;
    if (this.formInvalid) return;

    this.save.emit(this.entity);
  }
}
