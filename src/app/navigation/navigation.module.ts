import {NgModule, ModuleWithProviders} from '@angular/core';
import {RouterModule} from '@angular/router';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {SidenavComponent} from './sidenav/sidenav.component';
import {TopnavComponent} from './topnav/topnav.component';
import {SharedModule} from '../shared/shared.module';
import {NavigationService} from './navigation.service';
import {SidenavItemComponent} from './sidenav/sidenav-item/sidenav-item.component';
import {DefaultLayoutComponent} from './layouts/default/default.layout.component';
import {NotificationsQuickComponent} from './notifications-quick/notifications-quick.component';
import { ProfileDropdownComponent } from './topnav/profile-dropdown/profile-dropdown.component';
import {AuthenticationModule} from '../authentication/authentication.module';
import { AlertsQuickComponent } from './alerts-quick/alerts-quick.component';
import { PersistentNotificationsQuickComponent } from './persistent-notifications-quick/persistent-notifications-quick.component';
import {TranslationModule} from '../translation/translation.module';
import { TopnavDropdownComponent } from './topnav/topnav-dropdown/topnav-dropdown.component';
import {OrdersModule} from '../orders/orders.module';
import {MaterialSelectionModule} from '../material-selection/material-selection.module';
import {ClipboardModule} from 'ngx-clipboard';
import {EntityServicesModule} from '../entity-services/entity-services.module';

@NgModule({
  imports : [
    MaterialSelectionModule,
    RouterModule,
    CommonModule,
    SharedModule,
    EntityServicesModule,
    FormsModule,
    AuthenticationModule,
    TranslationModule,
    OrdersModule,
    ClipboardModule
  ],
  declarations : [
    SidenavComponent,
    TopnavComponent,
    SidenavItemComponent,
    DefaultLayoutComponent,
    NotificationsQuickComponent,
    ProfileDropdownComponent,
    AlertsQuickComponent,
    PersistentNotificationsQuickComponent,
    TopnavDropdownComponent
  ],
  exports : [
    SidenavComponent,
    TopnavComponent,
    DefaultLayoutComponent
  ]
})
export class NavigationModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule : NavigationModule,
      providers : [NavigationService]
    };
  }
}

