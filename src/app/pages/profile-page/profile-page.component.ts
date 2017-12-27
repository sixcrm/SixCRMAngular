import {Component, OnInit, OnDestroy} from '@angular/core';
import {AuthenticationService} from "../../authentication/authentication.service";
import {User} from '../../shared/models/user.model';
import {UsersService} from '../../shared/services/users.service';
import {NavigationService} from '../../navigation/navigation.service';
import {Acl} from '../../shared/models/acl.model';
import {Subject} from 'rxjs';
import {UserSettings, NotificationUserSettings} from '../../shared/models/user-settings';
import {UserSettingsService} from '../../shared/services/user-settings.service';
import {NotificationSettings, NotificationSettingsData} from '../../shared/models/notification-settings.model';
import {NotificationSettingsService} from '../../shared/services/notification-settings.service';
import {conformToMask} from 'angular2-text-mask';
import {getPhoneNumberMask} from '../../shared/utils/mask.utils';
import {CustomServerError} from '../../shared/models/errors/custom-server-error';
import {Router} from '@angular/router';
import {ColumnParams} from '../../shared/models/column-params.model';
import {TableMemoryTextOptions} from "../components/table-memory/table-memory.component";
import {TabHeaderElement} from "../../shared/components/tab-header/tab-header.component";

let moment = require('moment-timezone');

@Component({
  selector: 'profile-page',
  templateUrl: 'profile-page.component.html',
  styleUrls: ['profile-page.component.scss']
})
export class ProfilePageComponent implements OnInit, OnDestroy {

  timezone: string;
  timezones: string[] = moment.tz.names();
  selectedIndex: number = 0;

  filterValue: string;

  accounts: Acl[] = [];

  user: User;
  userBackup: User;
  userSettings: UserSettings;
  userSettingsBackup: UserSettings;
  phone: string;

  notificationSettings: NotificationSettings;
  defaultNotificationSettings: NotificationSettingsData;

  public mask = getPhoneNumberMask();

  private userSettingsUpdateDebouncer: Subject<boolean> = new Subject();
  private notificationSettingsUpdateDebouncer: Subject<boolean> = new Subject();
  private unsubscribe$: Subject<boolean> = new Subject();

  accountColumnParams = [
    new ColumnParams('PROFILE_ACCOUNTS_ACCOUNTNAME', (e: Acl) => e.account.name),
    new ColumnParams('PROFILE_ACCOUNTS_ROLENAME', (e: Acl) => e.role.name)
  ];

  accountTextOptions: TableMemoryTextOptions = {
    title: 'PROFILE_ACCOUNTS_TITLE',
    viewOptionText: 'PROFILE_ACCOUNTS_VIEW'
  };

  deviceLabels = {
    six: 'SixCRM',
    ios: 'iOS App',
    email: 'E-Mail',
    sms: 'SMS',
    skype: 'Skype',
    slack: 'Slack'
  };

  tabHeaders: TabHeaderElement[] = [
    {name: 'general', label: 'PROFILE_TABS_GENERAL'},
    {name: 'notifications', label: 'PROFILE_TABS_NOTIFICATIONS'},
    {name: 'accounts', label: 'PROFILE_TABS_ACCOUNTS'},
    {name: 'signingstrings', label: 'PROFILE_TABS_SIGNINGSTRINGS'}
  ];

  constructor(
    private userService: UsersService,
    private userSettingsService: UserSettingsService,
    private notificationSettingsService: NotificationSettingsService,
    private authService: AuthenticationService,
    public navigation: NavigationService,
    private router: Router
  ) { }

  ngOnInit() {
    this.userSettingsService.entity$.merge(this.userSettingsService.entityUpdated$).takeUntil(this.unsubscribe$).subscribe(settings => {
      if (settings instanceof CustomServerError) {
        this.router.navigate(['/error']);
        return;
      }

      this.userSettings = settings;
      if (!this.userSettings.id) {
        this.userSettings.id = this.user.id;
      }

      this.userSettingsBackup = this.userSettings.copy();
      this.phone = this.getPhoneNumber();
    });

    this.notificationSettingsService.defaultNotificationSettings$.takeUntil(this.unsubscribe$).subscribe(settings => {
      if (settings instanceof CustomServerError) {
        this.router.navigate(['/error']);
        return;
      }

      this.defaultNotificationSettings = settings;
      this.notificationSettings.settings = settings;
      this.notificationSettings.id = this.user.id;

      this.notificationSettingsService.createEntity(this.notificationSettings);
    });

    this.notificationSettingsService.entity$.takeUntil(this.unsubscribe$).subscribe(settings => {
      if (settings instanceof CustomServerError) {
        this.router.navigate(['/error']);
        return;
      }

      this.notificationSettings = settings;

      if (!this.notificationSettings.settings) {
        this.notificationSettingsService.fetchDefaultNotificationSettings();
      }
    });

    this.notificationSettingsService.entityCreated$
      .merge(this.notificationSettingsService.entityUpdated$).takeUntil(this.unsubscribe$).subscribe(settings => {
        if (settings instanceof CustomServerError) {
          this.router.navigate(['/error']);
          return;
        }

        this.notificationSettings = settings;
      });

    // six user observable is behaviour subject, and six user is fetched at app load (userintrospection)
    this.authService.sixUser$.takeUntil(this.unsubscribe$).subscribe((user: User) => {
      this.user = user;
      this.userBackup = this.user.copy();

      this.accounts = this.user.acls.slice();

      if (this.user.id && !this.userSettings) {
        this.userSettingsService.getEntity(this.user.id);
      }

      if (this.user.id && !this.notificationSettings) {
        this.notificationSettingsService.getEntity(this.user.id);
      }
    });

    this.userSettingsUpdateDebouncer.takeUntil(this.unsubscribe$).debounceTime(2000).subscribe(() => {
      this.userSettingsService.updateEntity(this.userSettings);
    });

    this.notificationSettingsUpdateDebouncer.takeUntil(this.unsubscribe$).debounceTime(2000).subscribe(() => {
      this.notificationSettingsService.updateEntity(this.notificationSettings)
    });
  }

  ngOnDestroy() {
    this.unsubscribe$.next(true);
    this.unsubscribe$.complete();
  }

  setIndex(index: number): void {
    this.selectedIndex = index;
  }

  updateUserDetails(): void {
    this.userService.updateEntity(this.userBackup, {ignorePermissions: true});
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

  notificationSettingsFieldUpdated(): void {
    this.notificationSettingsUpdateDebouncer.next(true);
  }

  sendTestNotification(): void {
    this.notificationSettingsService.sendTestNotification();
  }

  sendTestAlert(): void {
    this.notificationSettingsService.sendTestAlert();
  }

  getPhoneNumber(): string {
    if (!this.userSettings) return '';

    let phone: string = '';

    if (this.userSettings.workPhone) {
      phone = this.userSettings.workPhone;
    } else {
      phone = this.userSettings.cellPhone;
    }

    return conformToMask(phone, this.mask, {guide: false}).conformedValue;
  }

  viewAccount(account: Acl) {
    this.router.navigate(['/accounts', account.account.id]);
  }

  setLanguage(language: string) {
    this.userSettingsBackup.language = language;
  }
}
