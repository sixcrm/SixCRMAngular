import {Component, OnInit, Input, OnDestroy} from '@angular/core';
import {CustomerNote} from '../../../../shared/models/customer-note.model';
import {CustomerNotesService} from '../../../../shared/services/customer-notes.service';
import {ProgressBarService} from '../../../../shared/services/progress-bar.service';
import {AuthenticationService} from '../../../../authentication/authentication.service';
import {AbstractEntityIndexComponent} from '../../../abstract-entity-index.component';
import {customerNotesByCustomerQuery} from '../../../../shared/utils/query-builder';
import {ActivatedRoute, Router} from '@angular/router';
import {PaginationService} from '../../../../shared/services/pagination.service';
import {MdDialog} from '@angular/material';
import {CustomersService} from '../../../../shared/services/customers.service';
import {firstIndexOf} from '../../../../shared/utils/array-utils';

@Component({
  selector: 'customer-notes',
  templateUrl: './customer-notes.component.html',
  styleUrls: ['./customer-notes.component.scss']
})
export class CustomerNotesComponent extends AbstractEntityIndexComponent<CustomerNote> implements OnInit, OnDestroy {

  @Input() customerId: string;

  notes: CustomerNote[] = [];
  showNewNote: boolean;
  note: string;

  constructor(
    customerNotesService: CustomerNotesService,
    auth: AuthenticationService,
    dialog: MdDialog,
    progressBarService: ProgressBarService,
    paginationService: PaginationService,
  ) {
    super(customerNotesService, auth, dialog, progressBarService, paginationService);
    this.setInfiniteScroll(true);
  }

  ngOnInit() {
    this.service.indexQuery = (limit?: number, cursor?: string) => customerNotesByCustomerQuery(this.customerId, limit, cursor);
    this.shareLimit = false;
    this.limit = 8;

    this.service.entities$.takeUntil(this.unsubscribe$).subscribe(notes => {
      this.hasMore = notes && notes.length === this.limit;
      this.notes = [...this.notes, ...notes];
      this.progressBarService.hideTopProgressBar();
    });

    this.service.entityCreated$.takeUntil(this.unsubscribe$).subscribe(note => {
      this.notes.unshift(note);
      this.closeNote();
      this.progressBarService.hideTopProgressBar();
    });

    this.service.entityDeleted$.takeUntil(this.unsubscribe$).subscribe(note => {
      this.deleteNoteLocally(note);
    });

    this.init();
  }

  onScroll(): void {
    if (!this.loadingData && this.hasMore) {
      this.loadingData = true;
      this.service.getEntities(this.limit);
    }
  }

  ngOnDestroy() {
    this.destroy();
  }

  newNote(): void {
    this.note = '';
    this.showNewNote = true;
  }

  closeNote(): void {
    this.note = '';
    this.showNewNote = false;
  }

  saveNote(): void {
    if (this.note) {
      let customerNote = new CustomerNote({customer: {id: this.customerId}, user: {id: this.authService.getSixUser().id}, body: this.note});
      this.service.createEntity(customerNote);
      this.progressBarService.showTopProgressBar();
    }
  }

  deleteNoteLocally(note: CustomerNote): void {
    let index = firstIndexOf(this.notes, (el) => el.id === note.id);

    if (index > -1) {
      this.notes.splice(index, 1);
    }
  }
}
