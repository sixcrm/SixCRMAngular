import {HttpResponse} from '@angular/common/http';
import {AuthenticationService} from '../../authentication/authentication.service';
import {Observable, Subject, BehaviorSubject} from 'rxjs';
import {environment} from '../../../environments/environment';
import {extractData, HttpWrapperService, generateHeaders, RequestBehaviourOptions} from '../../shared/services/http-wrapper.service';
import {CustomServerError} from '../../shared/models/errors/custom-server-error';
import {ErrorSnackBarComponent, SnackBarType} from '../../shared/components/error-snack-bar/error-snack-bar.component';
import {IndexQueryParameters} from '../../shared/utils/queries/index-query-parameters.model';
import {MatSnackBar} from '@angular/material';

export abstract class AbstractEntityService<T> {

  entities$: Subject<T[] | CustomServerError>;
  entitiesHasMore$: Subject<boolean>;
  entity$: Subject<T | CustomServerError>;
  entityDeleted$: Subject<T | CustomServerError>;
  entityCreated$: Subject<T | CustomServerError>;
  entityUpdated$: Subject<T | CustomServerError>;
  requestInProgress$: BehaviorSubject<boolean>;

  protected cursor: string;
  protected exclusiveStartKey: string;

  constructor(
    protected http: HttpWrapperService,
    protected authService: AuthenticationService,
    protected toEntity: (data: any) => T,
    public indexQuery: (params: IndexQueryParameters) => string,
    public viewQuery: (id: string) => string,
    public deleteQuery: (id: string) => string,
    public deleteManyQuery: (id: string[]) => string,
    public createQuery: (entity: T) => string,
    public updateQuery: (entity: T) => string,
    public updateManyQuery: (entities: T[]) => string,
    public accessRole: string,
    public snackBar: MatSnackBar
  ) {
    this.entities$ = new Subject<T[] | CustomServerError>();
    this.entitiesHasMore$ = new Subject<boolean>();
    this.entity$ = new Subject<T>();
    this.entityDeleted$ = new Subject<T>();
    this.entityCreated$ = new Subject<T>();
    this.entityUpdated$ = new Subject<T>();
    this.requestInProgress$ = new BehaviorSubject<boolean>(false);
  };

  getEntities(limit?: number, search?: string, requestBehaviourOptions?: RequestBehaviourOptions): void {
    this.customEntitiesQuery(
      this.indexQuery({
        limit: limit,
        cursor: this.cursor,
        search: search,
        exclusiveStartKey: this.exclusiveStartKey
      }),
      requestBehaviourOptions
    );
  }

  getEntity(id: string): void {
    this.customEntityQuery(this.viewQuery(id), {});
  }

  fetchEntity(id: string): Observable<CustomServerError | T> {
    if (!this.hasViewPermission()) {
      return;
    }

    return this.queryRequest(this.viewQuery(id), {}).map(data => {
      if (data instanceof CustomServerError) {
        return data;
      }

      const json = extractData(data);
      const entityKey = Object.keys(json)[0];
      const entityData =json[entityKey];

      return this.toEntity(entityData);
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

  deleteEntities(id: string[]): void {
    if (!this.hasWritePermission() || !this.deleteManyQuery) {
      return;
    }

    this.queryRequest(this.deleteManyQuery(id)).subscribe(data => {
      if (data instanceof CustomServerError) {
        this.entityDeleted$.next(data);
        return;
      }

      const json = extractData(data);

      Object.keys(json).forEach(key => {
        this.entityDeleted$.next(this.toEntity(json[key]));
      });

      this.openSnackBar('SNACK_DELETED');
    });
  }

  openSnackBar(message: string) {
    this.snackBar.openFromComponent(
      ErrorSnackBarComponent, {duration: 2000, data: {message: message, type: SnackBarType.success}});
  }

  createEntity(entity: T, options?: {ignoreSnack?: boolean}): void {
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

      if (!options || !options.ignoreSnack) {
        this.openSnackBar('SNACK_CREATED');
      }
      this.entityCreated$.next(this.toEntity(entityData));
    });
  }

  fetchCreateEntity(entity: T): Observable<CustomServerError | T> {
    if (!this.hasWritePermission()) {
      return;
    }

    return this.queryRequest(this.createQuery(entity)).map(data => {
      if (data instanceof CustomServerError) {
        return data;
      }

      const json = extractData(data);
      const entityKey = Object.keys(json)[0];
      const entityData =json[entityKey];

      return this.toEntity(entityData);
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

  updateEntities(entities: T[]): void {
    if (!this.hasWritePermission() || !this.updateManyQuery || entities.length < 1) {
      return;
    }

    this.queryRequest(this.updateManyQuery(entities)).subscribe(data => {
      if (data instanceof CustomServerError) {
        this.entityUpdated$.next(data);
        return;
      }

      const json = extractData(data);

      Object.keys(json).forEach(key => {
        this.entityUpdated$.next(this.toEntity(json[key]));
      });

      this.openSnackBar('SNACK_UPDATED');
    });
  }

  resetPagination(): void {
    this.cursor = '';
    this.exclusiveStartKey = '';
  }

  hasWritePermission(): boolean {
    if (this.accessRole === 'default') {
      return true;
    }

    return this.authService.hasPermissions(this.accessRole, 'create');
  }

  hasViewPermission(): boolean {
    if (this.accessRole === 'default') {
      return true;
    }

    return this.authService.hasPermissions(this.accessRole, 'read');
  }

  hasReadPermission(): boolean {
    if (this.accessRole === 'default') {
      return true;
    }

    return this.authService.hasPermissions(this.accessRole, 'read');
  }

  customEntitiesQuery(query: string, requestBehaviourOptions?: RequestBehaviourOptions): void {
    if (!(requestBehaviourOptions && requestBehaviourOptions.ignorePermissions) && !this.hasViewPermission()) {
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
          this.exclusiveStartKey = listData.pagination.last_evaluated;
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

  customEntityQuery(query: string, requestBehaviourOptions?: RequestBehaviourOptions): void {
    if (!this.hasViewPermission()) {
      return;
    }

    this.queryRequest(query, requestBehaviourOptions).subscribe(data => {
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

  planeCustomEntitiesQuery(query: string, requestBehaviourOptions?: RequestBehaviourOptions): Observable<T[]> {
    return this.queryRequest(query, requestBehaviourOptions).map(data => {
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

  protected queryRequest(query: string, requestBehaviourOptions?: RequestBehaviourOptions, forceAccount?: string): Observable<HttpResponse<any> | CustomServerError> {
    let endpoint = environment.endpoint;

    if (forceAccount) {
      endpoint += forceAccount;
    } else {

      if (this.authService.getActingAsAccount()) {
        endpoint += this.authService.getActingAsAccount().id;
      } else if (this.authService.getActiveAcl() && this.authService.getActiveAcl().account) {
        endpoint += this.authService.getActiveAcl().account.id;
      } else {
        endpoint += '*';
      }

    }

    return this.http.postWithError(endpoint, query, { headers: generateHeaders(this.authService.getToken())}, requestBehaviourOptions);
  }
}
