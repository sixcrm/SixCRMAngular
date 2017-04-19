import { Component, OnInit } from '@angular/core';
import {ProgressBarService} from '../../../shared/services/progress-bar.service';
import {Router} from '@angular/router';

@Component({
  selector: 'advanced-search',
  templateUrl: './advanced-search.component.html',
  styleUrls: ['./advanced-search.component.scss']
})
export class AdvancedSearchComponent implements OnInit {

  searchOptions = {
    advanced: true,
    firstname: '',
    lastname: '',
    phone: '',
    email: '',
    tracking_number: '',
    address_line_1: '',
    address_line_2: '',
    city: '',
    state: '',
    zip: '',
    alias: '',
    cctype: '',
    first_six: '',
    last_four: '',
  };

  constructor(private progressBarService: ProgressBarService, private router: Router) { }

  ngOnInit() { }

  search(): void {
    this.progressBarService.showTopProgressBar();

    Object.keys(this.searchOptions).forEach((key) => {
      if (!this.searchOptions[key]) {
        delete this.searchOptions[key];
      }
    });

    this.router.navigate(['/search'], {queryParams: this.searchOptions});
  }

}
