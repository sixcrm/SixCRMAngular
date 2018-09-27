import {by, element} from 'protractor';

export class EmailTemplatePage {

  getTemplates() {
    return element.all(by.css('.template-card'));
  }

  getPreviewButton(templateNum: number) {
    return this.getTemplates().get(templateNum).element(by.css('.actions')).all(by.css('button')).first();
  }

  getEditButton(templateNum: number) {
    return this.getTemplates().get(templateNum).element(by.css('.actions')).all(by.css('button')).last();
  }

  getPreviewModal() {
    return element(by.css('email-template-preview-modal'));
  }

  getPreviewContent() {
    return this.getPreviewModal().element(by.id('e2e-test-block'));
  }

  getGrapesCategoryBlocks() {
    return element.all(by.css('.gjs-block-category'));
  }

  getGrapesJS() {
    return element(by.id('grapesjs'));
  }

}
