import { Component, OnInit, Input } from '@angular/core';
import {AuthenticationService} from '../../../authentication/authentication.service';
import {utc, tz} from 'moment-timezone';
import {Router} from '@angular/router';

@Component({
  selector: 'entity-list',
  templateUrl: './entity-list.component.html',
  styleUrls: ['./entity-list.component.scss']
})
export class EntityListComponent implements OnInit {

  @Input() query: string;
  @Input() data: any[] = [];

  constructor(private authService: AuthenticationService, private router: Router) { }

  ngOnInit() {
  }

  getName(entity): string {
    return entity.fields.name || entity.fields.alias || `${entity.fields.firstname}  ${entity.fields.lastname}`;
  }

  format(date: string): string {
    return utc(date).tz(this.authService.getTimezone()).format('MM/DD/YYYY');
  }

  navigateToEntity(entity): void {
    this.router.navigate([`/${entity.fields.entity_type}s`, entity.id]);
  }
}
