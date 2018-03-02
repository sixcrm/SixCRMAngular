import {Component, OnInit, Output, EventEmitter} from '@angular/core';
import {Role} from '../../../../shared/models/role.model';

@Component({
  selector: 'role-add-new',
  templateUrl: './role-add-new.component.html',
  styleUrls: ['./role-add-new.component.scss']
})
export class RoleAddNewComponent implements OnInit {

  role: Role = new Role({active: true});

  @Output() cancel: EventEmitter<boolean> = new EventEmitter();
  @Output() save: EventEmitter<Role> = new EventEmitter();

  formInvalid: boolean;

  constructor() {}

  ngOnInit() { }

  saveRole() {
    this.formInvalid = !this.role.name;

    if (this.formInvalid) return;

    this.save.emit(this.role)
  }
}
