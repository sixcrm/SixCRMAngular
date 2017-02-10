import { Component, OnInit } from '@angular/core';
import {UsersService} from '../../../shared/services/users.service';
import {ActivatedRoute, Params} from '@angular/router';
import {User} from '../../../shared/models/user';
import {AbstractEntityViewComponent} from '../../abstract-entity-view.component';
import {ProgressBarService} from '../../../shared/services/progress-bar.service';

@Component({
  selector: 'c-user-view',
  templateUrl: './user-view.component.html',
  styleUrls: ['./user-view.component.scss']
})
export class UserViewComponent extends AbstractEntityViewComponent<User> implements OnInit {

  private user: User;

  constructor(private usersService: UsersService, route: ActivatedRoute, progressBarService: ProgressBarService) {
    super(usersService, route, progressBarService);
  }

  ngOnInit() {
    this.usersService.entity$.subscribe((data) => {
      this.user = data;
      this.progressBarService.hideTopProgressBar();
    });

    this.init();
  }

}
