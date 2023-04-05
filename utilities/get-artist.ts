// GET ARTIST STUFF: 
import { Address, AddressKind } from "@coinbarn/ergo-ts/dist/models/address";

async function get(url: string, apiKey = '') {
  return await fetch(url, {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      api_key: apiKey,
    },
  });
}

export const explorerApi = 'https://api.ergoplatform.com/api/v0'

function getRequest(url: string, api = explorerApi) {
  return get(api + url).then(res => res.json())
}

export function txById(id: string) {
  return getRequest(`/transactions/${id}`)
}

export async function boxById(id: string) {
  return getRequest(`/transactions/boxes/${id}`)
}

export async function issuingBoxById(id: string) {
  return getRequest(`/assets/${id}/issuingBox`)
}

export async function getArtist(bx: { address: string; txId: string | undefined; outputTransactionId: string; }) {
  while (AddressKind.P2PK !== new Address(bx.address).getType()) {
    let tx = await txById(bx.txId === undefined ? bx.outputTransactionId : bx.txId)
    bx = tx.inputs[0]
  }
  return bx.address
}

