import {Headers, Response, Http} from '@angular/http';
import {AuthenticationService} from '../../authentication/authentication.service';
import {Observable, Subject, BehaviorSubject} from 'rxjs';
import {environment} from '../../../environments/environment';

export abstract class AbstractEntityService<T> {

  entities$: Subject<T[]>;
  entitiesHasMore$: Subject<boolean>;
  entity$: Subject<T>;
  entityDeleted$: Subject<T>;
  entityCreated$: Subject<T>;
  entityUpdated$: Subject<T>;
  requestInProgress$: BehaviorSubject<boolean>;

  protected cursor: string;

  constructor(
    private http: Http,
    protected authService: AuthenticationService,
    private toEntity?: (data: any) => T,
    public indexQuery?: (limit?: number, cursor?: string) => string,
    private viewQuery?: (id: string) => string,
    private deleteQuery?: (id: string) => string,
    private createQuery?: (entity: T) => string,
    private updateQuery?: (entity: T) => string,
    private accessRole?: string
  ) {
    this.entities$ = new Subject<T[]>();
    this.entitiesHasMore$ = new Subject<boolean>();
    this.entity$ = new Subject<T>();
    this.entityDeleted$ = new Subject<T>();
    this.entityCreated$ = new Subject<T>();
    this.entityUpdated$ = new Subject<T>();
    this.requestInProgress$ = new BehaviorSubject<boolean>(false);
  };

  getEntities(limit?: number): void {
    this.customEntitiesQuery(this.indexQuery(limit, this.cursor));
  }

  getEntity(id: string): void {
    if (!this.hasViewPermission()) {
      return;
    }

    this.queryRequest(this.viewQuery(id)).subscribe(
      (data) => {
        let json = data.json().data;
        let entityKey = Object.keys(json)[0];
        let entityData =json[entityKey];

        this.entity$.next(this.toEntity(entityData));
      },
      (error) => {
        console.error(error);
      }
    )
  }

  deleteEntity(id: string): void {
    if (!this.hasWritePermission()) {
      return;
    }

    this.queryRequest(this.deleteQuery(id)).subscribe(
      (data) => {
        let json = data.json().data;
        let entityKey = Object.keys(json)[0];
        let entityData =json[entityKey];

        this.entityDeleted$.next(this.toEntity(entityData));
      },
      (error) => console.error(error)
    );
  }

  createEntity(entity: T): void {
    if (!this.hasWritePermission()) {
      return;
    }

    this.queryRequest(this.createQuery(entity)).subscribe(
      (data) => {
        let json = data.json().data;
        let entityKey = Object.keys(json)[0];
        let entityData =json[entityKey];

        this.entityCreated$.next(this.toEntity(entityData));
      }
    );
  }

  updateEntity(entity: T, ignorePermissions?: boolean): void {
    if (!ignorePermissions && !this.hasWritePermission()) {
      return;
    }

    this.queryRequest(this.updateQuery(entity)).subscribe(
      (data) => {
        let json = data.json().data;
        let entityKey = Object.keys(json)[0];
        let entityData =json[entityKey];

        this.entityUpdated$.next(this.toEntity(entityData));
      }
    );
  }

  resetPagination(): void {
    this.cursor = '';
  }

  hasWritePermission(): boolean {
    if (this.accessRole === 'default') {
      return true;
    }

    return this.authService.hasPermissions(this.accessRole, 'write');
  }

  hasViewPermission(): boolean {
    if (this.accessRole === 'default') {
      return true;
    }

    return this.authService.hasPermissions(this.accessRole, 'view');
  }

  hasReadPermission(): boolean {
    if (this.accessRole === 'default') {
      return true;
    }

    return this.authService.hasPermissions(this.accessRole, 'read');
  }

  protected customEntitiesQuery(query: string): void {
    if (!this.hasViewPermission()) {
      return;
    }

    this.requestInProgress$.next(true);
    this.queryRequest(query).subscribe(
      (data) => {
        let json = data.json().data;
        let listKey = Object.keys(json)[0];
        let listData = json[listKey];

        let entitiesKey = Object.keys(listData)[0];
        let entitiesData = listData[entitiesKey];

        if (listData.pagination) {
          this.entitiesHasMore$.next(listData.pagination.end_cursor !== '' && listData.pagination.has_next_page);
          this.cursor = listData.pagination.end_cursor;
        }

        if (entitiesData) {
          this.entities$.next(entitiesData.map(entity => this.toEntity(entity)));
        } else {
          this.entities$.next([]);
        }
      },
      (error) => {
        console.error(error);
      },
      () => {
        this.requestInProgress$.next(false);
      }
    )
  }


  protected queryRequest(query: string): Observable<Response> {
    // let endpoint = environment.endpoint + 'ffdb91c2-d2dc-4301-86a4-a48f64c6c503';
    let endpoint = environment.endpoint;


    if (this.authService.getActiveAcl() && this.authService.getActiveAcl().account) {
      endpoint = endpoint + this.authService.getActiveAcl().account.id;
    } else {
      endpoint = endpoint + '*';
    }

    return this.http.post(endpoint, query, { headers: this.generateHeaders()});
  }

  private generateHeaders(): Headers {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', this.authService.getToken());

    return headers;
  }
}
