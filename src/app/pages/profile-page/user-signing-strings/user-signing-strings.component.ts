import {Component, OnInit, OnDestroy} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {AbstractEntityIndexComponent} from "../../abstract-entity-index.component";
import {UserSigningString} from "../../../shared/models/user-signing-string.model";
import {UserSigningStringsService} from "../../../shared/services/user-signing-string.service";
import {AuthenticationService} from "../../../authentication/authentication.service";
import {PaginationService} from "../../../shared/services/pagination.service";
import {ColumnParams} from "../../../shared/models/column-params.model";
import {SingleInputDialogComponent} from "../../../dialog-modals/single-input-dialog.component";
import {MatDialog} from '@angular/material';

@Component({
  selector: 'user-signing-strings',
  templateUrl: './user-signing-strings.component.html',
  styleUrls: ['./user-signing-strings.component.scss']
})
export class UserSigningStringsComponent extends AbstractEntityIndexComponent<UserSigningString> implements OnInit, OnDestroy {

  constructor(
    userSigningStringService: UserSigningStringsService,
    auth: AuthenticationService,
    dialog: MatDialog,
    paginationService: PaginationService,
    router: Router,
    activatedRoute: ActivatedRoute
  ) {
    super(userSigningStringService, auth, dialog, paginationService, router, activatedRoute);

    this.entityFactory = () => new UserSigningString();
    this.viewAfterCrate = false;

    let f = this.authService.getTimezone();
    this.columnParams = [
      new ColumnParams('PROFILE_SIGNINGSTRINGS_NAME', (e: UserSigningString) => e.name),
      new ColumnParams('PROFILE_SIGNINGSTRINGS_SIGNINGSTRING', (e: UserSigningString) => e.signingString).setCopyOption(true),
      new ColumnParams('PROFILE_SIGNINGSTRINGS_USED', (e: UserSigningString) => e.usedAt ? e.usedAt.tz(f).format('MM/DD/YYYY') : 'never'),
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

  addOrUpdateSigningString(userSigningStrings?: UserSigningString) {
    let dialogRef = this.deleteDialog.open(SingleInputDialogComponent);
    dialogRef.componentInstance.text = userSigningStrings ? 'PROFILE_SIGNINGSTRINGS_UPDATETEXT' : 'PROFILE_SIGNINGSTRINGS_ADDTEXT';
    dialogRef.componentInstance.inputPlaceholder = 'PROFILE_SIGNINGSTRINGS_NAME';
    dialogRef.componentInstance.inputContent = userSigningStrings ? userSigningStrings.name : '';
    dialogRef.componentInstance.yesText = 'PROFILE_SIGNINGSTRINGS_SAVE';
    dialogRef.componentInstance.noText = 'PROFILE_SIGNINGSTRINGS_CANCEL';

    dialogRef.afterClosed().subscribe(result => {
      dialogRef = null;

      if (result && result.content) {

        if (userSigningStrings) {
          userSigningStrings.name = result.content;

          this.service.updateEntity(userSigningStrings)
        } else {
          const strings = new UserSigningString({user: this.authService.getSixUser().id, name: result.content});

          this.service.createEntity(strings);
        }
      }
    })
  }

}
