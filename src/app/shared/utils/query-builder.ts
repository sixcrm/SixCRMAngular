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

const uuidV4 = require('uuid/v4');

function deleteMutation(entity: string, id: string) {
  return `mutation { delete${entity} (id: "${id}") { id }}`
}

export function  searchQuery(query: string, createdAtRange: string, sortBy: string, start: number, size: number, entityTypes?: string[]): string {
  let entityTypesQuery: string = '';

  if (entityTypes && entityTypes.length > 0) {
    entityTypesQuery = '(or ';
    entityTypes.forEach(entityType => entityTypesQuery+= ` entity_type:'${entityType}' `);
    entityTypesQuery+= ')'
  }

  let filterQuery = entityTypesQuery;
  if (createdAtRange) {
    filterQuery = `(and created_at:${createdAtRange} ${entityTypesQuery})`
  }

  let sort = '';
  if (sortBy) {
    sort = `sort:"${sortBy}"`;
  }

  return `{
		search (search: {query: "${query}*" filterQuery:"${filterQuery}" ${sort} start: "${start}" size: "${size}"}) {
			status { timems rid }
			hits { found start
				hit { id fields }
			}
		}
	}`;
}

export function  searchFacets(query: string, createdAtRange: string): string {
  let filterQuery = '';
  if (createdAtRange) {
    filterQuery = 'created_at: ' + createdAtRange;
  }

  return `{
		search (search: {query: "${query}*" filterQuery:"${filterQuery}" facet:"{entity_type:{}}" return:"_no_fields"}) {
			status { timems rid }
			facets
		}
	}`;
}

export function  searchAdvancedQuery(options: any, createdAtRange: string, sortBy: string, start: number, size: number, entityTypes?: string[]): string {
  let fieldsQuery = '';
  if (createdAtRange) {
    fieldsQuery += ` created_at: ${createdAtRange} `;
  }

  for (let field in options) {
    if (options[field]) {

      if (options[field] instanceof Array) {
        let key = field;

        for (let fieldInner in options[key]) {
          if (options[key][fieldInner]) {
            fieldsQuery += ` (prefix field=${key} '${options[key][fieldInner]}')`
          }
        }
      } else {
        fieldsQuery += ` (prefix field=${field} '${options[field]}')`
      }
    }
  }

  let filterQuery: string = '';

  if (entityTypes && entityTypes.length > 0) {
    filterQuery = '(or ';
    entityTypes.forEach(entityType => filterQuery+= ` entity_type:'${entityType}' `);
    filterQuery+= ')'
  }

  let sort = '';
  if (sortBy) {
    sort = `sort:"${sortBy}"`;
  }

  return `
  {
    search (search: {query: "(and${fieldsQuery})" filterQuery: "${filterQuery}" queryParser: "structured" ${sort} start: "${start}" size: "${size}"}) {
      hits {
        found start
        hit { id fields }
      }
    }
  }`;
}

export function  searchAdvancedFacets(options: any, createdAtRange: string): string {

  let query = '';
  if (createdAtRange) {
    query += ` created_at: ${createdAtRange} `;
  }

  for (let field in options) {
    if (options[field]) {

      if (options[field] instanceof Array) {
        let key = field;

        for (let fieldInner in options[key]) {
          if (options[key][fieldInner]) {
            query += ` (prefix field=${key} '${options[key][fieldInner]}')`
          }
        }
      } else {
        query += ` (prefix field=${field} '${options[field]}')`
      }
    }
  }

  return `
  {
    search (search: {query: "(and${query})" queryParser: "structured" facet:"{entity_type:{}}" return:"_no_fields"}) {
      status { timems rid }
			facets
    }
  }`;
}

export function  suggestionsQuery(query: string): string {
  return `{
		search (search: {query: "${query}*" queryOptions:"{fields:['suggestion_field_1']}" return:"suggestion_field_1" size:"10"}) {
			hits {
				found start
				hit { fields }
			}
		}
	}`
}

export function  productsListQuery(limit?:number, cursor?:string): string {
  return `{
    productlist ${pageParams(limit, cursor)} {
			products { id name sku ship shipping_delay
				fulfillment_provider { id name provider username password endpoint }
			}
			pagination { count end_cursor has_next_page }
		}}`;
}

