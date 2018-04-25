import {Component, OnInit, OnDestroy, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {SearchService} from '../../shared/services/search.service';
import {Subscription, Subject} from 'rxjs';
import {PaginationService} from '../../shared/services/pagination.service';
import {utc, Moment} from 'moment';
import {DaterangepickerConfig} from 'ng2-daterangepicker';
import {NavigationService} from '../../navigation/navigation.service';
import {environment} from '../../../environments/environment';
import {AdvancedSearchComponent} from './advanced-search/advanced-search.component';
import {firstIndexOf} from '../../shared/utils/array.utils';
import {AuthenticationService} from '../../authentication/authentication.service';
import {AutocompleteComponent} from '../../shared/components/autocomplete/autocomplete.component';
import {getMonths, getDays} from '../../shared/utils/date.utils';
import {TranslationService} from '../../translation/translation.service';

export interface FacetCount {
  name: string;
  count: number;
  checked: boolean;
}

@Component({
  selector: 'c-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit, OnDestroy {
  @ViewChild('autocomplete') autocomplete: AutocompleteComponent;

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
  paginationValues: number[] = [5, 10, 25, 50, 75, 100];
  page: number = 0;

  searchResults: any[] = [];
  searchResultsToDisplay: any[] = [];
  numberOfSearchResults: number = 0;

  facets: FacetCount[] = [];
  createdAtRange: string;

  checkboxClicked$: Subject<boolean> = new Subject<boolean>();

  cardMode: boolean = true;

  sortBy: string = '';

  shareSearch: boolean = false;

  queryOptsLabel = {
    firstname: 'First Name', lastname: 'Last Name', phone: 'Phone Number', email: 'Email Address',
    alias: 'Transaction Alias', address_line_1: 'Address 1', address_line_2: 'Address 2', city: 'City', state: 'State',
    zip: 'ZIP Code', tracking_number: 'Tracking No', first_six: 'First 6 #', last_four: 'Last 4 #'
  };

  datepickerVisible: boolean = false;
  startDate: Moment;
  endDate: Moment;
  applyDateFilter: boolean;

  filterValue: string;

  fetchingData: boolean = false;
  searchPerformed: boolean = false;

  showDetails: boolean = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private searchService: SearchService,
    private paginationService: PaginationService,
    private daterangepickerOptions: DaterangepickerConfig,
    private navigationService: NavigationService,
    private translationService: TranslationService
  ) {
    this.startDate = utc().subtract(1,'M');
    this.endDate = utc();

    this.setDatepickerOptions();
  }

  ngOnInit() {
    this.navigationService.setSidenavAuto(false);

    this.paginationService.searchResultsLimit$.subscribe(limit => this.limit = limit);

    this.paramsSub = this.route.queryParams.subscribe(params => {
      this.queryOptions = [];
      this.showAdvancedSearch = !params['advanced'] && !params['query'];
      this.parseShareParams(params);

      if (params['advanced']) {
        this.isAdvancedSearch = true;
        this.queryString = '';
        Object.keys(params).forEach(key => {
          if (this.queryOptsLabel[key]) {
            this.queryOptions.push({key: key, value: params[key], enabled: true});
          }
        });
      } else {
        this.isAdvancedSearch = false;
        this.queryString = params['query'] || '';

        this.currentRoute = this.queryString;
      }

      this.search();
    });

    this.searchService.searchResults$.subscribe(data => {
      this.fetchingData = false;
      this.searchResults = [...this.searchResults, ...data.hit];
      this.numberOfSearchResults = data.found;
      this.reshuffleSearchResults();
    });

    this.searchService.suggestionResults$.subscribe(data => this.autocompleteOptions = data);

    this.searchService.facets$.subscribe(data => {
      let temp: FacetCount[] = this.facets.filter(f => f.checked).map(f => { return {name: f.name, count: 0, checked: true} });
      Object.keys(data).forEach(key => {
        let index = firstIndexOf(temp, (el) => el.name === key);

        if (index !== -1) {
          temp[index].count = data[key];
        } else {
          temp.push({name: key, count: data[key], checked: false});
        }
      });

      temp.sort((a, b) => {
        if (a.name > b.name) return 1;
        else return -1
      });

      this.facets = temp;
    });

    this.checkboxClicked$.debounceTime(1000).subscribe(() => this.search());
  }

  ngOnDestroy() {
    if (this.paramsSub) {
      this.paramsSub.unsubscribe();
    }
    this.navigationService.resetSidenavAuto();
  }

  parseShareParams(params): void {
    this.applyDateFilter = params['startDate'] && params['endDate'];
    this.startDate = params['startDate'] ? utc(params['startDate']) : utc().subtract(1,'M');
    this.endDate = params['endDate'] ? utc(params['endDate']) : utc();
    this.createdAtRange = `['${this.startDate.format()}', '${this.endDate.format()}']`;
    this.page = +params['page'] || 0;
    this.limit = +params['limit'] || this.limit;
    this.sortBy = params['sortBy'] || this.sortBy;
    this.cardMode = !params['cardMode'] || params['cardMode'] === 'true';
    this.filterValue = params['filterValue'] || '';
    let filters = params['filters'] || '';
    if (filters.split(',')) {
      filters.split(',').forEach(filter => {
        if (filter) {
          let index = firstIndexOf(this.facets, el => el.checked);
          if (index !== -1) {
            this.facets[index].checked = true;
          } else {
            this.facets.push({name: filter, count: 0, checked: true})
          }
        }
      });
    }

    this.shareSearch = params['page'] && params['limit'];

    this.setDatepickerOptions();
  }

  setDatepickerOptions(): void {

    this.updateDatepicker();

  }

  updateDatepicker(): void {
    let ranges = {};
    ranges[this.translationService.translate('DATEPICKER_TODAY')] = [utc(), utc()];
    ranges[this.translationService.translate('DATEPICKER_YESTERDAY')] = [utc().subtract(1, 'd'), utc().subtract(1, 'd')];
    ranges[this.translationService.translate('DATEPICKER_DAY7')] = [utc().subtract(7, 'd'), utc()];
    ranges[this.translationService.translate('DATEPICKER_DAY30')] = [utc().subtract(30, 'd'), utc()];

    this.daterangepickerOptions.settings = {
      parentEl: '.datepicker--custom',
      startDate: this.startDate,
      endDate: this.endDate,
      locale: {
        format: 'MM/DD/YYYY',
        applyLabel: this.translationService.translate('DATEPICKER_APPLY'),
        cancelLabel: this.translationService.translate('DATEPICKER_CANCEL'),
        monthNames: getMonths(this.translationService),
        daysOfWeek: getDays(this.translationService),
        customRangeLabel: this.translationService.translate('DATEPICKER_CUSTOM'),
      },
      alwaysShowCalendars: true,
      applyClass: 'btn-success-custom',
      linkedCalendars: false,
      ranges: ranges
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
    this.applyDateFilter = true;
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

    if (this.queryString === this.currentRoute) {
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

      if (this.autocomplete && this.autocomplete.getSelected()) {
        this.queryString = this.autocomplete.getSelected();
      }

      this.quickSearch();
    }

    if (event.key === 'Tab' && this.autocomplete) {
      event.preventDefault();
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

  dateCheckboxClicked(): void {
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

  canFetchMore(): boolean {
    return this.searchResults.length < this.numberOfSearchResults;
  }

  hasMorePages(): boolean {
    let nextPage = this.page + 1;

    return nextPage * this.limit < this.numberOfSearchResults;
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

  toggleView(): void {
    this.cardMode = !this.cardMode;
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

  getShareUrl(): string {
    let url = environment.auth0RedirectUrl + '/search';

    if (this.isAdvancedSearch) {
      url += `?advanced=true`;

      this.queryOptions.forEach(option => {
        if (option.enabled) {
          url += `&${option.key}=${option.value}`;
        }
      })
    } else if (this.queryString) {
      url += `?query=${this.queryString}`;
    } else {
      return url;
    }

    let filters = '&filters=';
    Object.keys(this.facets).forEach(key => {
      if (this.facets[key].checked) {
        filters += `${this.facets[key].name},`
      }
    });

    const dateFilter = this.applyDateFilter ? `&startDate=${this.startDate.format()}&endDate=${this.endDate.format()}` : ''

    return url + dateFilter + `&sortBy=${this.sortBy}&page=${this.page}&limit=${this.limit}&cardMode=${this.cardMode}&filterValue=${this.filterValue}` + filters;
  }

  resetSearch(advancedSearchComponent: AdvancedSearchComponent): void {
    this.isAdvancedSearch = false;
    this.applyDateFilter = false;
    this.queryString = '';
    this.sortBy = '';
    this.startDate = utc().subtract(1, 'M');
    this.endDate = utc();
    this.shareSearch = false;
    this.filterValue = '';
    this.facets = [];
    this.searchResultsToDisplay = [];
    this.prepareNewSearch();
    this.setDatepickerOptions();
    advancedSearchComponent.resetFields();

    this.router.navigate(['/search']);
  }

  private prepareNewSearch(): void {
    this.searchResults = [];
    this.searchResultsToDisplay = [];
    this.numberOfSearchResults = 0;

    if (!this.shareSearch) {
      this.page = 0;
    } else {
      this.shareSearch = false;
    }
  }

  private reshuffleSearchResults(): void {
    let tempResults = this.searchResults.slice(this.page * this.limit, this.page * this.limit + this.limit);

    if (tempResults.length >= this.limit || !this.canFetchMore()) {
      this.searchResultsToDisplay = tempResults;
    }
    else {
      if (this.canFetchMore()) {
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
    this.fetchingData = true;
    this.searchPerformed = true;
    this.searchService.searchByQuery(query, this.applyDateFilter ? createdAtRange : '', sortBy, offset, count, entityTypes);
    this.searchService.searchFacets(query, this.applyDateFilter ? createdAtRange : '');
  }

  private getCheckedEntityTypes(): string [] {
    return this.facets.filter(f => f.checked).map(f => f.name);
  }
}
