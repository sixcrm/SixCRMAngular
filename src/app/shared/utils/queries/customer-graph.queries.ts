import {customerResponseQuery} from './entities/customer.queries';

export function getCustomerJwtQuery(sessionId: string): string {
  return `{
    getcustomerjwt (session: "${sessionId}") {
      token
    }
  }`
}

export function getCustomerSession(sessionId: string): string {
  return `{
    session (id: "${sessionId}") {
      id created_at updated_at
      customer { ${customerResponseQuery()} },
      rebills { id bill_at amount paid { detail updated_at }
        transactions { processor_response creditcard { type last_four } },
        product_schedules { name }
      }
    }
  }`
}
