import { Component, OnInit } from '@angular/core';
import {AuthenticationService} from '../../../authentication/authentication.service';
import {AccessKey} from '../../../shared/models/access-key.model';
import {AccessKeysService} from '../../../shared/services/access-keys.service';
import {CustomServerError} from '../../../shared/models/errors/custom-server-error';

@Component({
  selector: 'account-management-apikeys',
  templateUrl: './account-management-apikeys.component.html',
  styleUrls: ['./account-management-apikeys.component.scss']
})
export class AccountManagementApikeysComponent implements OnInit {

  account: Account;
  accessKeys: AccessKey[];
  filterString: string;
  filterFunction = (keys: AccessKey) => keys.name;

  constructor(private authService: AuthenticationService, private accessKeyService: AccessKeysService) { }

  ngOnInit() {
    this.account = this.authService.getActiveAcl().account;

    this.accessKeyService.entities$.subscribe(keys => {
      if (keys instanceof CustomServerError) return;

      this.accessKeys = keys;
    });

    this.accessKeyService.getEntities();
  }

  createNewAccessKey() {

  }

  editKey(keys: AccessKey) {

  }

  deleteKey(keys: AccessKey) {

  }
}
