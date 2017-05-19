import {Component, OnInit, Input, Output, OnDestroy, EventEmitter, ElementRef, ViewChild} from '@angular/core';
import {SearchService} from '../../services/search.service';
import {Subject, Subscription} from 'rxjs';
import {FilterTerm} from '../../../pages/dashboard-page/dashboard.component';

@Component({
  selector: 'input-autocomplete',
  templateUrl: './input-autocomplete.component.html',
  styleUrls: ['./input-autocomplete.component.scss'],
  host: {'(document:click)':'onClick($event)'}
})
export class InputAutocompleteComponent implements OnInit, OnDestroy {
  @ViewChild('inputField') inputField;

  @Input()
  title: string;

  @Input()
  entityType: string;

  @Output()
  selected: EventEmitter<FilterTerm> = new EventEmitter();

  suggestions: FilterTerm[] = [];

  private unsubscribe$: Subject<boolean> = new Subject();
  private debouncer$: Subject<string> = new Subject();
  private sub: Subscription = new Subscription();

  constructor(private searchService: SearchService, private elementRef: ElementRef) { }

  ngOnInit() {
    this.debouncer$.takeUntil(this.unsubscribe$).subscribe(value => {
      if (this.sub) {
        this.sub.unsubscribe();
      }

      this.sub = this.searchService.searchDashboardFiltersAdvanced(value, this.entityType).subscribe(results => {
        this.suggestions = this.parseFilterSearchResults(results.hit);
      });
    })
  }

  select(filterTerm: FilterTerm): void {
    this.selected.emit(filterTerm);
    this.suggestions = [];
    this.inputField.value = '';
  }

  input(event): void {
    if (event.target.value) {
      this.debouncer$.next(event.target.value);
    } else if (this.sub) {
      this.sub.unsubscribe();
    }
  }

  ngOnDestroy() {
    this.unsubscribe$.next(true);
    this.unsubscribe$.complete();
  }

  private parseFilterSearchResults(results: any[]): FilterTerm[] {
    let terms: FilterTerm[] = [];

    results.forEach(result => {
      let type = result.fields.entity_type;

      if (type === this.entityType) {
        let label = '';

        switch (type) {
          case 'customer' : {
            label = `${result.fields.firstname} ${result.fields.lastname}`;
            break;
          }
          case 'transaction' : {
            label = result.fields.alias;
            break;
          }
          case 'affiliate': {
            label = result.fields.affiliate_id;
            break;
          }
          default: {
            label = result.fields.name;
          }
        }

        terms.push({id: result.id, type: type, label: label});
      }
    });

    return terms;
  }

  onClick(): void {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      if (this.sub) {
        this.sub.unsubscribe();
      }

      this.suggestions = [];
    }
  }

}
