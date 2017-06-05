import {Component, OnInit, OnDestroy} from '@angular/core';
import {Customer} from '../../../shared/models/customer.model';
import {CustomersService} from '../../../shared/services/customers.service';
import {ProgressBarService} from '../../../shared/services/progress-bar.service';
import {ActivatedRoute} from '@angular/router';
import {AbstractEntityViewComponent} from '../../abstract-entity-view.component';
import {CustomerNotesService} from '../../../shared/services/customer-notes.service';
import {CustomerNote} from '../../../shared/models/customer-note.model';
import {AuthenticationService} from '../../../authentication/authentication.service';
import {NavigationService} from '../../../navigation/navigation.service';
import {AnalyticsService} from '../../../shared/services/analytics.service';
import {Activity} from '../../../shared/models/analytics/activity.model';
import {utc} from 'moment';

@Component({
  selector: 'customer-view',
  templateUrl: './customer-view.component.html',
  styleUrls: ['./customer-view.component.scss']
})
export class CustomerViewComponent extends AbstractEntityViewComponent<Customer> implements OnInit, OnDestroy {
  selectedIndex: number = 0;

  note = '';
  showNewNote: boolean = false;
  notes: CustomerNote[] = [];
  activities: Activity[] = [];

  constructor(
    service: CustomersService,
    private analyticsService: AnalyticsService,
    private customerNotesService: CustomerNotesService,
    private authService: AuthenticationService,
    public navigation: NavigationService,
    route: ActivatedRoute,
    progressBarService: ProgressBarService
  ) {
    super(service, route, progressBarService);
  }

  ngOnInit() {
    this.customerNotesService.entities$.takeUntil(this.unsubscribe$).subscribe((customerNotes: CustomerNote[]) => {
      this.notes = customerNotes.sort((a: CustomerNote, b: CustomerNote) => a.createdAt > b.createdAt ? -1 : 1);
    });

    this.analyticsService.activitiesByCustomer$.takeUntil(this.unsubscribe$).subscribe((activities: Activity[]) => {
      this.activities = activities;
    });

    this.customerNotesService.entityCreated$.takeUntil(this.unsubscribe$).subscribe((note: CustomerNote) => {
      this.progressBarService.hideTopProgressBar();
      this.notes.unshift(note);
      this.showNewNote = false;
    });

    this.customerNotesService.entityDeleted$.takeUntil(this.unsubscribe$).subscribe((note: CustomerNote) => {
      this.progressBarService.hideTopProgressBar();
      this.deleteNoteLocally(note);
    });

    this.service.entity$.takeUntil(this.unsubscribe$).first().subscribe((customer: Customer) => {
      this.customerNotesService.getByCustomer(this.entityId);
      this.analyticsService.getActivityByCustomer(customer.createdAt.format(), utc().format(), this.entityId, 5, 0);
    });

    this.init();
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
      let customerNote = new CustomerNote({customer: {id: this.entityId}, user: {id: this.authService.getSixUser().id}, body: this.note});
      this.customerNotesService.createEntity(customerNote);
      this.progressBarService.showTopProgressBar();
    }
  }

  deleteNote(note: CustomerNote): void {
    this.customerNotesService.deleteEntity(note.id);
    this.progressBarService.showTopProgressBar();
  }

  setIndex(index: number): void {
    this.selectedIndex = index;
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
