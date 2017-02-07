import { Component, OnInit } from '@angular/core';
import {EmailsService} from '../../../shared/services/emails.service';
import {ActivatedRoute, Params} from '@angular/router';
import {Email} from '../../../shared/models/email.model';

@Component({
  selector: 'c-email-view',
  templateUrl: './email-view.component.html',
  styleUrls: ['./email-view.component.scss']
})
export class EmailViewComponent implements OnInit {

  private email: Email;

  constructor(private emailsService: EmailsService, private route: ActivatedRoute) { }

  ngOnInit() {
    this.emailsService.entity$.subscribe((data) => this.email = data);
    this.route.params.subscribe((params: Params) => this.emailsService.getEntity(params['id']));
  }

}
