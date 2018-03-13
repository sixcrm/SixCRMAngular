import {Component, OnInit, OnDestroy, Output, EventEmitter} from '@angular/core';
import {AbstractEntityIndexComponent} from '../../../abstract-entity-index.component';
import {EventHook} from '../../../../shared/models/event-hook.model';
import {EventHooksService} from '../../../../shared/services/event-hooks.service';
import {AuthenticationService} from '../../../../authentication/authentication.service';
import {MdDialog} from '@angular/material';
import {PaginationService} from '../../../../shared/services/pagination.service';
import {Router, ActivatedRoute} from '@angular/router';
import {ColumnParams} from '../../../../shared/models/column-params.model';

@Component({
  selector: 'event-hooks-custom',
  templateUrl: './event-hooks-custom.component.html',
  styleUrls: ['./event-hooks-custom.component.scss']
})
export class EventHooksCustomComponent extends AbstractEntityIndexComponent<EventHook> implements OnInit, OnDestroy {

  @Output() addSelected: EventEmitter<boolean> = new EventEmitter();

  constructor(
    eventHooksService: EventHooksService,
    auth: AuthenticationService,
    dialog: MdDialog,
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

}
