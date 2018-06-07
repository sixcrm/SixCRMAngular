import {Component, OnInit, Input, ViewChild, ElementRef} from '@angular/core';
import {AuthenticationService} from '../../../../authentication/authentication.service';
import {CustomerNotesService} from '../../../../shared/services/customer-notes.service';
import {CustomerNote} from '../../../../shared/models/customer-note.model';
import {Customer} from '../../../../shared/models/customer.model';
import {IndexQueryParameters} from '../../../../shared/utils/queries/index-query-parameters.model';
import {customerNotesByCustomerQuery} from '../../../../shared/utils/queries/entities/customer-note.queries';
import {CustomServerError} from '../../../../shared/models/errors/custom-server-error';
import {scrollToBottom} from '../../../../shared/utils/document.utils';

@Component({
  selector: 'customer-info-notes',
  templateUrl: './customer-info-notes.component.html',
  styleUrls: ['./customer-info-notes.component.scss']
})
export class CustomerInfoNotesComponent implements OnInit {

  _customer: Customer;
  newNoteText: string;
  limit = 50;
  notes: CustomerNote[] = [];

  @Input() set customer(customer: Customer) {
    if (customer) {
      const performInit = !this._customer;

      this._customer = customer;

      if (performInit) {
        this.initialize();
      }
    }
  }

  @ViewChild('notescontainer') notesContainer: ElementRef;

  constructor(private customerNotesService: CustomerNotesService, private authService: AuthenticationService) { }

  ngOnInit() { }

  initialize() {
    this.customerNotesService.indexQuery = (params: IndexQueryParameters) => customerNotesByCustomerQuery(this._customer.id, params);

    this.customerNotesService.entities$.take(1).subscribe(notes => {
      if (notes instanceof CustomServerError) return;

      this.notes = [...this.notes, ...notes].sort((f: CustomerNote, s: CustomerNote) => {
        if (f.createdAt.isBefore(s.createdAt)) return -1;
        if (f.createdAt.isAfter(s.createdAt)) return 1;
        return 0;
      });
      this.newNoteText = '';
    });

    this.customerNotesService.getEntities(this.limit);
  }

  scrollToBottom() {
    setTimeout(() => scrollToBottom(this.notesContainer.nativeElement, 0), 0);
  }

  saveNote() {
    if (!this.newNoteText) return;

    this.customerNotesService.entityCreated$.take(1).subscribe(note => {
      if (note instanceof CustomServerError) return;

      this.notes = [...this.notes, note];
      this.newNoteText = '';
      scrollToBottom(this.notesContainer.nativeElement, 2000);
    });

    const note = new CustomerNote({
      customer: {id: this._customer.id},
      user: {id: this.authService.getSixUser().id},
      body: this.newNoteText
    });

    this.customerNotesService.createEntity(note, {ignoreSnack: true});
  }

}
