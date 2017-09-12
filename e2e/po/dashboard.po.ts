import {element, by, browser} from 'protractor';
import {AdvancedFilterPage} from './advanced-filter.po';

export class DashboardPage {

  advancedFilter: AdvancedFilterPage = new AdvancedFilterPage();

  navigateTo() {
    browser.get('/dashboard');
  }

  getCollapsedMenuButton() {
    return element(by.css('.topnav__items--collapsed__icon'));
  }

  getCollapsedMenuItems() {
    return element.all(by.css('.topnav__items--collapsed__menu__button'));
  }

  getAdvancedFilterComponent() {
    return this.advancedFilter.getComponent();
  }

  getAdvancedFilterReload() {
    return element(by.css('.advanced-filter__icons')).all(by.css('md-icon')).first();
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
    return element(by.css('transaction-overview')).element(by.css('md-spinner'));
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
