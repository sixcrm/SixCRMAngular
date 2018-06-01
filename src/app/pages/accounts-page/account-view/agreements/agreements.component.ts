import {Component, OnInit, OnDestroy, Input} from '@angular/core';
import { CustomServerError } from '../../../../shared/models/errors/custom-server-error';
import { AuthenticationService } from '../../../../authentication/authentication.service';
import { Subscription } from 'rxjs';
import { UsersService } from '../../../../shared/services/users.service';
import * as jsPDF from 'jspdf';
import {PrivacyPolicy} from "./privacy-policy.md";
import {TermsDialogComponent} from "../../../../dialog-modals/terms-dialog/terms-dialog.component";
import {MatDialog} from "@angular/material";

@Component({
  selector: 'agreements',
  templateUrl: './agreements.component.html',
  styleUrls: ['./agreements.component.scss']
})
export class AgreementsComponent implements OnInit, OnDestroy {
  private sub: Subscription;
  termsAndConditions: any = {};
  licenceAgreement: any = {};
  privacyPolicy: any = {};
  downloadDisabled: boolean = false;

  @Input()
  accountId: string;

  constructor(
    private authService: AuthenticationService,
    private userService: UsersService,
    private dialog: MatDialog,
  ) {
  }

  ngOnInit() {
    this.sub = this.authService.sixUser$.subscribe(user => {
      if (user && user.id) {
        this.fetch();
      }
    })
  }

  ngOnDestroy() {
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }

  fetch(): void {
    this.userService.getlatestTermsAndConditions(this.accountId, 'owner').take(1).subscribe((response) => {
      if (response instanceof CustomServerError) {
        return;
      }

      this.termsAndConditions = response.body.response.data.latesttermsandconditions;
    });

    this.userService.getlatestTermsAndConditions().take(1).subscribe((response) => {
      if (response instanceof CustomServerError) {
        return;
      }

      this.licenceAgreement = response.body.response.data.latesttermsandconditions;
    });

    this.privacyPolicy = PrivacyPolicy.get();
  }

  download(id: string) {
    if (this.downloadDisabled) {
      return;
    }

    this.downloadDisabled = true;
    const elementToPrint = document.getElementById(id);
    const pdf = new jsPDF('p', 'mm', 'a4');

    pdf.fromHTML(elementToPrint.innerHTML, 10, 10, {
      width: 185
    }, () => {
      pdf.save(`${id}.pdf`);
      this.downloadDisabled = false;
    });

  }

  private openTerms(title: string, text: string) {
    let ref = this.dialog.open(TermsDialogComponent, { disableClose : true });
    ref.componentInstance.title = title;
    ref.componentInstance.text = text;

    ref.afterClosed().take(1).subscribe(() => {
      ref = null;
    });
  }

}
