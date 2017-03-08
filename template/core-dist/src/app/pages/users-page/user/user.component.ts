import {Component, OnInit} from '@angular/core';
import {User} from '../../../shared/models/user.model';
import {AbstractEntityComponent} from '../../abstract-entity-component';
import {ProgressBarService} from '../../../shared/services/progress-bar.service';
import {UsersService} from '../../../shared/services/users.service';

@Component({
  selector: 'user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
})
export class UserComponent extends AbstractEntityComponent<User> implements OnInit {

  constructor(usersService: UsersService, progressBarService: ProgressBarService) {
    super(usersService, progressBarService);
  }

  ngOnInit() {
    this.init();
  }
}
