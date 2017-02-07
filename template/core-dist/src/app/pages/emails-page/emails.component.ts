import { Component, OnInit } from '@angular/core';
import {AbstractEntityIndexComponent} from '../abstract-entity-index.component';
import {Router, ActivatedRoute} from '@angular/router';
import {Email} from '../../shared/models/email.model';
import {EmailsService} from '../../shared/services/emails.service';

@Component({
  selector: 'c-emails',
  templateUrl: './emails.component.html',
  styleUrls: ['./emails.component.scss']
})
export class EmailsComponent extends AbstractEntityIndexComponent implements OnInit {

  private emails: Email[];

  constructor(private emailsService: EmailsService, router: Router, route: ActivatedRoute) {
    super(emailsService, router, route);
  }

  ngOnInit() {
    this.emailsService.entities$.subscribe((data) => this.emails = data);
    this.emailsService.getEntities();
  }

}
