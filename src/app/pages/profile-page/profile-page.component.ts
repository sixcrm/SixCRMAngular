import {Component, OnInit, OnDestroy} from '@angular/core';
import {AuthenticationService} from "../../authentication/authentication.service";
import {User} from '../../shared/models/user.model';
import {AbstractEntityViewComponent} from '../abstract-entity-view.component';
import {UsersService} from '../../shared/services/users.service';
import {NavigationService} from '../../navigation/navigation.service';
import {ActivatedRoute} from '@angular/router';
import {ProgressBarService} from '../../shared/services/progress-bar.service';
import {Acl} from '../../shared/models/acl.model';

@Component({
  selector: 'profile-page',
  templateUrl: 'profile-page.component.html',
  styleUrls: ['profile-page.component.scss']
})
export class ProfilePageComponent extends AbstractEntityViewComponent<User> implements OnInit, OnDestroy {

  timezone: string;
  timezones: string[] = ['PST', 'UTC', 'CEST'];
  selectedIndex: number = 0;

  filterValue: string;

  accounts: EntitySelectable<Acl>[] = [];

  notificationDevices: NotificationDevice[] = [
    new NotificationDevice('SixCRM', true),
    new NotificationDevice('iOS App'),
    new NotificationDevice('SMS', true),
    new NotificationDevice('E-Mail'),
    new NotificationDevice('Slack', true),
    new NotificationDevice('Skype')
  ];

  notificationOptions: NotificationOptions[] = [
    new NotificationOptions('Invitation sent'),
    new NotificationOptions('Invitation accepted'),
    new NotificationOptions('Lead'),
    new NotificationOptions('Order'),
    new NotificationOptions('Upsell'),
    new NotificationOptions('Decline'),
    new NotificationOptions('Cancellation'),
    new NotificationOptions('Rebill'),
    new NotificationOptions('Mid')
  ];

  constructor(
    service: UsersService,
    private authService: AuthenticationService,
    public navigation: NavigationService,
    route: ActivatedRoute,
    progressBarService: ProgressBarService
  ) {
    super(service, route, progressBarService);
  }

  ngOnInit() {
    this.authService.sixUser$.takeUntil(this.unsubscribe$).subscribe((user: User) => {
      this.entity = user;
      this.entityBackup = this.entity.copy();

      this.accounts = [];
      this.entity.acls.forEach(acl => this.accounts.push(new EntitySelectable(acl)));
    });

    this.service.entityUpdated$.takeUntil(this.unsubscribe$).subscribe((user: User) => {
      this.authService.updateSixUser(user);
    });

    this.fetchEntityOnInit = false;
    this.init();
  }

  ngOnDestroy() {
    this.destroy();
  }

  setIndex(index: number): void {
    this.selectedIndex = index;
  }

  countSelectedAccs(): number {
    return countSelected(this.accounts);
  }



}

export class NotificationOptions {
  name: string;
  devices: NotificationDevice[] = [];

  constructor(name: string) {
    this.name = name;
    this.devices = [
      new NotificationDevice('SixCRM', true),
      new NotificationDevice('iOS App', name === 'Invitation sent'),
      new NotificationDevice('SMS', name === 'Invitation sent'),
      new NotificationDevice('E-Mail', name === 'Invitation sent'),
      new NotificationDevice('Slack', name === 'Invitation sent'),
      new NotificationDevice('Skype', name === 'Invitation sent')
    ];
  }

  getDevice(name: string): NotificationDevice {
    for (let i = 0; i < this.devices.length; i++) {
      if (this.devices[i].name === name) {
        return this.devices[i];
      }
    }

    return null;
  }
}

export class NotificationDevice {
  name: string;
  selected: boolean;

  constructor(name: string, selected?: boolean) {
    this.name = name;
    this.selected = !!selected;
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
