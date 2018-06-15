import {Component, OnInit, OnDestroy} from '@angular/core';
import {EventHook} from '../../../../shared/models/event-hook.model';
import {ColumnParams} from '../../../../shared/models/column-params.model';
import {ActivatedRoute, Router} from '@angular/router';
import {PaginationService} from '../../../../shared/services/pagination.service';
import {AuthenticationService} from '../../../../authentication/authentication.service';
import {AbstractEntityIndexComponent} from '../../../abstract-entity-index.component';
import {EventHooksSharedService} from '../../../../entity-services/services/event-hooks-shared.service';
import {MatDialog} from '@angular/material';

@Component({
  selector: 'event-hooks-shared',
  templateUrl: './event-hooks-shared.component.html',
  styleUrls: ['./event-hooks-shared.component.scss']
})
export class EventHooksSharedComponent extends AbstractEntityIndexComponent<EventHook> implements OnInit, OnDestroy {

  constructor(
    eventHooksService: EventHooksSharedService,
    auth: AuthenticationService,
    dialog: MatDialog,
    paginationService: PaginationService,
    router: Router,
    activatedRoute: ActivatedRoute
  ) {
    super(eventHooksService, auth, dialog, paginationService, router, activatedRoute);

    this.entityFactory = () => new EventHook({});

    let f = this.authService.getTimezone();
    this.columnParams = [
      new ColumnParams('EVENTHOOK_INDEX_HEADER_ID', (e: EventHook) => e.id).setSelected(false),
      new ColumnParams('EVENTHOOK_INDEX_HEADER_NAME', (e: EventHook) => e.name),
      new ColumnParams('EVENTHOOK_INDEX_HEADER_ACTIVE', (e: EventHook) => e.active),
      new ColumnParams('EVENTHOOK_INDEX_HEADER_TYPE', (e: EventHook) => e.eventType),
      new ColumnParams('EVENTHOOK_INDEX_HEADER_CREATED', (e: EventHook) => e.createdAt.tz(f).format('MM/DD/YYYY')).setSelected(false),
      new ColumnParams('EVENTHOOK_INDEX_HEADER_UPDATED', (e: EventHook) => e.createdAt.tz(f).format('MM/DD/YYYY')).setSelected(false)
    ];
  }

  ngOnInit() {
    this.init();
  }

  ngOnDestroy() {
    this.destroy();
  }

  copyHook(eventHook: EventHook) {
    const hook = eventHook.copy();
    hook.name += ' Copy';

    this.createEntity(hook);
  }

  viewEntity(id: string, shared?: boolean): void {
    let params = [id];
    if (shared) params.unshift('shared');

    this.router.navigate(params, {relativeTo: this.activatedRoute});
  }
}
