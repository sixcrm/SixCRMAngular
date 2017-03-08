import { Component, OnInit } from '@angular/core';
import {AbstractEntityIndexComponent} from '../abstract-entity-index.component';
import {AccessKeysService} from '../../shared/services/access-keys.service';
import {AccessKey} from '../../shared/models/access-key.model';
import {MdDialog} from '@angular/material';
import {ProgressBarService} from '../../shared/services/progress-bar.service';
import {PaginationService} from '../../shared/services/pagination.service';
import {AuthenticationService} from '../../authentication/authentication.service';

@Component({
  selector: 'c-access-keys',
  templateUrl: './access-keys.component.html',
  styleUrls: ['./access-keys.component.scss']
})
export class AccessKeysComponent extends AbstractEntityIndexComponent<AccessKey> implements OnInit {

  constructor(
    private accessKeysService: AccessKeysService,
    auth: AuthenticationService,
    dialog: MdDialog,
    progressBarService: ProgressBarService,
    paginationService: PaginationService
  ) {
    super(accessKeysService, auth, dialog, progressBarService, paginationService);
  }

  ngOnInit() {
    this.accessKeysService.entityDeleted$.subscribe((data) => this.accessKeysService.getEntities());

    this.init();
  }

}
