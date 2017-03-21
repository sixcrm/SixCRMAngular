import {Component, OnInit, OnDestroy} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {SearchService} from '../../shared/services/search.service';
import {ProgressBarService} from '../../shared/services/progress-bar.service';
import {Subscription} from 'rxjs';

@Component({
  selector: 'c-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit, OnDestroy {

  private queryString: string;
  private height: string = '0';
  private paramsSub: Subscription;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private progressBarService: ProgressBarService,
    private searchService: SearchService
  ) {}

  ngOnInit() {
    this.paramsSub = this.route.queryParams.subscribe((params) => {
      this.queryString = params['query'];
      this.search();
    });

    this.searchService.searchResults$.subscribe(() => {
      this.progressBarService.hideTopProgressBar();
    });

    setTimeout(() => {
      this.height = window.innerHeight - 64 + 'px';
    }, 1);
  }

  ngOnDestroy() {
    if (this.paramsSub) {
      this.paramsSub.unsubscribe();
    }
  }

  search(): void {
    if (this.queryString) {
      this.progressBarService.showTopProgressBar();
      this.searchService.searchByQuery(this.queryString);
    }
  }

  navigateSearch(): void {
    this.router.navigate(['/dashboard', 'search'], {queryParams: {query: this.queryString}})
  }

  getString(obj: any): string {
    return JSON.stringify(obj);
  }

}
