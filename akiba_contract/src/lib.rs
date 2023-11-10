use near_contract_standards::non_fungible_token::metadata::{
    NFTContractMetadata, NonFungibleTokenMetadataProvider, TokenMetadata, NFT_METADATA_SPEC,
};
use near_contract_standards::non_fungible_token::{Token, TokenId};
use near_contract_standards::non_fungible_token::NonFungibleToken;
use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};
use near_sdk::collections::LazyOption;
use near_sdk::{
    env, near_bindgen, AccountId, BorshStorageKey, PanicOnDefault, Promise, PromiseOrValue,
};
use std::collections::HashMap; 
use near_sdk::serde::{Serialize,Deserialize};



#[derive(Clone,BorshDeserialize, BorshSerialize, Serialize,Debug,PartialEq,Deserialize)]
#[serde(crate = "near_sdk::serde")]
pub struct Saver {
    pub account_id: AccountId,
    pub saver_id: u128,
    pub total_saves_amount: u128,
    pub total_amount_earned: u128,

}

#[derive(Clone,BorshDeserialize, BorshSerialize, Serialize,Debug,PartialEq,Deserialize)]
#[serde(crate = "near_sdk::serde")]
pub struct Save {
    pub account_id: AccountId,
    pub save_id: u128,
    pub save_amount: u128,
    pub token_id: u128,
    pub save_start: u128,
    pub save_end: u128,
    pub save_period: u128,
    pub is_transfer: bool,
    pub is_save_active: bool,
}         

#[derive(Clone,BorshDeserialize, BorshSerialize, Serialize,Debug,PartialEq,Deserialize)]
#[serde(crate = "near_sdk::serde")]
pub struct Reward {
    pub account_id: AccountId,
    pub reward_id: u128,
    pub redeemed: bool,
    pub reward_type: String,
}


#[near_bindgen]
#[derive(BorshDeserialize, BorshSerialize, PanicOnDefault)]
pub struct Contract {
    tokens: NonFungibleToken,
    metadata: LazyOption<NFTContractMetadata>,
    savers: HashMap<AccountId, Saver>,
    saves: HashMap<u128, Save>,
    rewards: HashMap<u128, Reward>,
    akiba_earnings:u128,
    transfers:HashMap<u128,Save>,
    is_saver:HashMap<AccountId,bool>,
    save_id_count:u128,
    reward_id_count:u128,
    token_id_count:u128,
    savers_count:u128,
    savers_list:HashMap<u128, Saver>,
    listed:HashMap<AccountId, bool>,
    key_count:u128,
}


const DATA_IMAGE_SVG_NEAR_ICON: &str = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 288 288'%3E%3Cg id='l' data-name='l'%3E%3Cpath d='M187.58,79.81l-30.1,44.69a3.2,3.2,0,0,0,4.75,4.2L191.86,103a1.2,1.2,0,0,1,2,.91v80.46a1.2,1.2,0,0,1-2.12.77L102.18,77.93A15.35,15.35,0,0,0,90.47,72.5H87.34A15.34,15.34,0,0,0,72,87.84V201.16A15.34,15.34,0,0,0,87.34,216.5h0a15.35,15.35,0,0,0,13.08-7.31l30.1-44.69a3.2,3.2,0,0,0-4.75-4.2L96.14,186a1.2,1.2,0,0,1-2-.91V104.61a1.2,1.2,0,0,1,2.12-.77l89.55,107.23a15.35,15.35,0,0,0,11.71,5.43h3.13A15.34,15.34,0,0,0,216,201.16V87.84A15.34,15.34,0,0,0,200.66,72.5h0A15.35,15.35,0,0,0,187.58,79.81Z'/%3E%3C/g%3E%3C/svg%3E";

#[derive(BorshSerialize, BorshStorageKey)]
enum StorageKey {
    NonFungibleToken,
    Metadata,
    TokenMetadata,
    Enumeration,
    Approval,
}

