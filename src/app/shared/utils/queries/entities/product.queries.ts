import {
  fullPaginationStringResponseQuery, paginationParamsQuery, deleteMutationQuery,
  addId
} from './entities-helper.queries';
import {Product} from '../../../models/product.model';

export function productsListQuery(limit?:number, cursor?:string): string {
  return `{
    productlist (${paginationParamsQuery(limit, cursor)}) {
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
  return `id name sku ship shipping_delay fulfillment_provider { id name username endpoint password provider }`
}

export function productInputQuery(product: Product, includeId?: boolean): string {
  return `${addId(product.id, includeId)} name: "${product.name}", sku: "${product.sku}", ship: "${product.ship}", shipping_delay:"${product.shippingDelay}",  fulfillment_provider:"${product.fulfillmentProvider.id}"`
}
