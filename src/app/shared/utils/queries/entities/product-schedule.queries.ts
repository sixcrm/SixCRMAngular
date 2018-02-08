import {loadBalancerResponseQuery} from './load-balancer.queries';
import {
  paginationParamsQuery, fullPaginationStringResponseQuery, deleteMutationQuery,
  addId, clean
} from './entities-helper.queries';
import {ProductSchedule} from '../../../models/product-schedule.model';

export function  productScheduleListQuery(limit?:number, cursor?:string): string {
  return `{
    productschedulelist ${paginationParamsQuery(limit, cursor)} {
			productschedules {
        ${productScheduleResponseQuery()}
			}
      ${fullPaginationStringResponseQuery()}
		}
  }`;
}

export function productSchedulesByProduct(id: string, limit?: number, cursor?: string): string {
  return `{
    productschedulelistbyproduct (product:"${id}" ${paginationParamsQuery(limit, cursor, true)}) {
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
    schedule { price start end period,
      product { id name ship }
    }
    loadbalancer {
      ${loadBalancerResponseQuery()}
    }`
}

export function productScheduleInfoResponseQuery(): string {
  return `id name created_at updated_at schedule { price}`
}

export function productScheduleInputQuery(productSchedule: ProductSchedule, includeId?: boolean): string {
  let schedules = productSchedule.schedules.reduce((a,b) => `${a} {product: "${b.product.id}", start: ${b.start}, ${b.end ? `end: ${b.end},` : ''} price: ${b.price.amount}, period: ${b.period}}, `, '');

  return `${addId(productSchedule.id, includeId)}, name: "${clean(productSchedule.name)}", ${productSchedule.loadBalancer.id ? `loadbalancer: "${productSchedule.loadBalancer.id}",` : ''} schedule: [${schedules}]`;
}
