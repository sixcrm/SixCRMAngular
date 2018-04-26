import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import {AuthenticationService} from '../../../authentication/authentication.service';
import {utc, tz} from 'moment-timezone';

@Component({
  selector: 'entity-list',
  templateUrl: './entity-list.component.html',
  styleUrls: ['./entity-list.component.scss']
})
export class EntityListComponent implements OnInit {

  @Input() query: string;
  @Input() data: any[] = [];
  @Input() selectedEntity: any;

  @Output() select: EventEmitter<any> = new EventEmitter();

  constructor(private authService: AuthenticationService) { }

  ngOnInit() {
  }

  getName(entity): string {
    return entity.fields.name || entity.fields.alias || `${entity.fields.firstname}  ${entity.fields.lastname}`;
  }

  format(date: string): string {
    return utc(date).tz(this.authService.getTimezone()).format('MM/DD/YYYY');
  }

  getFieldValue(entity): string {
    switch (entity.fields.entity_type) {
      case 'customer': return entity.fields.email;
      case 'affiliate': return entity.fields.affiliate_id;
      case 'product': return entity.fields.sku;
      default: return '';
    }
  }

  selectEntity(entity): void {
    this.select.emit(entity);
  }
}
