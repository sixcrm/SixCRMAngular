import {Component, OnInit, Input, EventEmitter, Output, ElementRef, OnDestroy} from '@angular/core';
import {ColumnParams} from '../../../shared/models/column-params.model';
import {firstIndexOf} from '../../../shared/utils/array.utils';
import {UserSettingsService} from '../../../entity-services/services/user-settings.service';
import {AuthenticationService} from '../../../authentication/authentication.service';
import {AsyncSubject} from 'rxjs';

@Component({
  selector: 'table-preferences',
  templateUrl: './table-preferences.component.html',
  styleUrls: ['./table-preferences.component.scss'],
  host: {'(document:click)': 'onClick($event)'}
})
export class TablePreferencesComponent implements OnInit, OnDestroy {

  @Input() columnParams: ColumnParams<any>[] = [];
  @Input() small: boolean = false;
  @Input() noUpdate: boolean = false;

  @Output() changed: EventEmitter<boolean> = new EventEmitter();
  columnParamsBackup: {label: string, selected: boolean}[] = [];

  showParams: boolean;
  unsubscribe$: AsyncSubject<boolean> = new AsyncSubject<boolean>();

  constructor(private elementRef: ElementRef, private userSettingsService: UserSettingsService, private authService: AuthenticationService) { }

  ngOnInit() {
    this.changed.takeUntil(this.unsubscribe$).subscribe(changed => this.onColumnPreferencesChanged(changed));

    this.backupColumnParams();
  }

  ngOnDestroy() {
    this.unsubscribe$.next(true);
    this.unsubscribe$.complete();
  }

  toggleParams() {
    this.showParams = !this.showParams;

    if (!this.showParams) {
      this.changed.emit(false);
    }
  }

  cancel() {
    this.showParams = false;

    this.changed.emit(false);
  }

  apply() {
    this.showParams = false;

    this.changed.emit(true);
  }

  onClick(event): void {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      if (this.showParams) {
        this.cancel();
      }
    }
  }

  resetColumnParams() {
    for (let i = 0; i < this.columnParams.length; i++) {
      const index = firstIndexOf(this.columnParamsBackup, (el) => el.label === this.columnParams[i].label);

      this.columnParams[i].selected = (index !== -1) && this.columnParamsBackup[index].selected;
    }
  }

  persistColumnParams() {
    const selected = this.columnParams.filter(c => c.selected).map(c => c.label);

    if (selected.length === 0) return;

    this.userSettingsService.updateColumnPreferences(this.columnParams);
  }

  onColumnPreferencesChanged(changed: boolean) {
    if (this.noUpdate) return;

    if (!changed) {
      this.resetColumnParams();

      return;
    }

    this.persistColumnParams();
  }

  backupColumnParams() {
    this.authService.userSettings$.takeUntil(this.unsubscribe$).subscribe(settings => {
      if (!settings) return;

      const params = this.columnParams
        .filter(p => settings.columnPreferences.indexOf(p.label) !== -1)
        .map(p => {
          return {label: p.label, selected: true}
        });

      if (!params || params.length === 0) {
        this.columnParamsBackup = this.columnParams.map(p => {
          return {label: p.label, selected: p.selected}
        });

        return;
      }

      this.columnParamsBackup = params;

      this.resetColumnParams();
    });
  }
}
