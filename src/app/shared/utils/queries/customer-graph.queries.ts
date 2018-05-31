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
      customer {
        firstname lastname email phone
        creditcards { name expiration last_four type }
      },
      rebills { id bill_at amount
        transactions { processor_response },
        product_schedules { name }
      }
    }
  }`
}
