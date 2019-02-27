import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {CampaignsService} from './services/campaigns.service';
import {ProductsService} from './services/products.service';
import {MerchantProvidersService} from './services/merchant-providers.service';
import {FulfillmentProvidersService} from './services/fulfillment-providers.service';
import {AffiliatesService} from './services/affiliates.service';
import {AccountsService} from './services/accounts.service';
import {AclsService} from './services/acls.service';
import {CustomersService} from './services/customers.service';
import {SessionsService} from './services/sessions.service';
import {MerchantProviderGroupsService} from './services/merchant-provider-groups.service';
import {TransactionsService} from './services/transactions.service';
import {CreditCardsService} from './services/credit-cards.service';
import {UsersService} from './services/users.service';
import {SmtpProvidersService} from './services/smtp-providers.service';
import {EmailTemplatesService} from './services/email-templates.service';
import {AccessKeysService} from './services/access-keys.service';
import {ProductScheduleService} from './services/product-schedule.service';
import {RolesService} from './services/roles.service';
import {RolesSharedService} from './services/roles-shared.service';
import {CustomerNotesService} from './services/customer-notes.service';
import {NotificationsService} from './services/notifications.service';
import {AlertsService} from './services/alerts.service';
import {RebillsService} from './services/rebills.service';
import {NotificationSettingsService} from './services/notification-settings.service';
import {TrackersService} from './services/trackers.service';
import {BillsService} from './services/bills.service';
import {UserSigningStringsService} from './services/user-signing-string.service';
import {ShippingReceiptsService} from './services/shipping-receipts.service';
import {ImagesService} from './services/images.service';
import {MerchantProviderGroupAssociationsService} from './services/merchant-provider-group-associations.service';
import {TagsService} from './services/tags.service';
import {EntityAclsService} from './services/entityacl.service';
import {EventHooksService} from './services/event-hooks.service';
import {EventHooksSharedService} from './services/event-hooks-shared.service';
import {UserSettingsService} from './services/user-settings.service';
import {OrdersService} from './services/orders.service';
import {AccountDetailsService} from './services/account-details.service';
import {ReturnsService} from './services/returns.service';
import {SmsProvidersService} from './services/sms-providers.service';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [],
  providers: [
    CampaignsService,
    ProductsService,
    MerchantProvidersService,
    FulfillmentProvidersService,
    AffiliatesService,
    AccountsService,
    AclsService,
    CustomersService,
    SessionsService,
    MerchantProviderGroupsService,
    TransactionsService,
    CreditCardsService,
    UsersService,
    SmtpProvidersService,
    SmsProvidersService,
    EmailTemplatesService,
    AccessKeysService,
    ProductScheduleService,
    RolesService,
    RolesSharedService,
    CustomerNotesService,
    NotificationsService,
    AlertsService,
    RebillsService,
    NotificationSettingsService,
    TrackersService,
    BillsService,
    UserSigningStringsService,
    ShippingReceiptsService,
    ImagesService,
    MerchantProviderGroupAssociationsService,
    TagsService,
    EntityAclsService,
    EventHooksService,
    EventHooksSharedService,
    UserSettingsService,
    OrdersService,
    AccountDetailsService,
    ReturnsService
  ]
})
export class EntityServicesModule { }
