import axios from "axios";
import { useRouter } from "next/router";
import { ChangeEvent, useEffect, useState } from "react";
import { Connection, PublicKey, Keypair, Transaction, SystemProgram } from '@solana/web3.js';
import { e2e } from "@/services/e2e";


const CreateNft = () => {
    const router = useRouter();
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [nftImageData, setNftImageData] = useState<string>("");
    const [stepperNumber, setStepperNumber] = useState<number>(1);
    const [cid, setCid] = useState<string>("");

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
            }
        };
    };

    const buyButtonClicked = async () => {
        const data = {
            bodyOfImage: nftImageData,
        };
        const response = await fetch("/api/upload", {
            method: "POST",
            body: JSON.stringify(data),
        });
        console.log(response.json());
        
        setStepperNumber(3);
    }

    const cancelButtonClicked = () => {
        setStepperNumber(1);
    }

    async function transferNFT(provider: any, nftId: string): Promise<void> {
        //const connection = new Connection(process.env.RPC_ENDPOINT); // Update with your Solana network URL
        //const nftProgramId = new PublicKey('YOUR_NFT_PROGRAM_ID'); // Replace with the actual NFT program ID
         const userPublicKey = new PublicKey(provider.publicKey.toString());
        // console.log(userPublicKey);
        //console.log("PROVIDERRRRRR",provider.publicKey.toString());  
        //const testPublicKey = new   PublicKey("HWD4hHZfTWPgKbN1YSYxE9kbTgtaKpV6EHPzWJwoEKCs");
        // const transferInstruction = SystemProgram.transfer({
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

        e2e(userPublicKey);
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
    const startUpload = async () => {
        const provider = getProvider(); // see "Detecting the Provider"
        try {
            const resp = await provider.connect();

            // Call the transferNFT function
            const nftId = 'YOUR_NFT_ID';
            transferNFT(provider, nftId);
        } catch (err) {
            // Handle error
        }
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
                <li className="flex items-center">
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
            {stepperNumber == 3 &&
                <div>
                    <button type="button" onClick={startUpload} className="focus:outline-none w-full text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900">Transfer NFT to Wallet</button>
                </div>
            }
        </div>
    )
}

export default CreateNft;