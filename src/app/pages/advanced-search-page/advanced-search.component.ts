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
    orderId: '',
    postalCode: '',
    creditCardType: '',
    creditCardf6: '',
    creditCardl4: '',
    ipAddress: ''
  };

  searchResults = [];

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
      alias: this.searchOptions.orderId,
      address: [this.searchOptions.address1, this.searchOptions.address2, this.searchOptions.state, this.searchOptions.city, this.searchOptions.postalCode]
    };

    Object.keys(options).forEach((key) => {
      if (!options[key]) {
        delete options[key];
      }

      if (options[key] && options[key] instanceof Array) {
        let temp = [];
        Object.keys(options[key]).forEach((innerKey) => {
          if (options[key][innerKey]) {
            temp.push(options[key][innerKey]);
          }
        });

        delete options[key];
        if (temp.length > 0) {
          options[key] = temp;
        }
      }
    });

    this.router.navigate(['/dashboard', 'search'], {queryParams: options});
  }

}