#[near_bindgen]
impl Contract {
    /// Initializes the contract owned by `owner_id` with
    /// default metadata (for example purposes only).
    #[init]
    pub fn new_default_meta(owner_id: AccountId) -> Self {
        Self::new(
            owner_id,
            NFTContractMetadata {
                spec: NFT_METADATA_SPEC.to_string(),
                name: "Example NEAR non-fungible token".to_string(),
                symbol: "EXAMPLE".to_string(),
                icon: Some(DATA_IMAGE_SVG_NEAR_ICON.to_string()),
                base_uri: None,
                reference: None,
                reference_hash: None,
            },
        )
    }

    #[init]
    pub fn new(owner_id: AccountId, metadata: NFTContractMetadata) -> Self {
        assert!(!env::state_exists(), "Already initialized");
        metadata.assert_valid();
        Self {
            tokens: NonFungibleToken::new(
                StorageKey::NonFungibleToken,
                owner_id,
                Some(StorageKey::TokenMetadata),
                Some(StorageKey::Enumeration),
                Some(StorageKey::Approval),
            ),
            metadata: LazyOption::new(StorageKey::Metadata, Some(&metadata)),
            savers: HashMap::new(),
            saves:HashMap::new(),
            rewards:HashMap::new(),
            akiba_earnings:0,
            transfers:HashMap::new(),
            savers_count:0,
            is_saver:HashMap::new(),
            save_id_count:0,
            reward_id_count:0,
            token_id_count:0,
            savers_list:HashMap::new(),
            listed:HashMap::new(),
            key_count:0,

        }
    }

    /// Mint a new token with ID=`token_id` belonging to `receiver_id`.
    ///
    /// Since this example implements metadata, it also requires per-token metadata to be provided
    /// in this call. `self.tokens.mint` will also require it to be Some, since
    /// `StorageKey::TokenMetadata` was provided at initialization.
    ///
    /// `self.tokens.mint` will enforce `predecessor_account_id` to equal the `owner_id` given in
    /// initialization call to `new`.
    #[payable]
    pub fn nft_mint(
        &mut self,
        token_id: TokenId,
        receiver_id: AccountId,
        token_metadata: TokenMetadata,
    ) -> Token {
        self.tokens.internal_mint(token_id, receiver_id, Some(token_metadata))
    }

    pub fn user_is_saver(&self, account_id: &AccountId) -> bool {
        // Check if the user is marked as a saver in the is_saver HashMap
        self.is_saver.get(account_id).copied().unwrap_or(false)
    }
    
    pub fn save_token_metadata(&self,new_title:String,description:String,issued_at:u128,expires_at:u128) -> TokenMetadata {
        TokenMetadata {
            title: Some(new_title),
            description: Some(description),
            media: None,
            media_hash: None,
            copies: Some(1u64),
            issued_at: Some(issued_at.to_string()),
            expires_at: Some(expires_at.to_string()),
            starts_at: None,
            updated_at: None,
            extra: None,
            reference: None,
            reference_hash: None,
        }
    }
    
