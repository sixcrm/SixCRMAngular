import { Component, OnInit, Input } from '@angular/core';
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

  @Input() active: boolean = true;

  constructor(private router: Router) { }

  ngOnInit() { }

  resetFields(): void {
    Object.keys(this.searchOptions).forEach(key => {
      if (key !== 'advanced') {
        this.searchOptions[key] = '';
      }
    })
  }

  search(input): void {
    Object.keys(this.searchOptions).forEach((key) => {
      if (!this.searchOptions[key]) {
        delete this.searchOptions[key];
      }
    });

    if (Object.keys(this.searchOptions).length > 1) {
      this.router.navigate(['/search'], {queryParams: this.searchOptions});
    } else {
      input.focus();
    }
  }

}
