import {Component, OnInit, OnDestroy} from '@angular/core';
import {CustomerNotesService} from '../../../../shared/services/customer-notes.service';
import {CustomerNotesComponent} from '../../../customers-page/customer-view/customer-notes/customer-notes.component';
import {PaginationService} from '../../../../shared/services/pagination.service';
import {MatDialog} from '@angular/material';
import {AuthenticationService} from '../../../../authentication/authentication.service';
import {CustomerNote} from '../../../../shared/models/customer-note.model';

@Component({
  selector: 'grid-notes-component',
  templateUrl: './grid-notes-component.component.html',
  styleUrls: ['./grid-notes-component.component.scss']
})
export class GridNotesComponentComponent extends CustomerNotesComponent implements OnInit, OnDestroy {

  groups: CustomerNote[][] = [[]];

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

    this.notesRefreshed$.takeUntil(this.unsubscribe$).subscribe(() => {
      if (!this.notes || this.notes.length === 0) {
        this.groups = [[],[],[]];
      }

      let group1 = [];
      let group2 = [];
      let group3 = [];

      for (let i = 0; i < this.notes.length; i++) {
        if ((i + 1) % 3 === 0) {
          group1.push(this.notes[i])
        }

        if ((i + 1) % 3 === 1) {
          group2.push(this.notes[i])
        }

        if ((i + 1) % 3 === 2) {
          group3.push(this.notes[i])
        }
      }

      this.groups = [group1, group2, group3];
    })
  }

  ngOnDestroy() {
    super.ngOnDestroy()
  }

}
