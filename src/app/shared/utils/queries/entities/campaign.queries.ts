import {productScheduleResponseQuery, productScheduleInfoResponseQuery} from './product-schedule.queries';
import {Campaign} from '../../../models/campaign.model';
import {
  fullPaginationStringResponseQuery, paginationParamsQuery, deleteMutationQuery,
  addId
} from './entities-helper.queries';

export function campaignsInfoListQuery(limit?:number, cursor?:string): string {
  return `{
    campaignlist ${paginationParamsQuery(limit, cursor)} {
      campaigns {
        ${campaignInfoResponseQuery()}
      }
      ${fullPaginationStringResponseQuery()}
    }}`
}

export function campaignsByProductSchedule(id: string, limit?:number, cursor?:string): string {
  return `{
    campaignlistbyproductschedule (productschedule: "${id}", ${paginationParamsQuery(limit, cursor, true)}) {
      campaigns {
        ${campaignInfoResponseQuery()}
      }
      ${fullPaginationStringResponseQuery()}
    }}`
}

export function campaignsByProduct(id: string, limit?:number, cursor?:string): string {
  return `{
    campaignlistbyproduct (product: "${id}", ${paginationParamsQuery(limit, cursor, true)}) {
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
    id name created_at updated_at,
    productschedules {
      ${productScheduleResponseQuery()}
    }
    emailtemplates {
      id name subject body type,
      smtp_provider { id name hostname }
    }`
}

function campaignInfoResponseQuery(): string {
  return `
    id name created_at updated_at,
    productschedules { ${productScheduleInfoResponseQuery()} }
    emailtemplates { id name }`
}

function campaignInputQuery(campaign: Campaign, includeId?: boolean): string {
  return `${addId(campaign.id, includeId)} name: "${campaign.name}", productschedules:[${campaign.productSchedules.map(s => `"${s.id}"`)}], emailtemplates:[${campaign.emailTemplates.map(t => t && t.id ? `"${t.id}"` : '')}]`;
}
