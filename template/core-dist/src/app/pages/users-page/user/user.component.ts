import {Component, OnInit} from '@angular/core';
import {User} from '../../../shared/models/user.model';
import {AbstractEntityComponent} from '../../abstract-entity-component';
import {ProgressBarService} from '../../../shared/services/progress-bar.service';
import {UsersService} from '../../../shared/services/users.service';
import {Role} from '../../../shared/models/role.model';
import {RolesService} from '../../../shared/services/roles.service';

@Component({
  selector: 'user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
})
export class UserComponent extends AbstractEntityComponent<User> implements OnInit {

  private email: string;
  private role: Role;
  private roles: Role[];
  private inviteSent: boolean = false;

  constructor(private usersService: UsersService, progressBarService: ProgressBarService, private rolesService: RolesService) {
    super(usersService, progressBarService, () => new User());
  }

  ngOnInit() {
    this.init();

    this.rolesService.entities$.subscribe((roles: Role[]) => this.roles = roles);
    this.rolesService.getEntities();
  }

  private setRole(role: Role): void {
    this.role = role;
  }

  private sendInvite(): void {
    if (this.email && this.role) {
      this.progressBarService.showTopProgressBar();
      this.usersService.sendUserInvite(this.email, this.role).subscribe((success: boolean) => {
        if (success) {
          this.inviteSent = true;
        }

        this.progressBarService.hideTopProgressBar();
      });
    }
  }
}
