import {
  paginationParamsQuery, fullPaginationStringResponseQuery, deleteMutationQuery,
  addId, deleteManyMutationQuery
} from './entities-helper.queries';
import {Tracker} from '../../../models/tracker.model';

export function trackersListQuery(limit?: number, cursor?: string): string {
  return `{
		trackerlist ${paginationParamsQuery(limit, cursor)} {
		  trackers {
        ${trackerResponseInfoQuery()}
      }
      ${fullPaginationStringResponseQuery()}
    }
  }`
}

export function trackersByAffiliateListQuery(affiliateId: string, limit?: number, cursor?: string): string {
  return `
    query {
      trackerlistbyaffiliate (affiliate: "${affiliateId}" ${paginationParamsQuery(limit, cursor, true)}) {
        trackers {
          ${trackerResponseQuery()}
        }
        ${fullPaginationStringResponseQuery()}
      }
    }`
}

export function trackerQuery(id: string): string {
  return `{
		tracker (id: "${id}") {
		  ${trackerResponseQuery()}
    }
  }`
}

export function deleteTrackerMutation(id: string): string {
  return deleteMutationQuery('tracker', id);
}

export function deleteTrackersMutation(id: string[]): string {
  return deleteManyMutationQuery('tracker', id);
}

export function updateTrackerMutation(tracker: Tracker): string {
  return `
    mutation {
      updatetracker (tracker: { ${trackerInputQuery(tracker, true)} }) {
        ${trackerResponseQuery()}
      }
    }`
}

export function createTrackerMutation(tracker: Tracker): string {
  return `
    mutation {
      createtracker (tracker: { ${trackerInputQuery(tracker)} }) {
        ${trackerResponseQuery()}
      }
    }`
}

export function trackerResponseQuery(): string {
  return ` id type event_type name body campaigns { id name created_at updated_at } created_at updated_at affiliates { id name affiliate_id created_at updated_at }`
}

export function trackerResponseInfoQuery(): string {
  return ` id type event_type name body created_at updated_at`
}

export function trackerInputQuery(tracker: Tracker, includeId?: boolean): string {
  let eventTypes = tracker.eventType.reduce((a,b) => `${a} "${b}",`, '');
  let affiliates = tracker.affiliates.map(a => a.id).reduce((a,b) => `${a} "${b}",`, '');
  let campaigns = tracker.campaigns.map(a => a.id).reduce((a,b) => `${a} "${b}",`, '');

  return `${addId(tracker.id, includeId)} event_type: [${eventTypes}] affiliates: [${affiliates}] campaigns: [${campaigns}] ${tracker.name? `name: "${tracker.name}"`: ''} type: "${tracker.type}" body:"${tracker.body.replace(/"/g, '\\"')}"`;
}

