import {Component, OnInit, OnDestroy} from '@angular/core';
import { Subscription } from 'rxjs';
import * as jsPDF from 'jspdf';
import {PrivacyPolicy} from "./privacy-policy.md";
import {MatDialog} from "@angular/material";
import {AuthenticationService} from "../../../authentication/authentication.service";
import {UsersService} from "../../../entity-services/services/users.service";
import {TermsDialogComponent} from "../../../dialog-modals/terms-dialog/terms-dialog.component";
import {CustomServerError} from "../../../shared/models/errors/custom-server-error";

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

  constructor(
    private authService: AuthenticationService,
    private userService: UsersService,
    private dialog: MatDialog
  ) {
  }

  ngOnInit() {
    this.sub = this.authService.sixUser$.subscribe(user => {
      if (user && user.id) {
        this.fetch();
      }
    });
  }

  ngOnDestroy() {
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }

  fetch(): void {
    if (this.authService.getActiveAcl().role.isOwner()) {
      this.userService.getlatestTermsAndConditions(this.authService.getActiveAcl().account.id, 'owner').take(1).subscribe((response) => {
        if (response instanceof CustomServerError) {
          return;
        }

        this.termsAndConditions = response.body.response.data.latesttermsandconditions;
      });
    }

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

    elementToPrint.style.fontSize = 'x-small';

    elementToPrint.innerHTML = this.stripNonAsciiCharacters(elementToPrint.innerHTML);

    pdf.fromHTML(elementToPrint, 10, 10, {
      width: 185
    }, () => {
      pdf.save(`${id}.pdf`);
      this.downloadDisabled = false;
    }, {top: 5, bottom: 0, left: 10, width: 185});

  }

  openTerms(title: string, text: string) {
    let ref = this.dialog.open(TermsDialogComponent);
    ref.componentInstance.title = title;
    ref.componentInstance.text = text;

    ref.afterClosed().take(1).subscribe(() => {
      ref = null;
    });
  }

  private stripNonAsciiCharacters(text: string) {
    return text.replace(/[^\x00-\x7F]/g, "");
  }

}
