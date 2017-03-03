import {Component, OnInit, OnDestroy} from '@angular/core';
import {UsersService} from '../../../shared/services/users.service';
import {ActivatedRoute, Params} from '@angular/router';
import {User} from '../../../shared/models/user.model';
import {AbstractEntityViewComponent} from '../../abstract-entity-view.component';
import {ProgressBarService} from '../../../shared/services/progress-bar.service';

@Component({
  selector: 'c-user-view',
  templateUrl: './user-view.component.html',
  styleUrls: ['./user-view.component.scss']
})
export class UserViewComponent extends AbstractEntityViewComponent<User> implements OnInit, OnDestroy {

  private user: User;

  constructor(private usersService: UsersService, route: ActivatedRoute, progressBarService: ProgressBarService) {
    super(usersService, route, progressBarService);
  }

  ngOnInit() {
    if (this.addMode) {
      this.entity = new User();
    }

    this.init();
  }

  ngOnDestroy() {
    this.destroy();
  }

}
