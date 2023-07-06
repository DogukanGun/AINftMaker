class NFTTransferService {
    getProvider() {
        if ('phantom' in window) {
            const provider = window.phantom?.solana;

            if (provider?.isPhantom) {
                return provider;
            }
        }
        window.open('https://phantom.app/', '_blank');
    };
    async transferNFT(nftDetails: NFTDetails, userWalletAddress: WalletAddress) {
        // Step 1: Connect to Phantom Wallet
        const provider = this.getProvider();

        if (!provider) {
            throw new Error('Phantom provider not found');
        }

        // Step 2: Connect to Phantom Wallet
        await provider.connect();

        // Step 3: Obtain the Nonce
        const nonce = await provider.getNonce(userWalletAddress);

        // Step 4: Construct the Transaction
        const transaction = {
            from: userWalletAddress,
            to: nftDetails.recipientAddress,
            contractAddress: nftDetails.contractAddress,
            tokenId: nftDetails.tokenId,
            // Additional parameters specific to the blockchain network or NFT contract
            nonce: nonce, // Add the nonce property
        };

        // Step 5: Sign and Submit the Transaction
        await provider.sendTransaction(transaction);
    }
}

// Define the necessary types
type WalletAddress = string; // Placeholder type, replace with your actual wallet address type
interface NFTDetails {
    recipientAddress: WalletAddress;
    contractAddress: string;
    tokenId: string;
    // Additional NFT details specific to your implementation
}

// Usage example
const nftTransferService = new NFTTransferService();
const nftDetails: NFTDetails = {
    recipientAddress: '0x123456789abcdef', // Replace with the recipient's wallet address
    contractAddress: '0xabcdef123456789', // Replace with the NFT contract address
    tokenId: '12345', // Replace with the specific NFT token ID
};
const userWalletAddress: WalletAddress = '0x987654321abcdef'; // Replace with the user's wallet address
nftTransferService.transferNFT(nftDetails, userWalletAddress)
    .then(() => {
        console.log('NFT transfer successful!');
    })
    .catch((error) => {
        console.error('NFT transfer failed:', error);
    });
