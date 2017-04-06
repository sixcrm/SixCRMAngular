import {Component, OnInit, OnDestroy} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {SearchService} from '../../shared/services/search.service';
import {ProgressBarService} from '../../shared/services/progress-bar.service';
import {Subscription, Subject} from 'rxjs';
import {PaginationService} from '../../shared/services/pagination.service';

@Component({
  selector: 'c-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit, OnDestroy {

  queryString: string;
  queryOptions: any[] = [];
  isAdvancedSearch: boolean;
  currentRoute: string;
  paramsSub: Subscription;
  showAutocomplete: boolean = false;
  options: string[] = [];

  limit;
  paginationValues: number[] = [5, 10, 15, 20, 30];
  page: number = 0;

  searchResults: any[] = [];
  searchResultsToDispaly: any[] = [];
  hasMore: boolean = true;

  entityTypesCount: any = {};
  checkboxClicked$: Subject<boolean> = new Subject<boolean>();
  optionSelecte: Subject<boolean> = new Subject<boolean>();

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
    firstname: 'First Name', lastname: 'Last Name', phone: 'Phone Number', email: 'Email Address', alias: 'Order ID', address: 'Address'
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
      if (params['advanced']) {
        this.isAdvancedSearch = true;
        this.queryOptions = [];
        Object.keys(params).forEach((key) => {
          if (key !== 'advanced') {
            this.queryOptions.push({key: key, value: params[key], enabled: true});
          }
        });
      } else {
        this.isAdvancedSearch = false;
        this.queryOptions = [];
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

    this.searchService.suggestionResults$.subscribe((data) => this.options = data);

    this.searchService.entityTypesCount$.subscribe((data) => this.entityTypesCount = data);

    this.checkboxClicked$.debounceTime(1000).subscribe(() => this.search());
  }

  ngOnDestroy() {
    if (this.paramsSub) {
      this.paramsSub.unsubscribe();
    }
  }

  search(): void {
    if (this.isAdvancedSearch && this.queryOptions) {
      let opt = {};
      this.queryOptions.forEach(option => {
        if (option.enabled) {
          opt[option.key] = option.value;
        }
      });

      this.prepareNewSearch();

      if (Object.keys(opt).length > 0) {
        this.progressBarService.showTopProgressBar();
        this.searchService.searchAdvanced(opt, this.searchResults.length, this.limit, this.getCheckedEntityTypes());
        this.searchService.searchAdvancedFacets(opt);
      }
    } else if (this.queryString) {
      this.progressBarService.showTopProgressBar();
      this.searchService.searchByQuery(this.queryString, this.searchResults.length, this.limit, this.getCheckedEntityTypes());
      this.searchService.searchFacets(this.queryString);
    }
  }

  private prepareNewSearch(): void {
    this.searchResults = [];
    this.searchResultsToDispaly = [];
    this.entityTypesCount = {};
    this.page = 0;
  }

  navigateSearch(): void {
    if (this.queryString === this.currentRoute) {
      this.search();
    } else {
      this.router.navigate(['/search'], {queryParams: {query: this.queryString}})
    }
  }

  inputChanged(input): void {
    this.queryString = input.target.value;
    this.searchService.searchSuggestions(this.queryString);

    if (!this.queryString) {
      this.options = [];
    }
  };

  keyDown(event): void {
    if (event && event.key === 'Enter' && this.queryString) {
      this.search();
    }
  }

  optionSelected(option: string): void {
    this.showAutocomplete = false;
    this.options = [];
    this.queryString = option;

    if (this.queryString === this.currentRoute) {
      this.search();
    } else {
      this.router.navigate(['/search'], {queryParams: {query: this.queryString}})
    }
  }

  checkboxClicked(): void {
    this.checkboxClicked$.next(true);
  }

  hideAutoComplete(): void {
    setTimeout(() => this.showAutocomplete = false, 150);
  }

  showAutoComplete(): void {
    this.options = [];
    this.showAutocomplete = true;

    if (this.queryString) {
      this.searchService.searchSuggestions(this.queryString);
    }
  }

  previous(): void {
    this.page--;
    this.reshuffleSearchResults();
  }

  next(): void {
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

  showResult(data: any): void {
    this.router.navigate([data.entityType + 's', data.id]);
  }

  openAdvancedSearch(): void {
    this.router.navigateByUrl('advanced-search');
  }

  changeEnabled(option: any): void {
    option.enabled = !option.enabled;
    this.checkboxClicked$.next(true);
  }

  private reshuffleSearchResults(): void {
    let tempResults = this.searchResults.slice(this.page * this.limit, this.page * this.limit + this.limit);

    if (tempResults.length >= this.limit || !this.hasMore) {
      this.searchResultsToDispaly = tempResults;
    }
    else {
      if (this.hasMore && (this.queryString || this.queryOptions)) {

        if (this.isAdvancedSearch) {
          this.searchService.searchAdvanced(this.queryOptions, this.searchResults.length, this.limit - tempResults.length, this.getCheckedEntityTypes());
          this.searchService.searchAdvancedFacets(this.queryOptions);
        } else {
          this.searchService.searchByQuery(this.queryString, this.searchResults.length, this.limit - tempResults.length, this.getCheckedEntityTypes());
          this.searchService.searchFacets(this.queryString);
        }

        this.progressBarService.showTopProgressBar();
      }
    }
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
