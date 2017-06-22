import {SmtpProvider} from '../models/smtp-provider.model';
import {MerchantProvider} from '../models/merchant-provider.model';
import {LoadBalancer} from '../models/load-balancers.model';
import {Product} from '../models/product.model';
import {ProductSchedule} from '../models/product-schedule.model';
import {User} from '../models/user.model';
import {CreditCard} from '../models/credit-card.model';
import {FulfillmentProvider} from '../models/fulfillment-provider.model';
import {Affiliate} from '../models/affiliate.model';
import {Customer} from '../models/customer.model';
import {CustomerNote} from '../models/customer-note.model';
import {Notification} from '../models/notification.model';
import {utc} from 'moment'
import {UserSettings} from '../models/user-settings';
import {NotificationSettings} from '../models/notification-settings.model';
import {Rebill} from '../models/rebill.model';
import {Tracker} from '../models/tracker.model';
import {EmailTemplate} from '../models/email-template.model';
import {Campaign} from '../models/campaign.model';

const uuidV4 = require('uuid/v4');

function deleteMutation(entity: string, id: string) {
  return `mutation { delete${entity} (id: "${id}") { id }}`
}

export function productsListQuery(limit?:number, cursor?:string): string {
  return `{
    productlist ${pageParams(limit, cursor)} {
			products { id name sku ship shipping_delay,
				fulfillment_provider { id name provider username password endpoint }
			}
			${paginationString()}
		}}`;
}

export function productQuery(id: string): string {
  return `{
    product (id: "${id}") { id name sku ship shipping_delay,
      fulfillment_provider { id name provider username password endpoint }
		} }`
}

export function deleteProductMutation(id: string): string {
  return deleteMutation('product', id);
}

export function createProductMutation(product: Product): string {
  return `
  mutation {
    createproduct (product: { id: "${generateUUID()}", name: "${product.name}", sku: "${product.sku}", ship: "${product.ship}", shipping_delay:"${product.shippingDelay}",  fulfillment_provider:"${product.fulfillmentProvider.id}" }) {
      id name sku ship shipping_delay,
      fulfillment_provider { id name username endpoint password provider }
    }
  }`;
}

export function updateProductMutation(product: Product): string {
  return `
    mutation {
      updateproduct (product: { id: "${product.id}", name: "${product.name}", sku: "${product.sku}", ship: "${product.ship}", shipping_delay:"${product.shippingDelay}",  fulfillment_provider:"${product.fulfillmentProvider.id}" }) {
        id name sku ship shipping_delay,
        fulfillment_provider { id name username endpoint password provider }
      }
    }`;
}

export function  productScheduleListQuery(limit?:number, cursor?:string): string {
  return `{
    productschedulelist ${pageParams(limit, cursor)} {
			productschedules { id name,
			  schedule { price start end period,
			    product { id name sku ship shipping_delay,
			      fulfillment_provider { id name provider username password endpoint }
					}
				}
			}
      ${paginationString()}
		}}`;
}

export function productScheduleQuery(id: string): string {
  return `{
    productschedule (id: "${id}") { id name,
			  schedule { price start end period,
			    product { id name sku ship shipping_delay,
			      fulfillment_provider { id name provider username password endpoint }
					}
				}
		} }`
}

export function deleteProductScheduleMutation(id: string): string {
  return deleteMutation('productschedule', id);
}

export function createProductScheduleMutation(schedule: ProductSchedule): string {
  let schedules: string = '';
  for (let index in schedule.schedules) {
    let sch = schedule.schedules[index];
    schedules += `{product_id: "${sch.product.id}", start: "${sch.start}", end: "${sch.end}", price: "${sch.price}", period: "${sch.period}"} `;
  }

  return `
    mutation {
		  createproductschedule (productschedule: { id: "${schedule.id}", schedule: [${schedules}]}) {
        id name,
        schedule { price start end period,
          product { id name }
        }
      }
	  }`
}

export function updateProductScheduleMutation(schedule: ProductSchedule): string {
  let schedules: string = '';
  for (let index in schedule.schedules) {
    let sch = schedule.schedules[index];
    schedules += `{product_id: "${sch.product.id}", start: "${sch.start}", end: "${sch.end}", price: "${sch.price}", period: "${sch.period}"} `;
  }

  return `
    mutation {
		  updateproductschedule (productschedule: { id: "${schedule.id}", schedule: [${schedules}]}) {
        id,
        schedule { price start end period,
          product { id name }
        }
      }
	  }`
}

