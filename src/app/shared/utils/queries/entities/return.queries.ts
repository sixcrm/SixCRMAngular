import {Return} from '../../../models/return.model';

export function createReturnMutation(ret: Return) {
  return `
    mutation {
      createreturn ( return: { ${returnInputQuery(ret)} } ) {
        ${returnResponseQuery()}
      }
    }`;
}

export function returnInputQuery(ret: Return) {
  const transactions = ret.transactions.reduce((a,b) => `${a?',':''}{ transaction: "${b.transaction}", products: [${b.products.reduce((c,d) => `${c?',':''}{ product:"${d.product}", alias:"${d.product}", quantity:${d.quantity} }`,'')}] }`, '');

  return `transactions: [${transactions}]`;
}

export function returnResponseQuery() {
  return 'id, alias, history { state, created_at }, transactions { transaction {id, alias}, products {alias, product {id, name}, quantity}}, created_at, updated_at';
}
