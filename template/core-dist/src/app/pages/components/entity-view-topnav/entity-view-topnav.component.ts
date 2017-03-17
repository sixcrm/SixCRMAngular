import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {AbstractEntityService} from '../../../shared/services/abstract-entity.service';

@Component({
  selector: 'entity-view-topnav',
  templateUrl: './entity-view-topnav.component.html',
  styleUrls: ['./entity-view-topnav.component.scss']
})
export class EntityViewTopnavComponent implements OnInit {

  @Input()
  service: AbstractEntityService<any>;

  @Input()
  mode: string;

  @Output()
  close: EventEmitter<boolean> = new EventEmitter<boolean>();

  @Output()
  del: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor() { }

  ngOnInit() {
  }

  deleteEntity(): void {
    this.del.emit(true);
  }

}