    #[payable]
    pub fn set_save(
        &mut self,
        save_amount: u128,
        save_start: u128,
        save_end: u128,
    ) -> Token {
        let account_id = env::predecessor_account_id(); // Get the caller's account ID
        let save_id = self.save_id_count + 1; // Read save_id
        self.save_id_count += 1;
        let token_id = self.token_id_count + 1; // Read token_id
        self.token_id_count += 1;
        let is_transfer: bool = false;
        let to_save_id = save_id.clone();
        let is_save_active:bool=true;
        let  save_period: u128 = save_end.clone() - save_start.clone();

        assert!(env::attached_deposit() >= save_amount.clone(), "Attached amount must be equal or greater than save amount");

        let new_save = Save {
            account_id:account_id.clone(),
            save_id:to_save_id,
            save_amount:save_amount.clone(),
            token_id:token_id.clone(),
            save_start: save_start.clone(),
            save_end: save_end.clone(),
            save_period,
            is_transfer,
            is_save_active,
        };

        self.saves.insert(save_id.clone(), new_save); // Update or insert the Save instance

        if !self.user_is_saver(&account_id) {
            // Update the is_saver HashMap to mark the user as a saver
            self.is_saver.insert(account_id.clone(), true);

            let account_id = account_id.clone();
            let saver_id = self.savers_count + 1;
            self.savers_count += 1; 
            let total_saves_amount = save_amount;
            let  total_amount_earned =  0;

            let new_saver = Saver{ account_id: account_id.clone(),saver_id,total_saves_amount,total_amount_earned};

            self.savers.insert(account_id,new_saver);


        }else{

            let saver = self.savers.get(&account_id).cloned().unwrap();

            let account_id = saver.account_id;
            let saver_id = saver.saver_id;
            let total_saves_amount = saver.total_saves_amount + save_amount;
            let  total_amount_earned =  saver.total_amount_earned;

            let new_saver = Saver{ account_id: account_id.clone(),saver_id,total_saves_amount,total_amount_earned};

            self.savers.insert(account_id,new_saver);



        }

        let token_id_str: String = token_id.to_string();
        let new_id =  self.save_id_count;

        let new_title = "Save ".to_string() + &new_id.to_string();
        let receiver_id =account_id.clone();
        let description  =  "Akiba Save for ".to_string() + &receiver_id.to_string();

        let token_metadata = self.save_token_metadata(new_title,description,save_start,save_end);

        self.tokens.internal_mint(token_id_str, account_id, Some(token_metadata))


    }

    pub fn get_save(&self, save_id: u128) -> &Save {
        self.saves.get(&save_id).unwrap()
    }

    #[payable]
    pub fn withdraw(&mut self, save_id: u128,end_date:u128,reward_id:u128) -> bool {
        let mut save = self.saves.get(&save_id).cloned().unwrap();

        let requester_account = env::predecessor_account_id();

        assert!(save.account_id == requester_account, "Not owner");


        if save.save_end <= end_date.clone(){
             let mut withdrawing_saver = self.savers.get(&save.account_id).cloned().unwrap();
             withdrawing_saver.total_saves_amount -= save.save_amount.clone();

             self.savers.insert(withdrawing_saver.account_id.clone(),withdrawing_saver);

             Promise::new(save.account_id.clone()).transfer(save.save_amount.clone());

             save.is_save_active = false;
             let save_id = save.token_id.clone();

             self.saves.insert(save.save_id.clone(),save);

             

             let token_id_to_string = save_id.to_string();

             self.nft_revoke(token_id_to_string, requester_account.clone());

             let account_id: AccountId = requester_account.clone();
             let reward_id:u128  = self.reward_id_count +1;
             self.reward_id_count +=1;
             let redeemed: bool = false;
             let reward_type: String = "Amnesty".to_string();

             let reward = Reward { account_id, reward_id,redeemed,reward_type};

             self.rewards.insert(reward_id.clone(),reward);



             true
        }else{

            let remainining_time = save.save_end.clone() - end_date;
            if reward_id != 0 {

                

            }else{

                let penalty value = 

            }
           
            true
        }

        
    }


    // Function to calculate the percentage based on remaining time
    pub fn calculate_percentage(save: &Save, remaining_time: u128) -> u128 {
        let remaining_days = remaining_time / (60 * 60 * 24);

        if remaining_days > 0 && remaining_days < 2 {
            (0.01 * save.save_amount as f64) as u128
        } else if remaining_days >= 2 && remaining_days < 10 {
            (0.02 * save.save_amount as f64) as u128
        } else if remaining_days >= 10 && remaining_days < 30 {
            (0.03 * save.save_amount as f64) as u128
        } else {
            (0.05 * save.save_amount as f64) as u128
        }
    }

}

near_contract_standards::impl_non_fungible_token_core!(Contract, tokens);
near_contract_standards::impl_non_fungible_token_approval!(Contract, tokens);
near_contract_standards::impl_non_fungible_token_enumeration!(Contract, tokens);

#[near_bindgen]
impl NonFungibleTokenMetadataProvider for Contract {
    fn nft_metadata(&self) -> NFTContractMetadata {
        self.metadata.get().unwrap()
    }
}

