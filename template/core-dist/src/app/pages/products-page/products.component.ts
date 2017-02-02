import { Component, OnInit } from '@angular/core';
import {ProductsService} from "../../shared/services/products.service";
import {Product} from "../../shared/models/product.model";
import {FormControl} from "@angular/forms";
import {NavigationService} from '../../navigation/navigation.service';

@Component({
  selector: 'products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {

  private products: Product[] = [];
  private productsSearchControl: FormControl = new FormControl();
  private searchString: string = '';

  private showAddDialog: boolean = false;
  private showAddFormError: boolean = false;
  private productAdd: Product = new Product();

  private showEditDialog: boolean = false;
  private showEditFormError: boolean = false;
  private editEnabled: boolean = false;
  private productEditBackup: Product = new Product();
  private productEdit: Product = new Product();

  constructor(private productsService: ProductsService, private navigationService: NavigationService) { }

  ngOnInit() {
    this.productsService.products$.subscribe((products: Product[]) => {
      this.products = products;
    });

    this.productsService.getProducts();
  }

  openEditDialog(product: Product): void {
    this.productEditBackup = product.copy();
    this.productEdit = product.copy();
    this.showEditFormError = false;
    this.showEditDialog = true;
  }

  closeEditDialog(): void {
    this.showEditDialog = false;
    this.showEditFormError = false;
  }

  saveEdited(): void {
    if (this.productEdit.id && this.productEdit.name && this.productEdit.sku) {
      this.productsService.editProduct(this.productEdit);
      this.closeEditDialog();
    } else {
      this.showEditFormError = true;
    }
  }

  enableEdit(): void {
    this.editEnabled = true;
  }

  disableEdit(): void {
    this.editEnabled = false;
    this.showEditFormError = false;
    this.productEdit = this.productEditBackup.copy();
  }

  openAddDialog(): void {
    this.navigationService.toggleSidenav(false);
    this.showAddDialog = true;
    this.productAdd = new Product();
  }

  closeAddDialog(): void {
    this.showAddDialog = false;
    this.showAddFormError = false;
    this.navigationService.toggleSidenav(true);
  }

  saveAdded(): void {
    if (this.productAdd.id && this.productAdd.name && this.productAdd.sku) {
      this.productsService.createProduct(this.productAdd);
      this.closeAddDialog();
    } else {
      this.showAddFormError = true;
    }
  }

  deleteProduct(product: Product): void {
    this.productsService.deleteProduct(product.id);
  }
}
