import {
  fullPaginationStringResponseQuery, deleteMutationQuery,
  addId, deleteManyMutationQuery, listQueryParams, addUpdatedAtApi
} from './entities-helper.queries';
import {EventHook} from '../../../models/event-hook.model';

export function eventHooksListQuery(limit?:number, cursor?:string, search?:string): string {
  return `{
    eventhooklist ${listQueryParams(limit, cursor, search)} {
			eventhooks {
        ${eventHookResponseQuery()}
      }
			${fullPaginationStringResponseQuery()}
		}}`
}

export function eventHooksSharedListQuery(limit?:number, cursor?:string, search?:string): string {
  return `{
    eventhooksharedlist ${listQueryParams(limit, cursor, search)} {
			eventhooks {
        ${eventHookResponseQuery()}
      }
			${fullPaginationStringResponseQuery()}
		}}`
}

export function eventHookQuery(id: string): string {
  return `{
    eventhook (id: "${id}") {
      ${eventHookResponseQuery()}
    }
  }`
}

export function eventHookSharedQuery(id: string): string {
  return `{
    eventhookshared (id: "${id}") {
      ${eventHookResponseQuery()}
    }
  }`
}

export function deleteEventHookMutation(id: string): string {
  return deleteMutationQuery('eventhook', id);
}

export function deleteEventHooksMutation(id: string[]): string {
  return deleteManyMutationQuery('eventhook', id);
}

export function createEventHookMutation(eventHook: EventHook): string {
  return `
    mutation {
		  createeventhook ( eventhook: { ${eventHookInputQuery(eventHook)} }) {
        ${eventHookResponseQuery()}
      }
	  }`
}

export function updateEventHookMutation(eventHook: EventHook): string {
  return `
    mutation {
		  updateeventhook ( eventhook: { ${eventHookInputQuery(eventHook, true)} }) {
        ${eventHookResponseQuery()}
      }
	  }`
}

export function eventHookResponseQuery(): string {
  return `id name event_type active hook created_at updated_at`
}

export function eventHookInputQuery(eventHook: EventHook, includeID?: boolean): string {
  return `${addId(eventHook.id, includeID)}, name:"${eventHook.name}", event_type:["${eventHook.eventType}"], ${eventHook.hookDecoded ? `hook: "${eventHook.encodeHook()}",` : '' } active:${!!eventHook.active}, ${addUpdatedAtApi(eventHook, includeID)}`;
}
