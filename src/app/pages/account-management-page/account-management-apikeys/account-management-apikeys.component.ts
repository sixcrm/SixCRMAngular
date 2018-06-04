import { Component, OnInit } from '@angular/core';
import {AuthenticationService} from '../../../authentication/authentication.service';
import {AccessKey} from '../../../shared/models/access-key.model';
import {AccessKeysService} from '../../../shared/services/access-keys.service';
import {CustomServerError} from '../../../shared/models/errors/custom-server-error';
import {Router} from '@angular/router';
import {MatDialog} from '@angular/material';
import {DeleteDialogComponent} from '../../delete-dialog.component';
import {firstIndexOf} from '../../../shared/utils/array.utils';
import {AccessKeysDialogComponent} from '../../../dialog-modals/access-keys-dialog/access-keys-dialog.component';

@Component({
  selector: 'account-management-apikeys',
  templateUrl: './account-management-apikeys.component.html',
  styleUrls: ['./account-management-apikeys.component.scss']
})
export class AccountManagementApikeysComponent implements OnInit {

  account: Account;
  accessKeys: AccessKey[];
  filterString: string;
  filterFunction = (keys: AccessKey) => `${keys.name} ${keys.notes}`;

  sortBy: {label: string, sortFunction: (f: AccessKey, s: AccessKey) => number}[] = [
    {label: 'Name', sortFunction: (f: AccessKey, s: AccessKey) => {
      if ((f.name || '').toLowerCase() < (s.name || '').toLowerCase()) return -1;
      if ((f.name || '').toLowerCase() > (s.name || '').toLowerCase()) return 1;
      return 0;
    }},
    {label: 'Notes', sortFunction: (f: AccessKey, s: AccessKey) => {
      if ((f.notes || '').toLowerCase() < (s.notes || '').toLowerCase()) return -1;
      if ((f.notes || '').toLowerCase() > (s.notes || '').toLowerCase()) return 1;
      return 0;
    }},
    {label: 'Created at', sortFunction: (f: AccessKey, s: AccessKey) => {
      if (f.createdAt.isBefore(s.createdAt)) return -1;
      if (f.createdAt.isAfter(s.createdAt)) return 1;
      return 0;
    }}
  ];

  selectedSortBy: {label: string, sortFunction: (f: AccessKey, s: AccessKey) => number};

  constructor(
    private authService: AuthenticationService,
    private accessKeyService: AccessKeysService,
    private router: Router,
    private dialog: MatDialog
  ) { }

  ngOnInit() {
    this.account = this.authService.getActiveAcl().account;

    this.accessKeyService.entities$.subscribe(keys => {
      if (keys instanceof CustomServerError) return;

      this.accessKeys = keys;
    });

    this.accessKeyService.getEntities();
  }

  createNewAccessKey() {
    let dialogRef = this.dialog.open(AccessKeysDialogComponent, {backdropClass: 'backdrop-blue'});

    dialogRef.afterClosed().subscribe(result => {
      dialogRef = null;

      if (result !== undefined) {
        this.accessKeyService.entityCreated$.take(1).subscribe(keys => {
          if (keys instanceof CustomServerError) return;

          this.accessKeys = [keys, ...this.accessKeys]
        });
        this.accessKeyService.createEntity(new AccessKey({name: result.name, notes: result.notes}))
      }
    });
  }

  editKey(keys: AccessKey) {
    let dialogRef = this.dialog.open(AccessKeysDialogComponent, {backdropClass: 'backdrop-blue'});

    dialogRef.componentInstance.name = keys.name;
    dialogRef.componentInstance.notes = keys.notes;
    dialogRef.componentInstance.editMode = true;

    dialogRef.afterClosed().subscribe(result => {
      dialogRef = null;

      if (result !== undefined) {
        this.accessKeyService.entityUpdated$.take(1).subscribe(updatedKeys => {
          if (updatedKeys instanceof CustomServerError) return;

          const index = firstIndexOf(this.accessKeys, (el) => el.id === updatedKeys.id);

          if (index !== -1) {
            this.accessKeys[index] = updatedKeys;
          }
        });

        let updated = keys.copy();
        updated.name = result.name;
        updated.notes = result.notes;

        this.accessKeyService.updateEntity(updated);
      }
    });
  }

  deleteKey(keys: AccessKey) {
    let dialogRef = this.dialog.open(DeleteDialogComponent);

    dialogRef.afterClosed().subscribe(result => {
      dialogRef = null;
      if (result && result.success) {
        this.performKeysDelete(keys);
      }
    });

  }

  private performKeysDelete(keys: AccessKey) {
    this.accessKeyService.entityDeleted$.take(1).subscribe(deletedKeys => {
      if (deletedKeys instanceof CustomServerError) return;

      const index = firstIndexOf(this.accessKeys, (el) => el.id === deletedKeys.id);

      if (index !== -1) {
        this.accessKeys.splice(index, 1);
      }
    });

    this.accessKeyService.deleteEntity(keys.id);
  }

  navigateToSigningStrings() {
    this.router.navigate(['/profile'], {fragment: 'signingstrings'})
  }

  applySortBy(sort: {label: string, sortFunction: (f: AccessKey, s: AccessKey) => number}) {
    this.selectedSortBy = sort;
    this.accessKeys = this.accessKeys.sort(sort.sortFunction);
  }
}
