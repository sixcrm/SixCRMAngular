export function  productsListQuery(full?: boolean): string {
  let fullQuery = '';
  if (full) {
    fullQuery = 'ship shipping_delay fulfillment_provider {id name provider username password endpoint}}';
  }

  return `{productlist {products {id name sku ${fullQuery}}}}`;
}

export function deleteProductMutation(id: string): string {
  return `mutation { deleteproduct (id: "${id}") { id }}`
}

export function createProductMutation(id: string, name: string, sku: string): string {
  return `mutation { createproduct (product: { id: "${id}", name: "${name}", sku: "${sku}" }) {id name sku} }`;
}

export function editProductMutation(id: string, name: string, sku: string): string {
  return `mutation { updateproduct (product: { id: "${id}", name: "${name}", sku: "${sku}" }) {id name sku} }`;
}
