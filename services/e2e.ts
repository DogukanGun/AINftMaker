import {
    TokenProgramVersion,
    TokenStandard,
  } from "@metaplex-foundation/mpl-bubblegum";
  import { ConcurrentMerkleTreeAccount } from "@solana/spl-account-compression";
  import { Keypair, PublicKey } from "@solana/web3.js";
  import base58 from "bs58";
  import {
    getCompressedNftId,
    initCollection,
    initTree,
    mintCompressedNft,
    transferAsset,
  } from "./utils";
  import { WrappedConnection } from "./wrappedConnection";
  import { use } from "chai";

  export const e2e = async (userPublicKey: PublicKey,uri:string = "https://wallpaperaccess.com/full/5502889.jpg"):Promise<string> => {
    console.log("Starting e2e test.");
    console.log("uri: " + uri);
    const apiKey = process.env["NEXT_PUBLIC_API_KEY"];
    console.log("Api key: " + apiKey);
    if (!apiKey) {
      throw new Error("Api key must be provided via API_KEY env var");
    }
  
    const secretKey = process.env["NEXT_PUBLIC_SECRET_KEY"];
    if (!secretKey) {
      throw new Error(
        "Wallet secret key must be provided via SECRET_KEY env var"
      );
    }
    let decodedSecretKey;
    try {
      decodedSecretKey = base58.decode(secretKey);
    } catch {
      throw new Error(
        "Invalid secret key provided. Must be a base 58 encoded string."
      );
    }
  
    const ownerWallet = Keypair.fromSecretKey(decodedSecretKey);
    console.log("Owner wallet: " + ownerWallet.publicKey);
  
    const connectionString = `https://devnet.helius-rpc.com/?api-key=${apiKey}`;
    const connectionWrapper = new WrappedConnection(
      ownerWallet,
      connectionString
    );
  
    // Fixed wallet to manage the merkle tree used to store the collection.
    const treeWallet = Keypair.generate();
    console.log("Tree wallet: " + treeWallet.publicKey);
    console.log("Creating merkle tree.");
    await initTree(connectionWrapper, ownerWallet, treeWallet);
  
    const {
      collectionMint,
      collectionMetadataAccount,
      collectionMasterEditionAccount,
    } = await initCollection(connectionWrapper, ownerWallet);
    console.log("\n===Collection Details===");
    console.log("Mint account: " + collectionMint.publicKey.toBase58());
    console.log("Metadata account: " + collectionMetadataAccount.toBase58());
    console.log(
      "Master edition account: " + collectionMasterEditionAccount.toBase58()
    );
    console.log("\n");
      
    // Mint a compressed NFT
    const nftArgs = {
      name: "Cartoon Picture",
      symbol: "CRTN",
      //uri: "https://arweave.net/gfO_TkYttQls70pTmhrdMDz9pfMUXX8hZkaoIivQjGs",
      uri: uri,
      creators: [],
      editionNonce: 253,
      tokenProgramVersion: TokenProgramVersion.Original,
      tokenStandard: TokenStandard.NonFungible,
      uses: null,
      collection: null,
      primarySaleHappened: false,
      sellerFeeBasisPoints: 0,
      isMutable: false,
    };
    const sig = await mintCompressedNft(
      connectionWrapper,
      nftArgs,
      ownerWallet,
      treeWallet,
      collectionMint,
      collectionMetadataAccount,
      collectionMasterEditionAccount
    );
    console.log("Minted compressed nft with txn: " + sig);
  
    // Get the NFT mint ID from the merkle tree.
    const treeAccount = await ConcurrentMerkleTreeAccount.fromAccountAddress(
      connectionWrapper,
      treeWallet.publicKey
    );
    // Get the most rightmost leaf index, which will be the most recently minted compressed NFT.
    // Alternatively you can keep a counter that is incremented on each mint.
    const leafIndex = treeAccount.tree.rightMostPath.index - 1;
    const assetId = await getCompressedNftId(treeWallet, leafIndex);
    console.log("Minted asset: " + assetId);
  
    // Fixed wallet to receive the NFT when we test transfer.
    const newOwnerWallet = userPublicKey;
    // const newOwnerWallet = new PublicKey("HWD4hHZfTWPgKbN1YSYxE9kbTgtaKpV6EHPzWJwoEKCs"); 
    //newOwnerWallet = "HWD4hHZfTWPgKbN1YSYxE9kbTgtaKpV6EHPzWJwoEKCs";
    console.log("New owner wallet: " + newOwnerWallet.toBase58());
    console.log("New owner wallet: " + newOwnerWallet);
  
  
    console.log("\n===Transfer===");
    console.log("Transfer to new wallet.");
    await transferAsset(
      connectionWrapper,
      ownerWallet,
      newOwnerWallet,
      assetId.toBase58()
    );
    console.log(
      "Successfully transferred nft to wallet: " +
        newOwnerWallet.toBase58()
    );
    return assetId.toBase58();
  };
  
  //e2e(userPublicKey);
  