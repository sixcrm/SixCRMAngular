import {Component, OnInit, OnDestroy} from '@angular/core';
import {AbstractEntityViewComponent} from '../../abstract-entity-view.component';
import {Product} from '../../../shared/models/product.model';
import {ProductsService} from '../../../shared/services/products.service';
import {ActivatedRoute} from '@angular/router';
import {NavigationService} from '../../../navigation/navigation.service';
import {MessageDialogComponent} from '../../message-dialog.component';
import {MdDialog} from '@angular/material';
import {TabHeaderElement} from '../../../shared/components/tab-header/tab-header.component';
import {DeleteDialogComponent} from '../../delete-dialog.component';

@Component({
  selector: 'product-view',
  templateUrl: './product-view.component.html',
  styleUrls: ['./product-view.component.scss']
})
export class ProductViewComponent extends AbstractEntityViewComponent<Product> implements OnInit, OnDestroy {

  selectedIndex: number = 0;
  canNotBeDeleted: boolean = true;

  tabHeaders: TabHeaderElement[] = [
    {name: 'general', label: 'PRODUCT_TAB_GENERAL'},
    {name: 'schedules', label: 'PRODUCT_TAB_SCHEDULE'},
    {name: 'campaigns', label: 'PRODUCT_TAB_CAMPAIGN'}
  ];

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
      this.entity.ship = true;
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
      this.showMessageDialog('PRODUCT_NODELETE');
    } else {
      this.remove();
    }
  }

  showMessageDialog(text: string) {
    let messageDialogRef = this.dialog.open(MessageDialogComponent);
    messageDialogRef.componentInstance.text = text;

    messageDialogRef.afterClosed().take(1).subscribe(() => {
      messageDialogRef = null;
    });
  }

  remove(): void {
    let deleteDialogRef = this.dialog.open(DeleteDialogComponent);

    deleteDialogRef.afterClosed().takeUntil(this.unsubscribe$).subscribe(result => {
      deleteDialogRef = null;

      if (result && result.success) {
        this.service.entityDeleted$.take(1).takeUntil(this.unsubscribe$).subscribe(() => {
          this.navigation.back();
        });

        this.service.deleteEntity(this.entity.id);
      }
    });
  }

  setCanNotBeDeleted(entities: any[]) {
    this.canNotBeDeleted = entities && entities.length > 0;
  }

  canBeDeactivated(): boolean {
    return super.canBeDeactivated();
  }

}
