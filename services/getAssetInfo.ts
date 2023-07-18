import { PublicKey } from "@solana/web3.js";

const apiKey = process.env["NEXT_PUBLIC_API_KEY"];

const url = `https://devnet.helius-rpc.com/?api-key=${apiKey}`;

export const getAsset = async (assetId: string) => {
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      jsonrpc: '2.0',
      id: 'my-test-id',
      method: 'getAsset',
      params: {
        id: assetId
      },
    }),
  });
  const { result } = await response.json();
  console.log("Url: ", url);
  console.log("Asset from getAsset(): ", result);
  return result;
};

  //getAsset();