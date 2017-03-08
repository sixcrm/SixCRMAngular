import {Component, OnInit} from '@angular/core';
import {User} from '../../shared/models/user.model';
import {UsersService} from '../../shared/services/users.service';
import {AbstractEntityIndexComponent} from '../abstract-entity-index.component';
import {MdDialog} from '@angular/material';
import {ProgressBarService} from '../../shared/services/progress-bar.service';
import {PaginationService} from '../../shared/services/pagination.service';
import {AuthenticationService} from '../../authentication/authentication.service'

@Component({
  selector: 'c-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
})
export class UsersComponent extends AbstractEntityIndexComponent<User> implements OnInit {

  constructor(
    private usersService: UsersService,
    auth: AuthenticationService,
    dialog: MdDialog,
    progressBarService: ProgressBarService,
    paginationService: PaginationService
  ) {
    super(usersService, auth, dialog, progressBarService, paginationService);
  }

  ngOnInit() {
    this.usersService.entityDeleted$.subscribe(() =>{
      this.usersService.getEntities();
    });
    this.authService.activeAclChanged$.subscribe(() => {
      this.resetEntities();
      this.usersService.getEntities(this.limit);
    });

    this.init();
  }
}
