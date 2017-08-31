import {Component, OnInit, OnDestroy} from '@angular/core';
import {AbstractEntityViewComponent} from '../../abstract-entity-view.component';
import {Account} from '../../../shared/models/account.model';
import {ActivatedRoute} from '@angular/router';
import {AccountsService} from '../../../shared/services/accounts.service';
import {NavigationService} from '../../../navigation/navigation.service';

@Component({
  selector: 'account-view',
  templateUrl: './account-view.component.html',
  styleUrls: ['./account-view.component.scss']
})
export class AccountViewComponent extends AbstractEntityViewComponent<Account> implements OnInit, OnDestroy {

  formInvalid: boolean;

  constructor(service: AccountsService, route: ActivatedRoute, public navigation: NavigationService) {
    super(service, route);
  }

  ngOnInit() {
    super.init(() => this.navigation.goToNotFoundPage());

    if (this.addMode) {
      this.entity = new Account();
      this.entity.active = 'true';
      this.entityBackup = this.entity.copy();
    }
  }

  ngOnDestroy() {
    this.destroy();
  }

  saveAccount(valid: boolean) {
    this.formInvalid = !valid;
    if (this.formInvalid) return;

    this.saveOrUpdate(this.entity);
  }


}
