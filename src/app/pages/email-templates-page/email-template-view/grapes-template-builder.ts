import {Token} from './token-list/token-list.component';
import * as juice from 'juice';
import * as grapesjs from 'grapesjs';
import {Observable} from 'rxjs';

function basicLayoutElementsPlugin(editor) {
  editor.BlockManager.add('basicLayout', {
    label: 'Basic Layout',
    category: {
      label: 'Basic Layout Elements',
      open: false
    },
    attributes: {class:'fa fa-window-maximize'},
    content: `<table style="width: 100%; font-family: Helvetica, Arial, Verdana, Trebuchet MS;">
        <tr style="height: 140px; background: #202124">
          <td style="text-align: center">
            <img style="max-height: 150px; max-width: 150px; min-height: 50px; min-width: 100px; background: #ffffff" src="{{accountdetails.company_logo}}" alt="Company Logo">
          </td>
        </tr>
        <tr>
          <td style="text-align: center">
            <table style="width: 100%; max-width: 650px; margin: 35px auto; font-size: 13px;">
                <tr style="height: 160px;">
                    <td></td>
                </tr>
            </table>
          </td>
        </tr>
        <tr style="width: 100%; font-size: 12px; color: #5F6368; background: #C4C4C4;">
            <td style="text-align: center; padding: 7px 0;">
                <div>If you have any questions about our privacy policy, contact our customer service center via {{accountdetails.support_link}}</div>
            </td>
        </tr>
        </table>`,
  });
  editor.BlockManager.add('sect100', {
    label: '1 Section',
    category: {
      label: 'Basic Layout Elements',
      open: false
    },
    attributes: {class:'gjs-fonts gjs-f-b1'},
    content: `<table style="height: 60px; width: 100%; font-size: 13px">
        <tr>
          <td></td>
        </tr>
        </table>`,
  });
  editor.BlockManager.add('sect50', {
    label: '1/2 Section',
    category: {
      label: 'Basic Layout Elements',
      open: false
    },
    attributes: {class:'gjs-fonts gjs-f-b2'},
    content: `<table style="height: 60px; width: 100%; font-size: 13px">
        <tr style="vertical-align: top">
          <td style="width: 50%"></td>
          <td style="width: 50%"></td>
        </tr>
        </table>`,
  });
  editor.BlockManager.add('sect30', {
    label: '1/3 Section',
    category: {
      label: 'Basic Layout Elements',
      open: false
    },
    attributes: {class:'gjs-fonts gjs-f-b3'},
    content: `<table style="height: 60px; width: 100%; font-size: 13px">
        <tr style="vertical-align: top">
          <td style="width: 33.3333%"></td>
          <td style="width: 33.3333%"></td>
          <td style="width: 33.3333%"></td>
        </tr>
        </table>`,
  });
  editor.BlockManager.add('sect37', {
    label: '3/7 Section',
    category: {
      label: 'Basic Layout Elements',
      open: false
    },
    attributes: {class:'gjs-fonts gjs-f-b37'},
    content: `<table style="height: 60px; width: 100%; font-size: 13px">
        <tr style="vertical-align: top">
          <td style="width:30%"></td>
          <td style="width:70%"></td>
        </tr>
        </table>`,
  });
  editor.BlockManager.add('divider', {
    label: 'Divider',
    category: {
      label: 'Basic Layout Elements',
      open: false
    },
    attributes: {class:'gjs-fonts gjs-f-divider'},
    content: `<table style="width: 100%; margin-top: 10px; margin-bottom: 10px;">
        <tr>
          <td class="divider"></td>
        </tr>
      </table>
      <style>
      .divider {
        background-color: rgba(0, 0, 0, 0.1);
        height: 1px;
      }
      </style>`
  });
  editor.BlockManager.add('text', {
    label: 'Text',
    category: {
      label: 'Basic Layout Elements',
      open: false
    },
    attributes: {class:'gjs-fonts gjs-f-text'},
    content: {
      type: 'text',
      content: 'Insert your text here',
      style: { padding: '10px' },
      activeOnRender: 1
    },
  });
  editor.BlockManager.add('image', {
    label: 'Image',
    category: {
      label: 'Basic Layout Elements',
      open: false
    },
    attributes: {class:'gjs-fonts gjs-f-image'},
    content: {
      type:'image',
      style: {color:'black'},
      activeOnRender: 1
    },
  });
  editor.BlockManager.add('link', {
    label: 'Link',
    category: {
      label: 'Basic Layout Elements',
      open: false
    },
    attributes: {class:'fa fa-link'},
    content: {
      type: 'link',
      content: 'Link',
      style: {color:'#3b97e3'}
    },
  });
}

