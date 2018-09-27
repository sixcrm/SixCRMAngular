import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {Router} from '@angular/router';
import {AuthenticationService} from '../../../authentication/authentication.service';
import {utc} from 'moment';

@Component({
  selector: 'perfect-match',
  templateUrl: './perfect-match.component.html',
  styleUrls: ['./perfect-match.component.scss']
})
export class PerfectMatchComponent implements OnInit {

  @Input() entity: any;
  @Output() hidePerfectMatch: EventEmitter<boolean> = new EventEmitter();

  utcf = utc;

  constructor(private router: Router, public authService: AuthenticationService) { }

  ngOnInit() {
  }

  getName(): string {
    if (this.entity.fields.entity_type === 'affiliate') {
      return this.entity.fields.name || 'Unnamed Affiliate';
    }

    return this.entity.fields.name || this.entity.fields.alias || `${this.entity.fields.firstname}  ${this.entity.fields.lastname}`;
  }

  navigateToEntity(): void {
    if (this.entity.fields.entity_type === 'session') {
      this.router.navigate([`/customers`, 'advanced'], {queryParams: {session: this.entity.id}, fragment: 'watermark'});
    } else if (this.entity.fields.entity_type === 'customer') {
      this.router.navigate([`/customers`, 'advanced'], {queryParams: {customer: this.entity.id}});
    } else {
      this.router.navigate([`/${this.entity.fields.entity_type}s`, this.entity.id]);
    }
  }
}
