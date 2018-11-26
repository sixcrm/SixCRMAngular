import {Component, OnInit, Input} from '@angular/core';
import {Product} from '../../../../shared/models/product.model';
import {EmailTemplatePreviewModalComponent} from '../../../../dialog-modals/email-template-preview-modal/email-template-preview-modal.component';
import {EmailTemplate} from '../../../../shared/models/email-template.model';
import {MatDialog} from '@angular/material';

@Component({
  selector: 'product-emails',
  templateUrl: './product-emails.component.html',
  styleUrls: ['./product-emails.component.scss']
})
export class ProductEmailsComponent implements OnInit {

  @Input() product: Product;

  constructor(private dialog: MatDialog) { }

  ngOnInit() {
  }

  previewTemplate(template: EmailTemplate) {
    let ref = this.dialog.open(EmailTemplatePreviewModalComponent);
    ref.componentInstance.body = template.preview;

    ref.afterClosed().subscribe(() => {
      ref = null;
    })
  }

}
