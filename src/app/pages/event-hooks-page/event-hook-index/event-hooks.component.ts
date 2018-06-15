import {Component, OnInit, OnDestroy} from '@angular/core';
import {TabHeaderElement} from '../../../shared/components/tab-header/tab-header.component';
import {EventHook} from '../../../shared/models/event-hook.model';
import {Modes} from '../../abstract-entity-view.component';
import {EventHooksService} from '../../../entity-services/services/event-hooks.service';

@Component({
  selector: 'event-hooks',
  templateUrl: './event-hooks.component.html',
  styleUrls: ['./event-hooks.component.scss']
})
export class EventHooksComponent implements OnInit, OnDestroy {

  tabHeaders: TabHeaderElement[] = [
    {name: 'custom', label: 'EVENTHOOK_TAB_CUSTOM'},
    {name: 'shared', label: 'EVENTHOOK_TAB_SHARED'}
  ];

  selectedIndex: number = 0;
  addMode: boolean;
  entity: EventHook = new EventHook();
  modes = Modes;

  constructor(private eventHookService: EventHooksService) { }

  ngOnInit() { }

  ngOnDestroy() { }

  setIndex(value: number) {
    this.selectedIndex = value;
  }

  toggleAddModal() {
    this.addMode = !this.addMode;
  }

  closeAddMode() {
    this.addMode = false;
    this.entity = new EventHook();
  }

  overlayClicked(event: any): void {
    if (event && event.target && event.target.className === 'full-overlay') {
      this.closeAddMode();
    }
  }

  saveEventHook(eventHook: EventHook): void {
    this.eventHookService.createEntity(eventHook);
  }
}
