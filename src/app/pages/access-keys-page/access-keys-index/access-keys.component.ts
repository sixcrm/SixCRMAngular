import {Component, OnInit, OnDestroy} from '@angular/core';
import {MdDialog} from '@angular/material';
import {ActivatedRoute, Router} from '@angular/router';
import {AbstractEntityIndexComponent} from '../../abstract-entity-index.component';
import {AccessKey} from '../../../shared/models/access-key.model';
import {AccessKeysService} from '../../../shared/services/access-keys.service';
import {AuthenticationService} from '../../../authentication/authentication.service';
import {PaginationService} from '../../../shared/services/pagination.service';
import {ColumnParams} from '../../../shared/models/column-params.model';
import {TextMaskPipe} from '../../../shared/pipes/text-mask.pipe';

@Component({
  selector: 'access-keys',
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

    this.entityFactory = () => new AccessKey();

    let f = this.authService.getTimezone();
    this.columnParams = [
      new ColumnParams('Created At', (e: AccessKey) => e.createdAt.tz(f).format('MM/DD/YYYY')),
      new ColumnParams('Name', (e: AccessKey) => e.name),
      new ColumnParams('Access Key', (e: AccessKey) => e.accessKey),
      new ColumnParams('Secret Key', (e: AccessKey) => new TextMaskPipe().transform(e.secretKey, true, 4))
    ];

  }

  ngOnInit() {
    this.init();
  }

  ngOnDestroy() {
    this.destroy();
  }

  refreshData() {
    this.loadingData = true;
    this.serverError = null;
    this.service.getEntities(this.limit);
  }

  editAccessKey(accessKey: AccessKey) {

  }

  viewAccessKey(accessKey: AccessKey) {

  }

  addAccessKey() {

  }

}