export function campaignQuery(id: string): string {
  return `{
    campaign (id: "${id}") 
      ${campaignResponseQuery()}
    }`
}

export function campaignsInfoListQuery(limit?:number, cursor?:string): string {
  return `{
    campaignlist ${pageParams(limit, cursor)} {
      campaigns { id name created_at updated_at,
        productschedules { id name schedule {price} }
        loadbalancer { id,
          merchantproviderconfigurations {
            merchantprovider { id }
            distribution
          }
        }
      }
      ${paginationString()}
    }}`
}

export function deleteCampaignMutation(id: string): string {
  return deleteMutation('campaign', id);
}

export function createCampaignMutation(campaign: Campaign): string {
  return `
    mutation { 
		  createcampaign ( campaign: { name: "${campaign.name}", loadbalancer: "${campaign.loadBalancer.id}", productschedules:[${campaign.productSchedules.map(s => `"${s.id}",`)}], emailtemplates:[${campaign.emailTemplates.map(t => `"${t.id}",`)}] } ) 
			${campaignResponseQuery()}
		}`
}

export function updateCampaignMutation(campaign: Campaign): string {
  return `
    mutation { 
		  updatecampaign ( campaign: { id: "${campaign.id}", name: "${campaign.name}", loadbalancer: "${campaign.loadBalancer.id}", productschedules:[${campaign.productSchedules.map(s => `"${s.id}",`)}], emailtemplates:[${campaign.emailTemplates.map(t => `"${t.id}",`)}] } ) 
			${campaignResponseQuery()}
		}`
}

function campaignResponseQuery(): string {
  return `
    { id name
      productschedules { id name,
        schedule { price start end period,
          product { id name sku ship shipping_delay,
            fulfillment_provider { id name provider username password endpoint }
          }
        }
      }
      loadbalancer { id,
        merchantproviderconfigurations {
          merchantprovider { id username password endpoint processor }
          distribution
        }
      }
      emailtemplates {
        id name subject body type,
        smtp_provider { id name hostname }
      }
    }`
}

export function merchantProvidersListQuery(limit?:number, cursor?:string): string {
  return `{ merchantproviderlist ${pageParams(limit, cursor)} { merchantproviders { id name username password endpoint processor } ${paginationString()} } }`
}

export function merchantProviderQuery(id: string): string {
  return `{ merchantprovider (id: "${id}") { id name username password endpoint processor } }`
}

export function deleteMerchantProviderMutation(id: string): string {
  return deleteMutation('merchantprovider', id);
}

export function createMerchantProviderMutation(provider: MerchantProvider): string {
  return `
    mutation {
		  createmerchantprovider (
		    merchantprovider: { id: "${generateUUID()}", name: "${provider.name}", username: "${provider.username}", password: "${provider.password}", endpoint: "${provider.endpoint}", processor: "${provider.processor}"}) {
			    id  name username password endpoint processor
		  }
	}`
}

export function updateMerchantProviderMutation(provider: MerchantProvider): string {
  return `
    mutation {
		  updatemerchantprovider (
		    merchantprovider: { id: "${provider.id}", name: "${provider.name}", username: "${provider.username}", password: "${provider.password}", endpoint: "${provider.endpoint}", processor: "${provider.processor}"}) {
			    id  name username password endpoint processor
		  }
	}`
}

export function fulfillmentProvidersListQuery(limit?:number, cursor?:string): string {
  return `{ fulfillmentproviderlist ${pageParams(limit, cursor)} { fulfillmentproviders { id name provider username password endpoint } ${paginationString()} } }`
}

export function fulfillmentProviderQuery(id: string): string {
  return `{ fulfillmentprovider (id: "${id}") { id name username password endpoint provider } }`
}

export function deleteFulfillmentProviderMutation(id: string): string {
  return deleteMutation('fulfillmentprovider', id);
}

export function createFulfillmentProviderMutation(provider: FulfillmentProvider): string {
  return `
    mutation {
		  createfulfillmentprovider ( fulfillmentprovider: { id:"${generateUUID()}" name: "${provider.name}", username: "${provider.username}", password: "${provider.password}", endpoint: "${provider.endpoint}", provider: "${provider.provider}"}) {
			  id name provider username password endpoint
		  }
	  }`
}

