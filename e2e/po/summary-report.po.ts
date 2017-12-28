import {by, element} from 'protractor';

export class SummaryReportPage {
  getTitle() {
    return element(by.css('.report__title'))
  }

  getSummaryTable() {
    return element(by.css('table-memory'))
  }

  getSummaryTableLoader() {
    return this.getSummaryTable().element(by.css('table-loader'));
  }

  getReportTable() {
    return element(by.css('report-table'));
  }

  getReportTableLoader() {
    return this.getReportTable().element(by.css('table-loader'));
  }

  getReportTableFirstItem() {
    return this.getReportTable().element(by.css('tbody')).element(by.css('tr')).element(by.css('td'));
  }
}
