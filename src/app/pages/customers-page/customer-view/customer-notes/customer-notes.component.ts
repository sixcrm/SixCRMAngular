import {Component, OnInit, Input, OnDestroy} from '@angular/core';
import {CustomerNote} from '../../../../shared/models/customer-note.model';
import {CustomerNotesService} from '../../../../shared/services/customer-notes.service';
import {ProgressBarService} from '../../../../shared/services/progress-bar.service';
import {AsyncSubject} from 'rxjs';
import {AuthenticationService} from '../../../../authentication/authentication.service';

@Component({
  selector: 'customer-notes',
  templateUrl: './customer-notes.component.html',
  styleUrls: ['./customer-notes.component.scss']
})
export class CustomerNotesComponent implements OnInit, OnDestroy {

  @Input() customerId: string;

  notes: CustomerNote[] = [];
  showNewNote: boolean;
  note: string;

  private unsubscribe$: AsyncSubject<boolean> = new AsyncSubject();

  constructor(
    private customerNotesService: CustomerNotesService,
    private progressBarService: ProgressBarService,
    private authService: AuthenticationService
  ) { }

  ngOnInit() {
    this.customerNotesService.entityDeleted$.takeUntil(this.unsubscribe$).subscribe((note: CustomerNote) => {
      this.progressBarService.hideTopProgressBar();
      this.deleteNoteLocally(note);
    });

    this.customerNotesService.entityCreated$.takeUntil(this.unsubscribe$).subscribe((note: CustomerNote) => {
      this.progressBarService.hideTopProgressBar();
      this.notes.unshift(note);
      this.showNewNote = false;
    });

    this.customerNotesService.entities$.takeUntil(this.unsubscribe$).subscribe((customerNotes: CustomerNote[]) => {
      this.notes = customerNotes.sort((a: CustomerNote, b: CustomerNote) => a.createdAt > b.createdAt ? -1 : 1);
    });

    this.customerNotesService.getByCustomer(this.customerId);
  }

  ngOnDestroy() {
    this.unsubscribe$.next(true);
    this.unsubscribe$.complete();
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
      this.customerNotesService.createEntity(customerNote);
      this.progressBarService.showTopProgressBar();
    }
  }

  deleteNote(note: CustomerNote): void {
    this.customerNotesService.deleteEntity(note.id);
    this.progressBarService.showTopProgressBar();
  }

  private deleteNoteLocally(note: CustomerNote): void {
    let indexOfNote = this.indexOfNote(note);

    if (indexOfNote !== -1) {
      this.notes.splice(indexOfNote, 1);
    }
  }

  private indexOfNote(note: CustomerNote) {
    for (let i = 0 ; i < this.notes.length ; i++) {
      if (this.notes[i].id === note.id) {
        return i;
      }
    }

    return -1;
  }
}