export function productQuery(id: string): string {
  return `{
    product (id: "${id}") { id name sku ship shipping_delay
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
      id name sku ship shipping_delay
      fulfillment_provider { id name username endpoint password provider }
    }
  }`;
}

export function updateProductMutation(product: Product): string {
  return `
    mutation {
      updateproduct (product: { id: "${product.id}", name: "${product.name}", sku: "${product.sku}", ship: "${product.ship}", shipping_delay:"${product.shippingDelay}",  fulfillment_provider:"${product.fulfillmentProvider.id}" }) {
        id name sku ship shipping_delay
        fulfillment_provider { id name username endpoint password provider }
      }
    }`;
}

export function  productScheduleListQuery(limit?:number, cursor?:string): string {
  return `{
    productschedulelist ${pageParams(limit, cursor)} {
			productschedules { id
			  schedule { price start end period
			    product { id name sku ship shipping_delay
			      fulfillment_provider { id name provider username password endpoint }
					}
				}
			}
			pagination { count end_cursor has_next_page }
		}}`;
}

export function productScheduleQuery(id: string): string {
  return `{
    productschedule (id: "${id}") { id
			  schedule { price start end period
			    product { id name sku ship shipping_delay
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
        id
        schedule { price start end period
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
        id
        schedule { price start end period
          product { id name }
        }
      }
	  }`
}

export function campaignQuery(id: string): string {
  return `{
    campaign (id: "${id}") { id name
      productschedules { id
        schedule { price start end period
          product { id name sku ship shipping_delay
            fulfillment_provider { id name provider username password endpoint }
          }
        }
      }
      loadbalancer { id
        merchantproviderconfigurations {
          merchantprovider { id username password endpoint processor }
          distribution
        }
      }
    }}`
}

export function campaignsInfoListQuery(limit?:number, cursor?:string): string {
  return `{
    campaignlist ${pageParams(limit, cursor)} {
      campaigns { id name
        productschedules { id }
        loadbalancer { id
          merchantproviderconfigurations {
            merchantprovider { id }
            distribution
          }
        }
      }
      pagination { count end_cursor has_next_page }
    }}`
}

export function deleteCampaignMutation(id: string): string {
  return deleteMutation('campaign', id);
}

export function merchantProvidersListQuery(limit?:number, cursor?:string): string {
  return `{ merchantproviderlist ${pageParams(limit, cursor)} { merchantproviders { id name username password endpoint processor } pagination { count end_cursor has_next_page } } }`
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
  return `{ fulfillmentproviderlist ${pageParams(limit, cursor)} { fulfillmentproviders { id name provider username password endpoint } pagination { count end_cursor has_next_page } } }`
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
  return `{ affiliatelist ${pageParams(limit, cursor)} { affiliates { id affiliate_id sub_id_1 sub_id_2 sub_id_3 sub_id_4 sub_id_5 click_id } pagination { count end_cursor has_next_page } } }`
}

export function affiliateQuery(id: string): string {
  return `{ affiliate (id: "${id}") { id affiliate_id sub_id_1 sub_id_2 sub_id_3 sub_id_4 sub_id_5 click_id } }`
}

export function deleteAffiliateMutation(id: string): string {
  return deleteMutation('affiliate', id);
}

export function createAffiliateMutation(affiliate: Affiliate): string {
  return `
    mutation {
      createaffiliate (affiliate: { id: "${generateUUID()}", affiliate_id: "${affiliate.affiliateId}", sub_id_1: "${affiliate.subId1}", sub_id_2: "${affiliate.subId2}", sub_id_3: "${affiliate.subId3}", sub_id_4: "${affiliate.subId4}", sub_id_5: "${affiliate.subId5}", click_id: "${affiliate.clickId}"}) { 
        id affiliate_id sub_id_1 sub_id_2 sub_id_3 sub_id_4 sub_id_5 click_id
      }
	  }`
}

export function updateAffiliateMutation(affiliate: Affiliate): string {
  return `
    mutation {
      updateaffiliate (affiliate: { id: "${affiliate.id}", affiliate_id: "${affiliate.affiliateId}", sub_id_1: "${affiliate.subId1}", sub_id_2: "${affiliate.subId2}", sub_id_3: "${affiliate.subId3}", sub_id_4: "${affiliate.subId4}", sub_id_5: "${affiliate.subId5}", click_id: "${affiliate.clickId}"}) { 
        id affiliate_id sub_id_1 sub_id_2 sub_id_3 sub_id_4 sub_id_5 click_id
      }
	  }`
}

