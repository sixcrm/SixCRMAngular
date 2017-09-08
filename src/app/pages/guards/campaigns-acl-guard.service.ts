import { Injectable } from '@angular/core';
import {CanActivate, Router, CanDeactivate} from '@angular/router';
import {AbstractAclGuard} from './abstract-acl-guard.service';
import {AuthenticationService} from '../../authentication/authentication.service';
import {MdDialog} from '@angular/material';
import {CampaignViewComponent} from '../campaigns-page/campaign-view/campaign-view.component';

@Injectable()
export class CampaignsAclGuard extends AbstractAclGuard implements CanActivate, CanDeactivate<CampaignViewComponent> {

  constructor(authService: AuthenticationService, router: Router, dialog: MdDialog) {
    super(authService, router, dialog);
  }

  canActivate(): boolean {
    return super.hasPermission('campaign');
  }
}
