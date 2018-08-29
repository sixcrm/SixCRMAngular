import {Token} from './token-list/token-list.component';
import * as juice from 'juice';
import * as grapesjs from 'grapesjs';

function basicLayoutElementsPlugin(editor) {
  editor.BlockManager.add('sect100', {
    label: '1 Section',
    category: 'Basic Layout Elements',
    attributes: {class:'gjs-fonts gjs-f-b1'},
    content: `<table style="height: 60px; width: 100%;">
        <tr>
          <td></td>
        </tr>
        </table>`,
  });
  editor.BlockManager.add('sect50', {
    label: '1/2 Section',
    category: 'Basic Layout Elements',
    attributes: {class:'gjs-fonts gjs-f-b2'},
    content: `<table style="height: 60px; width: 100%;">
        <tr>
          <td style="width: 50%"></td>
          <td style="width: 50%"></td>
        </tr>
        </table>`,
  });
  editor.BlockManager.add('sect30', {
    label: '1/3 Section',
    category: 'Basic Layout Elements',
    attributes: {class:'gjs-fonts gjs-f-b3'},
    content: `<table style="height: 60px; width: 100%;">
        <tr>
          <td style="width: 33.3333%"></td>
          <td style="width: 33.3333%"></td>
          <td style="width: 33.3333%"></td>
        </tr>
        </table>`,
  });
  editor.BlockManager.add('sect37', {
    label: '3/7 Section',
    category: 'Basic Layout Elements',
    attributes: {class:'gjs-fonts gjs-f-b37'},
    content: `<table style="height: 60px; width: 100%;">
        <tr>
          <td style="width:30%"></td>
          <td style="width:70%"></td>
        </tr>
        </table>`,
  });
  editor.BlockManager.add('divider', {
    label: 'Divider',
    category: 'Basic Layout Elements',
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
    category: 'Basic Layout Elements',
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
    category: 'Basic Layout Elements',
    attributes: {class:'gjs-fonts gjs-f-image'},
    content: {
      type:'image',
      style: {color:'black'},
      activeOnRender: 1
    },
  });
  editor.BlockManager.add('link', {
    label: 'Link',
    category: 'Basic Layout Elements',
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
      className: 'fa fa-undo icon-undo',
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

export function initGrapesJS(
  params: {
    targetId: string,
    parent: {templateBody: string, allTokens: Token[], tokensInited: boolean},
    saveClickedCallback: () => void,
    additionalFields: {accountName: string}
  }
): any {
  const predefinedBlocksPlugin = (editor) => {

    editor.BlockManager.add('predefined-header', {
      label: '<b>Header</b>',
      category: 'Predefined Token Blocks',
      attributes: { class:'gjs-block-full-width' },
      content: `
                <section id="header-section">
                  Dear {{customer.firstname}} {{customer.lastname}}!
                </section>
            `
    });

    editor.BlockManager.add('predefined-footer', {
      label: '<b>Footer</b>',
      category: 'Predefined Token Blocks',
      attributes: { class:'gjs-block-full-width' },
      content: `
                <section id="footer-section">
                  Thank you for using ${params.additionalFields.accountName}!
                </section>
            `
    });

    editor.BlockManager.add('predefined-order-summary', {
      label: '<b>Order Summary</b>',
      category: 'Predefined Token Blocks',
      attributes: { class:'gjs-block-full-width' },
      content: `
                <section id="order-summary-section">
                  <div style="margin-bottom: 10px">Order Summary</div>
                  <div>Order Number: {{rebill.alias}}</div>
                  <div>Total Amount: \${{rebill.amount}}</div>
                </section>
            `
    });

    editor.BlockManager.add('predefined-product-summary', {
      label: '<b>Products Summary</b>',
      category: 'Predefined Token Blocks',
      attributes: { class:'gjs-block-full-width' },
      content: `
                <section id="products-summary-section">
                  <div style="margin-bottom: 10px">Products Summary</div>
                  {{#order.products}}
                  <div>{{product.name}} \${{amount}} x {{quantity}}</div>
                  {{/order.products}}
                </section>
            `
    });

    editor.BlockManager.add('predefined-customer-summary', {
      label: '<b>Customer Summary</b>',
      category: 'Predefined Token Blocks',
      attributes: { class:'gjs-block-full-width' },
      content: `
                <section id="customer-summary-section">
                  <div style="margin-bottom: 10px">Customer Information</div>
                  <div>{{customer.firstname}} {{customer.lastname}}</div>
                  <div>{{customer.address.line1}}, {{customer.address.line2}}</div>
                  <div>{{customer.address.city}} {{customer.address.state}}, {{customer.address.zip}}</div>
                </section>
            `
    });

    editor.BlockManager.add('predefined-billing-summary', {
      label: '<b>Billing Summary</b>',
      category: 'Predefined Token Blocks',
      attributes: { class:'gjs-block-full-width' },
      content: `
                <section id="billing-summary-section">
                  <div style="margin-bottom: 10px">Billing Information</div>
                  <div>{{creditcard.name}}</div>
                  <div>{{creditcard.type}} ****{{creditcard.last_four}}</div>
                  <div>{{creditcard.address.city}} {{creditcard.address.state}}, {{creditcard.address.zip}}</div>
                </section>
            `
    })
  };
  const saveToolbarButtonPlugin = (editor) => {

    editor.Commands.add('save-template', {
      run: (editor, sender) => {
        params.saveClickedCallback();

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

    params.parent.tokensInited = true;

    for (let token of params.parent.allTokens) {
      editor.BlockManager.add(`token-${token.value.replace(/\s/g, '-')}`, {
        label: `<b>${token.description}</b>`,
        category: 'Tokens',
        attributes: { class:'gjs-block-full-width' },
        content: `<span>{{${token.value}}}</span>`
      });
    }
  };

  const grapesEditor = grapesjs.init({
    container : params.targetId,
    height: 'calc(100vh - 218px)',
    components: params.parent.templateBody,
    plugins: [
      basicLayoutElementsPlugin,
      predefinedBlocksPlugin,
      tokensPlugin,
      toolbarEditButtonsPlugin,
      saveToolbarButtonPlugin
    ],
    storageManager: { type: 'simple-storage' },
  });

  setBlocksViewDefault(grapesEditor);
  setSimpleStorageManager(grapesEditor, params.parent);

  return grapesEditor
}
