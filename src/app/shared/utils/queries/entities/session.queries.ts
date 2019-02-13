import {
  paginationParamsQuery, fullPaginationStringResponseQuery, deleteMutationQuery,
  deleteManyMutationQuery, listQueryParams
} from './entities-helper.queries';
import {IndexQueryParameters} from '../index-query-parameters.model';
import {Session} from '../../../models/session.model';
import {Watermark} from '../../../models/watermark/watermark.model';
import {ProductSchedule} from '../../../models/product-schedule.model';
import {Product} from '../../../models/product.model';
import {Schedule} from '../../../models/schedule.model';
import {customerResponseQuery} from './customer.queries';

export function sessionsInfoListQuery(params: IndexQueryParameters): string {
  return `{
    sessionlist ${listQueryParams(params)} {
			sessions {
			  ${sessionInfoResponseQuery()}
			}
			${fullPaginationStringResponseQuery()}
		}}`
}

export function sessionsByAffiliate(affiliateId: string, params: IndexQueryParameters): string {
  return `{
		sessionlistbyaffiliate (affiliate:"${affiliateId}" ${paginationParamsQuery(params, true)}) {
			sessions {
			  ${sessionInfoResponseQuery()}
			}
			${fullPaginationStringResponseQuery()}
    }
  }`
}

export function sessionQuery(id: string): string {
  return `
  {
		session (id: "${id}") {
			${sessionResponseQuery()}
		}
	}`
}

export function deleteSessionMutation(id: string): string {
  return deleteMutationQuery('session', id);
}

export function deleteSessionsMutation(id: string[]): string {
  return deleteManyMutationQuery('session', id);
}

function parseSchedule(schedule: Schedule): string {
  return `{
   price: ${schedule.price.amount},
   start: ${schedule.start},
   ${schedule.end ? `end: ${schedule.end},`:''}
   samedayofmonth: ${!!schedule.sameDayOfMonth},
   period: ${schedule.period},
   product: ${parseProduct(schedule.product)}
 }`;
}

function parseProduct(product: Product): string {
  return `{
    id: "${product.id}",
    name: "${product.name}",
    ${product.description ? `description: "${product.description}",`:''}
    ${product.sku ? `sku: "${product.sku}",`:''}
    ${product.ship ? `ship: ${!!product.ship},`:''}
    ${product.shippingDelay ? `shipping_delay: ${product.shippingDelay},`:''}
    ${product.price ? `price: ${product.defaultPrice.amount},`:''}
    ${product.fulfillmentProvider.id ? `fulfillment_provider: "${product.fulfillmentProvider.id}",`:''}
  }`;
}

function parseWatermarkProductSchedules(watermark: Watermark): string {
  if (!watermark || !watermark.extractedProductSchedules || watermark.extractedProductSchedules.length === 0) return `[]`;

  const parseItem = (productSchedule: ProductSchedule) => {
    return `{
      quantity:${productSchedule.quantity || 1},
      product_schedule:{
        ${productSchedule.id ? `id: "${productSchedule.id}",`: ''}
        ${productSchedule.name ? `name: "${productSchedule.name}",`: ''}
        schedule: [${productSchedule.schedules.map(s => parseSchedule(s))}]
      }
    }`
  };

  return `[${watermark.extractedProductSchedules.reduce((a,b) => `${a}${a?',':''}${parseItem(b)}`, '')}]`
}

function parseWatermarkProducts(watermark: Watermark): string {
  if (!watermark || !watermark.extractedProducts || watermark.extractedProducts.length === 0) return `[]`;

  const parseItem = (product: Product) => {
    return `{
      quantity: ${product.quantity || 1},
      price: ${product.price.amount},
      product: ${parseProduct(product)}
    }`;
  };

  return `[${watermark.extractedProducts.reduce((a,b) => `${a}${a?',':''}${parseItem(b)}`, '')}]`
}

export function updateSessionMutation(session: Session): string {
  return `mutation {
		  updatesession ( session: {
		    id: "${session.id}",
		    customer: "${session.customer.id}",
		    campaign: "${session.campaign.id}",
		    completed: ${!!session.completed},
		    watermark: {
		      product_schedules: ${parseWatermarkProductSchedules(session.watermark)},
		      products: ${parseWatermarkProducts(session.watermark)}
		    }
		    product_schedules: [${session.productSchedules.map(ps => ps.id).reduce((a,b)=> `${a}${a?',':''}"${b}"`, '')}],
		    ${session.cid.id ? `cid:	"${session.cid.id}",`: ''}
		    ${session.affiliate.id ? `affiliate:	"${session.affiliate.id}",`: ''}
		    ${session.subAffiliate1.id ? `subaffiliate_1:	"${session.subAffiliate1.id}",`: ''}
		    ${session.subAffiliate2.id ? `subaffiliate_2:	"${session.subAffiliate2.id}",`: ''}
		    ${session.subAffiliate3.id ? `subaffiliate_3:	"${session.subAffiliate3.id}",`: ''}
		    ${session.subAffiliate4.id ? `subaffiliate_4:	"${session.subAffiliate4.id}",`: ''}
		    ${session.subAffiliate5.id ? `subaffiliate_5:	"${session.subAffiliate5.id}",`: ''}
        updated_at: "${session.updatedAtAPI}"
      }) {
        ${sessionResponseQuery()}
      }
	  }`
}

export function cancelSessionMutation(session: Session, canceledBy: string): string {
    return `mutation { cancelsession (session: { id: "${session.id}", cancelled: true, cancelled_by: "${canceledBy}" })
        {
            ${sessionResponseQuery()}
        }
     }`
}

export function confirmDelivery(sessionId: string): string {
  return `mutation { confirmtrialdelivery (session_id: "${sessionId}") { result } }`
}

export function sessionResponseQuery(): string {
  return `
    id alias created_at updated_at completed,
    watermark {
      product_schedules { quantity, product_schedule { name, schedule { price, start, end, period, samedayofmonth, product {id, name } } } },
      products { quantity, price, product { id name } }
    }
    trial_confirmation { id code delivered_at confirmed_at }
    customer { ${customerResponseQuery()} }
    rebills { ${sessionRebillResponseQuery()} },
    campaign { id name }
    cancelled { cancelled cancelled_at cancelled_by { id name } }`;
}

function sessionRebillResponseQuery() {
  return `
    id alias bill_at amount cycle created_at updated_at state
    products { quantity, amount, product { id, name, sku, ship } }
    transactions {
      creditcard { id, last_four, type, created_at }
      id alias amount processor_response type result created_at updated_at,
      merchant_provider { id name }
      products { amount,
        product { id name sku ship shipping_delay,
          fulfillment_provider {id name}
        }
        shippingreceipt { id status fulfillment_provider_reference tracking {carrier id} fulfillment_provider {id, name} created_at }
      }
    }
  `
}

export function sessionInfoResponseQuery(): string {
  return `id alias created_at updated_at customer { id firstname lastname } watermark { product_schedules { quantity } } rebills { id } campaign { id name }`;
}
