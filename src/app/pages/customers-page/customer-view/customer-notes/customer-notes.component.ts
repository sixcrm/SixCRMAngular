import {Component, OnInit, Input, OnDestroy} from '@angular/core';
import {CustomerNote} from '../../../../shared/models/customer-note.model';
import {CustomerNotesService} from '../../../../entity-services/services/customer-notes.service';
import {AuthenticationService} from '../../../../authentication/authentication.service';
import {AbstractEntityIndexComponent} from '../../../abstract-entity-index.component';
import {PaginationService} from '../../../../shared/services/pagination.service';
import {firstIndexOf} from '../../../../shared/utils/array.utils';
import {customerNotesByCustomerQuery} from '../../../../shared/utils/queries/entities/customer-note.queries';
import {CustomServerError} from '../../../../shared/models/errors/custom-server-error';
import {IndexQueryParameters} from '../../../../shared/utils/queries/index-query-parameters.model';
import {MatDialog} from '@angular/material';
import {Subject} from 'rxjs';
import {Customer} from '../../../../shared/models/customer.model';
import {User} from '../../../../shared/models/user.model';

@Component({
  selector: 'customer-notes',
  templateUrl: './customer-notes.component.html',
  styleUrls: ['./customer-notes.component.scss']
})
export class CustomerNotesComponent extends AbstractEntityIndexComponent<CustomerNote> implements OnInit, OnDestroy {

  @Input() customerId: string;

  notes: CustomerNote[] = [];
  showNewNote: boolean;
  showEditNote: boolean;
  note: string;

  noteToEdit: CustomerNote;

  notesRefreshed$: Subject<boolean> = new Subject();

  constructor(
    customerNotesService: CustomerNotesService,
    auth: AuthenticationService,
    dialog: MatDialog,
    paginationService: PaginationService,
  ) {
    super(customerNotesService, auth, dialog, paginationService);
    this.setInfiniteScroll(true);
  }

  ngOnInit() {
    this.service.indexQuery = (params: IndexQueryParameters) => customerNotesByCustomerQuery(this.customerId, params);
    this.shareLimit = false;
    this.limit = 50;
    this.viewAfterCrate = false;

    this.service.entities$.takeUntil(this.unsubscribe$).subscribe(notes => {
      if (notes instanceof CustomServerError) {
        this.serverError = notes;
        return;
      }

      this.serverError = null;
      this.hasMore = notes && notes.length === this.limit;
      this.notes = [...this.notes, ...notes];
      this.notesRefreshed$.next(true);
    });

    this.service.entityCreated$.takeUntil(this.unsubscribe$).subscribe(note => {
      if (note instanceof CustomServerError) {
        this.serverError = note;
        return;
      }

      this.serverError = null;
      this.notes.unshift(note);
      this.closeNote();
      this.notesRefreshed$.next(true);
    });

    this.service.entityDeleted$.takeUntil(this.unsubscribe$).subscribe(note => {
      if (note instanceof CustomServerError) {
        this.serverError = note;
        return;
      }

      this.serverError = null;
      this.deleteNoteLocally(note);
    });

    this.service.entityUpdated$.takeUntil(this.unsubscribe$).subscribe(note => {
      if (note instanceof CustomServerError) {
        this.serverError = note;
        return;
      }

      this.serverError = null;
      this.closeNote();
      this.updateNoteLocally(note);
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
    this.showEditNote = false;
  }

  editNote(note: CustomerNote): void {
    this.noteToEdit = note.copy();
    this.noteToEdit.customer = new Customer({id: this.customerId});
    this.noteToEdit.user = new User({id: this.authService.getSixUser().id});
    this.note = this.noteToEdit.body;
    this.showNewNote = false;
    this.showEditNote = true;
  }

  updateNote() {
    if (!this.noteToEdit || !this.noteToEdit.id) return;

    this.noteToEdit.body = this.note;

    this.service.updateEntity(this.noteToEdit)
  }

  saveOrUpdateNote() {
    if (this.showNewNote) {
      this.saveNote();
    } else {
      this.updateNote();
    }
  }

  closeNote(): void {
    this.note = '';
    this.noteToEdit = null;
    this.showEditNote = false;
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
      this.notesRefreshed$.next(true);
    }
  }

  updateNoteLocally(note: CustomerNote): void {
    let index = firstIndexOf(this.notes, (el) => el.id === note.id);

    if (index > -1) {
      this.notes[index] = note.copy();
      this.notesRefreshed$.next(true);
    }
  }
}
