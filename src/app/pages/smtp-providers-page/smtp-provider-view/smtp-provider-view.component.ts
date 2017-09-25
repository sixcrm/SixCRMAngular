import {Component, OnInit, OnDestroy} from '@angular/core';
import {SmtpProvidersService} from '../../../shared/services/smtp-providers.service';
import {ActivatedRoute, Router} from '@angular/router';
import {AbstractEntityViewComponent} from '../../abstract-entity-view.component';
import {SmtpProvider} from '../../../shared/models/smtp-provider.model';
import {NavigationService} from '../../../navigation/navigation.service';
import {CustomServerError} from '../../../shared/models/errors/custom-server-error';
import {extractData} from '../../../shared/services/http-wrapper.service';
import {SnackbarService} from '../../../shared/services/snackbar.service';
import {MdDialog} from '@angular/material';
import {SingleInputDialogComponent} from '../../../dialog-modals/single-input-dialog.component';
import {isAllowedEmail} from '../../../shared/utils/form.utils';
import {MessageDialogComponent} from '../../message-dialog.component';

@Component({
  selector: 'smtp-provider-view',
  templateUrl: './smtp-provider-view.component.html',
  styleUrls: ['./smtp-provider-view.component.scss']
})
export class SmtpProviderViewComponent extends AbstractEntityViewComponent<SmtpProvider> implements OnInit, OnDestroy {

  selectedIndex: number = 0;
  formInvalid: boolean;

  constructor(private smtpService: SmtpProvidersService,
              route: ActivatedRoute,
              public navigation: NavigationService,
              private router: Router,
              private dialog: MdDialog
  ) {
    super(smtpService, route);
  }

  ngOnInit() {
    this.init(() => this.navigation.goToNotFoundPage());

    if (this.addMode) {
      this.entity = new SmtpProvider();
      this.entityBackup = this.entity.copy();
    }

    this.service.entityCreated$.takeUntil(this.unsubscribe$).subscribe(() => this.openValidationDialog())
  }

  openValidationDialog(): void {
    let dialogRef = this.dialog.open(SingleInputDialogComponent, {disableClose: true});
    dialogRef.componentInstance.text = 'Input email address to use for SMTP Provider Validation';
    dialogRef.componentInstance.yesText = 'Validate';
    dialogRef.componentInstance.noText = 'Cancel';
    dialogRef.componentInstance.inputPlaceholder = 'Email';
    dialogRef.componentInstance.keydownAllowFunction = isAllowedEmail;

    dialogRef.afterClosed().takeUntil(this.unsubscribe$).take(1).subscribe(result => {
      dialogRef = null;
      if (result.content) {
        this.validateProvider(result.content);
      }
    });
  }

  validateProvider(email: string): void {
    this.smtpService.validate(this.entity, email).subscribe(data => {
      if (data instanceof CustomServerError) return;

      const response = extractData(data).smtpvalidation.smtp_response;
      const responseMessage = response.errormessage ? `SMTP Validation Failed! ERROR: ${response.errormessage}` : 'SMTP Validation Successful!';

      let dialogRef = this.dialog.open(MessageDialogComponent, {disableClose: true});
      dialogRef.componentInstance.text = responseMessage;

      dialogRef.afterClosed().takeUntil(this.unsubscribe$).take(1).subscribe(() => {
        dialogRef = null;
      });
    });
  }

  ngOnDestroy() {
    this.destroy();
  }

  setIndex(value: number): void {
    this.selectedIndex = value;
  }

  cancelEdit(): void {
    this.setMode(this.modes.View);
    this.formInvalid = false;
    this.cancelUpdate();
  }

  saveProvider(valid: boolean): void {
    if (!valid) {
      this.formInvalid = true;
      return;
    }

    this.formInvalid = false;
    if (this.addMode) {
      this.service.entityCreated$.take(1).subscribe(provider => {
        if (provider instanceof CustomServerError) return;

        this.router.navigate(['smtpproviders', provider.id]);
        this.entity = provider;
        this.entityBackup = this.entity.copy();
      });
      this.saveEntity(this.entity);
    } else {
      this.service.entityUpdated$.take(1).subscribe(() => this.setMode(this.modes.View));
      this.updateEntity(this.entity);
    }
  }
}