function toolbarEditButtonsPlugin(editor) {

  editor.Commands.add('undo', {
    run: (editor, sender) => {
      editor.UndoManager.undo(1);
      setTimeout(() => {
        sender.set('active', 0);
      }, 120);
    }
  });

  editor.Commands.add('redo', {
    run: (editor, sender) => {
      editor.UndoManager.redo(1);
      setTimeout(() => {
        sender.set('active', 0);
      }, 120);
    }
  });

  editor.Panels.addButton('options', [
    {
      id: 'undo',
      className: 'fa fa-undo icon-undo gjs-margin-left-25',
      command: 'undo',
      attributes: { title: 'Undo (CTRL/CMD + Z)'}
    },
    {
      id: 'redo',
      className: 'fa fa-repeat icon-redo',
      command: 'redo',
      attributes: { title: 'Redo (CTRL/CMD + SHIFT + Z)' }
    }
  ])

}

function setBlocksViewDefault(editor) {
  editor.Panels.getButton('views', 'open-blocks').set('active', true);
}

function setSimpleStorageManager(editor, parent: {templateBody: string}) {

  const storage = {

    load: (keys, clb, clbErr) => {
      clb(keys);
    },

    store: (data, clb, clbErr) => {
      parent.templateBody = juice(`<style>${data['gjs-css']}</style>${data['gjs-html']}`);

      clb();
    }

  };

  editor.StorageManager.add('simple-storage', storage);

}

function advancedDevicesPlugin(editor) {
  const cmdm = editor.Commands;


  cmdm.add('set-device-mobile', {
    run(editor) {
      editor.setDevice('Mobile portrait');
    }
  });

  cmdm.add('set-device-tablet', {
    run(editor) {
      editor.setDevice('Tablet');
    }
  });

  cmdm.add('set-device-desktop', {
    run(editor) {
      editor.setDevice('Desktop');
    }
  });

  editor.getConfig().showDevices = 0;

  const devicePanel = editor.Panels.addPanel({
    id: 'devices-c'
  });
  devicePanel.get('buttons').add([
    {
      id: 'deviceMobile',
      command: 'set-device-mobile',
      className: 'fa fa-mobile',
    },
    {
      id: 'deviceTablet',
      command: 'set-device-tablet',
      className: 'fa fa-tablet',
    },
    {
      id: 'deviceDesktop',
      command: 'set-device-desktop',
      className: 'fa fa-desktop',
      active: 1,
    }
  ])
}

