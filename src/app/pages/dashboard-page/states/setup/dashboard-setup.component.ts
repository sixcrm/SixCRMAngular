import 'rxjs/add/operator/takeUntil';

import {Component, Input, OnInit} from '@angular/core';
import {AsyncSubject} from 'rxjs';
import {AuthenticationService} from '../../../../authentication/authentication.service';
import {Observable} from "rxjs/Observable";
import {TranslationService} from "../../../../translation/translation.service";
import {TranslatedQuote} from "../../../../translation/translated-quote.model";

@Component({
  selector: 'c-dashboard-setup',
  templateUrl: './dashboard-setup.component.html',
  styleUrls: ['./dashboard-setup.component.scss']
})
export class DashboardSetupComponent implements OnInit {

  @Input() quote: TranslatedQuote;

  name: string;
  protected unsubscribe$: AsyncSubject<boolean> = new AsyncSubject<boolean>();

  constructor(
    private authService: AuthenticationService,
    private translationService: TranslationService
  ) { }

  ngOnInit() {
    this.authService.sixUser$.takeUntil(this.unsubscribe$).subscribe(user => {
      this.name = user.firstName;
    });

    let quoteSub = Observable.interval(50).take(40).subscribe(() => {
      if (!this.quote) {
        this.quote = this.translationService.getRandomQuote();
      } else {
        quoteSub.unsubscribe();
      }
    });
  }
}
