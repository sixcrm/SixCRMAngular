import {PaginationService} from '../shared/services/pagination.service';
import {AsyncSubject} from 'rxjs';
import {ColumnParams} from '../shared/models/column-params.model';

export class ReportColumnParams<T> extends ColumnParams<T> {
  isFilter: boolean;
  entityType: string;

  constructor(label?: string, mappingFunction?: (e: T) => string | number,  align?: string, order?: string, applied?: boolean) {
    super(label, mappingFunction, align, order, applied);
  }

  setIsFilter(value: boolean) {
    this.isFilter = value;

    return this;
  }

  setEntityType(value: string) {
    this.entityType = value;

    return this;
  }
}

export class ReportsAbstractComponent<T> {
  limit = 10;
  page = 0;
  columnParams: ReportColumnParams<T>[] = [];
  reports: T[] = [];
  reportsToDisplay: T[] = [];
  hasMore: boolean = true;

  protected unsubscribe$: AsyncSubject<boolean> = new AsyncSubject();
  fetchFunction: () => void;

  constructor(protected paginationService: PaginationService) { }

  protected destroy(): void {
    this.unsubscribe$.next(true);
    this.unsubscribe$.complete();
  }

  fetchNext(): void {
    this.page++;
    this.reshuffle();
  }

  fetchPrevious(): void {
    this.page--;
    this.reshuffle();
  }

  updateLimit(limit: number): void {
    if (!limit) return;

    let firstElement: number = this.page * this.limit;
    this.page = Math.floor(firstElement / limit);
    this.limit = limit;

    this.reshuffle();
  }

  getPaginationString(): string {
    let from = this.page * this.limit + 1;
    let to = this.page * this.limit + this.limit;
    let of = to;
    return `${from}-${to} of ${of}`;
  }

  reshuffle(): void {
    let temp = this.reports.slice(this.page * this.limit, this.page * this.limit + this.limit);

    if (temp.length >= this.limit) {
      this.reportsToDisplay = temp;
    } else {
      if (this.hasMore) {
        this.fetchFunction();
      }
    }
  }
}
