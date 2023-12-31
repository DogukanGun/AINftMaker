    import axios from "axios";
    import { useRouter } from "next/router";
    import { ChangeEvent, useEffect, useState } from "react";
    import { e2e } from "@/services/e2e";
    import { Connection, Keypair, PublicKey } from '@solana/web3.js';
    import { Token, TOKEN_PROGRAM_ID } from "@solana/spl-token";
    import uuid from 'react-uuid';
    import { getAsset } from "@/services/getAssetInfo";
    import { burnAsset } from "@/services/utils";
    import { WrappedConnection } from "@/services/wrappedConnection";
    import base58 from "bs58";


    const CreateNft = () => {
        const router = useRouter();
        const [selectedFile, setSelectedFile] = useState<File | null>(null);
        const [isPopupOpen, setIsPopupOpen] = useState<boolean>(false);
        const [friendsWalletAddress, setFriendsWalletAddress] = useState<string>("");
        const [nftImageData, setNftImageData] = useState<string>("");
        const [stepperNumber, setStepperNumber] = useState<number>(1);
        const [cid, setCid] = useState<string>("");
        const [assetId, setAssetId] = useState<string>("");
        const [nftUuid,setNftUuid] = useState<string>("");
        const apiKey = process.env["NEXT_PUBLIC_API_KEY"];
        const secretKey = process.env["NEXT_PUBLIC_SECRET_KEY"];
        if (!secretKey) {
            throw new Error(
              "Wallet secret key must be provided via SECRET_KEY env var"
            );
          }

        console.log("Api key: " + apiKey);
        let decodedSecretKey;
        try {
          decodedSecretKey = base58.decode(secretKey);
        } catch {
          throw new Error(
            "Invalid secret key provided. Must be a base 58 encoded string."
          );
        }
      
        const ownerWallet = Keypair.fromSecretKey(decodedSecretKey);  

        useEffect(() => {

        }, [])
        

        const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
            const file = event.target.files && event.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onload = (upload) => {
                    console.log(upload.target?.result);
                    const fileContent = upload.target?.result;
                    console.log('File content:', fileContent);
                    const data = { file: fileContent };
                    axios.post("http://localhost:8000/cartoonize", data)
                        .then(result => {
                            if (result.data) {
                                setNftImageData("data:image/png;base64," + result.data);
                                setStepperNumber(stepperNumber + 1);
                            }
                        })
                        .catch(err => {
                            console.error(err);
                            //show notification
                        })
                }
            };
        };

        const buyButtonClicked = async () => {
            const data = {
                bodyOfImage: nftImageData,
            };
            fetch("/api/upload", {
                method: "POST",
                body: JSON.stringify(data),
            })
                .then((response) => response.json())
                .then((data) => {
                    console.log("cid when buy button clicked", data.cid);
                    setCid(data.cid);
                    setStepperNumber(3);
                    // Handle the response data
                })
                .catch((error) => {
                    console.error('Error:', error);
                    // Handle the error
                });
        }

        const cancelButtonClicked = () => {
            setStepperNumber(1);
        }

        async function transferNFT(provider: any, nftId: string): Promise<void> {
            //const connection = new Connection(process.env.RPC_ENDPOINT); // Update with your Solana network URL
            //const nftProgramId = new PublicKey('YOUR_NFT_PROGRAM_ID'); // Replace with the actual NFT program ID
            const userPublicKey = new PublicKey(provider.publicKey.toString());
            // console.log(userPublicKey);
            //console.log("PROVIDER",provider.publicKey.toString());  
            //const testPublicKey = new PublicKey("HWD4hHZfTWPgKbN1YSYxE9kbTgtaKpV6EHPzWJwoEKCs");
            //const transferInstruction = SystemProgram.transfer({
            //   fromPubkey: wallet.publicKey,
            //   toPubkey: wallet.publicKey,
            //   lamports: 0, // Replace with the desired amount of lamports (Solana's native token) to transfer along with the NFT
            // });

            //const transferTx = new Transaction().add(transferInstruction);
            // TODO: Add additional instructions and signers required for the NFT transfer
            
            // TODO: Construct the NFT transfer transaction based on your NFT program

            // Sign and send the transaction with durable nonce
            // const { blockhash } = await connection.getRecentBlockhash();
            // transferTx.recentBlockhash = blockhash;
            // transferTx.feePayer = wallet.publicKey;
            // const signedTx = await wallet.signTransaction(transferTx, { durableNonce: true });
            // const txId = await connection.sendRawTransaction(signedTx.serialize());

            // // Wait for transaction confirmation
            // await connection.confirmTransaction(txId);

            // TODO: Handle any additional logic after the NFT transfer
            console.log("CID before entering into E2E: " + cid);

            e2e(userPublicKey, "https://ipfs.io/ipfs/" + cid + "/example.png")
                .then(res => {
                    if (res) {
                        setStepperNumber(4);
                        console.log("assetId", res);
                        
                        //here we call getAsset function
                        getAsset(res).then(assetInfo => {
                            setAssetId(res);
                            console.log("Asset Info: ", assetInfo);
                        }).catch(err => {
                            console.error("Error getting asset info: ", err);
                        });
                    }
                })
        }

        

        const getProvider = () => {
            if ('phantom' in window) {
                const provider = window.phantom?.solana;

                if (provider?.isPhantom) {
                    return provider;
                }
            }
            window.open('https://phantom.app/', '_blank');
        };


        const startUpload = async (choice:number) => {
            const provider = getProvider(); // see "Detecting the Provider"

            if (!provider.publicKey) {
                try {
                await provider.connect();
                } catch (err) {
                console.error('Failed to connect to wallet:', err);
                return;
                }
            }
            // Call the transferNFT function
            setNftUuid(uuid())
            const nftId = nftUuid;
            console.log("Token program id", TOKEN_PROGRAM_ID);
            if (choice == 1) {
                transferNFT(provider, nftId);

            }else{
                sendToFriend();
            }
           
        }
        // this function is not completed yet.. will be worked upon later
        /*
        const sendToFriend = async () => {
            const connection = new Connection('https://api.devnet.solana.com');
            const provider = getProvider(); // see "Detecting the Provider"
            
            if (!provider.publicKey) {
                try {
                await provider.connect();
                } catch (err) {
                console.error('Failed to connect to wallet:', err);
                return;
                }
            }

            // Fetch the provider
            console.log("PROVIDER", provider);
            const userPublicKey = new PublicKey(provider.publicKey.toString());
            console.log("USER PUBLIC KEY", userPublicKey);
            
            console.log("Token program id", TOKEN_PROGRAM_ID);

            // Fetch all token accounts for the wallet
            const tokenAccounts = await connection.getParsedTokenAccountsByOwner(userPublicKey, {
                programId: TOKEN_PROGRAM_ID, // Replace with the actual SPL Token program ID
            });
            console.log("TOKEN ACCOUNTS", tokenAccounts);
        
            // Log the details of each token account
            tokenAccounts.value.forEach((tokenAccount) => {
                console.log('Token account:', tokenAccount.pubkey.toBase58());
                console.log('Mint:', tokenAccount.account.data.parsed.info.mint);
                console.log('Owner:', tokenAccount.account.data.parsed.info.owner);
                console.log('Token amount:', tokenAccount.account.data.parsed.info.tokenAmount);
            });     
        }
        */

        const sendToFriend = async () => {
            console.log("CID before entering into E2E, sent to friend: " + cid);
            const friendPublicKey = new PublicKey(friendsWalletAddress);
            e2e(friendPublicKey, "https://ipfs.io/ipfs/" + cid + "/example.png")
                .then(res => {
                    if (res) {
                        setIsPopupOpen(false);
                        setStepperNumber(4);
                        console.log("assetId", res);
                        
                        //here we call getAsset function
                        getAsset(res).then(assetInfo => {
                            setAssetId(res);
                            console.log("Asset Info: ", assetInfo);
                        }).catch(err => {
                            console.error("Error getting asset info: ", err);
                        });
                    }
                })
        }

        const burnNFT = async () => {
            
            const connectionString = `https://devnet.helius-rpc.com/?api-key=${apiKey}`;
            const connectionWrapper = new WrappedConnection(
            ownerWallet,
            connectionString
            );
            burnAsset(connectionWrapper,ownerWallet, assetId).then(res => {
                console.log("Res", res);
            }   
            ).catch(err => {
                console.error("Error burning asset: ", err);
            });
        }

        const seeAllNFTs = async () => {



        }


        const returnHome = () => {
            router.push("/");
        }

        return (
            <div className="flex-col items-center justify-center mt-10 my-auto h-screen px-96 w-full">
                <ol className="flex items-center w-full text-sm font-medium text-center text-gray-500 dark:text-gray-400 sm:text-base mb-10">
                    <li className="flex md:w-full items-center text-blue-600 dark:text-blue-500 sm:after:content-[''] after:w-full after:h-1 after:border-b after:border-gray-200 after:border-1 after:hidden sm:after:inline-block after:mx-6 xl:after:mx-10 dark:after:border-gray-700">
                        <span className="flex items-center after:content-['/'] sm:after:hidden after:mx-2 after:text-gray-200 dark:after:text-gray-500">
                            <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-2.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z" />
                            </svg>
                            <span className="mr-2">1</span>
                            Upload
                        </span>
                    </li>
                    <li className={`flex ${stepperNumber > 2 ? 'text-blue-600' : ''} md:w-full items-center after:content-[''] after:w-full after:h-1 after:border-b after:border-gray-200 after:border-1 after:hidden sm:after:inline-block after:mx-6 xl:after:mx-10 dark:after:border-gray-700`}>
                        <span className="flex items-center after:content-['/'] sm:after:hidden after:mx-2 after:text-gray-200 dark:after:text-gray-500">
                            {stepperNumber > 2 && <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-2.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z" />
                            </svg>}
                            <span className="mr-2">2</span>
                            Decide
                        </span>
                    </li>
                    <li className={`flex ${stepperNumber > 3 ? 'text-blue-600' : ''} items-center`}>
                        {stepperNumber > 3 && <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-2.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z" />
                        </svg>}
                        <span className="mr-2">3</span>
                        Transfer
                    </li>
                </ol>

                {stepperNumber == 2 &&
                    <>
                        <img src={nftImageData} alt="Base 64 image" className="mb-10" />
                        <div className="flex">
                            <button type="button" onClick={buyButtonClicked} className="focus:outline-none w-1/2 text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900">Buy</button>
                            <button type="button" onClick={cancelButtonClicked} className="text-white bg-gray-800 w-1/2 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700">Sell</button>
                        </div>
                    </>
                }
                {stepperNumber == 1 &&
                    <>
                        <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center mt-24 w-full h-64 border-2 border-gray-500 border-dashed rounded-lg cursor-pointer bg-gray-700 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-700 dark:border-gray-600 dark:hover:border-gray-700 dark:hover:bg-gray-600">
                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                <svg aria-hidden="true" className="w-10 h-10 mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path></svg>
                                <p className="mb-2 text-sm text-gray-500 dark:text-gray-400"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">SVG, PNG, JPG or GIF (MAX. 800x400px)</p>
                            </div>
                            <input id="dropzone-file" type="file" onChange={handleFileChange} className="hidden" />
                        </label>
                    </>
                }
                {stepperNumber == 3 && !isPopupOpen &&
                    <div>
                        <button type="button" onClick={()=>startUpload(1)} className="focus:outline-none w-full text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900">Transfer NFT to Wallet</button>
                        <button onClick={()=>setIsPopupOpen(true)}  type="button" className="focus:outline-none w-full text-white bg-purple-700 hover:bg-purple-900 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900">Send NFT to Friend</button>
                    </div>
                }
                {isPopupOpen && 
                    <form className="space-y-6" action="#">
                        <div>
                            <label htmlFor="wallet" className="block mb-2 text-sm font-medium text-white dark:text-white">Wallet Address</label>
                            <input type="text" value={friendsWalletAddress} onChange={(e)=>setFriendsWalletAddress(e.target.value)} name="wallet" id="wallet" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" placeholder="0x...." required/>
                        </div>
                        <button onClick={()=>startUpload(2)}  type="button" className="focus:outline-none w-full text-white bg-purple-700 hover:bg-purple-900 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900">Send NFT to Friend</button>
                    </form>            
                } 
               
                {stepperNumber == 4 &&
                    <div>
                        <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-4" role="alert">
                            <p className="font-bold">Success</p>
                            <p>Transfer is done.</p>
                        </div>

                    <button type="button" onClick={returnHome} className="focus:outline-none w-full text-white bg-purple-700 hover:bg-purple-900 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900">Return Home Page</button>
                    </div>
                }
            </div>
        )
    }

    export default CreateNft;