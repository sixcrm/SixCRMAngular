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
import {ProductAttributes} from '../../../shared/models/product-attributes.model';
import {SixImage} from '../../../shared/models/six-image.model';
import {BreadcrumbItem} from '../../components/entity-view-breadcrumbs/entity-view-breadcrumbs.component';

@Component({
  selector: 'product-view',
  templateUrl: './product-view.component.html',
  styleUrls: ['./product-view.component.scss']
})
export class ProductViewComponent extends AbstractEntityViewComponent<Product> implements OnInit, OnDestroy {

  selectedIndex: number = 0;
  canNotBeDeleted: boolean = true;
  entityAttributes: ProductAttributes;

  tabHeaders: TabHeaderElement[] = [
    {name: 'general', label: 'PRODUCT_TAB_GENERAL'},
    {name: 'images', label: 'PRODUCT_TAB_IMAGES'},
    {name: 'schedules', label: 'PRODUCT_TAB_SCHEDULE'},
    {name: 'campaigns', label: 'PRODUCT_TAB_CAMPAIGN'},
    {name: 'merchantgroupassociations', label: 'PRODUCT_TAB_MERCHANTGROUPASSOCIATION'}
  ];

  breadcrumbs: BreadcrumbItem[] = [
    {label: () => 'PRODUCT_INDEX_TITLE', url: '/products'},
    {label: () => this.entity.name}
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

    this.service.entity$.merge(this.service.entityUpdated$).takeUntil(this.unsubscribe$).subscribe(entity => {
      this.entityAttributes = this.entity.attributes.copy();
    });

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
    this.entity = this.entity.copy();
    this.entity.attributes = this.entityAttributes.copy();

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

  checkIfChanged(): boolean {
    const originalAttributesString = JSON.stringify(this.entityAttributes);
    const backupAttributesString = JSON.stringify(this.entityBackup.attributes);

    if (originalAttributesString !== backupAttributesString) return false;

    return super.checkIfChanged();
  }

  cancelProductUpdate() {
    this.entityAttributes = this.entityBackup.attributes.copy();
    super.cancelUpdate();
  }

  addNewImage(image: SixImage) {
    const temp = this.entityBackup.copy();
    temp.attributes.images.push(image);

    this.service.updateEntity(temp);
  }

  updateImage(image: SixImage) {
    let updated = false;

    this.entity.attributes.images = this.entity.attributes.images.map(i => {
      let temp = i.copy();

      if (!updated && temp.path === image.path) {
        updated = true;

        return image.copy();
      }

      if (image.defaultImage) {
        temp.defaultImage = false;
      }

      return temp;
    });

    this.updateEntity(this.entity);
  }

  deleteImage(image: SixImage) {
    for (let i = 0; i < this.entity.attributes.images.length; i++) {
      if (this.entity.attributes.images[i].path === image.path) {
        this.entity.attributes.images.splice(i, 1);

        this.updateEntity(this.entity);
        return;
      }
    }
  }
}
