import {Response} from '@angular/http';
import {AuthenticationService} from '../../authentication/authentication.service';
import {Observable, Subject, BehaviorSubject} from 'rxjs';
import {environment} from '../../../environments/environment';
import {
  extractData, HttpWrapperService, generateHeaders, FailStrategy,
  RequestBehaviourOptions
} from './http-wrapper.service';
import {CustomServerError} from '../models/errors/custom-server-error';
import {MdSnackBar} from '@angular/material';
import {ErrorSnackBarComponent, SnackBarType} from '../components/error-snack-bar/error-snack-bar.component';

export abstract class AbstractEntityService<T> {

  entities$: Subject<T[] | CustomServerError>;
  entitiesHasMore$: Subject<boolean>;
  entity$: Subject<T | CustomServerError>;
  entityDeleted$: Subject<T | CustomServerError>;
  entityCreated$: Subject<T | CustomServerError>;
  entityUpdated$: Subject<T | CustomServerError>;
  requestInProgress$: BehaviorSubject<boolean>;

  protected cursor: string;

  constructor(
    private http: HttpWrapperService,
    protected authService: AuthenticationService,
    private toEntity: (data: any) => T,
    public indexQuery: (limit?: number, cursor?: string) => string,
    private viewQuery: (id: string) => string,
    private deleteQuery: (id: string) => string,
    private createQuery: (entity: T) => string,
    private updateQuery: (entity: T) => string,
    private accessRole: string,
    private snackBar: MdSnackBar
  ) {
    this.entities$ = new Subject<T[] | CustomServerError>();
    this.entitiesHasMore$ = new Subject<boolean>();
    this.entity$ = new Subject<T>();
    this.entityDeleted$ = new Subject<T>();
    this.entityCreated$ = new Subject<T>();
    this.entityUpdated$ = new Subject<T>();
    this.requestInProgress$ = new BehaviorSubject<boolean>(false);
  };

  getEntities(limit?: number, requestBehaviourOptions?: RequestBehaviourOptions): void {
    this.customEntitiesQuery(this.indexQuery(limit, this.cursor), requestBehaviourOptions);
  }

  getEntity(id: string): void {
    if (!this.hasViewPermission()) {
      return;
    }

    this.queryRequest(this.viewQuery(id)).subscribe(data => {
      if (data instanceof CustomServerError) {
        this.entity$.next(data);
        return;
      }

      const json = extractData(data);
      const entityKey = Object.keys(json)[0];
      const entityData =json[entityKey];

      this.entity$.next(this.toEntity(entityData));
    })
  }

  deleteEntity(id: string): void {
    if (!this.hasWritePermission()) {
      return;
    }

    this.queryRequest(this.deleteQuery(id)).subscribe(data => {
      if (data instanceof CustomServerError) {
        this.entityDeleted$.next(data);
        return;
      }

      const json = extractData(data);
      const entityKey = Object.keys(json)[0];
      const entityData =json[entityKey];

      this.openSnackBar('SNACK_DELETED');
      this.entityDeleted$.next(this.toEntity(entityData));
    });
  }

  openSnackBar(message: string) {
    const ctx = this.snackBar.openFromComponent(ErrorSnackBarComponent, {duration: 2000});
    const instance = ctx.instance;

    instance.message = message;
    instance.type = SnackBarType.success;
  }

  createEntity(entity: T): void {
    if (!this.hasWritePermission()) {
      return;
    }

    this.queryRequest(this.createQuery(entity)).subscribe(data => {
      if (data instanceof CustomServerError) {
        this.entityCreated$.next(data);
        return;
      }

      const json = extractData(data);
      const entityKey = Object.keys(json)[0];
      const entityData =json[entityKey];

      this.openSnackBar('SNACK_CREATED');
      this.entityCreated$.next(this.toEntity(entityData));
    });
  }

  updateEntity(entity: T, options?: {ignoreSnack?: boolean, ignoreProgress?: boolean, ignorePermissions?: boolean}): void {
    if ((!options || !options.ignorePermissions) && !this.hasWritePermission()) {
      return;
    }

    this.queryRequest(this.updateQuery(entity), {ignoreProgress: options && options.ignoreProgress}).subscribe(data => {
      if (data instanceof CustomServerError) {
        this.entityUpdated$.next(data);
        return;
      }

      const json = extractData(data);
      const entityKey = Object.keys(json)[0];
      const entityData =json[entityKey];

      if (!options || !options.ignoreSnack) {
        this.openSnackBar('SNACK_UPDATED');
      }

      this.entityUpdated$.next(this.toEntity(entityData));
    });
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

  customEntitiesQuery(query: string, requestBehaviourOptions?: RequestBehaviourOptions): void {
    if (!this.hasViewPermission()) {
      return;
    }

    this.requestInProgress$.next(true);
    this.queryRequest(query, requestBehaviourOptions).subscribe(data => {
        if (data instanceof CustomServerError) {
          this.entities$.next(data);
          return;
        }

        const json = extractData(data);
        const listKey = Object.keys(json)[0];
        const listData = json[listKey];

        const entitiesKey = listData ? Object.keys(listData)[0] : null;
        const entitiesData = entitiesKey ? listData[entitiesKey] : null;

        if (listData && listData.pagination) {
          this.entitiesHasMore$.next(listData.pagination.end_cursor !== '' && listData.pagination.has_next_page);
          this.cursor = listData.pagination.end_cursor;
        }

        if (entitiesData) {
          this.entities$.next(entitiesData.map(entity => this.toEntity(entity)));
        } else {
          this.entities$.next([]);
        }
      },
      () => {
        // not handling error, wrapper will do that for us
      },
      () => {
        this.requestInProgress$.next(false)
      }
    )
  }

  planeCustomEntitiesQuery(query: string): Observable<T[]> {
    return this.queryRequest(query).map(data => {
      if (data instanceof CustomServerError) {
        return [];
      }

      const json = extractData(data);
      const listKey = Object.keys(json)[0];
      const listData = json[listKey];

      const entitiesKey = listData ? Object.keys(listData)[0] : null;
      const entitiesData = entitiesKey ? listData[entitiesKey] : null;

      if (entitiesData) {
        return entitiesData.map(entity => this.toEntity(entity));
      } else {
        return [];
      }
    })
  }

  protected queryRequest(query: string, requestBehaviourOptions?: RequestBehaviourOptions): Observable<Response | CustomServerError> {
    let endpoint = environment.endpoint;

    if (this.authService.getActingAsAccount()) {
      endpoint += this.authService.getActingAsAccount().id;
    } else if (this.authService.getActiveAcl() && this.authService.getActiveAcl().account) {
      endpoint += this.authService.getActiveAcl().account.id;
    } else {
      endpoint += '*';
    }

    return this.http.postWithError(endpoint, query, { headers: generateHeaders(this.authService.getToken())}, requestBehaviourOptions);
  }
}
