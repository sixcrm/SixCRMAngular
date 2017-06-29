import {Component, OnInit, OnDestroy} from '@angular/core';
import {User} from '../../../shared/models/user.model';
import {AbstractEntityViewComponent} from '../../abstract-entity-view.component';
import {ActivatedRoute} from '@angular/router';
import {UsersService} from '../../../shared/services/users.service';
import {NavigationService} from '../../../navigation/navigation.service';

@Component({
  selector: 'user-view',
  templateUrl: './user-view.component.html',
  styleUrls: ['./user-view.component.scss']
})
export class UserViewComponent extends AbstractEntityViewComponent<User> implements OnInit, OnDestroy {

  selectedIndex: number = 0;
  formInvalid: boolean;

  constructor(service: UsersService, route: ActivatedRoute, public navigation: NavigationService) {
    super(service, route);
  }

  ngOnInit() {
    super.init(() => this.navigation.goToNotFoundPage());

    if (this.addMode) {
      this.entity = new User();
      this.entity.active = 'true';
      this.entity.termsAndConditions = '0.1';
      this.entityBackup = this.entity.copy();
    }
  }

  ngOnDestroy() {
    this.destroy();
  }

  setIndex(value: number) {
    this.selectedIndex = value;
  }

  saveUser(valid: boolean) {
    if (this.addMode) {
      this.formInvalid = !valid;
      if (this.formInvalid) return;

      this.entity.id = this.entity.email;
      this.entity.auth0Id = this.entity.email;
    }
    this.formInvalid = false;

    this.saveOrUpdate(this.entity);
  }

}
