import {Component, OnInit, OnDestroy} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {AbstractEntityIndexComponent} from '../../abstract-entity-index.component';
import {AccessKey} from '../../../shared/models/access-key.model';
import {AccessKeysService} from '../../../entity-services/services/access-keys.service';
import {AuthenticationService} from '../../../authentication/authentication.service';
import {PaginationService} from '../../../shared/services/pagination.service';
import {ColumnParams} from '../../../shared/models/column-params.model';
import {TextMaskPipe} from '../../../shared/pipes/text-mask.pipe';
import {AccessKeyDetailsDialogComponent} from '../../../dialog-modals/access-key-details-dialog.component';
import {MatDialog} from '@angular/material';

@Component({
  selector: 'access-keys',
  templateUrl: './access-keys.component.html',
  styleUrls: ['./access-keys.component.scss']
})
export class AccessKeysComponent extends AbstractEntityIndexComponent<AccessKey> implements OnInit, OnDestroy {

  constructor(
    accessKeysService: AccessKeysService,
    auth: AuthenticationService,
    dialog: MatDialog,
    paginationService: PaginationService,
    router: Router,
    activatedRoute: ActivatedRoute
  ) {
    super(accessKeysService, auth, dialog, paginationService, router, activatedRoute);

    this.entityFactory = () => new AccessKey();
    this.viewAfterCrate = false;

    let f = this.authService.getTimezone();
    this.columnParams = [
      new ColumnParams('ACCOUNT_KEYS_HEADER_CREATED', (e: AccessKey) => e.createdAt.tz(f).format('MM/DD/YYYY')),
      new ColumnParams('ACCOUNT_KEYS_HEADER_NAME', (e: AccessKey) => e.name),
      new ColumnParams('ACCOUNT_KEYS_HEADER_ACCESS', (e: AccessKey) => e.accessKey),
      new ColumnParams('ACCOUNT_KEYS_HEADER_SECRET', (e: AccessKey) => new TextMaskPipe().transform(e.secretKey, true, 4))
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
    let accessKeyDetailsDialog = this.deleteDialog.open(AccessKeyDetailsDialogComponent);
    accessKeyDetailsDialog.componentInstance.accessKey = accessKey.copy();
    accessKeyDetailsDialog.componentInstance.editMode = true;

    accessKeyDetailsDialog.afterClosed().take(1).subscribe(result => {
      accessKeyDetailsDialog = null;

      if (result) {
        this.service.updateEntity(result);
      }
    });
  }

  viewAccessKey(accessKey: AccessKey) {
    let accessKeyDetailsDialog = this.deleteDialog.open(AccessKeyDetailsDialogComponent);
    accessKeyDetailsDialog.componentInstance.accessKey = accessKey.copy();

    accessKeyDetailsDialog.afterClosed().take(1).subscribe(() => {
      accessKeyDetailsDialog = null;
    });
  }

  addAccessKey() {
    this.service.createEntity(new AccessKey());
  }

}
