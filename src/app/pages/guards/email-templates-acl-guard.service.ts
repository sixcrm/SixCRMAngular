import { Injectable } from '@angular/core';
import {CanActivate, Router, CanDeactivate} from '@angular/router';
import {AbstractAclGuard} from './abstract-acl-guard.service';
import {AuthenticationService} from '../../authentication/authentication.service';
import {MdDialog} from '@angular/material';
import {EmailTemplateViewComponent} from '../email-templates-page/email-template-view/email-template-view.component';
import {NavigationService} from '../../navigation/navigation.service';

@Injectable()
export class EmailTemplatesAclGuard extends AbstractAclGuard implements CanActivate, CanDeactivate<EmailTemplateViewComponent> {

  constructor(authService: AuthenticationService,
              router: Router,
              dialog: MdDialog,
              navigation: NavigationService
  ) {
    super(authService, router, dialog, navigation);
  }

  canActivate(): boolean {
    return super.hasPermission('emailtemplate');
  }
}
