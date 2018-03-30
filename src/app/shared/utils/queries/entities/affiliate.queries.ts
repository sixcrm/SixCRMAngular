import {
  fullPaginationStringResponseQuery, deleteMutationQuery,
  addId, deleteManyMutationQuery, listQueryParams, addUpdatedAtApi
} from './entities-helper.queries';
import {Affiliate} from '../../../models/affiliate.model';
import {IndexQueryParameters} from '../index-query-parameters.model';

export function affiliatesListQuery(params: IndexQueryParameters): string {
  return `{
    affiliatelist ${listQueryParams(params)} {
      affiliates {
        ${affiliateResponseQuery()}
      }
      ${fullPaginationStringResponseQuery()}
    }
  }`
}

export function affiliateQuery(id: string): string {
  return `{
    affiliate (id: "${id}") {
      ${affiliateResponseQuery()}
    }
  }`
}

export function deleteAffiliateMutation(id: string): string {
  return deleteMutationQuery('affiliate', id);
}

export function deleteAffiliatesMutation(id: string[]): string {
  return deleteManyMutationQuery('affiliate', id);
}

export function createAffiliateMutation(affiliate: Affiliate): string {
  return `
    mutation {
      createaffiliate (affiliate: { ${affiliateInputQuery(affiliate)} }) {
        ${affiliateResponseQuery()}
      }
	  }`
}

export function updateAffiliateMutation(affiliate: Affiliate): string {
  return `
    mutation {
      updateaffiliate (affiliate: { ${affiliateInputQuery(affiliate, true)} }) {
        ${affiliateResponseQuery()}
      }
	  }`
}

export function affiliateResponseQuery(): string {
  return 'id name affiliate_id created_at updated_at';
}

export function affiliateInputQuery(affiliate: Affiliate, includeId?: boolean): string {
  return `${addId(affiliate.id, includeId)}, affiliate_id: "${affiliate.affiliateId}", ${affiliate.name ? `name: "${affiliate.name}"`: ''}, ${addUpdatedAtApi(affiliate, includeId)}`;
}
