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

  @Output()
  close: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor() { }

  ngOnInit() {
  }

}
