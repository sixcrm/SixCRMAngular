import {Component, OnInit, OnDestroy} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {SearchService} from '../../shared/services/search.service';
import {ProgressBarService} from '../../shared/services/progress-bar.service';
import {Subscription} from 'rxjs';
import {Campaign} from '../../shared/models/campaign.model';
import {Product} from '../../shared/models/product.model';

@Component({
  selector: 'c-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit, OnDestroy {

  private queryString: string;
  private currentRoute: string;
  private paramsSub: Subscription;
  private showAutocomplete: boolean = false;
  private options: string[] = [];

  private limit: number = 10;
  private paginationValues: number[] = [5, 10, 15, 20, 30];
  private page: number = 0;

  private searchResults: any[] = [];
  private searchResultsToDispaly: any[] = [];
  private hasMore: boolean = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private progressBarService: ProgressBarService,
    private searchService: SearchService
  ) {}

  ngOnInit() {
    this.paramsSub = this.route.queryParams.subscribe((params) => {
      this.queryString = params['query'];
      this.currentRoute = this.queryString;
      this.search();
    });

    this.searchService.searchResults$.subscribe((data) => {
      this.searchResults = [...this.searchResults, ...data.hit];
      this.hasMore = data.hit.length >= this.limit;
      this.reshuffleSearchResults();
      this.progressBarService.hideTopProgressBar();
    });

    this.searchService.suggestionResults$.takeWhile(() => !!this.queryString).subscribe((data) => {
      this.options = data;
    });
  }

  ngOnDestroy() {
    if (this.paramsSub) {
      this.paramsSub.unsubscribe();
    }
  }

  search(): void {
    if (this.queryString) {
      this.progressBarService.showTopProgressBar();
      this.searchResults = [];
      this.searchService.searchByQuery(this.queryString, this.searchResults.length, this.limit);
    }
  }

  navigateSearch(): void {
    if (this.queryString === this.currentRoute) {
      this.search();
    } else {
      this.router.navigate(['/dashboard', 'search'], {queryParams: {query: this.queryString}})
    }
  }

  getString(obj: any): string {
    return JSON.stringify(obj);
  }

  inputChanged(input): void {
    this.queryString = input.target.value;
    this.searchService.searchSuggestions(this.queryString);

    if (!this.queryString) {
      this.options = [];
    }
  };

  optionSelected(option: string): void {
    this.showAutocomplete = false;
    this.options = [];
    this.queryString = option;

    if (this.queryString === this.currentRoute) {
      this.search();
    } else {
      this.router.navigate(['/dashboard', 'search'], {queryParams: {query: this.queryString}})
    }
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

    let firstElement: number = this.page * this.limit;

    this.page = Math.floor(firstElement / limit);
    this.limit = limit;

    this.reshuffleSearchResults();
  }

  hasMorePages(): boolean {
    let nextPage = this.page + 1;

    return this.hasMore || this.searchResults.slice(nextPage * this.limit, nextPage * this.limit + this.limit).length > 0;
  }

  private reshuffleSearchResults(): void {
    let tempResults = this.searchResults.slice(this.page * this.limit, this.page * this.limit + this.limit);

    if (tempResults.length >= this.limit || !this.hasMore) {
      this.searchResultsToDispaly = tempResults;
    }
    else {
      if (this.hasMore) {
        this.searchService.searchByQuery(this.queryString, this.searchResults.length, this.limit - tempResults.length);
        this.progressBarService.showTopProgressBar();
      }
    }
  }

}
