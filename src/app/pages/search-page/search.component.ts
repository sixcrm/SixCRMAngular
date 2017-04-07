import {Component, OnInit, OnDestroy} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {SearchService} from '../../shared/services/search.service';
import {ProgressBarService} from '../../shared/services/progress-bar.service';
import {Subscription, Subject} from 'rxjs';
import {PaginationService} from '../../shared/services/pagination.service';
import {utc} from 'moment';

@Component({
  selector: 'c-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit, OnDestroy {

  // quick search string
  queryString: string;

  // advanced search options
  queryOptions: any[] = [];

  // should advanced search or quick search be performed
  isAdvancedSearch: boolean;

  currentRoute: string;
  paramsSub: Subscription;

  // should show quick search auto-complete
  showAutocomplete: boolean = false;
  autocompleteOptions: string[] = [];

  // pagination limit
  limit: number;
  paginationValues: number[] = [5, 10, 15, 20, 30];
  page: number = 0;

  searchResults: any[] = [];
  searchResultsToDisplay: any[] = [];
  hasMore: boolean = true;

  entityTypesCount: any = {};
  createdAtRange: string;

  checkboxClicked$: Subject<boolean> = new Subject<boolean>();

  entityTypesChecked: any  = {
    campaign: false,
    customer: false,
    user: false,
    billing: false,
    transaction: false,
    product: false,
    fulfillment: false,
    productschedule: false
  };

  queryOptsLabel = {
    firstname: 'First Name',
    lastname: 'Last Name',
    phone: 'Phone Number',
    email: 'Email Address',
    alias: 'Transaction Alias',
    address: 'Address',
    address_line_1: 'Address 1',
    address_line_2: 'Address 2',
    city: 'City',
    state: 'State',
    zip: 'Postal Code'
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private progressBarService: ProgressBarService,
    private searchService: SearchService,
    private paginationService: PaginationService
  ) {}

  ngOnInit() {
    this.paginationService.searchResultsLimit$.subscribe((limit) => this.limit = limit);

    this.paramsSub = this.route.queryParams.subscribe((params) => {
      this.queryOptions = [];

      if (params['advanced']) {
        this.isAdvancedSearch = true;
        Object.keys(params).forEach((key) => {
          if (key !== 'advanced') {
            this.queryOptions.push({key: key, value: params[key], enabled: true});
          }
        });
      } else {
        this.isAdvancedSearch = false;
        this.queryString = params['query'];
        this.currentRoute = this.queryString;
      }

      this.search();
    });

    this.searchService.searchResults$.subscribe((data) => {
      this.searchResults = [...this.searchResults, ...data.hit];
      this.hasMore = data.hit.length >= this.limit;
      this.reshuffleSearchResults();
      this.progressBarService.hideTopProgressBar();
    });

    this.searchService.suggestionResults$.subscribe((data) => this.autocompleteOptions = data);

    this.searchService.entityTypesCount$.subscribe((data) => this.entityTypesCount = data);

    this.checkboxClicked$.debounceTime(1000).subscribe(() => this.search());
  }

  ngOnDestroy() {
    if (this.paramsSub) {
      this.paramsSub.unsubscribe();
    }
  }

  search(): void {
    if (this.isAdvancedSearch) {
      let opt: any = this.transformSearchOptions();
      this.prepareNewSearch();
      if (Object.keys(opt).length > 0) {
        this.performSearch(opt, this.createdAtRange, this.searchResults.length, this.limit, this.getCheckedEntityTypes());
      }
    } else if (this.queryString) {
      this.prepareNewSearch();
      this.performSearch(this.queryString, this.createdAtRange, this.searchResults.length, this.limit, this.getCheckedEntityTypes());
    }
  }

  quickSearch(): void {
    if (this.queryString === this.currentRoute) {
      this.search();
    } else {
      this.router.navigate(['/search'], {queryParams: {query: this.queryString}})
    }
  }

  quickSearchInputChanged(input): void {
    this.queryString = input.target.value;
    this.searchService.searchSuggestions(this.queryString);

    if (!this.queryString) {
      this.autocompleteOptions = [];
    }
  };

  quickSearchKeyDown(event): void {
    if (event && event.key === 'Enter' && this.queryString) {
      this.quickSearch();
    }
  }

  suggestionSelected(option: string): void {
    this.showAutocomplete = false;
    this.autocompleteOptions = [];
    this.queryString = option;

    this.quickSearch();
  }

  checkboxClicked(): void {
    this.checkboxClicked$.next(true);
  }

  hideAutoComplete(): void {
    setTimeout(() => this.showAutocomplete = false, 150);
  }

  showAutoComplete(): void {
    this.autocompleteOptions = [];
    this.showAutocomplete = true;

    if (this.queryString) {
      this.searchService.searchSuggestions(this.queryString);
    }
  }

  previousPage(): void {
    this.page--;
    this.reshuffleSearchResults();
  }

  nextPage(): void {
    this.page++;
    this.reshuffleSearchResults();
  }

  updateLimit(limit: number): void {
    if (!limit) return;

    this.paginationService.setSearchResultsLimit(limit);

    let firstElement: number = this.page * this.limit;

    this.page = Math.floor(firstElement / limit);
    this.limit = limit;

    this.reshuffleSearchResults();
  }

  hasMorePages(): boolean {
    let nextPage = this.page + 1;

    return this.hasMore || this.searchResults.slice(nextPage * this.limit, nextPage * this.limit + this.limit).length > 0;
  }

  showResultDetails(data: any): void {
    this.router.navigate([data.entityType + 's', data.id]);
  }

  openAdvancedSearch(): void {
    this.router.navigateByUrl('advanced-search');
  }

  toggleAdvancedSearchFieldEnabled(option: any): void {
    option.enabled = !option.enabled;
    this.checkboxClicked$.next(true);
  }

  dateFilterClicked(checked: boolean, option: number): void {
    if (!checked) {
      this.createdAtRange = '';
    } else {
      // option 1 is for today
      if (option === 1) {
        this.createdAtRange = `['${utc().hour(0).minutes(0).seconds(0).millisecond(0).format()}',}`;
      }

      // option 2 is for yesterday
      if (option === 2) {
        this.createdAtRange =
          `['${utc().subtract('1','d').hour(0).minutes(0).seconds(0).millisecond(0).format()}','${utc().hour(0).minutes(0).seconds(0).millisecond(0).format()}']`;
      }

      // option 3 is for last 7 days
      if (option === 3) {
        this.createdAtRange = `['${utc().subtract('7','d').hour(0).minutes(0).seconds(0).millisecond(0).format()}',}`;
      }

      // option 4 is for last 30 days
      if (option === 4) {
        this.createdAtRange = `['${utc().subtract('30','d').hour(0).minutes(0).seconds(0).millisecond(0).format()}',}`;
      }
    }

    this.checkboxClicked$.next(true);
  }

  private prepareNewSearch(): void {
    this.searchResults = [];
    this.searchResultsToDisplay = [];
    this.entityTypesCount = {};
    this.page = 0;
  }

  private reshuffleSearchResults(): void {
    let tempResults = this.searchResults.slice(this.page * this.limit, this.page * this.limit + this.limit);

    if (tempResults.length >= this.limit || !this.hasMore) {
      this.searchResultsToDisplay = tempResults;
    }
    else {
      if (this.hasMore) {
        let query: any = this.isAdvancedSearch ? this.transformSearchOptions() : this.queryString;

        this.performSearch(query, this.createdAtRange, this.searchResults.length, this.limit - tempResults.length, this.getCheckedEntityTypes());
      }
    }
  }

  private transformSearchOptions(): any {
    let opt: any = {};
    this.queryOptions.forEach(option => {
      if (option.enabled) {
        opt[option.key] = option.value;
      }
    });

    return opt;
  }

  private performSearch(query: string|any, createdAtRange: string, offset: number, count: number, entityTypes: any): void {
    this.progressBarService.showTopProgressBar();
    this.searchService.searchByQuery(query, createdAtRange, offset, count, entityTypes);
    this.searchService.searchFacets(query, createdAtRange);
  }

  private getCheckedEntityTypes(): string [] {
    let entityTypesCheckedArray: string[] = [];

    for (let entityType in this.entityTypesChecked) {
      if (this.entityTypesChecked[entityType]) {
        entityTypesCheckedArray.push(entityType);
      }
    }

    return entityTypesCheckedArray;
  }

}