export function updateFulfillmentProviderMutation(provider: FulfillmentProvider): string {
  return `
    mutation {
		  updatefulfillmentprovider ( fulfillmentprovider: { id: "${provider.id}", name: "${provider.name}", username: "${provider.username}", password: "${provider.password}", endpoint: "${provider.endpoint}", provider: "${provider.provider}"}) {
			  id name provider username password endpoint
		  }
	  }`
}

export function affiliatesListQuery(limit?:number, cursor?:string): string {
  return `{ affiliatelist ${pageParams(limit, cursor)} { affiliates { id name affiliate_id created_at updated_at } ${paginationString()} } }`
}

export function affiliateQuery(id: string): string {
  return `{ affiliate (id: "${id}") { id name affiliate_id created_at updated_at } }`
}

export function deleteAffiliateMutation(id: string): string {
  return deleteMutation('affiliate', id);
}

export function createAffiliateMutation(affiliate: Affiliate): string {
  return `
    mutation {
      createaffiliate (affiliate: { id: "${generateUUID()}", affiliate_id: "${affiliate.affiliateId}", name: "${affiliate.name}"}) { 
        id name affiliate_id created_at updated_at
      }
	  }`
}

export function updateAffiliateMutation(affiliate: Affiliate): string {
  return `
    mutation {
      updateaffiliate (affiliate: { id: "${affiliate.id}", affiliate_id: "${affiliate.affiliateId}", name: "${affiliate.name}" }) { 
        id affiliate_id name created_at updated_at
      }
	  }`
}

export function trackersByAffiliateListQuery(affiliateId: string, limit?: number, cursor?: string): string {
  return `
    query {
      trackerlistbyaffiliate (affiliate: "${affiliateId}" ${pageParams(limit, cursor, true)}) {
        trackers{ id event_type type name body created_at updated_at,
          affiliates { id name affiliate_id created_at updated_at }
        }
        ${paginationString()}
      } }`
}

export function trackersListQuery(limit?: number, cursor?: string): string {
  return `{
		trackerlist ${pageParams(limit, cursor)} {
			trackers { id event_type name type body created_at updated_at,
        affiliates { id }
      }
			${paginationString()}
		} }`
}

export function trackerQuery(id: string): string {
  return `{
		tracker (id: "${id}") {
		  id event_type name type body created_at updated_at,
      affiliates { id affiliate_id name created_at updated_at }
    } }`
}

export function deleteTrackerMutation(id: string): string {
  return deleteMutation('tracker', id);
}

export function updateTrackerMutation(tracker: Tracker): string {
  let eventTypes: string = '';
  Object.keys(tracker.eventType).forEach(key => eventTypes += (eventTypes ? ',' : '') + `"${tracker.eventType[key]}"`);

  let affiliates: string = '';
  Object.keys(tracker.affiliates).forEach(key => affiliates += (affiliates ? ',' : '') + `"${tracker.affiliates[key].id}"`);

  return `
  mutation {
		updatetracker (tracker: { id: "${tracker.id}", event_type: [${eventTypes}], affiliates: [${affiliates}], name: "${tracker.name}", type: "${tracker.type}", body:"${tracker.body.replace(/"/g, '\\"')}"}) {
			id type event_type name body created_at updated_at,
			affiliates { id affiliate_id name created_at updated_at }
		} }`
}

export function createTrackerMutation(tracker: Tracker): string {
  let eventTypes: string = '';
  Object.keys(tracker.eventType).forEach(key => eventTypes += (eventTypes ? ',' : '') + `"${tracker.eventType[key]}"`);

  let affiliates: string = '';
  Object.keys(tracker.affiliates).forEach(key => affiliates += (affiliates ? ',' : '') + `"${tracker.affiliates[key].id}"`);

  return `
    mutation {
      createtracker (tracker: { event_type: [${eventTypes}], affiliates: [${affiliates}], name: "${tracker.name}", type: "${tracker.type}", body:"${tracker.body.replace(/"/g, '\\"')}"}) {
        id type name body created_at updated_at
        affiliates{ id name affiliate_id created_at updated_at }
      }
    }`
}

export function customersInfoListQuery(limit?:number, cursor?:string): string {
  return `{
    customerlist ${pageParams(limit, cursor)} {
      customers { id firstname lastname created_at,
        address { city country state }
			}
			${paginationString()}
		}}`
}

export function customerQuery(id: string): string {
  return `{
    customer (id: "${id}") { id email firstname lastname phone created_at updated_at,
      address { line1 line2 city state zip country }
		  creditcards {	id number expiration ccv name,
			  address { line1 line2 city state zip country }
			}
		}
  }`
}

