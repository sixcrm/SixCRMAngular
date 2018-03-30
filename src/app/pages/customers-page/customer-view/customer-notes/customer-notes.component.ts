import {Component, OnInit, Input, OnDestroy} from '@angular/core';
import {CustomerNote} from '../../../../shared/models/customer-note.model';
import {CustomerNotesService} from '../../../../shared/services/customer-notes.service';
import {AuthenticationService} from '../../../../authentication/authentication.service';
import {AbstractEntityIndexComponent} from '../../../abstract-entity-index.component';
import {PaginationService} from '../../../../shared/services/pagination.service';
import {MdDialog} from '@angular/material';
import {firstIndexOf} from '../../../../shared/utils/array.utils';
import {customerNotesByCustomerQuery} from '../../../../shared/utils/queries/entities/customer-note.queries';
import {CustomServerError} from '../../../../shared/models/errors/custom-server-error';
import {IndexQueryParameters} from '../../../../shared/utils/queries/index-query-parameters.model';

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
    paginationService: PaginationService,
  ) {
    super(customerNotesService, auth, dialog, paginationService);
    this.setInfiniteScroll(true);
  }

  ngOnInit() {
    this.service.indexQuery = (params: IndexQueryParameters) => customerNotesByCustomerQuery(this.customerId, params);
    this.shareLimit = false;
    this.limit = 50;

    this.service.entities$.takeUntil(this.unsubscribe$).subscribe(notes => {
      if (notes instanceof CustomServerError) {
        this.serverError = notes;
        return;
      }

      this.serverError = null;
      this.hasMore = notes && notes.length === this.limit;
      this.notes = [...this.notes, ...notes];
    });

    this.service.entityCreated$.takeUntil(this.unsubscribe$).subscribe(note => {
      if (note instanceof CustomServerError) {
        this.serverError = note;
        return;
      }

      this.serverError = null;
      this.notes.unshift(note);
      this.closeNote();
    });

    this.service.entityDeleted$.takeUntil(this.unsubscribe$).subscribe(note => {
      if (note instanceof CustomServerError) {
        this.serverError = note;
        return;
      }

      this.serverError = null;
      this.deleteNoteLocally(note);
    });

    this.init(!!this.customerId);
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
    }
  }

  refreshData() {
    this.loadingData = true;
    this.serverError = null;
    this.service.getEntities(this.limit);
  }

  deleteNoteLocally(note: CustomerNote): void {
    let index = firstIndexOf(this.notes, (el) => el.id === note.id);

    if (index > -1) {
      this.notes.splice(index, 1);
    }
  }
}