export function customersInfoListQuery(limit?:number, cursor?:string): string {
  return `{
    customerlist ${pageParams(limit, cursor)} {
      customers { id firstname lastname
        address { city country state }
			}
			pagination { count end_cursor has_next_page }
		}}`
}

export function customerQuery(id: string): string {
  return `{
    customer (id: "${id}") { id email firstname lastname phone created_at
      address { line1 line2 city state zip country }
		  creditcards {	id ccnumber expiration ccv name
			  address { line1 line2 city state zip }
			}
		}
  }`
}

export function deleteCustomerMutation(id: string): string {
  return deleteMutation('customer', id);
}

export function createCustomerMutation(customer: Customer): string {
  let creditCards: string = '';
  for (let index in customer.creditCards) {
    let creditCard = customer.creditCards[index];
    creditCards += `"${creditCard.id}" `;
  }

  return `
    mutation {
		  createcustomer (
		    customer: {
		      id: "${generateUUID()}" email: "${customer.email}" firstname: "${customer.firstName}" lastname: "${customer.lastName}" phone: "${customer.phone}"
		      address: { line1: "${customer.address.line1}" city: "${customer.address.city}" state: "${customer.address.state}" zip: "${customer.address.zip}" country: "${customer.address.country}" }
		      creditcards:[${creditCards}] }
      ) {
        id email firstname lastname phone
        address { line1 city state zip country }
			  creditcards { id ccnumber expiration ccv name
				  address { line1 line2 city state zip }
			  }
		  }
	  }`
}

export function updateCustomerMutation(customer: Customer): string {
  let creditCards: string = '';
  for (let index in customer.creditCards) {
    let creditCard = customer.creditCards[index];
    creditCards += `"${creditCard.id}" `;
  }

  return `
    mutation {
		  updatecustomer (
		    customer: {
		      id: "${customer.id}" email: "${customer.email}" firstname: "${customer.firstName}" lastname: "${customer.lastName}" phone: "${customer.phone}"
		      address: { line1: "${customer.address.line1}" city: "${customer.address.city}" state: "${customer.address.state}" zip: "${customer.address.zip}" country: "${customer.address.country}" }
		      creditcards:[${creditCards}] }
      ) {
		    id email firstname lastname phone
		    address { line1 city state zip country }
			  creditcards { id ccnumber expiration ccv name
				  address { line1 line2 city state zip }
			  }
		  }
	  }`
}

export function customerNotesByCustomerQuery(id: string): string {
  return `{
    customernotelistbycustomer (customer: "${id}") {
      customernotes { id body created_at updated_at
        user {id name }
      }
		}}`
}

export function createCustomerNoteMutation(customerNote: CustomerNote): string {

  return `
    mutation {
		  createcustomernote (
		    customernote: { id: "${generateUUID()}" customer: "${customerNote.customer.id}" user: "${customerNote.user.id}" body: "${customerNote.body}" }
      ) {
        id body created_at updated_at
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
			loadbalancers { id
			  merchantproviderconfigurations {
					merchantprovider { endpoint processor }
					distribution
				}
			}
			pagination { count end_cursor has_next_page }
		}}`
}

