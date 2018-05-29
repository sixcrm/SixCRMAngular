import { Component, OnInit, OnDestroy } from '@angular/core';
import { CustomServerError } from '../../../../shared/models/errors/custom-server-error';
import { AuthenticationService } from '../../../../authentication/authentication.service';
import { Subscription } from 'rxjs';
import { UsersService } from '../../../../shared/services/users.service';
import * as jsPDF from 'jspdf';

@Component({
  selector: 'agreements',
  templateUrl: './agreements.component.html',
  styleUrls: ['./agreements.component.scss']
})
export class AgreementsComponent implements OnInit, OnDestroy {
  private sub: Subscription;
  termsAndConditions: any = {};
  downloadDisabled: boolean = false;
  licenceAgreement: any = {};

  constructor(
    private authService: AuthenticationService,
    private userService: UsersService
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
    this.userService.getlatestTermsAndConditions(this.authService.getActiveAcl().account.id, 'owner').take(1).subscribe((response) => {
      if (response instanceof CustomServerError) {
        return;
      }

      this.termsAndConditions = response.body.response.data.latesttermsandconditions;
    });

    this.userService.getlatestTermsAndConditions(this.authService.getActiveAcl().account.id).take(1).subscribe((response) => {
      if (response instanceof CustomServerError) {
        return;
      }

      this.licenceAgreement = response.body.response.data.latesttermsandconditions;
    })
  }

  download(id: string) {
    if (this.downloadDisabled) {
      return;
    }

    this.downloadDisabled = true;
    const elementToPrint = document.getElementById(id);
    const pdf = new jsPDF('p', 'mm', 'a4');

    pdf.fromHTML(elementToPrint.innerHTML, 5, 5, {

    }, () => {
      pdf.save(`${id}.pdf`);
      this.downloadDisabled = false;
    });

  }

}
