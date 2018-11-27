import { Component, OnInit, Input } from '@angular/core';
import {Product} from '../../../../shared/models/product.model';
import {Modes} from '../../../abstract-entity-view.component';
import {ProductAttributes} from '../../../../shared/models/product-attributes.model';
import {getAllDimensionUnits, getAllWeightUnits} from '../../../../shared/utils/measure.utilities';

@Component({
  selector: 'product-attributes',
  templateUrl: './product-attributes.component.html',
  styleUrls: ['./product-attributes.component.scss']
})
export class ProductAttributesComponent implements OnInit {

  @Input() attributes: ProductAttributes;
  @Input() mode: Modes;

  dimensionUnits = getAllDimensionUnits();
  weightUnits = getAllWeightUnits();

  modes = Modes;

  constructor() { }

  ngOnInit() {
  }

  selectDimensionUnit(unit: string) {
    this.attributes.dimensions.length.unitofmeasurement = unit;
    this.attributes.dimensions.height.unitofmeasurement = unit;
    this.attributes.dimensions.width.unitofmeasurement = unit;
  }

}