#[cfg(all(test, not(target_arch = "wasm32")))]
mod tests {
    use near_sdk::test_utils::{accounts, VMContextBuilder};
    use near_sdk::testing_env;
    use std::collections::HashMap;

    use super::*;

    const MINT_STORAGE_COST: u128 = 5870000000000000000000;

    fn get_context(predecessor_account_id: AccountId) -> VMContextBuilder {
        let mut builder = VMContextBuilder::new();
        builder
            .current_account_id(accounts(0))
            .signer_account_id(predecessor_account_id.clone())
            .predecessor_account_id(predecessor_account_id);
        builder
    }

    fn sample_token_metadata() -> TokenMetadata {
        TokenMetadata {
            title: Some("Olympus Mons".into()),
            description: Some("The tallest mountain in the charted solar system".into()),
            media: None,
            media_hash: None,
            copies: Some(1u64),
            issued_at: None,
            expires_at: None,
            starts_at: None,
            updated_at: None,
            extra: None,
            reference: None,
            reference_hash: None,
        }
    }

    #[test]
    fn test_new() {
        let mut context = get_context(accounts(1));
        testing_env!(context.build());
        let contract = Contract::new_default_meta(accounts(1).into());
        testing_env!(context.is_view(true).build());
        assert_eq!(contract.nft_token("1".to_string()), None);
    }

    #[test]
    #[should_panic(expected = "The contract is not initialized")]
    fn test_default() {
        let context = get_context(accounts(1));
        testing_env!(context.build());
        let _contract = Contract::default();
    }

    #[test]
    fn test_mint() {
        let mut context = get_context(accounts(0));
        testing_env!(context.build());
        let mut contract = Contract::new_default_meta(accounts(0).into());

        testing_env!(context
            .storage_usage(env::storage_usage())
            .attached_deposit(MINT_STORAGE_COST)
            .predecessor_account_id(accounts(0))
            .build());

        let token_id = "0".to_string();
        let token = contract.nft_mint(token_id.clone(), accounts(0), sample_token_metadata());

        assert_eq!(token.token_id, token_id);
        assert_eq!(token.owner_id.to_string(), accounts(0).to_string());
        assert_eq!(token.metadata.unwrap(), sample_token_metadata());
        assert_eq!(token.approved_account_ids.unwrap(), HashMap::new());
    }

    #[test]
    fn test_save() {
        let mut context = get_context(accounts(0));
        testing_env!(context.build());
        let mut contract = Contract::new_default_meta(accounts(0).into());

        let save_amount :u128= 100;
        let save_start: u128 = 1000;
        let save_end: u128 = 1200;
        let account_id = env::predecessor_account_id();

        testing_env!(context
            .storage_usage(env::storage_usage())
            .attached_deposit(MINT_STORAGE_COST + save_amount.clone())
            .predecessor_account_id(accounts(0))
            .build());

        let token_id = "1".to_string();
        let token = contract.set_save(save_amount.clone(), save_start.clone(), save_end.clone());

        let result = contract.get_save(1);

        // Assert that the result is Some(Save)
        assert_eq!(result.save_amount, save_amount);

        assert_eq!(token.token_id, token_id);
        assert_eq!(token.owner_id.to_string(), account_id.to_string());
        assert_eq!(token.approved_account_ids.unwrap(), HashMap::new());
    }


    #[test]
    fn test_transfer() {
        let mut context = get_context(accounts(0));
        testing_env!(context.build());
        let mut contract = Contract::new_default_meta(accounts(0).into());

        testing_env!(context
            .storage_usage(env::storage_usage())
            .attached_deposit(MINT_STORAGE_COST)
            .predecessor_account_id(accounts(0))
            .build());
        let token_id = "0".to_string();
        contract.nft_mint(token_id.clone(), accounts(0), sample_token_metadata());

        testing_env!(context
            .storage_usage(env::storage_usage())
            .attached_deposit(1)
            .predecessor_account_id(accounts(0))
            .build());
        contract.nft_transfer(accounts(1), token_id.clone(), None, None);

        testing_env!(context
            .storage_usage(env::storage_usage())
            .account_balance(env::account_balance())
            .is_view(true)
            .attached_deposit(0)
            .build());
        if let Some(token) = contract.nft_token(token_id.clone()) {
            assert_eq!(token.token_id, token_id);
            assert_eq!(token.owner_id.to_string(), accounts(1).to_string());
            assert_eq!(token.metadata.unwrap(), sample_token_metadata());
            assert_eq!(token.approved_account_ids.unwrap(), HashMap::new());
        } else {
            panic!("token not correctly created, or not found by nft_token");
        }
    }

