import {Component, OnInit, OnDestroy, ElementRef} from '@angular/core';
import {AbstractEntityViewComponent} from '../../abstract-entity-view.component';
import {Session} from '../../../shared/models/session.model';
import {SessionsService} from '../../../entity-services/services/sessions.service';
import {ActivatedRoute, Router} from '@angular/router';
import {NavigationService} from '../../../navigation/navigation.service';
import {Rebill} from '../../../shared/models/rebill.model';
import {ColumnParams} from '../../../shared/models/column-params.model';
import {AuthenticationService} from '../../../authentication/authentication.service';
import {Campaign} from '../../../shared/models/campaign.model';
import {Affiliate} from '../../../shared/models/affiliate.model';
import {TableMemoryTextOptions} from '../../components/table-memory/table-memory.component';
import {TabHeaderElement} from '../../../shared/components/tab-header/tab-header.component';
import {BreadcrumbItem} from '../../components/models/breadcrumb-item.model';
import {ProductSchedule} from '../../../shared/models/product-schedule.model';
import {Subject} from 'rxjs';
import {CustomServerError} from '../../../shared/models/errors/custom-server-error';
import {Product} from '../../../shared/models/product.model';
import {WatermarkProductSchedule} from '../../../shared/models/watermark/watermark-product-schedule.model';
import {WatermarkProduct} from '../../../shared/models/watermark/watermark-product.model';
import {MatDialog} from '@angular/material';
import {YesNoDialogComponent} from '../../yes-no-dialog.component';
import {utc} from 'moment';

@Component({
  selector: 'session-view',
  templateUrl: './session-view.component.html',
  styleUrls: ['./session-view.component.scss']
})
export class SessionViewComponent extends AbstractEntityViewComponent<Session> implements OnInit, OnDestroy {

  detailsElement: ElementRef;

  selectedIndex: number = 0;

  rebillColumnParams: ColumnParams<Rebill>[];
  rebillText: TableMemoryTextOptions = {
    title: 'SESSION_REBILL_TITLE',
    viewOptionText: 'SESSION_REBILL_VIEW',
    noDataText: 'SESSION_REBILL_NODATA'
  };

  campaignColumnParams: ColumnParams<Campaign>[];
  campaignText: TableMemoryTextOptions = {
    title: 'SESSION_CAMPAIGN_TITLE',
    viewOptionText: 'SESSION_CAMPAIGN_VIEW',
    noDataText: 'SESSION_CAMPAIGN_NODATA'
  };

  affiliateColumnParams: ColumnParams<Affiliate>[];
  affiliateText: TableMemoryTextOptions = {
    title: 'SESSION_AFFILIATE_TITLE',
    viewOptionText: 'SESSION_AFFILIATE_VIEW',
    noDataText: 'SESSION_AFFILIATE_NODATA'
  };

  affiliates: Affiliate[] = [];

  tabHeaders: TabHeaderElement[] = [
    {name: 'general', label: 'SESSION_TAB_GENERAL'},
    {name: 'watermark', label: 'SESSION_TAB_WATERMARK'},
    {name: 'affiliates', label: 'SESSION_TAB_AFFILIATE'}
  ];

  breadcrumbs: BreadcrumbItem[] = [
    {label: () => 'SESSION_INDEX_TITLE', url: '/sessions'},
    {label: () => this.entity.alias}
  ];

  saveDebouncer: Subject<ProductSchedule[]> = new Subject();
  productSchedulesWaitingForUpdate: ProductSchedule[];
  updateError: boolean;
  autosaveDebouncer: number = 3500;

  constructor(public sessionService: SessionsService,
              route: ActivatedRoute,
              public navigation: NavigationService,
              private authService: AuthenticationService,
              private router: Router,
              private dialog: MatDialog
  ) {
    super(sessionService, route);
  }

