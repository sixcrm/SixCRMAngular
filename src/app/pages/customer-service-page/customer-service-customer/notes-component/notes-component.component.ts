import {Component, OnInit, OnDestroy} from '@angular/core';
import {CustomerNotesService} from '../../../../shared/services/customer-notes.service';
import {CustomerNotesComponent} from '../../../customers-page/customer-view/customer-notes/customer-notes.component';
import {PaginationService} from '../../../../shared/services/pagination.service';
import {MatDialog} from '@angular/material';
import {AuthenticationService} from '../../../../authentication/authentication.service';
import {CustomerNote} from '../../../../shared/models/customer-note.model';

@Component({
  selector: 'notes-component',
  templateUrl: './notes-component.component.html',
  styleUrls: ['./notes-component.component.scss']
})
export class NotesComponentComponent extends CustomerNotesComponent implements OnInit, OnDestroy {

  constructor(
    customerNotesService: CustomerNotesService,
    auth: AuthenticationService,
    dialog: MatDialog,
    paginationService: PaginationService,
  ) {
    super(customerNotesService, auth, dialog, paginationService);
  }

  ngOnInit() {
    super.ngOnInit();
  }

  ngOnDestroy() {
    super.ngOnDestroy()
  }

}
