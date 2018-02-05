import {
  fullPaginationStringResponseQuery, paginationParamsQuery, deleteMutationQuery,
  addId, clean, addField
} from './entities-helper.queries';
import {Product} from '../../../models/product.model';

export function productsListQuery(limit?:number, cursor?:string): string {
  return `{
    productlist ${paginationParamsQuery(limit, cursor)} {
			products {
			  ${productResponseQuery()}
			}
			${fullPaginationStringResponseQuery()}
		}
  }`;
}

export function productQuery(id: string): string {
  return `{
    product (id: "${id}") {
      ${productResponseQuery()}
		}
  }`
}

export function deleteProductMutation(id: string): string {
  return deleteMutationQuery('product', id);
}

export function createProductMutation(product: Product): string {
  return `
  mutation {
    createproduct (product: { ${productInputQuery(product)} }) {
      ${productResponseQuery()}
    }
  }`;
}

export function updateProductMutation(product: Product): string {
  return `
    mutation {
      updateproduct (product: { ${productInputQuery(product, true)} }) {
        ${productResponseQuery()}
      }
    }`;
}

export function productResponseQuery(): string {
  return `id, name, description, sku, ship, shipping_delay, default_price, fulfillment_provider { id, name, provider { name } }, attributes { weight { units, unitofmeasurement }, dimensions { width { units, unitofmeasurement }, height { units, unitofmeasurement }, length { units, unitofmeasurement } }, images { path, dimensions { width, height}, name, description, format } }, created_at, updated_at`
}

export function productInputQuery(p: Product, includeId?: boolean): string {
  const product = p.copy();

  let height = '';
  if (product.attributes.dimensions.height.units) {
    height = `height: { units: ${product.attributes.dimensions.height.units}, unitofmeasurement: "${product.attributes.dimensions.height.unitofmeasurement}" }`;
  }

  let length = '';
  if (product.attributes.dimensions.length.units) {
    length = `length: { units: ${product.attributes.dimensions.length.units}, unitofmeasurement: "${product.attributes.dimensions.length.unitofmeasurement}" }`;
  }

  let width = '';
  if (product.attributes.dimensions.width.units) {
    width = `width: { units: ${product.attributes.dimensions.width.units}, unitofmeasurement: "${product.attributes.dimensions.width.unitofmeasurement}" }`;
  }

  let weight = '';
  if (product.attributes.weight.units) {
    weight = `weight: { units: ${product.attributes.weight.units}, unitofmeasurement: "${product.attributes.weight.unitofmeasurement}" }`;
  }

  let dimensions = '';
  if (height || length || width) {
    dimensions = `dimensions: { ${height} ${length} ${width} }`;
  }

  let images = '';
  if (p.attributes.images) {
    images = `images: [ ${p.attributes.images.reduce((a,b) => `${a}${a ? ',' : ' '}{path:"${b.path}"}` ,'')} ]`;
  }

  let attributes = '';
  if (dimensions || weight || images) {
    attributes = `attributes: { ${dimensions} ${weight} ${images} } `;
  }

  return `${addId(product.id, includeId)} name: "${clean(product.name)}", ${attributes ? attributes : ''} ${product.description ? `description: "${product.description}",` : ''} sku: "${product.sku}", ship: ${!!product.ship} ${product.defaultPrice.amount || product.defaultPrice.amount===0 ? `, default_price:${product.defaultPrice.amount}` : ''} ${product.shippingDelay || product.shippingDelay===0 ? `, shipping_delay:${product.shippingDelay}` : ''} ${product.fulfillmentProvider.id ? `, fulfillment_provider:"${product.fulfillmentProvider.id}"` : ''}`
}