export function deleteCustomerMutation(id: string): string {
  return deleteMutation('customer', id);
}

export function createCustomerMutation(customer: Customer): string {

  return `
    mutation {
		  createcustomer (
		    customer: { ${customer.getMutation()} }
      ) {
        id email firstname lastname phone,
        address { line1 city state zip country }
			  creditcards { id number expiration ccv name,
				  address { line1 line2 city state zip }
			  }
		  }
	  }`
}

export function updateCustomerMutation(customer: Customer): string {
  return `
    mutation {
		  updatecustomer (
		    customer: { ${customer.getMutation()} }
      ) {
		    id email firstname lastname phone created_at updated_at,
		    address { line1 line2 city state zip country }
			  creditcards { id number expiration ccv name,
				  address { line1 line2 city state zip country }
			  }
		  }
	  }`
}

export function customerNotesByCustomerQuery(id: string, limit?: number, cursor?: string): string {
  return `{
    customernotelistbycustomer (customer:"${id}" ${pageParams(limit, cursor, true)}) {
      customernotes { id body created_at updated_at,
        user {id name }
      }
      ${paginationString()}
		}}`
}

export function createCustomerNoteMutation(customerNote: CustomerNote): string {

  return `
    mutation {
		  createcustomernote (
		    customernote: { id: "${generateUUID()}" customer: "${customerNote.customer.id}" user: "${customerNote.user.id}" body: "${customerNote.body}" }
      ) {
        id body created_at updated_at,
        user { id name }
		  }
	  }`
}

export function deleteCustomerNoteMutation(id: string): string {
  return deleteMutation('customernote', id);
}

export function loadBalancersInfoListQuery(limit?:number, cursor?:string): string {
  return `{
    loadbalancerlist ${pageParams(limit, cursor)} {
			loadbalancers { id,
			  merchantproviderconfigurations {
					merchantprovider { endpoint processor }
					distribution
				}
			}
			${paginationString()}
		}}`
}

export function loadBalancerQuery(id: string): string {
  return `{
    loadbalancer (id: "${id}") { id,
			  merchantproviderconfigurations {
					merchantprovider { id username password endpoint processor }
					distribution
				}
			} }`
}

export function createLoadBalancerMutation(loadBalancer: LoadBalancer): string {
  let providers: string = '';
  for (let index in loadBalancer.merchantProviderConfigurations) {
    let config = loadBalancer.merchantProviderConfigurations[index];
    providers += `{id: "${config.merchantProvider.id}", distribution: "${config.distribution}"} `;
  }

  return `
    mutation {
		createloadbalancer ( loadbalancer: {id: "${generateUUID()}", merchantproviders: [${providers}] } ) {
			id,
			merchantproviderconfigurations {
				merchantprovider { id name username password endpoint processor }
				distribution,
			}
		}
	}`
}

export function updateLoadBalancerMutation(loadBalancer: LoadBalancer): string {
  let providers: string = '';
  for (let index in loadBalancer.merchantProviderConfigurations) {
    let config = loadBalancer.merchantProviderConfigurations[index];
    providers += `{id: "${config.merchantProvider.id}", distribution: "${config.distribution}"} `;
  }

  return `
    mutation {
		updateloadbalancer ( loadbalancer: {id: "${loadBalancer.id}", merchantproviders: [${providers}] } ) {
			id,
			merchantproviderconfigurations {
				merchantprovider { id name username password endpoint processor }
				distribution
			}
		}
	}`
}

export function deleteLoadBalancerMutation(id: string): string {
  return deleteMutation('loadbalancer', id);
}

export function transactionsInfoListQuery(limit?:number, cursor?:string): string {
  return `{ transactionlist ${pageParams(limit, cursor)} {	transactions { id amount processor_response } ${paginationString()} } }`
}

export function transactionQuery(id: string): string {
  return `{
    transaction (id: "${id}") { id alias amount processor_response created_at updated_at,
      merchant_provider { id name }
      rebill { id amount }
      products { amount,
        product { id name sku ship shipping_delay,
          fulfillment_provider {id name}
        }
        shippingreceipt { id status trackingnumber created_at }
      }
    }
	}`
}

export function deleteTransactionMutation(id: string): string {
  return deleteMutation('transaction', id);
}

