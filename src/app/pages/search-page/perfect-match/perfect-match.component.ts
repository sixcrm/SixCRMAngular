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
    return this.entity.fields.name || this.entity.fields.alias || `${this.entity.fields.firstname}  ${this.entity.fields.lastname}`;
  }

  navigateToEntity(): void {
    this.router.navigate([`/${this.entity.fields.entity_type}s`, this.entity.id]);
  }
}
