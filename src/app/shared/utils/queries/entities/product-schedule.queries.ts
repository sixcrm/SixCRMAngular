import {loadBalancerResponseQuery} from './load-balancer.queries';
import {
  paginationParamsQuery, fullPaginationStringResponseQuery, deleteMutationQuery,
  addId
} from './entities-helper.queries';
import {ProductSchedule} from '../../../models/product-schedule.model';

export function  productScheduleListQuery(limit?:number, cursor?:string): string {
  return `{
    productschedulelist (${paginationParamsQuery(limit, cursor)}) {
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

function productScheduleResponseQuery(): string {
  return `
    id name created_at updated_at,
    schedule { price start end period,
      product { id name ship }
    }
    loadbalancers {
      ${loadBalancerResponseQuery()}
    }`
}

function productScheduleInfoResponseQuery(): string {
  return `id name created_at updated_at schedule { price}`
}

function productScheduleInputQuery(productSchedule: ProductSchedule, includeId?: boolean): string {
  let schedules = productSchedule.schedules.reduce((a,b) => `${a} {product_id: "${b.product.id}", start: ${b.start}, ${b.end ? `end: ${b.end},` : ''} price: ${b.price.amount}, period: ${b.period}}, `, '');

  return `${addId(productSchedule.id, includeId)}, name: "${productSchedule.name}" schedule: [${schedules}]`;
}
