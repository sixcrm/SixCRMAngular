import {Component, OnInit, OnDestroy} from '@angular/core';
import {User} from '../../shared/models/user.model';
import {UsersService} from '../../shared/services/users.service';
import {AbstractEntityIndexComponent} from '../abstract-entity-index.component';
import {MdDialog} from '@angular/material';
import {ProgressBarService} from '../../shared/services/progress-bar.service';
import {PaginationService} from '../../shared/services/pagination.service';
import {AuthenticationService} from '../../authentication/authentication.service'
import {ActivatedRoute, Router} from '@angular/router';
import {ColumnParams} from '../../shared/models/column-params.model';

@Component({
  selector: 'c-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
})
export class UsersComponent extends AbstractEntityIndexComponent<User> implements OnInit, OnDestroy {

  constructor(
    usersService: UsersService,
    auth: AuthenticationService,
    dialog: MdDialog,
    progressBarService: ProgressBarService,
    paginationService: PaginationService,
    router: Router,
    activatedRoute: ActivatedRoute
  ) {
    super(usersService, auth, dialog, progressBarService, paginationService, router, activatedRoute);

    this.columnParams = [
      new ColumnParams('Name', (e) => e.name),
      new ColumnParams('Email',(e) => e.email),
      new ColumnParams('Active', (e) => e.active),
      new ColumnParams('Terms and Conditions', (e) => e.termsAndConditions)
    ];
  }

  ngOnInit() {
    this.init();
  }

  ngOnDestroy() {
    this.destroy();
  }
}