export function transactionsByCustomer(customerId: string, limit?:number, cursor?:string): string {
  return `{
		transactionlistbycustomer (customer:"${customerId}" ${pageParams(limit, cursor, true)}) {
			transactions { id amount processor_response alias }
			${paginationString()}
    }
  }`
}

export function refundTransactionMutation(transactionId: string, refundAmount: number): string {
  return `mutation {
		refundtransaction(refund:{amount:${refundAmount}}, transaction:"${transactionId}") {
			id alias amount processor_response created_at updated_at,
      merchant_provider { id name username password endpoint processor created_at updated_at }
			rebill { id amount bill_at,
			  product_schedules { id,
			    schedule { price start end period,
						product { id name sku ship shipping_delay,
							fulfillment_provider { id name provider username password endpoint }
						}
					}
				}
			}
			products { amount,
				product { id name sku ship shipping_delay,
					fulfillment_provider { id name provider username password endpoint }
				}
				shippingreceipt { id status trackingnumber created_at updated_at }
			}	
		}
	}`
}

export function sessionsInfoListQuery(limit?:number, cursor?:string): string {
  return `{
    sessionlist ${pageParams(limit, cursor)} {
			sessions { id,
			  customer { id firstname lastname }
				product_schedules { id }
				rebills { id 	}
				campaign { id name }
			}
			${paginationString()}
		}}`
}

export function sessionsByCustomer(customerId: string, limit?:number, cursor?:string): string {
  return `{
		sessionlistbycustomer (customer:"${customerId}" ${pageParams(limit, cursor, true)}) {
			sessions { id,
			  customer { id firstname lastname }
				product_schedules { id }
				rebills { id 	}
				campaign { id name }
			}
			${paginationString()}
    }
  }`
}

export function sessionsByAffiliate(affiliateId: string, limit?:number, cursor?:string): string {
  return `{
		sessionlistbyaffiliate (affiliate:"${affiliateId}" ${pageParams(limit, cursor, true)}) {
			sessions { id,
			  customer { id firstname lastname }
				product_schedules { id schedule { price } }
				rebills { id amount }
				campaign { id name }
			}
			${paginationString()}
    }
  }`
}

export function sessionQuery(id: string): string {
  return `{
    session (id: "${id}") { id,
			  customer { id firstname lastname,
			    address { line1 line2 city state zip }
				}
				product_schedules { id,
					schedule { price start end period,
					  product { id name sku ship shipping_delay,
					    fulfillment_provider { id name provider username password endpoint }
						}
					}
				}
				rebills { id,
				  product_schedules { id,
				    schedule { price start end period,
				      product { id name sku ship shipping_delay,
				        fulfillment_provider { id name provider username password endpoint }
							}
						}
					}
					transactions { id created_at processor_response amount }
				}
				campaign { id name,
					productschedules { id,
					  schedule { price start end period,
							product { id name sku ship shipping_delay,
							  fulfillment_provider { id name provider username password endpoint }
							}
						}
					}
					loadbalancer { id,
						merchantproviderconfigurations {
							merchantprovider { id username password endpoint processor }
							distribution
						}
					}
				}
			}
	}`
}

export function deleteSessionMutation(id: string): string {
  return deleteMutation('session', id);
}

export function rebillsListQuery(limit?: number, cursor?: string): string {
  return `{
		rebilllist ${pageParams(limit, cursor)} {
			rebills { id bill_at amount created_at updated_at,
				parentsession { id,
					customer { id firstname lastname }
				}
				product_schedules { id }
				transactions { id processor_response amount }
			}
			${paginationString()}
		}
  }`
}

export function rebillQuery(id: string): string {
  return `{
		rebill (id: "${id}") {
			id bill_at amount created_at updated_at,
      parentsession { id,
        customer { id firstname lastname }
      }
      product_schedules { id }
      transactions { id processor_response amount }
    }
  }`
}

export function rebillsByCustomer(customerId: string, limit?: number, cursor?: string): string {
  return `{
		rebilllistbycustomer (customer:"${customerId}" ${pageParams(limit, cursor, true)}) {
			rebills { id bill_at amount created_at updated_at,
				parentsession { id,
					customer { id firstname lastname }
				}
				product_schedules { id }
				transactions { id processor_response amount }
			}
			${paginationString()}
		}
  }`
}

export function deleteRebillMutation(id: string): string {
  return deleteMutation('rebill', id);
}

