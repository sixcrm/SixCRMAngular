import {element, by} from 'protractor';

export class LoadBalancerPage {

  getNewForm() {
    return element(by.css('load-balancer-add-new'));
  }

  getNewFormInputs() {
    return element(by.css('load-balancer-add-new')).all(by.css('input'));
  }

  getNewFormSaveButton() {
    return element(by.css('.entity-view__card__actions')).all(by.css('div')).last();
  }

  getErrorInputs() {
    return element(by.css('load-balancer-add-new')).all(by.css('.ng-invalid'));
  }

  getLoadBalancerName() {
    return element(by.css('.entity-view__info__data__name'));
  }
}
