import {Component, OnInit, OnDestroy} from '@angular/core';
import {AbstractEntityViewComponent} from '../../abstract-entity-view.component';
import {EventHook} from '../../../shared/models/event-hook.model';
import {EventHooksService} from '../../../entity-services/services/event-hooks.service';
import {TabHeaderElement} from '../../../shared/components/tab-header/tab-header.component';
import {BreadcrumbItem} from '../../components/models/breadcrumb-item.model';
import {ActivatedRoute} from '@angular/router';
import {NavigationService} from '../../../navigation/navigation.service';
import {EventHooksSharedService} from '../../../entity-services/services/event-hooks-shared.service';

@Component({
  selector: 'event-hook-view',
  templateUrl: './event-hook-view.component.html',
  styleUrls: ['./event-hook-view.component.scss']
})
export class EventHookViewComponent extends AbstractEntityViewComponent<EventHook> implements OnInit, OnDestroy {

  selectedIndex: number = 0;

  tabHeaders: TabHeaderElement[] = [
    {name: 'general', label: 'EVENTHOOK_TAB_GENERAL'}
  ];

  breadcrumbs: BreadcrumbItem[] = [
    {label: () => 'EVENTHOOK_INDEX_TITLE', url: '/eventhooks'},
    {label: () => this.entity.name}
  ];

  isShared: boolean;

  constructor(eventHooksService: EventHooksService,
              private sharedService: EventHooksSharedService,
              private activatedRoute: ActivatedRoute,
              public navigation: NavigationService
  ) {
    super(eventHooksService, activatedRoute);
  }

  ngOnInit() {

    this.activatedRoute.url.subscribe(data => {
      if (data[0].path === 'shared') {
        this.service = this.sharedService;
        this.isShared = true;
      }

      this.init(() => this.navigation.goToNotFoundPage());
    });

    this.init(() => this.navigation.goToNotFoundPage());
  }

  ngOnDestroy() {
    this.destroy();
  }

  setIndex(value): void {
    this.selectedIndex = value;
  }

  appendHookBody(eventHook: EventHook) {
    if (!eventHook.hookDecoded) return;

    if (this.entity.hookDecoded) {
      this.entity.hookDecoded += '\n';
    }

    this.entity.hookDecoded += eventHook.hookDecoded
  }
}
