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
import {InviteUserDialogComponent} from '../invite-user-dialog.component';
import {Role} from '../../shared/models/role.model';
import {MdDialog, MdDialogRef} from '@angular/material';
import {RolesService} from '../../shared/services/roles.service';
import {Account} from '../../shared/models/account.model';
import {CustomServerError} from '../../shared/models/errors/custom-server-error';
import {Router} from '@angular/router';

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

  deviceLabels = {
    six: 'SixCRM',
    ios: 'iOS App',
    email: 'E-Mail',
    sms: 'SMS',
    skype: 'Skype',
    slack: 'Slack'
  };

  inviteDialogRef: MdDialogRef<InviteUserDialogComponent>;
  roles: Role[] = [];

  constructor(
    private userService: UsersService,
    private userSettingsService: UserSettingsService,
    private notificationSettingsService: NotificationSettingsService,
    private authService: AuthenticationService,
    public navigation: NavigationService,
    private dialog: MdDialog,
    private rolesService: RolesService,
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

    // get available roles for user invite
    this.rolesService.entities$.takeUntil(this.unsubscribe$).take(1).subscribe(roles => {
      if (roles instanceof CustomServerError) {
        this.roles = [];
        return;
      }

      this.roles = roles
    });
    this.rolesService.getEntities();
  }

  ngOnDestroy() {
    this.unsubscribe$.next(true);
    this.unsubscribe$.complete();
  }

  setIndex(index: number): void {
    this.selectedIndex = index;
  }

  updateUserDetails(): void {
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

  notificationSettingsFieldUpdated(): void {
    this.notificationSettingsUpdateDebouncer.next(true);
  }

  sendTestNotification(): void {
    this.notificationSettingsService.sendTestNotification();
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

  inviteUser(account: Account): void {
    this.inviteDialogRef = this.dialog.open(InviteUserDialogComponent);
    this.inviteDialogRef.componentInstance.options = this.roles.filter(role => role.name !== 'Owner');

    this.inviteDialogRef.afterClosed().takeUntil(this.unsubscribe$).subscribe(result => {
      this.inviteDialogRef = null;

      if (result.email && result.role) {
        this.userService.sendUserInvite(result.email, result.role, account.id).subscribe();
      }
    });
  }
}
