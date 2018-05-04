import {element, by} from 'protractor';

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
    return element(by.css('.entity-view__info__data__name'));
  }

  getMenuButton() {
    return element(by.css('.entity-view__card__header')).element(by.css('mat-icon'));
  }

  getEditButton() {
    return element(by.css('.mat-menu-content')).element(by.css('button'));
  }

  getCampaignIndividualCampaign(num: number) {
    return element(by.css('tbody')).all(by.css('tr')).get(num);
  }

  getCampaignNameInCard() {
    return element(by.css('.entity-view__card__content')).element(by.css('input'));
  }

}
