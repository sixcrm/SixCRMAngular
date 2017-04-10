import { Component, OnInit } from '@angular/core';
import {ProgressBarService} from '../../shared/services/progress-bar.service';
import {Router} from '@angular/router';

@Component({
  selector: 'advanced-search',
  templateUrl: './advanced-search.component.html',
  styleUrls: ['./advanced-search.component.scss']
})
export class AdvancedSearchComponent implements OnInit {

  searchOptions = {
    firstName: '',
    lastName: '',
    phoneNumber: '',
    emailAddress: '',
    shipTrackNumber: '',
    address1: '',
    address2: '',
    city: '',
    state: '',
    alias: '',
    postalCode: '',
    creditCardType: '',
    creditCardf6: '',
    creditCardl4: '',
  };

  constructor(private progressBarService: ProgressBarService, private router: Router) { }

  ngOnInit() { }

  search(): void {
    this.progressBarService.showTopProgressBar();

    let options = {
      advanced: true,
      firstname: this.searchOptions.firstName,
      lastname: this.searchOptions.lastName,
      phone: this.searchOptions.phoneNumber,
      email: this.searchOptions.emailAddress,
      alias: this.searchOptions.alias,
      address_line_1: this.searchOptions.address1,
      address_line_2: this.searchOptions.address2,
      state: this.searchOptions.state,
      city: this.searchOptions.city,
      zip: this.searchOptions.postalCode
    };

    Object.keys(options).forEach((key) => {
      if (!options[key]) {
        delete options[key];
      }
    });

    this.router.navigate(['/search'], {queryParams: options});
  }

}
