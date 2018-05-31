import {element, by, browser} from 'protractor';
import {AdvancedFilterPage} from './advanced-filter.po';

export class DashboardPage {

  advancedFilter: AdvancedFilterPage = new AdvancedFilterPage();

  navigateTo() {
    browser.get('/dashboard');
  }

  getTOS() {
    return element(by.css('.terms-and-conditions-container'));
  }

  getTOSButton() {
    return element(by.css('.accept'));
  }

  getTOSTitle() {
    return element(by.css('.title'));
  }

  getSaasTitle() {
    return element(by.css('.title'));
  }

  getCollapsedMenuButton() {
    return element(by.css('.profile-dropdown__header'));
  }

  getCollapsedMenuItems() {
    return element.all(by.css('.profile-dropdown__menu__item'));
  }

  getAdvancedFilterComponent() {
    return this.advancedFilter.getComponent();
  }

  getAdvancedFilterReload() {
    return element(by.css('.advanced-filter__icons')).all(by.css('mat-icon')).first();
  }

  getAdvancedFilterDates() {
    return element.all(by.css('.advanced-filter__date__quick__item'));
  }

  getResetButton() {
    return element(by.css('.advanced-filter__advanced-button')).element(by.css('span'));
  }

  getTransactionOverview() {
    return element(by.css('transaction-overview'));
  }

  getTransactionOverviewLoader() {
    return element(by.css('transaction-overview')).element(by.css('mat-spinner'));
  }

  getFunnelGraph() {
    return element(by.css('funnel-graph'));
  }

  getEventsSummary() {
    return element(by.css('events-summary'))
  }

  getTransactionSummary() {
    return element(by.css('transaction-summary-chart'));
  }

  getTopCampaigns() {
    return element(by.css('top-campaigns'));
  }

  getMoversCard() {
    return element(by.css('movers-card'));
  }

  getDashboardReports() {
    return element(by.css('dashboard-reports'));
  }

  getEventsBy() {
    return element(by.css('events-by'));
  }

  getTransactionBy() {
    return element(by.css('transaction-by'));
  }
}
