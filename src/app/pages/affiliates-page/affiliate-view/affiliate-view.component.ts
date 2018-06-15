import {Component, OnInit, OnDestroy, ViewChild} from '@angular/core';
import {AbstractEntityViewComponent} from '../../abstract-entity-view.component';
import {Affiliate} from '../../../shared/models/affiliate.model';
import {AffiliatesService} from '../../../entity-services/services/affiliates.service';
import {ActivatedRoute} from '@angular/router';
import {NavigationService} from '../../../navigation/navigation.service';
import {TabHeaderElement} from '../../../shared/components/tab-header/tab-header.component';
import {BreadcrumbItem} from '../../components/entity-view-breadcrumbs/entity-view-breadcrumbs.component';

@Component({
  selector: 'affiliate-view',
  templateUrl: './affiliate-view.component.html',
  styleUrls: ['./affiliate-view.component.scss']
})
export class AffiliateViewComponent extends AbstractEntityViewComponent<Affiliate> implements OnInit, OnDestroy {

  @ViewChild('nameInputField') nameInput;

  selectedIndex: number = 0;
  formInvalid: boolean;

  tabHeaders: TabHeaderElement[] = [
    {name: 'tracking', label: 'AFFILIATE_TAB_TRACKING'},
    {name: 'sessions', label: 'AFFILIATE_TAB_SESSION'},
    {name: 'campaigns', label: 'AFFILIATE_TAB_CAMPAIGN'}
  ];

  breadcrumbs: BreadcrumbItem[] = [
    {label: () => 'AFFILIATE_INDEX_TITLE', url: '/affiliates'},
    {label: () => this.entity.name}
  ];

  constructor(service: AffiliatesService, route: ActivatedRoute, public navigation: NavigationService) {
    super(service, route);
  }

  ngOnInit() {
    this.init(() => this.navigation.goToNotFoundPage());

    if (this.addMode) {
      this.entity = new Affiliate();
      this.entityBackup = this.entity.copy();
    }
  }

  ngOnDestroy() {
    this.destroy()
  }

  cancelEdit() {
    this.formInvalid = false;
    this.cancelUpdate();
  }

  editAffiliate() {
    setTimeout(() => {if (this.nameInput) this.nameInput.focus()}, 100);

    this.setMode(this.modes.Update);
  }

  saveAffiliate(value: boolean) {
    this.formInvalid = !value;
    if(this.formInvalid) return;

    this.saveOrUpdate(this.entity);
  }

  setIndex(value: number) {
    this.selectedIndex = value;
  }
}
