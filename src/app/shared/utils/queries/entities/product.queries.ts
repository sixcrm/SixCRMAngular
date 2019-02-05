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
  return `id, name, sku, price, is_shippable, shipping_price, shipping_delay, image_urls, created_at, updated_at`;
}

export function productResponseQuery(): string {
  return `id, name, description, sku, is_shippable, shipping_price, shipping_delay, price, fulfillment_provider { id, name, provider { name } }, image_urls, emailtemplates { id, name, subject, type, preview, smtp_provider { id name }} created_at, updated_at`
}

export function productInputQuery(p: Product, includeId?: boolean): string {
  const product = p.copy();

  const images = `image_urls: [ ${product.imageUrls.reduce((a, b) => `${a}${a ? ',':''}"${b}"`, '')} ]`;

  let sku = '';
  if (product.sku !== '') {
    sku = `sku: "${product.sku}"`;
  }

  return `${addId(product.id, includeId)} name: "${clean(product.name)}", ${images}, ${product.description ? `description: "${product.description}",` : ''} ${sku}, is_shippable: ${!!product.ship}, price:${product.defaultPrice.amount || 0}, shipping_price:${product.shippingPrice.amount || 0}  ${product.shippingDelay || product.shippingDelay===0 ? `, shipping_delay:${product.shippingDelay}` : ''} ${product.fulfillmentProvider.id ? `, fulfillment_provider:"${product.fulfillmentProvider.id}"` : ''}, ${addUpdatedAtApi(product, includeId)}`
}
