import {
  fullPaginationStringResponseQuery, deleteMutationQuery,
  addId, clean, addField, deleteManyMutationQuery, listQueryParams, addUpdatedAtApi
} from './entities-helper.queries';
import {Product} from '../../../models/product.model';
import {IndexQueryParameters} from '../index-query-parameters.model';
import {Currency} from '../../currency/currency';

export function productsListQuery(params: IndexQueryParameters): string {
  return `{
    productlist ${listQueryParams(params)} {
			products {
			  ${productInfoResponseQuery()}
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

export function deleteProductsMutation(id: string[]): string {
  return deleteManyMutationQuery('product', id);
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

export function productInfoResponseQuery(): string {
  return `id, name, sku, default_price, dynamic_pricing {min, max}, attributes { images { path, default_image } }, created_at, updated_at`;
}

export function productResponseQuery(): string {
  return `id, name, description, sku, ship, shipping_delay, default_price, dynamic_pricing {min, max}, fulfillment_provider { id, name, provider { name } }, attributes { weight { units, unitofmeasurement }, dimensions { width { units, unitofmeasurement }, height { units, unitofmeasurement }, length { units, unitofmeasurement } }, images { path, default_image, dimensions { width, height}, name, description, format } }, emailtemplates { id, name, subject, type, preview, smtp_provider { id name }} created_at, updated_at`
}

export function productInputQuery(p: Product, includeId?: boolean): string {
  const product = p.copy();

  product.dynamicPrice.enabled = true;
  product.dynamicPrice.min = new Currency(0);
  product.dynamicPrice.max = new Currency(9999999);

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
    images = `images: [ ${p.attributes.images.reduce((a,b) => `${a}${a ? ',' : ' '}{path:"${b.path}" ${addField('name', b.name, true)} ${addField('description', b.description, true)} default_image: ${!!b.defaultImage} }` ,'')} ]`;
  }

  let attributes = '';
  if (dimensions || weight || images) {
    attributes = `attributes: { ${dimensions} ${weight} ${images} } `;
  }

  let dynamic = '';
  if (product.dynamicPrice.enabled) {
    dynamic = `dynamic_pricing: { min:${product.dynamicPrice.min.amount}, max:${product.dynamicPrice.max.amount} }`
  }

  let sku = '';
  if (product.sku !== '') {
    sku = `sku: "${product.sku}"`;
  }

  return `${addId(product.id, includeId)} name: "${clean(product.name)}", ${dynamic}, ${attributes ? attributes : ''} ${product.description ? `description: "${product.description}",` : ''} ${sku}, ship: ${!!product.ship} ${product.defaultPrice.amount || product.defaultPrice.amount===0 ? `, default_price:${product.defaultPrice.amount}` : ''} ${product.shippingDelay || product.shippingDelay===0 ? `, shipping_delay:${product.shippingDelay}` : ''} ${product.fulfillmentProvider.id ? `, fulfillment_provider:"${product.fulfillmentProvider.id}"` : ''}, ${addUpdatedAtApi(product, includeId)}`
}
