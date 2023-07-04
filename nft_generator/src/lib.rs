use anchor_lang::prelude::*;

#[program]
pub mod nft {
    use super::*;
    
    // Creates an account for the lottery
    pub fn initialise_lottery(ctx: Context<Create>) -> Result<()> {        
        Ok(())
    }

    pub fn create_nft(ctx: Context<CreateNFT>, image: String) -> ProgramResult {
        let nft = &mut ctx.accounts.nft;
        
        nft.owner = *ctx.accounts.from.key;
        nft.image = image;
        
        Ok(())
    }

    pub fn transfer_nft(ctx: Context<TransferNFT>, to: Pubkey) -> ProgramResult {
        let nft = &mut ctx.accounts.nft;
        
        if nft.owner != *ctx.accounts.from.key {
            return Err(ErrorCode::Unauthorized.into());
        }
        
        nft.owner = to;
        
        Ok(())
    }

    pub fn sell_nft(ctx: Context<SellNFT>, price: u64) -> ProgramResult {
        let nft = &mut ctx.accounts.nft;
        
        if nft.owner != *ctx.accounts.from.key {
            return Err(ErrorCode::Unauthorized.into());
        }
        
        nft.for_sale = true;
        nft.price = price;
        
        Ok(())
    }

    pub fn buy_nft(ctx: Context<BuyNFT>) -> ProgramResult {
        let nft = &mut ctx.accounts.nft;

        if !nft.for_sale {
            return Err(ErrorCode::NotForSale.into());
        }

        let buyer = *ctx.accounts.from.key;
        let price = nft.price;

        // Transfer ownership
        nft.owner = buyer;
        nft.for_sale = false;
        nft.price = 0;

        // Transfer funds from buyer to seller (you may need to implement this depending on the platform)

        Ok(())
    }
}

#[derive(Accounts)]
pub struct CreateNFT<'info> {
    #[account(init, payer = from, space = 100, seeds = [b"nft".as_ref()],)]
    pub nft: Account<'info, NFT>,
    pub from: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct TransferNFT<'info> {
    #[account(mut)]
    pub nft: Account<'info, NFT>,
    pub from: Signer<'info>,
    pub to: AccountInfo<'info>,
}

#[derive(Accounts)]
pub struct SellNFT<'info> {
    #[account(mut)]
    pub nft: Account<'info, NFT>,
    pub from: Signer<'info>,
}

#[derive(Accounts)]
pub struct BuyNFT<'info> {
    #[account(mut)]
    pub nft: Account<'info, NFT>,
    pub from: Signer<'info>,
    pub system_program: Program<'info, System>,
    pub seller: AccountInfo<'info>,
    pub buyer_payment: AccountInfo<'info>,
}

#[account]
pub struct NFT {
    pub owner: Pubkey,
    pub image: String,
    pub for_sale: bool,
    pub price: u64,
}

#[error]
pub enum ErrorCode {
    #[msg("Unauthorized: You are not the owner of this NFT")]
    Unauthorized,
    #[msg("NFT is not for sale")]
    NotForSale,
}