export function updateRebillMutation(rebill: Rebill): string {
  let schedules = '';
  Object.keys(rebill.productSchedules).forEach(key => {
    schedules += ` "${rebill.productSchedules[key].id}",`
  });

  return `
    mutation { 
      updaterebill ( rebill: { id: "${rebill.id}", bill_at:"${ rebill.billAt.format() }", parentsession: "${rebill.parentSession.id}", amount:"${rebill.amount.amount}", product_schedules:[${schedules}] } ) {
        id bill_at amount created_at updated_at,
        parentsession { id,
          customer { id firstname lastname,
            address { line1 line2 city state zip }
          },
          product_schedules { id,
            schedule { price start end period,
              product { id name sku ship shipping_delay,
                fulfillment_provider { id name provider username password endpoint }
              }
            }
          }
        }
        product_schedules { id,
          schedule { price start end period,
            product { id name sku ship shipping_delay,
              fulfillment_provider { id name provider username password endpoint }
            }
          }
        },
        transactions { id processor_response amount }
      }
    }`
}

export function creditCardsListQuery(limit?:number, cursor?:string): string {
  return `{
    creditcardlist ${pageParams(limit, cursor)} {
			creditcards { id number expiration ccv name,
			  address { country state city }
			}
		  ${paginationString()}
		}}`
}

export function creditCardQuery(id: string): string {
  return `{
    creditcard (id: "${id}") { id number expiration ccv name,
		  address { line1 line2 city state zip country }
		} }`
}

export function deleteCreditCardMutation(id: string): string {
  return deleteMutation('creditcard', id);
}

export function createCreditCardMutation(cc: CreditCard): string {
  return `
    mutation {
		  createcreditcard (creditcard: { ${cc.getMutation()} }) {
        id number expiration ccv name,
        address { line1 line2 city state zip country }
      }
	  }`
}

export function updateCreditCardMutation(cc: CreditCard): string {
  return `
    mutation {
		  updatecreditcard (creditcard: { ${cc.getMutation()} }) {
        id number expiration ccv name,
        address { line1 line2 city state zip country }
      }
	  }`
}

export function usersListQuery(limit?: number, cursor?: string): string {
  return `{
    userlist ${pageParams(limit,cursor)} {
			users { id auth0_id name active termsandconditions,
			  acl {
					account { id name active }
					role { id name active }
				}
			}
			${paginationString()}
		}}`
}

export function userQuery(id: string): string {
  return `
    {
      user (id: "${id}") { id auth0_id name alias first_name last_name active termsandconditions created_at updated_at address { country state city line1 line2 zip}}
    }`
}

export function userIntrospection(): string {
  return `{
    userintrospection { id name alias first_name last_name auth0_id active termsandconditions,
      acl {
        account { id name active }
        role { id name active,
          permissions { allow deny }
        }
      }
      address { line1 line2 city state zip country }
      usersetting { timezone }
    }
  }`
}

export function deleteUserMutation(id: string): string {
  return deleteMutation('user', id);
}

export function updateUserMutation(user: User): string {
  let fname = user.firstName ? `first_name: "${user.firstName}"` : '';
  let lname = user.lastName ? `last_name: "${user.lastName}"` : '';

  return `
    mutation {
      updateuser (user: { id: "${user.id}", auth0_id: "${user.auth0Id}", name: "${user.name}" alias: "${user.alias}" ${fname} ${lname} active:"${user.active}", termsandconditions:"${user.termsAndConditions}"}) {
        id name alias auth0_id active first_name last_name,
        address { line1 line2 city state zip country }
        acl {
          account { id name active }
          role { id name active }
        }
        termsandconditions
		  }
    }`;
}

export function updateUserForRegistration(user: User): string {
  return `
    mutation {
		  updateuser (
		    user: { id: "${user.id}" name: "${user.name}" alias: "${user.alias}" first_name: "${user.firstName}" last_name: "${user.lastName}" auth0_id: "${user.auth0Id}" active: "${user.active}" termsandconditions: "0.1",
		      address: {line1: "${user.address.line1}" line2: "${user.address.line2}" city: "${user.address.city}" state: "${user.address.state}" zip: "${user.address.zip}" country:"${user.address.country}"}}) {
			    id auth0_id name active termsandconditions
			}
	}`
}

export function updateUserForActivation(user: User): string {
  return `
    mutation {
		  updateuser (
		    user: { id: "${user.id}" name: "${user.name}" auth0_id: "${user.auth0Id}" active: "${user.active}" termsandconditions: "0.1"}) {
			    id auth0_id name active termsandconditions
			}
	}`
}

