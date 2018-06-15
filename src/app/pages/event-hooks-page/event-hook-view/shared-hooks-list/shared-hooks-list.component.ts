import {Component, OnInit, OnDestroy, Output, EventEmitter} from '@angular/core';
import {Subscription} from 'rxjs';
import {CustomServerError} from '../../../../shared/models/errors/custom-server-error';
import {EventHook} from '../../../../shared/models/event-hook.model';
import {EventHooksSharedService} from '../../../../entity-services/services/event-hooks-shared.service';

@Component({
  selector: 'shared-hooks-list',
  templateUrl: './shared-hooks-list.component.html',
  styleUrls: ['./shared-hooks-list.component.scss']
})
export class SharedHooksListComponent implements OnInit, OnDestroy {

  @Output() hookSelected: EventEmitter<EventHook> = new EventEmitter();

  hooks: EventHook[];
  sub: Subscription;
  filterString: string;
  selectedType: string;
  types: string[] = [];

  constructor(private sharedService: EventHooksSharedService) { }

  ngOnInit() {
    this.sub = this.sharedService.entities$.subscribe(hooks => {
      if (hooks instanceof CustomServerError) return;

      this.hooks = hooks;

      const filteredTypes = [];
      this.hooks.map(t => t.eventType).forEach(type => {
        if (filteredTypes.indexOf(type) === -1) {
          filteredTypes.push(type);
        }
      });

      this.types = filteredTypes;
    });

    this.sharedService.resetPagination();
    this.sharedService.getEntities();
  }

  ngOnDestroy() {
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }

}