  ngOnInit() {
    this.takeUpdated = false;

    this.service.entityUpdated$.takeUntil(this.unsubscribe$).subscribe(session => {
      if (session instanceof CustomServerError) {
        this.updateError = true;
      } else {
        this.updateError = false;
        this.entity.updatedAtAPI = session.updatedAtAPI;
        this.entity.updatedAt = session.updatedAt.clone();
        this.entityBackup = this.entity.copy();
        this.productSchedulesWaitingForUpdate = null;
      }
    });

    this.saveDebouncer.debounceTime(this.autosaveDebouncer).takeUntil(this.unsubscribe$).subscribe(productSchedules => {
      this.updateEntity(this.copyWithWatermark(productSchedules, this.entity.watermark.extractedProducts), {ignoreSnack: true});
    });

    super.init(() => this.navigation.goToNotFoundPage());

    let f = this.authService.getTimezone();
    this.rebillColumnParams = [
      new ColumnParams('SESSION_REBILL_BILLED',(e: Rebill) => e.billAt ? e.billAt.clone().tz(f).format('MM/DD/YYYY') : 'not billed'),
      new ColumnParams('SESSION_REBILL_AMOUNT', (e: Rebill) => e.amount.usd(), 'right').setNumberOption(true)
    ];


    this.campaignColumnParams = [
      new ColumnParams('SESSION_CAMPAIGN_NAME',(e: Campaign) => e.name),
      new ColumnParams('SESSION_CAMPAIGN_CREATED', (e: Campaign) => e.createdAt.clone().tz(f).format('MM/DD/YYYY'))
    ];

    this.affiliateColumnParams = [
      new ColumnParams('SESSION_AFFILIATE_NAME',(e: Affiliate) => e.name),
      new ColumnParams('SESSION_AFFILIATE_ID',(e: Affiliate) => e.affiliateId),
      new ColumnParams('SESSION_AFFILIATE_CREATED', (e: Affiliate) => e.createdAt.clone().tz(f).format('MM/DD/YYYY'))
    ];

    this.service.entity$.takeUntil(this.unsubscribe$).take(1).subscribe((s: Session) => this.affiliates = s.parseAffiliates());
  }

  ngOnDestroy() {
    if (this.productSchedulesWaitingForUpdate) {
      this.updateEntity(this.copyWithWatermark(this.productSchedulesWaitingForUpdate, this.entity.watermark.extractedProducts));
    }

    this.navigation.resetSidenavAuto();

    this.destroy();
  }

  copyWithWatermark(productSchedules: ProductSchedule[], products: Product[]): Session {
    let copy: Session = this.entity.copy();

    if (productSchedules) {
      copy.watermark.productSchedules = productSchedules.map(ps => new WatermarkProductSchedule({quantity: ps.quantity, product_schedule: ps.inverse()}))
      copy.watermark.extractedProductSchedules = productSchedules;
    }

    if (products) {
      copy.watermark.products = products.map(p => new WatermarkProduct({quantity: p.quantity, price: p.price.amount, product: p.inverse()}))
      copy.watermark.extractedProducts = products;
    }

    return copy;
  }

  setIndex(value: number): void {
    this.selectedIndex = value;

    if (this.selectedIndex === 1) {
      this.navigation.setSidenavAuto(false);
    } else {
      this.navigation.resetSidenavAuto();
    }
  }

  viewRebill(rebill: Rebill): void {
    this.router.navigate(['/rebills', rebill.id]);
  }

  viewCampaign(campaign: Campaign): void {
    this.router.navigate(['/campaigns', campaign.id]);
  }

  viewAffiliate(affiliate: Affiliate): void {
    this.router.navigate(['/affiliates', affiliate.id]);
  }

  setDetails(details) {
    this.detailsElement = details;
  }

  updateItems(productSchedules: ProductSchedule[]) {
    if (productSchedules && productSchedules.length > 0) {
      this.productSchedulesWaitingForUpdate = productSchedules;
      this.saveDebouncer.next(productSchedules);
    }
  }

  cancelSession() {
    this.sessionService.cancelSession(this.entity).subscribe(session => {
      if (session instanceof CustomServerError) {
        return;
      }

      this.updateError = false;
      this.entity = session;
      this.entityBackup = this.entity.copy();
      this.productSchedulesWaitingForUpdate = null;
    });
  }

  trimWatermark() {
    const end = utc().diff(this.entity.createdAt, 'd');

    this.entity.watermark.extractedProductSchedules = this.entity.watermark.extractedProductSchedules.map(watermarkProductSchedule => {
      watermarkProductSchedule.schedules = watermarkProductSchedule.schedules.map(schedule => {
        if (schedule.start > end) return null;

        if (!schedule.end || schedule.end > end) {
          schedule.end = end;
        }

        return schedule;
      }).filter(schedule => !!schedule);

      return watermarkProductSchedule;
    }).filter(watermarkProductSchedule => watermarkProductSchedule.schedules.length > 0);

    this.sessionService.entityUpdated$.take(1).subscribe(session => {
      if (session instanceof CustomServerError) {
        return;
      }

      this.updateError = false;
      this.entity = session;
      this.entityBackup = this.entity.copy();
      this.productSchedulesWaitingForUpdate = null;

      this.cancelSession();
    });

    this.sessionService.updateEntity(this.entity);
  }

  openCancelSessionModal() {
    let ref = this.dialog.open(YesNoDialogComponent);
    ref.componentInstance.text = 'Are you sure you want to cancel this session?';

    ref.afterClosed().subscribe(result => {
      ref = null;

      if (result && result.success) {
        this.trimWatermark();
      }

    })
  }

}
