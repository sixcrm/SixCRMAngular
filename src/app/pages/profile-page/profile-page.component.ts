import {Component, OnInit, OnDestroy} from '@angular/core';
import {AuthenticationService} from "../../authentication/authentication.service";
import {User} from '../../shared/models/user.model';
import {UsersService} from '../../entity-services/services/users.service';
import {NavigationService} from '../../navigation/navigation.service';
import {Acl} from '../../shared/models/acl.model';
import {Subject} from 'rxjs';
import {UserSettings} from '../../shared/models/user-settings';
import {UserSettingsService} from '../../entity-services/services/user-settings.service';
import {NotificationSettings, NotificationSettingsData} from '../../shared/models/notification-settings.model';
import {NotificationSettingsService} from '../../entity-services/services/notification-settings.service';
import {conformToMask} from 'angular2-text-mask';
import {getPhoneNumberMask} from '../../shared/utils/mask.utils';
import {CustomServerError} from '../../shared/models/errors/custom-server-error';
import {Router} from '@angular/router';
import {ColumnParams} from '../../shared/models/column-params.model';
import {TableMemoryTextOptions} from "../components/table-memory/table-memory.component";
import {TabHeaderElement} from "../../shared/components/tab-header/tab-header.component";
import {TranslationService} from '../../translation/translation.service';
import {isValidEmail} from '../../shared/utils/form.utils';
import {FeatureFlagService} from '../../shared/services/feature-flag.service';
import {BreadcrumbItem} from '../components/models/breadcrumb-item.model';

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

  notificationSettingsBackup: NotificationSettings;
  notificationSettings: NotificationSettings;
  defaultNotificationSettings: NotificationSettingsData;

  formInvalid: boolean = false;

  public mask = getPhoneNumberMask();

  private unsubscribe$: Subject<boolean> = new Subject();

  accountColumnParams = [
    new ColumnParams('PROFILE_ACCOUNTS_ACCOUNTNAME', (e: Acl) => e.account.name),
    new ColumnParams('PROFILE_ACCOUNTS_ROLENAME', (e: Acl) => e.role.name)
  ];

  accountTextOptions: TableMemoryTextOptions = {
    title: 'PROFILE_ACCOUNTS_TITLE',
    viewOptionText: 'PROFILE_ACCOUNTS_VIEW'
  };

  breadcrumbs: BreadcrumbItem[] = [
    {label: () => 'PROFILE_TITLE'},
    {label: () => `${this.userBackup.firstName} ${this.userBackup.lastName}`}
  ];

  tabHeaders: TabHeaderElement[] = [
    {name: 'general', label: 'PROFILE_TABS_GENERAL'},
    {name: 'appsanddevices', label: 'PROFILE_TABS_APPSANDDEVICES'},
    {name: 'notificationpreferences', label: 'PROFILE_TABS_NOTIFICATIONPREFERENCES'},
    {name: 'accounts', label: 'PROFILE_TABS_ACCOUNTS'},
    {name: 'signingstrings', label: 'PROFILE_TABS_SIGNINGSTRINGS'},
    {name: 'agreements', label: 'ACCOUNT_TAB_AGREEMENTS'}
  ];

  constructor(
    private userService: UsersService,
    private userSettingsService: UserSettingsService,
    private notificationSettingsService: NotificationSettingsService,
    private authService: AuthenticationService,
    public navigation: NavigationService,
    private router: Router,
    public translationsService: TranslationService,
    public featureFlagsService: FeatureFlagService
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

      let parsedSettings = settings.copy();

      parsedSettings.notification_groups.forEach((group) => {
          group.notifications.forEach((notification) => {
            group.def.forEach(def => {
              if (def ==='all') {
                notification.channels.push('six');
                notification.channels.push('email');
                notification.channels.push('sms');
                notification.channels.push('slack');
              } else {
                notification.channels.push(def);
              }
            });
        })
      });

      this.defaultNotificationSettings = parsedSettings;
      this.notificationSettings.settings = parsedSettings;
      this.notificationSettings.id = this.user.id;

      this.notificationSettingsService.createEntity(this.notificationSettings);
    });

    this.notificationSettingsService.entity$.takeUntil(this.unsubscribe$).subscribe(settings => {
      if (settings instanceof CustomServerError) {
        this.router.navigate(['/error']);
        return;
      }

      this.notificationSettings = settings;
      this.notificationSettingsBackup = this.notificationSettings.copy();

      if (!this.notificationSettings.id) {
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
  }

  ngOnDestroy() {
    this.unsubscribe$.next(true);
    this.unsubscribe$.complete();
  }

  setIndex(index: number): void {
    this.selectedIndex = index;
  }

  updateUserDetails(): void {
    this.formInvalid = !this.validEmail();
    if (this.formInvalid) return;

    this.userBackup.name = `${this.userBackup.firstName} ${this.userBackup.lastName}`;
    this.userService.updateEntity(this.userBackup, {ignorePermissions: true});

    if (this.userSettings.cellPhone !== this.userSettingsBackup.cellPhone) {
      const smsSettings = this.userSettingsBackup.notificationSettings.find(n => n.name === 'sms');
      if (smsSettings) {
        smsSettings.data = this.userSettingsBackup.cellPhone;
      }
    }

    this.userSettingsService.updateEntity(this.userSettingsBackup);
  }

  updateUserSettings(): void {
    this.userSettingsService.updateEntity(this.userSettings);
  }

  cancelNotificationSettingsUpdate(): void {
    this.notificationSettings = this.notificationSettingsBackup.copy();
  }

  notificationSettingsUpdated(): void {
    this.notificationSettingsService.updateEntity(this.notificationSettings)
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

  getLanguages() {
    return this.translationsService
      .getLanguages()
      .filter(l => this.featureFlagsService.isEnabled(`user-settings-languages|${l.toLowerCase()}`));
  }

  setLanguage(language: string) {
    this.userSettingsBackup.language = language;
  }

  validEmail(): boolean {
    return isValidEmail(this.user.email);
  }
}
