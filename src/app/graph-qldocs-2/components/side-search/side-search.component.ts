import {Component, OnInit, Input} from '@angular/core';
import {navigateToFieldByString} from '../../utils';
import {ActivatedRoute, NavigationEnd, Router} from "@angular/router";
import {Subject} from "rxjs";

export interface SearchItem {
  name: string;
  children: string[];
}

@Component({
  selector: 'side-search',
  templateUrl: './side-search.component.html',
  styleUrls: ['./side-search.component.scss']
})
export class SideSearchComponent implements OnInit {

  @Input() searchItems: SearchItem[];
  @Input() focused: boolean = false;

  filterString: string;
  selectedItem: string;

  private searchDebouncer: Subject<string> = new Subject();

  constructor(
    private router: Router,
    private route: ActivatedRoute
  ) {
    router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        let shouldRedirect = this.checkUrlAfterRedirect(event);
        if (!shouldRedirect) {
          this.selectedItem = '';
        }
      }
    });
  }

  checkUrlAfterRedirect(event) {
    return event.urlAfterRedirects.includes('documentation/graph2/query') ||
      event.urlAfterRedirects.includes('documentation/graph2/mutation') ||
      event.urlAfterRedirects.includes('documentation/graph2/type')
  }

  ngOnInit() {
    this.route.queryParams.take(1).subscribe(params => {
      this.filterString = params['filter'] || '';
    });

    this.searchDebouncer.debounceTime(250).subscribe(value => {
      this.router.navigate([], { queryParams: { filter: value} });
    })
  }

  nav(path: string): void {
    navigateToFieldByString(path);
  }

  navigateTo(path: string, type: string): void {
    this.router.navigate(['documentation/graph2/', type.toLowerCase(), path]);
  }

  addQueryParams(input) {
    this.searchDebouncer.next(input.target.value);
  }
}
