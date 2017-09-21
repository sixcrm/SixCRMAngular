import {Component, OnInit, OnDestroy} from '@angular/core';
import {AbstractEntityViewComponent} from '../../abstract-entity-view.component';
import {Product} from '../../../shared/models/product.model';
import {ProductsService} from '../../../shared/services/products.service';
import {ActivatedRoute} from '@angular/router';
import {NavigationService} from '../../../navigation/navigation.service';
import {MessageDialogComponent} from '../../message-dialog.component';
import {MdDialog} from '@angular/material';

@Component({
  selector: 'product-view',
  templateUrl: './product-view.component.html',
  styleUrls: ['./product-view.component.scss']
})
export class ProductViewComponent extends AbstractEntityViewComponent<Product> implements OnInit, OnDestroy {

  selectedIndex: number = 0;
  canNotBeDeleted: boolean = true;

  constructor(
    service: ProductsService,
    route: ActivatedRoute,
    public navigation: NavigationService,
    private dialog: MdDialog
  ) {
    super(service, route);
  }

  ngOnInit() {
    this.init(() => this.navigation.goToNotFoundPage());

    if (this.addMode) {
      this.entity = new Product();
      this.entity.ship = 'true';
      this.entityBackup = this.entity.copy();
    }
  }

  ngOnDestroy() {
    this.destroy();
  }

  setIndex(value: number) {
    this.selectedIndex = value;
  }

  save(): void {
    this.saveOrUpdate(this.entity);
  }

  deleteProduct(): void {
    if (this.canNotBeDeleted) {
      this.showMessageDialog('You can not delete this product as long as it is associated with a product schedule.');
    } else {
      this.service.entityDeleted$.take(1).takeUntil(this.unsubscribe$).subscribe(() => {
        this.navigation.back();
      });

      this.service.deleteEntity(this.entity.id);
    }
  }

  showMessageDialog(text: string) {
    let messageDialogRef = this.dialog.open(MessageDialogComponent);
    messageDialogRef.componentInstance.text = text;

    messageDialogRef.afterClosed().take(1).subscribe(() => {
      messageDialogRef = null;
    });
  }

  setCanNotBeDeleted(entities: any[]) {
    this.canNotBeDeleted = entities && entities.length > 0;
  }

  canBeDeactivated(): boolean {
    return super.canBeDeactivated();
  }

}
