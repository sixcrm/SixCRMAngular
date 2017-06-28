import {Component, OnInit, OnDestroy} from '@angular/core';
import {MdDialog} from '@angular/material';
import {ActivatedRoute, Router} from '@angular/router';
import {AbstractEntityIndexComponent} from '../../abstract-entity-index.component';
import {AccessKey} from '../../../shared/models/access-key.model';
import {AccessKeysService} from '../../../shared/services/access-keys.service';
import {AuthenticationService} from '../../../authentication/authentication.service';
import {PaginationService} from '../../../shared/services/pagination.service';

@Component({
  selector: 'c-access-keys',
  templateUrl: './access-keys.component.html',
  styleUrls: ['./access-keys.component.scss']
})
export class AccessKeysComponent extends AbstractEntityIndexComponent<AccessKey> implements OnInit, OnDestroy {

  constructor(
    accessKeysService: AccessKeysService,
    auth: AuthenticationService,
    dialog: MdDialog,
    paginationService: PaginationService,
    router: Router,
    activatedRoute: ActivatedRoute
  ) {
    super(accessKeysService, auth, dialog, paginationService, router, activatedRoute);
  }

  ngOnInit() {
    this.init();
  }

  ngOnDestroy() {
    this.destroy();
  }

}