    #[test]
    fn test_approve() {
        let mut context = get_context(accounts(0));
        testing_env!(context.build());
        let mut contract = Contract::new_default_meta(accounts(0).into());

        testing_env!(context
            .storage_usage(env::storage_usage())
            .attached_deposit(MINT_STORAGE_COST)
            .predecessor_account_id(accounts(0))
            .build());
        let token_id = "0".to_string();
        contract.nft_mint(token_id.clone(), accounts(0), sample_token_metadata());

        // alice approves bob
        testing_env!(context
            .storage_usage(env::storage_usage())
            .attached_deposit(150000000000000000000)
            .predecessor_account_id(accounts(0))
            .build());
        contract.nft_approve(token_id.clone(), accounts(1), None);

        testing_env!(context
            .storage_usage(env::storage_usage())
            .account_balance(env::account_balance())
            .is_view(true)
            .attached_deposit(0)
            .build());
        assert!(contract.nft_is_approved(token_id.clone(), accounts(1), Some(1)));
    }

    #[test]
    fn test_revoke() {
        let mut context = get_context(accounts(0));
        testing_env!(context.build());
        let mut contract = Contract::new_default_meta(accounts(0).into());

        testing_env!(context
            .storage_usage(env::storage_usage())
            .attached_deposit(MINT_STORAGE_COST)
            .predecessor_account_id(accounts(0))
            .build());
        let token_id = "0".to_string();
        contract.nft_mint(token_id.clone(), accounts(0), sample_token_metadata());

        // alice approves bob
        testing_env!(context
            .storage_usage(env::storage_usage())
            .attached_deposit(150000000000000000000)
            .predecessor_account_id(accounts(0))
            .build());
        contract.nft_approve(token_id.clone(), accounts(1), None);

        // alice revokes bob
        testing_env!(context
            .storage_usage(env::storage_usage())
            .attached_deposit(1)
            .predecessor_account_id(accounts(0))
            .build());
        contract.nft_revoke(token_id.clone(), accounts(1));
        testing_env!(context
            .storage_usage(env::storage_usage())
            .account_balance(env::account_balance())
            .is_view(true)
            .attached_deposit(0)
            .build());
        assert!(!contract.nft_is_approved(token_id.clone(), accounts(1), None));
    }

    #[test]
    fn test_revoke_all() {
        let mut context = get_context(accounts(0));
        testing_env!(context.build());
        let mut contract = Contract::new_default_meta(accounts(0).into());

        testing_env!(context
            .storage_usage(env::storage_usage())
            .attached_deposit(MINT_STORAGE_COST)
            .predecessor_account_id(accounts(0))
            .build());
        let token_id = "0".to_string();
        contract.nft_mint(token_id.clone(), accounts(0), sample_token_metadata());

        // alice approves bob
        testing_env!(context
            .storage_usage(env::storage_usage())
            .attached_deposit(150000000000000000000)
            .predecessor_account_id(accounts(0))
            .build());
        contract.nft_approve(token_id.clone(), accounts(1), None);

        // alice revokes bob
        testing_env!(context
            .storage_usage(env::storage_usage())
            .attached_deposit(1)
            .predecessor_account_id(accounts(0))
            .build());
        contract.nft_revoke_all(token_id.clone());
        testing_env!(context
            .storage_usage(env::storage_usage())
            .account_balance(env::account_balance())
            .is_view(true)
            .attached_deposit(0)
            .build());
        assert!(!contract.nft_is_approved(token_id.clone(), accounts(1), Some(1)));
    }
}