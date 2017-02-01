import { Component, OnInit } from '@angular/core';
import {SessionsService} from "../../shared/services/sessions.service";

@Component({
  selector: 'sessions',
  templateUrl: './sessions.component.html',
  styleUrls: ['./sessions.component.scss']
})
export class SessionsComponent implements OnInit {

  constructor(private sessionsService: SessionsService) { }

  ngOnInit() {
  }

}
