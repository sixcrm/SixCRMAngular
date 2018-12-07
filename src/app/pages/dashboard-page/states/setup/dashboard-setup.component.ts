import {Component, Input, OnInit} from '@angular/core';
import {AsyncSubject, Observable} from 'rxjs';
import {AuthenticationService} from '../../../../authentication/authentication.service';
import {TranslationService} from "../../../../translation/translation.service";
import {TranslatedQuote} from "../../../../translation/translated-quote.model";
import {Router} from "@angular/router";

@Component({
  selector: 'c-dashboard-setup',
  templateUrl: './dashboard-setup.component.html',
  styleUrls: ['./dashboard-setup.component.scss']
})
export class DashboardSetupComponent implements OnInit {

  @Input() quote: TranslatedQuote;

  name: string;
  accountId: string;
  protected unsubscribe$: AsyncSubject<boolean> = new AsyncSubject<boolean>();

  constructor(
    public authService: AuthenticationService,
    private translationService: TranslationService,
    private router: Router
  ) { }

  ngOnInit() {
    this.authService.sixUser$.takeUntil(this.unsubscribe$).subscribe(user => {
      this.name = user.firstName;
    });

    this.accountId = this.authService.getActiveAcl().account.id;

    let quoteSub = Observable.interval(50).take(40).subscribe(() => {
      if (!this.quote) {
        this.quote = this.translationService.getRandomQuote();
      } else {
        quoteSub.unsubscribe();
      }
    });
  }

  navigateToAccountSettings() {
    this.router.navigate(['/accountmanagement', 'general']);
  }

  navigateToUsers() {
    this.router.navigate(['/accountmanagement', 'users']);
  }

  navigateToSubscription() {
    this.router.navigate(['/accountmanagement', 'billing']);
  }
}