export function inviteUserMutation(email: string, accountId: string, roleId: string): string {
  return `
    mutation {
		  inviteuser (userinvite: {email: "${email}" account:"${accountId}" role:"${roleId}"}) {
			  link
		  }
	  }`
}

export function acceptInviteMutation(token: string, parameters: string): string {
  return `
    mutation {
		acceptinvite (invite: {token: "${token}", parameters:"${parameters}"}) {
			id name auth0_id active termsandconditions acl {
				account { id name active }
				role { id name active }
			}
			address { line1 line2 city state zip country }
		}
	}`
}

export function smtpProvidersListQuery(limit?:number, cursor?:string): string {
  return `{
    smtpproviderlist ${pageParams(limit, cursor)} {
			smtpproviders {
        ${smtpProviderResponseQuery()}
      }
			${paginationString()}
		}}`
}

export function smtpProviderQuery(id: string): string {
  return `
    {
      smtpprovider (id: "${id}") {
        ${smtpProviderResponseQuery()}
      }
    }`
}

export function deleteSmptProviderMutation(id: string): string {
  return deleteMutation('smtpprovider', id);
}

export function createSmptProviderMutation(smtpProvider: SmtpProvider): string {
  return `
    mutation {
		  createsmtpprovider ( ${smtpProviderInputQuery(smtpProvider)} ) {
        ${smtpProviderResponseQuery()}
      }
	  }`
}

export function updateSmptProviderMutation(smtpProvider: SmtpProvider): string {
  return `
    mutation {
		  updatesmtpprovider ( ${smtpProviderInputQuery(smtpProvider)} ) {
        ${smtpProviderResponseQuery()}
      }
	  }`
}

function smtpProviderInputQuery(smtpProvider: SmtpProvider): string {
  return `smtpprovider: { id: "${smtpProvider.id}", name: "${smtpProvider.name}", from_name: "${smtpProvider.fromName}", from_email: "${smtpProvider.fromEmail}", hostname: "${smtpProvider.hostname}", ip_address: "${smtpProvider.ipAddress}", username: "${smtpProvider.username}", password: "${smtpProvider.password}", port: "${smtpProvider.port}"}`;
}

function smtpProviderResponseQuery(): string {
  return `id name from_name from_email hostname username password port created_at updated_at`
}

export function emailTemplatesListQuery(limit?:number, cursor?:string): string {
  return `{
    emailtemplatelist ${pageParams(limit, cursor)} {
			emailtemplates { id name subject body type created_at updated_at,
			  smtp_provider { ${smtpProviderResponseQuery()} }
			}
			${paginationString()}
		}}`
}

export function emailTemplateQuery(id: string): string {
  return `
    {
      emailtemplate (id: "${id}") { id name subject body type created_at updated_at,
			  smtp_provider { ${smtpProviderResponseQuery()} }
			}
    }`
}

export function deleteEmailTemplateMutation(id: string): string {
  return deleteMutation('emailtemplate', id);
}

export function updateEmailTemplateMutation(emailTemplate: EmailTemplate): string {
  return `mutation { 
		updateemailtemplate (emailtemplate: { id: "${emailTemplate.id}", name: "${emailTemplate.name}", subject: "${emailTemplate.subject}", body: "${emailTemplate.body.replace(/"/g, '\\"')}", type: "${emailTemplate.type.toLowerCase()}", smtp_provider:"${emailTemplate.smtpProvider.id}"}) { 
			id name subject body type created_at updated_at,
			smtp_provider { id name hostname ip_address username password port },
		} 
	}`;
}

export function createEmailTemplateMutation(emailTemplate: EmailTemplate): string {
  return `mutation { 
		createemailtemplate (emailtemplate: { name: "${emailTemplate.name}", subject: "${emailTemplate.subject}", body: "${emailTemplate.body.replace(/"/g, '\\"')}", type: "${emailTemplate.type.toLowerCase()}", smtp_provider:"${emailTemplate.smtpProvider.id}"}) { 
			id name subject body type created_at updated_at,
			smtp_provider { id name hostname ip_address username password port },
		} 
	}`;
}

export function accessKeysListQuery(limit?:number, cursor?:string): string {
  return `{
    accesskeylist ${pageParams(limit, cursor)} {
			accesskeys { id access_key secret_key }
			${paginationString()}
		}}`
}