export function loadBalancerQuery(id: string): string {
  return `{
    loadbalancer (id: "${id}") { id
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
			id
			merchantproviderconfigurations {
				merchantprovider { id name username password endpoint processor }
				distribution
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
			id
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
  return `{ transactionlist ${pageParams(limit, cursor)} {	transactions { id amount processor_response } pagination { count end_cursor has_next_page } } }`
}

export function transactionQuery(id: string): string {
  return `{
    transaction (id: "${id}") { id alias amount processor_response created_at updated_at
      rebill { id amount }
      products { amount
        product { id name sku ship shipping_delay
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
			transactions { id amount processor_response }
			pagination { count end_cursor has_next_page }
    }
  }`
}

export function sessionsInfoListQuery(limit?:number, cursor?:string): string {
  return `{
    sessionlist ${pageParams(limit, cursor)} {
			sessions { id
			  customer { id firstname lastname }
				product_schedules { id }
				rebills { id 	}
				campaign { id name }
			}
			pagination { count end_cursor has_next_page }
		}}`
}

export function sessionsByCustomer(customerId: string, limit?:number, cursor?:string): string {
  return `{
		sessionlistbycustomer (customer:"${customerId}" ${pageParams(limit, cursor, true)}) {
			sessions { id
			  customer { id firstname lastname }
				product_schedules { id }
				rebills { id 	}
				campaign { id name }
			}
			pagination { count end_cursor has_next_page }
    }
  }`
}

export function sessionQuery(id: string): string {
  return `{
    session (id: "${id}") { id
			  customer { id firstname lastname
			    address { line1 line2 city state zip }
				}
				product_schedules { id
					schedule { price start end period
					  product { id name sku ship shipping_delay
					    fulfillment_provider { id name provider username password endpoint }
						}
					}
				}
				rebills { id
				  product_schedules { id
				    schedule { price start end period
				      product { id name sku ship shipping_delay
				        fulfillment_provider { id name provider username password endpoint }
							}
						}
					}
					transactions { id created_at processor_response amount }
				}
				campaign { id name
					productschedules { id
					  schedule { price start end period
							product { id name sku ship shipping_delay
							  fulfillment_provider { id name provider username password endpoint }
							}
						}
					}
					loadbalancer { id
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

export function creditCardsListQuery(limit?:number, cursor?:string): string {
  return `{
    creditcardlist ${pageParams(limit, cursor)} {
			creditcards { id ccnumber expiration ccv name
			  address { country state city }
			}
			pagination { count end_cursor has_next_page }
		}}`
}

export function creditCardQuery(id: string): string {
  return `{
    creditcard (id: "${id}") { id ccnumber expiration ccv name
		  address { line1 line2 city state zip country }
		} }`
}

export function deleteCreditCardMutation(id: string): string {
  return deleteMutation('creditcard', id);
}

export function createCreditCardMutation(cc: CreditCard): string {
  return `
    mutation {
		  createcreditcard (creditcard: { ccnumber: "${cc.ccnumber}" expiration: "${cc.expiration}" ccv: "${cc.ccv}" name: "${cc.name}" address: { line1: "${cc.address.line1}" line2: "${cc.address.line2}" city: "${cc.address.city}" state: "${cc.address.state}" zip: "${cc.address.zip}" country: "${cc.address.country}" } }) {
        id ccnumber expiration ccv name
        address { line1 line2 city state zip country }
      }
	  }`
}

export function updateCreditCardMutation(cc: CreditCard): string {
  return `
    mutation {
		  updatecreditcard (creditcard: { id: "${cc.id}" ccnumber: "${cc.ccnumber}" expiration: "${cc.expiration}" ccv: "${cc.ccv}" name: "${cc.name}" address: { line1: "${cc.address.line1}" line2: "${cc.address.line2}" city: "${cc.address.city}" state: "${cc.address.state}" zip: "${cc.address.zip}" country: "${cc.address.country}" } }) {
        id ccnumber expiration ccv name
        address { line1 line2 city state zip country }
      }
	  }`
}

export function usersListQuery(limit?: number, cursor?: string): string {
  return `{
    userlist ${pageParams(limit,cursor)} {
			users { id auth0_id name active termsandconditions
			  acl {
					account { id name active }
					role { id name active }
				}
			}
			pagination { count end_cursor has_next_page }
		}}`
}

export function userQuery(id: string): string {
  return `
    {
      user (id: "${id}") { id auth0_id name active termsandconditions address { country state city line1 line2 zip}}
    }`
}

export function userIntrospection(): string {
  return `{
    userintrospection { id name auth0_id active termsandconditions
      acl {
        account { id name active }
        role { id name active 
          permissions { allow deny }
        }
      }
      address { line1 line2 city state zip country }
    }
  }`
}

export function deleteUserMutation(id: string): string {
  return deleteMutation('user', id);
}

export function updateUserMutation(user: User): string {
  return `
    mutation {
      updateuser (user: { id: "${user.id}", auth0_id: "${user.auth0Id}", name: "${user.name}", active:"${user.active}", termsandconditions:"${user.termsAndConditions}", address:{line1: "${user.address.line2}", line2:"${user.address.line1}", city:"${user.address.city}", state:"${user.address.state}", zip:"${user.address.zip}", country:"${user.address.country}"}}) {
        id name auth0_id active
        address { line1 line2 city state zip country }
        acl {
          account { id name active }
          role { id name active }
        }
        termsandconditions
		  }
    }`;
}

export function createUserForRegistration(email: string, auth0Id: string): string {
  return `
    mutation {
		  createuser (
		    user: {id: "${email}" auth0_id: "${auth0Id}", name: "${email}", active: "false", termsandconditions:"0" }) {
			    id auth0_id name active termsandconditions
			}
	}`
}

export function updateUserForRegistration(user: User): string {
  return `
    mutation {
		  updateuser (
		    user: { id: "${user.id}" name: "${user.name}" auth0_id: "${user.auth0Id}" active: "${user.active}" termsandconditions: "0.1"
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
			id name auth0_id active termsandconditions
			acl {
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
			smtpproviders { id name hostname ip_address username port }
			pagination { count end_cursor has_next_page }
		}}`
}

export function smtpProviderQuery(id: string): string {
  return `
    {
      smtpprovider (id: "${id}") { id name hostname ip_address username password port }
    }`
}

export function deleteSmptProviderMutation(id: string): string {
  return deleteMutation('smtpprovider', id);
}

export function createSmptProviderMutation(smtpProvider: SmtpProvider): string {
  return `
    mutation {
		  createsmtpprovider (
		    smtpprovider: { id: "${generateUUID()}", name: "${smtpProvider.name}", hostname: "${smtpProvider.hostname}", ip_address: "${smtpProvider.ipAddress}", username: "${smtpProvider.username}", password: "${smtpProvider.password}", port: "${smtpProvider.port}"}) {
			    id name hostname ip_address username password port
			}
	}`
}

export function updateSmptProviderMutation(smtpProvider: SmtpProvider): string {
  return `
    mutation {
		  updatesmtpprovider (
		    smtpprovider: { id: "${smtpProvider.id}", name: "${smtpProvider.name}", hostname: "${smtpProvider.hostname}", ip_address: "${smtpProvider.ipAddress}", username: "${smtpProvider.username}", password: "${smtpProvider.password}", port: "${smtpProvider.port}"}) {
			    id name hostname ip_address username password port
			}
	}`
}

export function emailsListQuery(limit?:number, cursor?:string): string {
  return `{
    emaillist ${pageParams(limit, cursor)} {
			emails { id name subject body type
			  smtp_provider { id name hostname ip_address username password port }
			}
			pagination { count end_cursor has_next_page }
		}}`
}

export function emailQuery(id: string): string {
  return `
    {
      email (id: "${id}") { id name subject body type
			  smtp_provider { id name hostname ip_address username password port }
			}
    }`
}

export function deleteEmailMutation(id: string): string {
  return deleteMutation('email', id);
}

export function accessKeysListQuery(limit?:number, cursor?:string): string {
  return `{
    accesskeylist ${pageParams(limit, cursor)} {
			accesskeys { id access_key secret_key }
			pagination { count end_cursor has_next_page }
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
			pagination { count end_cursor has_next_page }
		}}`
}

export function notificationsListQuery(limit?:number, cursor?:string): string {
  return `{
    notificationlist ${pageParams(limit, cursor)} {
			notifications { id user account type action message read_at created_at updated_at }
		}}`
}

export function notificationCountQuery(): string {
  return `{notificationcount {count}}`
}

export function updateNotificationMutation(notification: Notification): string {
  return `
    mutation {
      updatenotification (notification: { id: "${notification.id}", user: "${notification.user}", account: "${notification.account}", type: "${notification.type}", action: "${notification.action}", message: "${notification.message}", read_at: "${utc().format()}"}) {
			  id user account type action message read_at created_at updated_at
		  }
    }`;
}

function pageParams(limit?: number, cursor?: string, noBraces?:boolean): string {
  let lim = !!limit ? `limit: "${limit}"` : '';
  let cur = !!cursor ? `cursor: "${cursor}"` : '';

  let params = `${lim} ${cur}`;
  if (!noBraces) {
    params = `(${params})`;
  }

  return limit || cur ? `${params}` : '';
}

function pageParamsNoBraces(limit?: number, cursor?: string): string {
  let lim = !!limit ? `limit: "${limit}"` : '';
  let cur = !!cursor ? `cursor: "${cursor}"` : '';

  return limit || cur ? `${lim} ${cur}` : '';
}

function generateUUID(): string {
  return uuidV4();
}
