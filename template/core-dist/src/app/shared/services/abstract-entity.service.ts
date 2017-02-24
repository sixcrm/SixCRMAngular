import {Headers, Response, Http} from '@angular/http';
import {AuthenticationService} from '../../authentication/authentication.service';
import {Observable, Subject} from 'rxjs';
import {environment} from '../../../environments/environment';

export abstract class AbstractEntityService<T> {

  entities$: Subject<T[]>;
  entitiesHasMore$: Subject<boolean>;
  entity$: Subject<T>;
  entityDeleted$: Subject<T>;
  entityCreated$: Subject<T>;
  entityUpdated$: Subject<T>;

  private cursor: string;

  constructor(
    private http: Http,
    private authService: AuthenticationService,
    private toEntity?: (data: any) => T,
    private indexQuery?: (limit?: number, cursor?: string) => string,
    private viewQuery?: (id: string) => string,
    private deleteQuery?: (id: string) => string,
    private createQuery?: (entity: T) => string,
    private updateQuery?: (entity: T) => string,
  ) {
    this.entities$ = new Subject<T[]>();
    this.entitiesHasMore$ = new Subject<boolean>();
    this.entity$ = new Subject<T>();
    this.entityDeleted$ = new Subject<T>();
    this.entityCreated$ = new Subject<T>();
    this.entityUpdated$ = new Subject<T>();
  };

  getEntities(limit?: number) {
    this.queryRequest(this.indexQuery(limit, this.cursor)).subscribe(
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
      }
    )
  }

  getEntity(id: string) {
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
    this.queryRequest(this.createQuery(entity)).subscribe(
      (data) => {
        let json = data.json().data;
        let entityKey = Object.keys(json)[0];
        let entityData =json[entityKey];

        this.entityCreated$.next(this.toEntity(entityData));
      }
    );
  }

  updateEntity(entity: T): void {
    this.queryRequest(this.updateQuery(entity)).subscribe(
      (data) => {
        let json = data.json().data;
        let entityKey = Object.keys(json)[0];
        let entityData =json[entityKey];

        this.entityUpdated$.next(this.toEntity(entityData));
      }
    );
  }

  protected queryRequest(query: string): Observable<Response> {
    return this.http.post(environment.endpoint, query, { headers: this.generateHeaders()});
  }

  private generateHeaders(): Headers {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', this.authService.getToken());

    return headers;
  }
}
