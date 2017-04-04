import { Component, OnInit } from '@angular/core';
import {SearchService} from '../../shared/services/search.service';
import {ProgressBarService} from '../../shared/services/progress-bar.service';

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

  constructor(private searchService: SearchService, private progressBarService: ProgressBarService) { }

  ngOnInit() {
    this.searchService.searchResults$.subscribe((data) => {
      this.searchResults = [];
      this.searchResults = [...this.searchResults, ...data.hit];
      this.progressBarService.hideTopProgressBar();
    });
  }

  search(): void {
    this.progressBarService.showTopProgressBar();
    let options = {
      firstname: this.searchOptions.firstName,
      lastname: this.searchOptions.lastName,
      phone: this.searchOptions.phoneNumber,
      email: this.searchOptions.emailAddress,
      address: [this.searchOptions.address1, this.searchOptions.address2, this.searchOptions.state, this.searchOptions.city, this.searchOptions.postalCode]
    };

    this.searchService.searchAdvanced(options, 0, 1000);
  }

}
