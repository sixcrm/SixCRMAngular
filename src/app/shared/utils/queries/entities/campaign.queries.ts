import {productScheduleResponseQuery, productScheduleInfoResponseQuery} from './product-schedule.queries';
import {Campaign} from '../../../models/campaign.model';
import {
  fullPaginationStringResponseQuery, paginationParamsQuery, deleteMutationQuery,
  addId, deleteManyMutationQuery, listQueryParams, addUpdatedAtApi
} from './entities-helper.queries';
import {IndexQueryParameters} from '../index-query-parameters.model';

export function campaignsInfoListQuery(params: IndexQueryParameters): string {
  return `{
    campaignlist ${listQueryParams(params)} {
      campaigns {
        ${campaignInfoResponseQuery()}
      }
      ${fullPaginationStringResponseQuery()}
    }}`
}

export function campaignsNamesListQuery(params: IndexQueryParameters): string {
  return `{
    campaignlist ${listQueryParams(params)} {
      campaigns {
        id name
      }
      ${fullPaginationStringResponseQuery()}
    }}`
}

export function campaignsByProductSchedule(id: string, params: IndexQueryParameters): string {
  return `{
    campaignlistbyproductschedule (productschedule: "${id}", ${paginationParamsQuery(params, true)}) {
      campaigns {
        ${campaignInfoResponseQuery()}
      }
      ${fullPaginationStringResponseQuery()}
    }}`
}

export function campaignsByProduct(id: string, params: IndexQueryParameters): string {
  return `{
    campaignlistbyproduct (product: "${id}", ${paginationParamsQuery(params, true)}) {
      campaigns {
        ${campaignInfoResponseQuery()}
      }
      ${fullPaginationStringResponseQuery()}
    }}`
}

export function campaignsByAffiliate(id: string, params: IndexQueryParameters): string {
  return `{
    campaignlistbyaffiliateallowed (affiliate: "${id}", ${paginationParamsQuery(params, true)}) {
      campaigns {
        ${campaignInfoResponseQuery()}
      }
      ${fullPaginationStringResponseQuery()}
    }}`
}

export function campaignQuery(id: string): string {
  return `{
    campaign (id: "${id}") {
      ${campaignResponseQuery()}
    }
  }`
}

export function deleteCampaignMutation(id: string): string {
  return deleteMutationQuery('campaign', id);
}

export function deleteCampaignsMutation(id: string[]): string {
  return deleteManyMutationQuery('campaign', id);
}

export function createCampaignMutation(campaign: Campaign): string {
  return `
    mutation { 
		  createcampaign ( campaign: { ${campaignInputQuery(campaign)} } ) {
	  		${campaignResponseQuery()}
      }
		}`
}

export function updateCampaignMutation(campaign: Campaign): string {
  return `
    mutation { 
		  updatecampaign ( campaign: { ${campaignInputQuery(campaign, true)} } ) {
        ${campaignResponseQuery()}
			}
		}`
}

function campaignResponseQuery(): string {
  return `
    id name created_at updated_at allow_prepaid show_prepaid allow_on_order_form,
    productschedules {
      ${productScheduleResponseQuery()}
    }
    emailtemplates {
      id name subject body type,
      smtp_provider { id name hostname }
    }
    affiliate_allow {
      ... on AffiliateGroup { id name }
      ... on Affiliate { id affiliate_id name created_at updated_at }
    }
    affiliate_deny {
      ... on AffiliateGroup { id name }
      ... on Affiliate { id affiliate_id name created_at updated_at }
    }
    merchantprovidergroup_associations { id merchantprovidergroup {id name} }`
}

function campaignInfoResponseQuery(): string {
  return `id name created_at allow_prepaid show_prepaid allow_on_order_form updated_at`
}

function campaignInputQuery(campaign: Campaign, includeId?: boolean): string {
  let affiliateAllowed = !campaign.affiliateAllow ? '' :
    (campaign.affiliateAllow.length === 1 && campaign.affiliateAllow[0].id === '*') ? `"*"` :
      campaign.affiliateAllow.reduce((a, b) => `${a} "${b.id}",`, '');

  let affiliateDenied = !campaign.affiliateDeny ? '' :
    (campaign.affiliateDeny.length === 1 && campaign.affiliateDeny[0].id === '*') ? `"*"` :
      campaign.affiliateDeny.reduce((a, b) => `${a} "${b.id}",`, '');

  return `${addId(campaign.id, includeId)} name: "${campaign.name}", affiliate_allow: [${affiliateAllowed}], affiliate_deny: [${affiliateDenied}], allow_prepaid: ${!!campaign.allowPrepaid}, show_prepaid: ${!!campaign.showPrepaid}, allow_on_order_form: ${!!campaign.allowOnOrder}, productschedules:[${campaign.productSchedules.map(s => `"${s.id}"`)}], ${addUpdatedAtApi(campaign, includeId)}`;
}
