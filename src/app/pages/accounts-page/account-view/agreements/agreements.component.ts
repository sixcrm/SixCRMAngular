import { Component, OnInit, OnDestroy } from '@angular/core';
import { CustomServerError } from '../../../../shared/models/errors/custom-server-error';
import { AuthenticationService } from '../../../../authentication/authentication.service';
import { Subscription } from 'rxjs';
import { UsersService } from '../../../../shared/services/users.service';
import * as jsPDF from 'jspdf';
import * as html2canvas from 'html2canvas';

@Component({
  selector: 'agreements',
  templateUrl: './agreements.component.html',
  styleUrls: ['./agreements.component.scss']
})
export class AgreementsComponent implements OnInit, OnDestroy {
  private sub: Subscription;
  termsAndConditions: any = {};

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
    this.userService.getLatestTermsAndConditionsForAccount(this.authService.getActiveAcl().account.id).take(1).subscribe((response) => {
      if (response instanceof CustomServerError) {
        return;
      }

      this.termsAndConditions = response.body.response.data.latesttermsandconditions;
    })
  }

  download() {
    const elementToPrint = document.getElementById('terms');
    const pdf = new jsPDF();

    pdf.addHTML(elementToPrint, 10, 10, {
      pagesplit: true,
      margin: {top: 10, right: 10, bottom: 10, left: 10, useFor: 'page'}
    }, () => {pdf.save("terms-and-conditions.pdf")})

  }

}