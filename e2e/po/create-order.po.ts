import {element, by} from 'protractor';

export class CreateOrderPage {

  getCreateOrderModalContainer() {
    return element(by.css('.create-order-modal-container'));
  }

  getCustomerPanel() {
    return element.all(by.css('mat-expansion-panel')).first();
  }

  getCustomerNewButton() {
    return this.getCustomerPanel().element(by.css('.expansion-body')).element(by.css('button'));
  }

  getNewCustomerInputs() {
    return this.getCustomerPanel().all(by.css('input'));
  }

  getCustomerNextButton() {
    return this.getCustomerPanel().element(by.css('.buttons')).all(by.css('button')).last();
  }

  getCustomerChip() {
    return this.getCustomerPanel().element(by.css('mat-chip'))
  }

  getCampaignPanel() {
    return element.all(by.css('mat-expansion-panel')).get(1);
  }

  getCampaignChip() {
    return this.getCampaignPanel().element(by.css('mat-chip'))
  }

  getCampaignNextButton() {
    return this.getCampaignPanel().element(by.css('.buttons')).all(by.css('button')).last();
  }

  getProductsPanel() {
    return element.all(by.css('mat-expansion-panel')).get(2);
  }

  getProductsInputSelector() {
    return this.getProductsPanel().element(by.css('input'));
  }

  getFirstMenuOption() {
    return element(by.css('mat-option'));
  }

  getMenuOptions() {
    return element.all(by.css('mat-option'));
  }

  getDisabledPanels() {
    return element.all(by.css('[aria-disabled="true"]'))
  }

  getMenuOption(index: number) {
    return this.getMenuOptions().get(index);
  }

  getProductsChip(index: number) {
    return this.getProductsChips().get(index);
  }

  getProductsChips() {
    return this.getProductsPanel().all(by.css('mat-chip'))
  }

  getProductsChipRemove(index: number) {
    return this.getProductsChip(index).element(by.css('mat-icon'));
  }

  getProductsNextButton() {
    return this.getProductsPanel().element(by.css('.buttons')).all(by.css('button')).last();
  }

  getAddressPanel() {
    return element.all(by.css('mat-expansion-panel')).get(3);
  }

  getNewAddressInputs() {
    return this.getAddressPanel().all(by.css('input'));
  }

  getAddressNextButton() {
    return this.getAddressPanel().element(by.css('.buttons')).all(by.css('button')).last();
  }

  getAddressChip() {
    return this.getAddressPanel().element(by.css('mat-chip'))
  }

  getShippingPanel() {
    return element.all(by.css('mat-expansion-panel')).get(4);
  }

  getShippingNextButton() {
    return this.getShippingPanel().element(by.css('.buttons')).all(by.css('button')).last();
  }

  getBillingPanel() {
    return element.all(by.css('mat-expansion-panel')).get(5);
  }

  getBillingInputs() {
    return this.getBillingPanel().all(by.css('input'));
  }

  getBillingChip() {
    return this.getBillingPanel().element(by.css('mat-chip'))
  }

  getBillingNextButton() {
    return this.getBillingPanel().element(by.css('.buttons')).all(by.css('button')).last();
  }

  getPreview() {
    return element(by.css('create-order-preview'));
  }

  getPreviewAddressItems() {
    return this.getPreview().element(by.css('.customer-info-container')).element(by.css('.shipping')).all(by.css('div'));
  }

  getPreviewPaymentItems() {
    return this.getPreview().element(by.css('.payment')).element(by.css('.summary')).all(by.css('.summary__column')).last().all(by.css('div'));
  }

  getProductItems() {
    return this.getPreview().element(by.css('.product-container')).element(by.css('.product-data')).all(by.css('div'));
  }

  getSubmitButton() {
    return this.getPreview().element(by.css('button'));
  }

  getProcessingOverlay() {
    return element(by.css('.process-dialog-wrapper'))
  }

  getOrderCompleteContainer() {
    return element(by.css('create-order-success'));
  }

  getOrderCompleteDoneButton() {
    return this.getOrderCompleteContainer().all(by.css('.column')).last().element(by.css('button'));
  }

  getAddressCheckbox() {
    return element(by.css('.same-checkbox'));
  }

  getDropdownOptions() {
    return element(by.css('.mat-menu-content')).all(by.css('button'));
  }

  getBillingDateDropdowns() {
    return element(by.css('.dates')).all(by.css('.element'));
  }
}