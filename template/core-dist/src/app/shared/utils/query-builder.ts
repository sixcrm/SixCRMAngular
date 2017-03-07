import {SmtpProvider} from '../models/smtp-provider.model';
import {MerchantProvider} from '../models/merchant-provider.model';
import {LoadBalancer} from '../models/load-balancers.model';
import {Product} from '../models/product.model';
import {ProductSchedule} from '../models/product-schedule.model';
import {User} from '../models/user.model';
import {CreditCard} from '../models/credit-card.model';
import {FulfillmentProvider} from '../models/fulfillment-provider.model';
import {Affiliate} from '../models/affiliate.model';

function deleteMutation(entity: string, id: string) {
  return `mutation { delete${entity} (id: "${id}") { id }}`
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
    createproduct (product: { id: "${product.name}", name: "${product.name}", sku: "${product.sku}", ship: "${product.ship}", shipping_delay:"${product.shippingDelay}",  fulfillment_provider:"${product.fulfillmentProvider.id}" }) {
      id name sku ship shipping_delay
      fulfillment_provider { id name }
    }
  }`;
}

export function updateProductMutation(product: Product): string {
  return `
    mutation {
      updateproduct (product: { id: "${product.id}", name: "${product.name}", sku: "${product.sku}", ship: "${product.ship}", shipping_delay:"${product.shippingDelay}",  fulfillment_provider:"${product.fulfillmentProvider.id}" }) {
        id name sku ship shipping_delay
        fulfillment_provider { id name }
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
		    merchantprovider: { id: "${provider.id}", name: "${provider.name}", username: "${provider.username}", password: "${provider.password}", endpoint: "${provider.endpoint}", processor: "${provider.processor}"}) {
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
		  createfulfillmentprovider ( fulfillmentprovider: { id: "${provider.id}", name: "${provider.name}", username: "${provider.username}", password: "${provider.password}", endpoint: "${provider.endpoint}", provider: "${provider.provider}"}) {
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
      createaffiliate (affiliate: { id: "${affiliate.id}", affiliate_id: "${affiliate.affiliateId}", sub_id_1: "${affiliate.subId1}", sub_id_2: "${affiliate.subId2}", sub_id_3: "${affiliate.subId3}", sub_id_4: "${affiliate.subId4}", sub_id_5: "${affiliate.subId5}", click_id: "${affiliate.clickId}"}) { 
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
        address { city country }
			}
			pagination { count end_cursor has_next_page }
		}}`
}

export function customerQuery(id: string): string {
  return `{
    customer (id: "${id}") { id email firstname lastname phone
      address { line1 line2 city state zip country }
		  creditcards {	id ccnumber expiration ccv name
			  address { line1 line2 city state zip }
			}
		} }`
}

export function deleteCustomerMutation(id: string): string {
  return deleteMutation('customer', id);
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
		createloadbalancer ( loadbalancer: {id: "${loadBalancer.id}", merchantproviders: [${providers}] } ) {
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
  return `{ transactionlist ${pageParams(limit, cursor)} {	transactions { id date amount processor_response } pagination { count end_cursor has_next_page } } }`
}

export function transactionQuery(id: string): string {
  return `{
    transaction (id: "${id}") { id date amount processor_response
      rebill { id amount billdate
        product_schedules { id
          schedule { price start end period
            product { id name sku ship shipping_delay
              fulfillment_provider {id name provider username password endpoint }
            }
          }
        }
      }
      products { amount
        product { id name sku ship shipping_delay
          fulfillment_provider {id name provider username password endpoint }
        }
        shippingreceipt { id created modified status trackingnumber }
      }
    }
	}`
}

export function deleteTransactionMutation(id: string): string {
  return deleteMutation('transaction', id);
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
				rebills { id billdate
				  product_schedules { id
				    schedule { price start end period
				      product { id name sku ship shipping_delay
				        fulfillment_provider { id name provider username password endpoint }
							}
						}
					}
					transactions { id date processor_response amount }
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
			creditcards { id expiration name
			  address { city state }
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
		    smtpprovider: { id: "${smtpProvider.id}", name: "${smtpProvider.name}", hostname: "${smtpProvider.hostname}", ip_address: "${smtpProvider.ipAddress}", username: "${smtpProvider.username}", password: "${smtpProvider.password}", port: "${smtpProvider.port}"}) {
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

function pageParams(limit?: number, cursor?: string): string {
  let lim = !!limit ? `limit: "${limit}"` : '';
  let cur = !!cursor ? `cursor: "${cursor}"` : '';

  return limit || cur ? `(${lim} ${cur})` : '';
}
