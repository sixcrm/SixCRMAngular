import {Component, OnInit, OnDestroy, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {SearchService} from '../../shared/services/search.service';
import {ProgressBarService} from '../../shared/services/progress-bar.service';
import {Subscription, Subject} from 'rxjs';
import {PaginationService} from '../../shared/services/pagination.service';
import {utc, Moment} from 'moment';
import {DaterangepickerConfig} from 'ng2-daterangepicker';
import {NavigationService} from '../../navigation/navigation.service';
import {environment} from '../../../environments/environment';

@Component({
  selector: 'c-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
  host: {'(document:click)': 'hideElements($event)'},
})
export class SearchComponent implements OnInit, OnDestroy {

  @ViewChild('shareContainer') shareContainer;

  // quick search string
  queryString: string;

  // advanced search options
  queryOptions: any[] = [];

  // should advanced search or quick search be performed
  isAdvancedSearch: boolean;

  showAdvancedSearch: boolean;

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
  numberOfSearchResults: number = 0;
  hasMore: boolean = true;

  entityTypesCount: any = {};
  createdAtRange: string;

  checkboxClicked$: Subject<boolean> = new Subject<boolean>();

  listMode: boolean = true;

  sortBy: string = '';

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

  shareVisible: boolean = false;
  shareSearch: boolean = false;

  queryOptsLabel = {
    firstname: 'First Name',
    lastname: 'Last Name',
    phone: 'Phone Number',
    email: 'Email Address',
    alias: 'Transaction Alias',
    address_line_1: 'Address 1',
    address_line_2: 'Address 2',
    city: 'City',
    state: 'State',
    zip: 'Postal Code',
    tracking_number: 'Tracking No',
    first_six: 'First 6 #',
    last_four: 'Last 4 #'
  };

  datepickerVisible: boolean = false;
  startDate: Moment;
  endDate: Moment;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private progressBarService: ProgressBarService,
    private searchService: SearchService,
    private paginationService: PaginationService,
    private daterangepickerOptions: DaterangepickerConfig,
    private navigationService: NavigationService
  ) {
    this.startDate = utc().subtract(30,'d');
    this.endDate = utc();

    this.setDatepickerOptions();
  }

  ngOnInit() {
    this.navigationService.toggleSidenav(false);

    this.paginationService.searchResultsLimit$.subscribe((limit) => this.limit = limit);

    this.paramsSub = this.route.queryParams.subscribe((params) => {
      this.queryOptions = [];
      this.showAdvancedSearch = !params['advanced'] && !params['query'];
      this.parseShareParams(params);

      if (params['advanced']) {
        this.isAdvancedSearch = true;
        this.queryString = '';
        Object.keys(params).forEach((key) => {
          if (this.queryOptsLabel[key]) {
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
      this.numberOfSearchResults = data.found;
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

  parseShareParams(params): void {
    this.startDate = params['startDate'] ? utc(params['startDate']) : utc().subtract(30,'d');
    this.endDate = params['endDate'] ? utc(params['endDate']) : utc();
    this.createdAtRange = `['${this.startDate.format()}', '${this.endDate.format()}']`;
    this.page = +params['page'] || 0;
    this.limit = +params['limit'] || this.limit;
    this.sortBy = params['sortBy'] || this.sortBy;
    this.listMode = !params['listMode'] || params['listMode'] === 'true';
    let filters = params['filters'] || '';
    if (filters.split(',')) {
      filters.split(',').forEach(filter => {
        if (filter) {
          this.entityTypesChecked[filter] = true
        }
      });
    }

    this.shareSearch = params['page'] && params['limit'];

    this.setDatepickerOptions();
  }

  setDatepickerOptions(): void {
    this.daterangepickerOptions.settings = {
      parentEl: '.datepicker--custom',
      startDate: this.startDate,
      endDate: this.endDate,
      locale: { format: 'MM/DD/YYYY' },
      alwaysShowCalendars: true,
      applyClass: 'btn-success-custom',
      linkedCalendars: false,
      ranges: {
        'Today': [utc(), utc()],
        'Yesterday': [utc().subtract(1, 'd'), utc().subtract(1, 'd')],
        'Last 7 days': [utc().subtract(7, 'd'), utc()],
        'Last 30 days': [utc().subtract(30, 'd'), utc()],
      }
    };
  }

  datepickerShown() {
    this.datepickerVisible = true;
  }

  datepickerHidden() {
    this.datepickerVisible = false;
  }

  dateSelected(value: any): void {
    this.startDate = utc(value.start);
    this.endDate = utc(value.end);

    this.createdAtRange = `['${this.startDate.format()}', '${this.endDate.format()}']`;
    this.checkboxClicked$.next(true);
  }

  search(): void {
    if (this.isAdvancedSearch) {
      let opt: any = this.transformSearchOptions();
      this.prepareNewSearch();
      if (Object.keys(opt).length > 0) {
        this.performSearch(opt, this.createdAtRange, this.sortBy, this.searchResults.length, this.limit, this.getCheckedEntityTypes());
      }
    } else {
      this.prepareNewSearch();

      if (this.queryString) {
        this.performSearch(this.queryString, this.createdAtRange, this.sortBy, this.searchResults.length, this.limit, this.getCheckedEntityTypes());
      }
    }
  }

  quickSearch(): void {
    this.showAutocomplete = false;

    if (this.queryString === this.currentRoute || this.isAdvancedSearch) {
      this.search();
    } else {
      this.router.navigate(['/search'], {queryParams: {query: this.queryString}})
    }
  }

  quickSearchInputChanged(input): void {
    this.queryString = input.target.value;
    this.searchService.searchSuggestions(this.queryString);
    this.showAutocomplete = true;

    if (!this.queryString) {
      this.autocompleteOptions = [];
    }
  };

  quickSearchKeyDown(event): void {
    if (event && event.key === 'Enter') {
      this.quickSearch();
    }
  }

  suggestionSelected(option: string): void {
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

    let firstElement: number = this.page * this.limit;

    this.page = Math.floor(firstElement / limit);
    this.paginationService.setSearchResultsLimit(limit);

    this.reshuffleSearchResults();
  }

  hasMorePages(): boolean {
    let nextPage = this.page + 1;

    return this.hasMore || this.searchResults.slice(nextPage * this.limit, nextPage * this.limit + this.limit).length > 0;
  }

  showResultDetails(data: any): void {
    this.router.navigate([data.entityType + 's', data.id]);
  }

  toggleAdvancedSearch(): void {
    this.showAdvancedSearch = !this.showAdvancedSearch;
  }

  toggleAdvancedSearchFieldEnabled(option: any): void {
    option.enabled = !option.enabled;
    this.checkboxClicked$.next(true);
  }

  hasAnyEntityType(): boolean {
    for (let key in this.entityTypesCount) {
      if (this.entityTypesCount[key]) {
        return true;
      }
    }

    return false;
  }

  toggleView(): void {
    this.listMode = !this.listMode;
  }

  paginationString(): string {
    if (!this.numberOfSearchResults || this.numberOfSearchResults === 0) {
      return '';
    }

    let upper = this.page * this.limit + this.limit;
    if (upper > this.numberOfSearchResults) {
      upper = this.numberOfSearchResults;
    }

    return `${this.page * this.limit + 1}-${upper} of ${this.numberOfSearchResults}`;
  }

  setSortBy(value: string): void {
    this.sortBy = value !== 'default' ? value: '' ;
    this.search();
  }

  showShare(): void {
    this.shareVisible = true;
  }

  copyUrlToClipboard(urlField): void {
    urlField.select();
    document.execCommand('copy');
  }

  getShareUrl(): string {
    let url = environment.auth0RedirectUrl + '/search?';
    if (this.isAdvancedSearch) {
      url += `advanced=true`;

      this.queryOptions.forEach(option => {
        if (option.enabled) {
          url += `&${option.key}=${option.value}`;
        }
      })
    } else {
      url += `query=${this.queryString}`;
    }

    let filters = '&filters=';
    for (let key in this.entityTypesChecked) {
      if (this.entityTypesChecked[key]) {
        filters += `${key},`
      }
    }

    return url + `&startDate=${this.startDate.format()}&endDate=${this.endDate.format()}&sortBy=${this.sortBy}&page=${this.page}&limit=${this.limit}&listMode=${this.listMode}` + filters;
  }

  resetSearch(): void {
    this.isAdvancedSearch = false;
    this.queryString = '';
    this.sortBy = '';
    this.startDate = utc().subtract(30, 'd');
    this.endDate = utc();
    this.shareSearch = false;
    Object.keys(this.entityTypesChecked).forEach(entityType => this.entityTypesChecked[entityType] = false);
    this.prepareNewSearch();
    this.setDatepickerOptions();

    this.router.navigate(['/search']);
  }

  private prepareNewSearch(): void {
    this.searchResults = [];
    this.searchResultsToDisplay = [];
    this.numberOfSearchResults = 0;
    this.entityTypesCount = {};

    if (!this.shareSearch) {
      this.page = 0;
    } else {
      this.shareSearch = false;
    }
  }

  private reshuffleSearchResults(): void {
    let tempResults = this.searchResults.slice(this.page * this.limit, this.page * this.limit + this.limit);

    if (tempResults.length >= this.limit || !this.hasMore) {
      this.searchResultsToDisplay = tempResults;
    }
    else {
      if (this.hasMore) {
        let query: any = this.isAdvancedSearch ? this.transformSearchOptions() : this.queryString;

        this.performSearch(query, this.createdAtRange, this.sortBy, this.searchResults.length, this.limit - tempResults.length, this.getCheckedEntityTypes());
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

  private performSearch(query: string|any, createdAtRange: string, sortBy: string, offset: number, count: number, entityTypes: any): void {
    this.progressBarService.showTopProgressBar();
    this.searchService.searchByQuery(query, createdAtRange, sortBy, offset, count, entityTypes);
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

  private hideElements(event): void {
    if (event.target.attributes.class && event.target.attributes.class.value === 'search__content__title__share__trigger material-icons') {
      return;
    }

    if (this.shareContainer && !this.shareContainer.nativeElement.contains(event.target)) {
      this.shareVisible = false;
    }
  }

}
