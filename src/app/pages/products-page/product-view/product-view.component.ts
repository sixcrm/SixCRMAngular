import {Component, OnInit, OnDestroy} from '@angular/core';
import {AbstractEntityViewComponent} from '../../abstract-entity-view.component';
import {Product} from '../../../shared/models/product.model';
import {ProductsService} from '../../../entity-services/services/products.service';
import {ActivatedRoute} from '@angular/router';
import {NavigationService} from '../../../navigation/navigation.service';
import {TabHeaderElement} from '../../../shared/components/tab-header/tab-header.component';
import {DeleteDialogComponent} from '../../../dialog-modals/delete-dialog.component';
import {ProductAttributes} from '../../../shared/models/product-attributes.model';
import {SixImage} from '../../../shared/models/six-image.model';
import {BreadcrumbItem} from '../../components/models/breadcrumb-item.model';
import {MatDialog} from '@angular/material';

@Component({
  selector: 'product-view',
  templateUrl: './product-view.component.html',
  styleUrls: ['./product-view.component.scss']
})
export class ProductViewComponent extends AbstractEntityViewComponent<Product> implements OnInit, OnDestroy {

  selectedIndex: number = 0;
  entityAttributes: ProductAttributes;

  tabHeaders: TabHeaderElement[] = [
    {name: 'general', label: 'GENERAL'},
    {name: 'emails', label: 'EMAILS'}
  ];

  secondaryTabHeaders: TabHeaderElement[] = [
    {name: 'info', label: 'INFO'}
  ];

  breadcrumbs: BreadcrumbItem[] = [
    {label: () => 'Products', url: '/products'},
    {label: () => this.entity ? this.entity.name : ''}
  ];

  infoVisible: boolean = true;

  constructor(
    service: ProductsService,
    route: ActivatedRoute,
    public navigation: NavigationService,
    private dialog: MatDialog
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

  addNewImage(image: SixImage) {
    const temp = this.entityBackup.copy();
    temp.attributes.images.push(image);

    this.service.updateEntity(temp);
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

  updateDefaultImage(image: SixImage) {
    this.entityBackup.attributes.images = this.entityBackup.attributes.images.map(i => {
      i.defaultImage = i.path === image.path;

      return i;
    });

    this.updateEntity(this.entityBackup);
  }
}
