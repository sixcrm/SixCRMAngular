import {Component, OnInit, OnDestroy, ViewChild} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {SearchService} from '../../shared/services/search.service';
import {Subscription, Subject} from 'rxjs';
import {utc, Moment} from 'moment';
import {DaterangepickerConfig} from 'ng2-daterangepicker';
import {environment} from '../../../environments/environment';
import {firstIndexOf} from '../../shared/utils/array.utils';
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

  queryString: string;

  currentRoute: string;
  paramsSub: Subscription;

  limit: number = 20;

  searchResults: any[] = [];
  numberOfSearchResults: number;

  facets: FacetCount[] = [];
  createdAtRange: string;

  checkboxClicked$: Subject<boolean> = new Subject<boolean>();

  cardMode: boolean = true;

  sortBy: string = '';

  datepickerVisible: boolean = false;
  startDate: Moment;
  endDate: Moment;
  applyDateFilter: boolean;

  filterValue: string;

  fetchingData: boolean = false;
  searchPerformed: boolean = false;

  showDetails: boolean = true;
  showFilters: boolean = true;

  selectedEntity: any;

  constructor(
    private route: ActivatedRoute,
    private searchService: SearchService,
    private daterangepickerOptions: DaterangepickerConfig,
    private translationService: TranslationService
  ) {
    this.startDate = utc().subtract(1,'M');
    this.endDate = utc();

    this.setDatepickerOptions();
  }

  ngOnInit() {
    this.paramsSub = this.route.queryParams.subscribe(params => {
      this.parseShareParams(params);
      this.queryString = params['query'] || '';
      this.currentRoute = this.queryString;

      this.search();
    });

    this.searchService.searchResults$.subscribe(data => {
      this.fetchingData = false;
      this.searchPerformed = true;
      this.searchResults = [...this.searchResults, ...data.hit];
      this.selectedEntity = this.searchResults[0];
      this.numberOfSearchResults = data.found;
    });

    this.searchService.facets$.subscribe(data => {
      const temp: FacetCount[] = this.facets.filter(f => f.checked).map(f => { return {name: f.name, count: 0, checked: true} });
      Object.keys(data).forEach(key => {
        const index = firstIndexOf(temp, (el) => el.name === key);

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
  }

  parseShareParams(params): void {
    this.startDate = params['startDate'] ? utc(params['startDate']) : this.applyDateFilter ? this.startDate : utc().subtract(1,'M');
    this.endDate = params['endDate'] ? utc(params['endDate']) : this.applyDateFilter ? this.endDate : utc();
    this.applyDateFilter = this.applyDateFilter || (params['startDate'] && params['endDate']);
    this.createdAtRange = `['${this.startDate.format()}', '${this.endDate.format()}']`;
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

    this.setDatepickerOptions();
  }

  setDatepickerOptions(): void {
    this.updateDatepicker();
  }

  updateDatepicker(): void {
    const ranges = {};
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
    this.prepareNewSearch();

    if (this.queryString) {
      this.performSearch(this.queryString, this.createdAtRange, this.sortBy, this.searchResults.length, this.limit, this.getCheckedEntityTypes());
    }
  }

  checkboxClicked(): void {
    this.checkboxClicked$.next(true);
  }

  dateCheckboxClicked(): void {
    this.checkboxClicked$.next(true);
  }

  canFetchMore(): boolean {
    return this.searchResults.length < this.numberOfSearchResults;
  }

  setSortBy(value: string): void {
    this.sortBy = value !== 'default' ? value: '' ;
    this.search();
  }

  getShareUrl(): string {
    let url = environment.auth0RedirectUrl + '/search';

    if (this.queryString) {
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

    const dateFilter = this.applyDateFilter ? `&startDate=${this.startDate.format()}&endDate=${this.endDate.format()}` : '';

    return url + dateFilter + `&sortBy=${this.sortBy}&limit=${this.limit}&cardMode=${this.cardMode}&filterValue=${this.filterValue}` + filters;
  }

  resetSearch(): void {
    this.applyDateFilter = false;
    this.sortBy = '';
    this.startDate = utc().subtract(1, 'M');
    this.endDate = utc();
    this.filterValue = '';
    this.facets = [];
    this.prepareNewSearch();
    this.setDatepickerOptions();
    this.search();
  }

  fetchMoreResults() {
    if (this.canFetchMore() && !this.fetchingData) {
      const query: any = this.queryString;

      this.performSearch(query, this.createdAtRange, this.sortBy, this.searchResults.length, this.limit, this.getCheckedEntityTypes());
    }
  }

  entitySelected(entity) {
    this.selectedEntity = entity;
  }

  private prepareNewSearch(): void {
    this.searchResults = [];
    this.numberOfSearchResults = 0;
  }

  private performSearch(query: string, createdAtRange: string, sortBy: string, offset: number, count: number, entityTypes: any): void {
    this.fetchingData = true;
    this.searchService.searchByQuery(query, this.applyDateFilter ? createdAtRange : '', sortBy, offset, count, entityTypes);
    this.searchService.searchFacets(query, this.applyDateFilter ? createdAtRange : '');
  }

  private getCheckedEntityTypes(): string [] {
    return this.facets.filter(f => f.checked).map(f => f.name);
  }
}
