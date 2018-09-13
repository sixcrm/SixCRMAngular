import {
  paginationParamsQuery, fullPaginationStringResponseQuery, deleteMutationQuery,
  addId, clean, deleteManyMutationQuery, listQueryParams, addUpdatedAtApi
} from './entities-helper.queries';
import {ProductSchedule} from '../../../models/product-schedule.model';
import {IndexQueryParameters} from '../index-query-parameters.model';

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

export function productSchedulesByProduct(id: string, params: IndexQueryParameters): string {
  return `{
    productschedulelistbyproduct (product:"${id}" ${paginationParamsQuery(params, true)}) {
			productschedules {
        ${productScheduleResponseQuery()}
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

export function createProductScheduleMutation(schedule: ProductSchedule): string {
  return `
    mutation {
		  createproductschedule (productschedule: { ${productScheduleInputQuery(schedule)} }) {
        ${productScheduleResponseQuery()}
      }
	  }`
}

export function updateProductScheduleMutation(schedule: ProductSchedule): string {
  return `
    mutation {
		  updateproductschedule (productschedule: { ${productScheduleInputQuery(schedule, true)} }) {
        ${productScheduleResponseQuery()}
      }
	  }`
}

export function productScheduleResponseQuery(): string {
  return `
    id name created_at updated_at,
    schedule { price start end period samedayofmonth,
      product { id name ship sku attributes { images { path default_image } } }
    },
    emailtemplates { id, name, subject, smtp_provider { id name } }`
}

export function productScheduleInfoResponseQuery(): string {
  return `id name created_at updated_at schedule { start samedayofmonth end period price product {id sku name default_price description attributes {images {path default_image}}} }`
}

export function productScheduleInputQuery(productSchedule: ProductSchedule, includeId?: boolean): string {
  let schedules = productSchedule.schedules.reduce((a,b) => `${a} {product: "${b.product.id}", start: ${b.start}, ${b.end ? `end: ${b.end},` : ''} price: ${b.price.amount}, period: ${b.period}, samedayofmonth: ${!!b.sameDayOfMonth}}, `, '');

  return `${addId(productSchedule.id, includeId)}, name: "${clean(productSchedule.name)}", schedule: [${schedules}], ${addUpdatedAtApi(productSchedule, includeId)}`;
}
