import {Component, OnInit, OnDestroy} from '@angular/core';
import {AuthenticationService} from "../../authentication/authentication.service";
import {User} from '../../shared/models/user.model';
import {UsersService} from '../../shared/services/users.service';
import {NavigationService} from '../../navigation/navigation.service';
import {ProgressBarService} from '../../shared/services/progress-bar.service';
import {Acl} from '../../shared/models/acl.model';
import {Subject} from 'rxjs';
import {UserSettings, NotificationUserSettings} from '../../shared/models/user-settings';
import {UserSettingsService} from '../../shared/services/user-settings.service';
import {NotificationSettings, NotificationSettingsData} from '../../shared/models/notification-settings.model';

@Component({
  selector: 'profile-page',
  templateUrl: 'profile-page.component.html',
  styleUrls: ['profile-page.component.scss']
})
export class ProfilePageComponent implements OnInit, OnDestroy {

  timezone: string;
  timezones: string[] = ['PST', 'UTC', 'CEST'];
  selectedIndex: number = 0;

  filterValue: string;

  accounts: EntitySelectable<Acl>[] = [];

  user: User;
  userBackup: User;
  userSettings: UserSettings;
  userSettingsBackup: UserSettings;

  notificationSettings: NotificationSettings;
  defaultNotificationSettings: NotificationSettingsData;

  private userSettingsUpdateDebouncer: Subject<boolean> = new Subject();
  private unsubscribe$: Subject<boolean> = new Subject();

  deviceLabels = {
    six: 'SixCRM',
    ios: 'iOS App',
    email: 'E-Mail',
    sms: 'SMS',
    skype: 'Skype',
    slack: 'Slack'
  };

  constructor(
    private userService: UsersService,
    private userSettingsService: UserSettingsService,
    private authService: AuthenticationService,
    public navigation: NavigationService,
    private progressBarService: ProgressBarService
  ) { }

  ngOnInit() {
    this.userSettingsService.entity$.merge(this.userSettingsService.entityUpdated$).takeUntil(this.unsubscribe$).subscribe(userSettings => {
      this.progressBarService.hideTopProgressBar();
      this.userSettings = userSettings;
      if (!this.userSettings.id) {
        this.userSettings.id = this.user.id;
      }

      this.userSettingsBackup = this.userSettings.copy();
    });

    // six user observable is behaviour subject, and six user is fetched at app load (userintrospection)
    this.authService.sixUser$.takeUntil(this.unsubscribe$).subscribe((user: User) => {
      this.user = user;
      this.userBackup = this.user.copy();

      this.accounts = [];
      this.user.acls.forEach(acl => this.accounts.push(new EntitySelectable(acl)));

      if (this.user.id && !this.userSettings) {
        this.userSettingsService.getEntity(this.user.id);
      }

      if (this.user.id && !this.notificationSettings) {
        this.userSettingsService.fetchNotificationSettings(this.user.id);
      }
    });

    this.userService.entityUpdated$.takeUntil(this.unsubscribe$).subscribe(user => this.authService.updateSixUser(user));

    this.userSettingsService.defaultNotificationSettings$.takeUntil(this.unsubscribe$).subscribe(settings => {
      this.defaultNotificationSettings = settings;
      this.notificationSettings.settings = settings;
    });

    this.userSettingsService.notificationSettings$.takeUntil(this.unsubscribe$).subscribe(settings => {
      this.notificationSettings = settings;

      if (!this.notificationSettings.settings) {
        this.userSettingsService.fetchDefaultNotificationSettings();
      }
    });

    this.userSettingsUpdateDebouncer.takeUntil(this.unsubscribe$).debounceTime(2000).subscribe(() => {
      this.progressBarService.showTopProgressBar();
      this.userSettingsService.updateEntity(this.userSettings);
    });
  }

  ngOnDestroy() {
    this.unsubscribe$.next(true);
    this.unsubscribe$.complete();
  }

  setIndex(index: number): void {
    this.selectedIndex = index;
  }

  countSelectedAccs(): number {
    return countSelected(this.accounts);
  }

  updateUserDetails(): void {
    this.progressBarService.showTopProgressBar();
    this.userService.updateEntity(this.userBackup, true);
    this.userSettingsService.updateEntity(this.userSettingsBackup)
  }

  getNotificationUserSettings(name: string): NotificationUserSettings {
    if (!this.userSettings) return new NotificationUserSettings();

    for (let i = 0; this.userSettings.notificationSettings.length; i++) {
      if (this.userSettings.notificationSettings[i].name === name) {
        return this.userSettings.notificationSettings[i];
      }
    }

    return new NotificationUserSettings();
  }

  userSettingsFieldUpdated(): void {
    this.userSettingsUpdateDebouncer.next(true);
  }
}

export class EntitySelectable<T> {
  selected: boolean;
  entity: T;

  constructor(entity: T, selected?: boolean) {
    this.entity = entity;
    this.selected = !!selected;
  }
}

export function countSelected(selectables: EntitySelectable<any>[]): number {
  if (!selectables || selectables.length === 0) return 0;

  let selected = 0;

  selectables.forEach(selectable => {
    if (selectable.selected) selected++;
  });

  return selected;
}
