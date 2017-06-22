import {Component, OnInit, OnDestroy} from '@angular/core';
import {User} from '../../../shared/models/user.model';
import {AbstractEntityViewComponent} from '../../abstract-entity-view.component';
import {ActivatedRoute} from '@angular/router';
import {ProgressBarService} from '../../../shared/services/progress-bar.service';
import {UsersService} from '../../../shared/services/users.service';
import {NavigationService} from '../../../navigation/navigation.service';

@Component({
  selector: 'user-view',
  templateUrl: './user-view.component.html',
  styleUrls: ['./user-view.component.scss']
})
export class UserViewComponent extends AbstractEntityViewComponent<User> implements OnInit, OnDestroy {

  constructor(service: UsersService, route: ActivatedRoute, progressBar: ProgressBarService, public navigation: NavigationService) {
    super(service, route, progressBar);
  }

  ngOnInit() {
    super.init();
  }

  ngOnDestroy() {
    this.destroy();
  }

}
