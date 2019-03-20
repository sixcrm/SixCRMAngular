import {
  fullPaginationStringResponseQuery, deleteMutationQuery,
  addId, clean, deleteManyMutationQuery, listQueryParams, addUpdatedAtApi
} from './entities-helper.queries';
import {IndexQueryParameters} from '../index-query-parameters.model';
import { CycleProduct, ProductSchedule } from '../../../models/product-schedule.model';

export function  productScheduleListQuery(params: IndexQueryParameters): string {
  return `{
    productschedulelist ${listQueryParams(params)} {
			productschedules {
        ${productScheduleInfoResponseQuery()}
			}
      ${fullPaginationStringResponseQuery()}
		}
  }`;
}

export function productScheduleQuery(id: string): string {
  return `{
    productschedule (id: "${id}") {
			  ${productScheduleResponseQuery()}
		}
  }`
}

export function deleteProductScheduleMutation(id: string): string {
  return deleteMutationQuery('productschedule', id);
}

export function deleteProductSchedulesMutation(id: string[]): string {
  return deleteManyMutationQuery('productschedule', id);
}

export function createProductScheduleMutation(productSchedule: ProductSchedule): string {
  return `
    mutation {
		  createproductschedule (productschedule: { ${productScheduleInputQuery(productSchedule)} }) {
        ${productScheduleResponseQuery()}
      }
	  }`
}

export function updateProductScheduleMutation(productSchedule: ProductSchedule): string {
  return `
    mutation {
		  updateproductschedule (productschedule: { ${productScheduleInputQuery(productSchedule, true)} }) {
        ${productScheduleResponseQuery()}
      }
	  }`
}

export function productScheduleResponseQuery(): string {
  return `id name created_at merchantprovidergroup {id, name} updated_at cycles { cycle_products { product {id, name, is_shippable}, is_shipping, quantity, position }, price, shipping_price, length, position, next_position }`
}

export function productScheduleInfoResponseQuery(): string {
  return `id name created_at updated_at cycles { length price }`
}

export function productScheduleInputQuery(productSchedule: ProductSchedule, includeId?: boolean): string {
  const extractCycleProducts = (products: CycleProduct[]) => {
    return products.reduce((a,b) => {
      return `${a}${a?',':''}{product:"${b.product.id}", is_shipping:${!!b.isShipping}, quantity:${b.quantity}, position:${b.position} }`
    }, '')
  };

  let cycles = productSchedule.cycles.reduce((a,b) => {
    return `${a}${a?',':''}{cycle_products: [${extractCycleProducts(b.cycleProducts)}], price:${b.price.amount}, shipping_price:${b.shippingPrice.amount}, length:"${b.length} ${b.monthly ? 'months' : 'days'}", position:${b.position}, next_position:${b.nextPosition}}`;
  }, '');

  return `${addId(productSchedule.id, includeId)}, name: "${clean(productSchedule.name)}" ${productSchedule.merchantProviderGroup.id ? `merchantprovidergroup:"${productSchedule.merchantProviderGroup.id}"` : ''} cycles: [${cycles}], ${addUpdatedAtApi(productSchedule, includeId)}`;
}
