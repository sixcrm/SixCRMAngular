import { Component, OnInit, Input } from '@angular/core';
import {Product} from '../../../../shared/models/product.model';
import {Modes} from '../../../abstract-entity-view.component';

@Component({
  selector: 'product-attributes',
  templateUrl: './product-attributes.component.html',
  styleUrls: ['./product-attributes.component.scss']
})
export class ProductAttributesComponent implements OnInit {

  @Input() entity: Product;
  @Input() mode: Modes;

  modes = Modes;

  constructor() { }

  ngOnInit() {
  }

}