export function initGrapesJS(
  params: {
    targetId: string,
    parent: {templateBody: string, allTokens: Token[]},
    saveCallback: () => void,
    previewCallback: () => void,
    saveCustomBlockCallback: (content: string) => Observable<{success: boolean, title: string}>,
    deleteCustomBlockCallback: (name: string) => Observable<{success: boolean}>,
    additionalFields: {accountName: string}
  }
): any {
  const saveCustomBlockPlugin = (editor) => {
    editor.Commands.add('save-custom-block', {
      run: (editor) => {
        const value = editor.getSelected().view.el.outerHTML;

        params.saveCustomBlockCallback(value).subscribe((param: {content, title, success}) => {
          if (!param.content || !param.title || !param.success) return;

          const id = new Date().getTime() + '';

          editor.BlockManager.add(`custom-block-${id}`, {
            label: `<b>${param.title}</b> <i id="${id}" class="fa fa-trash-o grapes-delete-icon"></i>`,
            category: {
              label: 'Custom Token Blocks',
              open: false
            },
            attributes: { class:'gjs-block-full-width' },
            content: param.content
          });

          document.getElementById(id).addEventListener('click', () => {
            params.deleteCustomBlockCallback(param.title).subscribe(result => {
              if (result) {
                editor.BlockManager.remove(`custom-block-${id}`);
                editor.BlockManager.render();
              }
            })
          })
        })
      }
    });

    const defaultType = editor.DomComponents.getType('default');
    const _initToolbar = defaultType.model.prototype.initToolbar;
    defaultType.model.prototype.initToolbar = function() {
      _initToolbar.apply(this, arguments);

      const tb = this.get('toolbar');

      if (tb.find((t) => t.command === 'save-custom-block')) return;

      tb.push({
        attributes: { class: 'fa fa-save' },
        command: 'save-custom-block'
      });

      this.set('toolbar', tb);
    };
  };
  const predefinedBlocksPlugin = (editor) => {

    editor.BlockManager.add('predefined-order-title', {
      label: '<b>Order Title</b>',
      category: {
        label: 'Predefined Token Block',
        open: false
      },
      attributes: { class:'gjs-block-full-width' },
      content: `
                <section id="order-title-section" style="text-align: center;">
                    <div style="margin-bottom: 25px; font-size: 22px;">
                        Thanks for your purchase, {{customer.firstname}}!
                    </div>
                    <div style="margin-bottom: 25px; color: #5F6368;">
                        We're getting your order ready to be shipped. We will notify you when it's been shipped out.
                    </div>
                </section>
            `
    });

    editor.BlockManager.add('predefined-order-details', {
      label: '<b>Order Basic Details</b>',
      category: {
        label: 'Predefined Token Block',
        open: false
      },
      attributes: { class:'gjs-block-full-width' },
      content: `
                <section id="order-basic-details-section" style="max-width: 650px; border-top: 1px solid #E5E5E5; border-bottom: 1px solid #E5E5E5; margin: 10px auto; padding: 10px 0;">
                    <table style="width: 100%; font-size: 13px; font-weight: bold; color: #202124;">
                        <tr>
                            <td style="text-align: left; width: 50%">
                                <div>
                                    Order ID #{{rebill.alias}}
                                </div>
                            </td>
                            <td style="text-align: right; width: 50%">
                                <div>
                                    Order placed {{rebill.bill_at}}
                                </div>
                            </td>
                        </tr>
                    </table>
                </section>
            `
    });

    editor.BlockManager.add('predefined-order-pricing', {
      label: '<b>Order Pricing Details</b>',
      category: {
        label: 'Predefined Token Block',
        open: false
      },
      attributes: { class:'gjs-block-full-width' },
      content: `
                <div>
                  <section id="order-pricing--details-section" style="max-width: 650px; border-top: 1px solid #E5E5E5; border-bottom: 1px solid #E5E5E5; margin: 10px auto; padding: 10px 0;">
                      <table style="width: 100%; font-size: 13px; color: #5F6368;">
                          <tr>
                              <td style="text-align: left; width: 50%;">
                                <div>Subtotal</div>
                              </td>
                              <td style="text-align: right; width: 50%; font-weight: bold;">
                                <div>\${{rebill.amount}}</div>
                              </td>
                          </tr>
                      </table>
                      {{#rebill.shipping_receipts}}
                      <table style="width: 100%; font-size: 13px; color: #5F6368;">
                          <tr>
                              <td style="text-align: left; width: 50%">
                                <div>Shipping {{tracker.carrier}}</div>
                              </td>
                              <td style="text-align: right; width: 50%; font-weight: bold">
                                <div>\${{amount}}</div>
                              </td>
                          </tr>
                      </table>
                      {{/rebill.shipping_receipts}}
                  </section>
                  <section style="text-align: right; max-width: 650px; margin: 0 auto; font-size: 20px;">
                      Total <span style="font-weight: bold">\${{order.amount}}</span>
                  </section>
                </div>
            `
    });

    editor.BlockManager.add('predefined-order-products', {
      label: '<b>Order Products Details</b>',
      category: {
        label: 'Predefined Token Block',
        open: false
      },
      attributes: { class:'gjs-block-full-width' },
      content: `
                <section id="order-products-details-section" style="max-width: 650px; margin: 10px auto;">
                    {{#order.products}}
                    <table style="width: 100%; font-size: 13px">
                        <tr>
                            <td style="text-align: left; width: 80%">
                                <table>
                                <tr>
                                    <td>
                                        <img src="{{image}}" alt="" style="min-width: 60px; max-width: 160px; min-height: 60px; background: grey; display: inline-block;">
                                    </td>
                                    <td>
                                        <div style="margin-left: 30px;">
                                            <div style="line-height: 24px; font-weight: bold; font-size: 18px;">{{product.name}}</div>
                                            <div style="line-height: 24px; color: #5F6368">QTY: {{quantity}}</div>
                                        </div>
                                    </td>
                                </tr>
                                </table>
                            </td>
                            <td style="text-align: right; width: 20%; color: #5F6368; font-weight: bold;">\${{amount}}</td>
                        </tr>
                    </table>
                    {{/order.products}}
                </section>
            `
    });

    editor.BlockManager.add('predefined-customer-shipping', {
      label: '<b>Customer Shipping Details</b>',
      category: {
        label: 'Predefined Token Block',
        open: false
      },
      attributes: { class:'gjs-block-full-width' },
      content: `
                <section id="customer-shipping-section" style="text-align: left; height: 100%;">
                  <div style="line-height: 24px; font-weight: bold;">Shipping Address</div>
                  <div style="color: #5F6368">
                    <div>{{customer.firstname}} {{customer.lastname}}</div>
                    <div>{{customer.address.line1}}</div>
                    <div>{{customer.address.line2}}</div>
                    <div>{{customer.address.city}}, {{customer.address.state}}</div>
                    <div>{{customer.address.zip}}</div>
                  </div>
                </section>
            `
    });

    editor.BlockManager.add('predefined-customer-billing', {
      label: '<b>Customer Billing Details</b>',
      category: {
        label: 'Predefined Token Block',
        open: false
      },
      attributes: { class:'gjs-block-full-width' },
      content: `
                <section id="customer-billing-section" style="text-align: left; height: 100%;">
                  <div style="line-height: 24px;font-weight: bold;">Billing Information</div>
                  <div style="color: #5F6368">
                    <div>{{creditcard.address.firstname}} {{creditcard.address.lastname}}</div>
                    <div>{{creditcard.address.line1}}</div>
                    <div>{{creditcard.address.line2}}</div>
                    <div>{{creditcard.address.city}}, {{creditcard.address.state}}</div>
                    <div>{{creditcard.address.zip}}</div>
                  </div>
                  <div style="margin-top: 12px; line-height: 24px; font-weight: bold;">Payment Method</div>
                  <div style="color: #5F6368">{{creditcard.type}} ****{{creditcard.last_four}}</div>
                </section>
            `
    })
  };
  const toolbarActionButtonsPlugin = (editor) => {

    editor.Commands.add('save-template', {
      run: (editor, sender) => {
        params.saveCallback();

        setTimeout(() => {
          sender.set('active', 0);
        }, 120);
      }
    });

    editor.Commands.add('preview', {
      run: (editor, sender) => {
        params.previewCallback();

        setTimeout(() => {
          sender.set('active', 0);
        }, 120);
      }
    });

    editor.Panels.addButton('options', [
      {
        id: 'save-template',
        className: 'fa fa-save',
        command: 'save-template',
        attributes: { title: 'Save Template' }
      }
    ])

  };
  const tokensPlugin = (editor) => {
    if (!params.parent.allTokens || params.parent.allTokens.length === 0) return;

    for (let token of params.parent.allTokens) {
      editor.BlockManager.add(`token-${token.value.replace(/\s/g, '-')}`, {
        label: `<b>${token.description}</b>`,
        category: {
          label: 'Tokens',
          open: false
        },
        attributes: { class:'gjs-block-full-width' },
        content: `<span>{{${token.value}}}</span>`
      });
    }
  };

  const grapesEditor = grapesjs.init({
    container : params.targetId,
    height: 'calc(100vh - 166px)',
    components: params.parent.templateBody,
    plugins: [
      advancedDevicesPlugin,
      saveCustomBlockPlugin,
      basicLayoutElementsPlugin,
      predefinedBlocksPlugin,
      tokensPlugin,
      toolbarEditButtonsPlugin,
      toolbarActionButtonsPlugin
    ],
    storageManager: { type: 'simple-storage' },
  });

  setBlocksViewDefault(grapesEditor);
  setSimpleStorageManager(grapesEditor, params.parent);

  return grapesEditor;
}