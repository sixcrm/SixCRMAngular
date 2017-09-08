import { Injectable } from '@angular/core';
import {CanActivate, Router, CanDeactivate} from '@angular/router';
import {AbstractAclGuard} from './abstract-acl-guard.service';
import {AuthenticationService} from '../../authentication/authentication.service';
import {MdDialog} from '@angular/material';
import {SmtpProviderViewComponent} from '../smtp-providers-page/smtp-provider-view/smtp-provider-view.component';

@Injectable()
export class SmtpProvidersAclGuard extends AbstractAclGuard implements CanActivate, CanDeactivate<SmtpProviderViewComponent> {

  constructor(authService: AuthenticationService, router: Router, dialog: MdDialog) {
    super(authService, router, dialog);
  }

  canActivate(): boolean {
    return super.hasPermission('smtpprovider');
  }
}
