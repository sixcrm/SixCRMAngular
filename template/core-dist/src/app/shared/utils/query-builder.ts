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

export function campaignsInfoListQuery(): string {
  return `{
    campaignlist {
      campaigns { id name
        productschedules { id }
        loadbalancer { id
          merchantproviderconfigurations {
            merchantprovider { id }
            distribution
          }
        }
      }
    }}`
}

export function marchantProvidersListQuery(): string {
  return `{ merchantproviderlist { merchantproviders { id name username password endpoint processor } } }`
}

export function marchantProviderQuery(id: string): string {
  return `{ merchantprovider (id: "${id}") { id name username password endpoint processor } }`
}

export function fulfillmentProvidersListQuery(): string {
  return `{ fulfillmentproviderlist { fulfillmentproviders { id name provider username password endpoint } } }`
}

export function fulfillmentProviderQuery(id: string): string {
  return `{ fulfillmentprovider (id: "${id}") { id name username password endpoint provider } }`
}

export function affiliatesListQuery(): string {
  return `{ affiliatelist { affiliates { id affiliate_id sub_id_1 sub_id_2 sub_id_3 sub_id_4 sub_id_5 click_id } } }`
}

export function affiliateQuery(id: string): string {
  return `{ affiliate (id: "${id}") { id affiliate_id sub_id_1 sub_id_2 sub_id_3 sub_id_4 sub_id_5 click_id } }`
}