export function accessKeyQuery(id: string): string {
  return `
    {
      accesskey (id: "${id}") { id access_key secret_key }
    }`
}

export function deleteAccessKeyMutation(id: string): string {
  return deleteMutation('accesskey', id);
}

export function rolesListQuery(limit?: number, cursor?: string): string {
  return `{
    rolelist ${pageParams(limit, cursor)} {
			roles { id name active }
			${paginationString()}
		}}`
}

export function notificationsListQuery(limit?:number, cursor?:string): string {
  return `{
    notificationlist ${pageParams(limit, cursor)} {
			notifications { id user account type action title body read_at created_at updated_at }
			${paginationString()}
		}}`
}

export function notificationsQuickListQuery(limit?:number, cursor?:string): string {
  return `{
    notificationlist ${pageParams(limit, null)} {
			notifications { id user account type action title body read_at created_at updated_at }
			${paginationString()}
		}}`
}

export function notificationCountQuery(): string {
  return `{notificationcount {count}}`
}

export function updateNotificationMutation(notification: Notification): string {
  return `
    mutation {
      updatenotification (notification: { id: "${notification.id}", user: "${notification.user}", account: "${notification.account}", type: "${notification.type}", action: "${notification.action}", title: "${notification.title}" body: "${notification.body}", read_at: "${utc().format()}"}) {
			  id user account type action title body read_at created_at updated_at
		  }
    }`;
}

export function userSettingsQuery(id: string): string {
  return `
  {
		usersetting (id: "${id}") {
			id work_phone cell_phone timezone created_at updated_at,
			notifications { name receive data }
		}
	}`
}

export function updateUserSettingsMutation(userSettings: UserSettings): string {
  let notificationString = '';
  userSettings.notificationSettings.forEach(notification => {
    notificationString += `{name: "${notification.name}", receive: ${notification.receive}`;
    notificationString += notification.data ? `, data: "${notification.data}"` : '';
    notificationString += '},'
  });
  if (notificationString) {
    notificationString = `, notifications: [${notificationString}]`;
  }

  let wphone = userSettings.workPhone ? `work_phone: "${userSettings.workPhone}"` : '';
  let cphone = userSettings.cellPhone ? `cell_phone: "${userSettings.cellPhone}"` : '';
  let tzone = userSettings.timezone ? `timezone: "${userSettings.timezone}"` : '';

  let updateString = `id: "${userSettings.id}" ${wphone} ${cphone} ${tzone} ${notificationString}`;

  return `
    mutation {
      updateusersetting (usersetting: { ${updateString} }) {
        id work_phone cell_phone timezone created_at updated_at,
        notifications { name receive data }
      }
	  }
  `
}

export function defaultNotificationSettingsQuery(): string {
  return `
    {
		  notificationsettingdefault {
        notification_groups { key name description display,
          notifications { key name description default }
        }
		  }
	  }`
}

export function notificationSettingsQuery(id: string): string {
  return `{
    notificationsetting (id: "${id}") { id settings created_at updated_at }
  }`
}

export function createNotificationSettingsMutation(notificationSettings: NotificationSettings): string {
  let settings = JSON.stringify(notificationSettings.settings).replace(/"/g, '\\"');

  return `
    mutation {
      createnotificationsetting (notificationsetting: { id: "${notificationSettings.id}", settings:"${settings}"}) {
        id settings created_at updated_at
      }
    }`
}

export function updateNotificationSettingsMutation(notificationSettings: NotificationSettings): string {
  let settings = JSON.stringify(notificationSettings.settings).replace(/"/g, '\\"');

  return `
    mutation {
      updatenotificationsetting (notificationsetting: { id: "${notificationSettings.id}", settings:"${settings}"}) {
        id settings created_at updated_at
      }
    }`
}

export function sendTestNotification(): string {
  return `{ notificationtest { result } }`
}

function pageParams(limit?: number, cursor?: string, noBraces?:boolean): string {
  let lim = !!limit ? `limit: "${limit}"` : '';
  let cur = !!cursor ? `cursor: "${cursor}"` : '';

  let params = `pagination: {${lim} ${cur}}`;
  if (!noBraces) {
    params = `(${params})`;
  }

  return limit || cur ? `${params}` : '';
}

function generateUUID(): string {
  return uuidV4();
}

function paginationString(): string {
  return 'pagination { count end_cursor has_next_page last_evaluated }';
}
