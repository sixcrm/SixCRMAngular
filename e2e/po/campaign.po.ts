import {element, by} from 'protractor';
import any = jasmine.any;

export class CampaignPage {

  getNewCampaignForm() {
    return element(by.css('campaign-add-new'));
  }

  getNewCampaignFormNameInput() {
    return element(by.css('campaign-add-new')).element(by.css('input'));
  }

  getNewCampaignFormInvalidInputs() {
    return element(by.css('campaign-add-new')).all(by.css('.ng-invalid'));
  }

  getCampaignFormCheckboxes() {
    return element(by.css('campaign-add-new')).element(by.css('mat-checkbox'));
  }

  getCampaignFormSaveButton() {
    return element(by.css('.entity-view__card__actions')).all(by.css('div')).last();
  }

  getCampaignNameInHeader() {
    return element(by.css('.title'));
  }

  getMenuButton() {
    return element(by.css('.entity-view__card__header')).element(by.css('mat-icon'));
  }

  getEditButton() {
    return element(by.css('.mat-menu-content')).element(by.css('button'));
  }

  getCampaignIndividualCampaign() {
    return element(by.css('tbody')).all(by.css('tr'));
  }

  getCampaignNameInCard() {
    return element(by.css('.entity-view__card__content')).element(by.css('input'));
  }

  getCampaignDeleteButton() {
    return element(by.css('tbody')).all(by.css('tr')).first().element(by.buttonText('delete'));
  }

  getCampaignDeleteModalButton() {
    return element(by.css('.custom-dialog__buttons')).all(by.css('div')).last();
  }

  getCampaignIndexButton() {
    return element(by.css('.crumbs'));
  }

}
