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
    listed_for:HashMap<AccountId, u128>,
    key_count:u128,
    disburse_timestamp: u64,
}


const DATA_IMAGE_SVG_NEAR_ICON: &str = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 288 288'%3E%3Cg id='l' data-name='l'%3E%3Cpath d='M187.58,79.81l-30.1,44.69a3.2,3.2,0,0,0,4.75,4.2L191.86,103a1.2,1.2,0,0,1,2,.91v80.46a1.2,1.2,0,0,1-2.12.77L102.18,77.93A15.35,15.35,0,0,0,90.47,72.5H87.34A15.34,15.34,0,0,0,72,87.84V201.16A15.34,15.34,0,0,0,87.34,216.5h0a15.35,15.35,0,0,0,13.08-7.31l30.1-44.69a3.2,3.2,0,0,0-4.75-4.2L96.14,186a1.2,1.2,0,0,1-2-.91V104.61a1.2,1.2,0,0,1,2.12-.77l89.55,107.23a15.35,15.35,0,0,0,11.71,5.43h3.13A15.34,15.34,0,0,0,216,201.16V87.84A15.34,15.34,0,0,0,200.66,72.5h0A15.35,15.35,0,0,0,187.58,79.81Z'/%3E%3C/g%3E%3C/svg%3E";

const NEAR_TO_YOCTO: u128 = 1_000_000_000_000_000_000_000_000;

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
            listed_for:HashMap::new(),
            key_count:0,
            disburse_timestamp:env::block_timestamp(),



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

        let save_amount_yocto = save_amount.checked_mul(NEAR_TO_YOCTO).expect("Overflow in conversion");
        let attached_deposit = env::attached_deposit();

        assert!(
            attached_deposit >= save_amount_yocto,
            "Attached amount must be equal or greater than save amount"
        );

        let new_save = Save {
            account_id:account_id.clone(),
            save_id:to_save_id,
            save_amount:save_amount_yocto.clone(),
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
            let total_saves_amount = save_amount_yocto.clone();
            let  total_amount_earned =  0;

            let new_saver = Saver{ account_id: account_id.clone(),saver_id,total_saves_amount,total_amount_earned};

            self.savers.insert(account_id,new_saver);


        }else{

            let saver = self.savers.get(&account_id).cloned().unwrap();

            let account_id = saver.account_id;
            let saver_id = saver.saver_id;
            let total_saves_amount = saver.total_saves_amount.checked_add(save_amount_yocto).expect("Overflow in total saves amount calculation");
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

    pub fn get_saver(&self, account_id: AccountId) -> &Saver {
        self.savers.get(&account_id).unwrap()
    }

    // Function to calculate the percentage based on remaining time
    pub fn calculate_percentage(&self, save: &Save, remaining_time: u128) -> u128 {
        let remaining_days = remaining_time as f64 / (60 * 60 * 24 * 1000) as f64;

        if remaining_days > 0.0 && remaining_days < 2.0 {
            (0.01 * save.save_amount as f64) as u128
        } else if remaining_days >= 2.0 && remaining_days < 10.0 {
            (0.02 * save.save_amount as f64) as u128
        } else if remaining_days >= 10.0 && remaining_days < 30.0 {
            (0.03 * save.save_amount as f64) as u128
        } else {
            (0.05 * save.save_amount as f64) as u128
        }
    }

    pub fn calculate_percentage_transfer(&self, save: &Save, remaining_time: u128) -> u128 {
        let remaining_days = remaining_time as f64 / (60 * 60 * 24 * 1000) as f64 ;

        if remaining_days > 0.0 && remaining_days < 2.0 {
            (0.005 * save.save_amount as f64) as u128
        } else if remaining_days >= 2.0 && remaining_days < 10.0 {
            (0.01 * save.save_amount as f64) as u128
        } else if remaining_days >= 10.0 && remaining_days < 30.0 {
            (0.015 * save.save_amount as f64) as u128
        } else {
            (0.025 * save.save_amount as f64) as u128
        }
    }

    #[payable]
    pub fn withdraw(&mut self, save_id: u128,end_date:u128,reward_id:u128){
        let mut save = self.saves.get(&save_id).cloned().unwrap();

        let requester_account = env::predecessor_account_id();

        assert!(save.account_id == requester_account, "Not owner");

        let mut withdrawing_saver = self.savers.get(&save.account_id).cloned().unwrap();


        if save.save_end <= end_date.clone(){
             
             withdrawing_saver.total_saves_amount -= save.save_amount.clone();

             self.savers.insert(withdrawing_saver.account_id.clone(),withdrawing_saver);

             Promise::new(save.account_id.clone()).transfer(save.save_amount.clone());

             save.is_save_active = false;
             let save_id = save.token_id.clone();

             self.saves.insert(save.save_id.clone(),save.clone());

             

             let token_id_to_string = save_id.to_string();

             self.nft_revoke(token_id_to_string, requester_account.clone());

             let account_id: AccountId = requester_account.clone();
             let reward_id:u128  = self.reward_id_count +1;
             self.reward_id_count +=1;
             let redeemed: bool = false;
             let reward_type: String = "Amnesty".to_string();

             let reward = Reward { account_id:account_id.clone(), reward_id,redeemed,reward_type};

             self.rewards.insert(reward_id.clone(),reward);

             let is_listed = self.is_account_listed(account_id.clone());

             if is_listed {
                    let mut listed_for = self.get_listed_duration(account_id.clone());

                    if listed_for > save.save_period.clone(){
                        listed_for = listed_for - save.save_period.clone();
                        self.listed_for.insert(account_id.clone(),listed_for);
                    }else{
                        self.remove_from_list(account_id.clone());
                    }
             }


        }else{

            let remaining_time = save.save_end.clone() - end_date;

            withdrawing_saver.total_saves_amount -= save.save_amount.clone();

            self.savers.insert(withdrawing_saver.account_id.clone(),withdrawing_saver);

            save.is_save_active = false;
            let save_id = save.token_id.clone();

            let save_amount_to_transfer = save.save_amount.clone();
            let transfer_to = save.account_id.clone();

            self.saves.insert(save.save_id.clone(),save.clone());

            let token_id_to_string = save_id.to_string();

            self.nft_revoke(token_id_to_string, requester_account.clone());

            if reward_id != 0 {

                let reward = self.rewards.get(&reward_id).cloned().unwrap();

                if reward.reward_type == "Amnesty"{
                    Promise::new(transfer_to.clone()).transfer(save_amount_to_transfer.clone());
                }else{

                    let penalty_value = self.calculate_percentage(&save, remaining_time.clone());
                    let new_save_amount_to_transfer = save_amount_to_transfer - penalty_value;
                    self.akiba_earnings += penalty_value;
    
                    Promise::new(transfer_to.clone()).transfer(new_save_amount_to_transfer.clone());

                    self.listed.insert(transfer_to.clone(),true);
                    self.listed_for.insert(transfer_to.clone(), save.save_period.clone());
                }

            }else{

                let penalty_value = self.calculate_percentage(&save, remaining_time.clone());
                let new_save_amount_to_transfer = save_amount_to_transfer - penalty_value;
                self.akiba_earnings += penalty_value;

                Promise::new(transfer_to.clone()).transfer(new_save_amount_to_transfer.clone());

                self.listed.insert(transfer_to.clone(),true);
                self.listed_for.insert(transfer_to.clone(), save.save_period.clone());

            }
           
        }

        
    }

    #[payable]
    pub fn transfer_save(&mut self, save_id: u128,transfer_to:AccountId,end_date:u128,reward_id:u128){

        let mut save = self.saves.get(&save_id).cloned().unwrap();

        let requester_account = env::predecessor_account_id();

        assert!(save.account_id == requester_account, "Not owner");

        let mut withdrawing_saver = self.savers.get(&save.account_id).cloned().unwrap();


        if save.save_end <= end_date.clone(){
             
             withdrawing_saver.total_saves_amount -= save.save_amount.clone();

             self.savers.insert(withdrawing_saver.account_id.clone(),withdrawing_saver);

             
             if !self.user_is_saver(&transfer_to) {

                self.is_saver.insert(transfer_to.clone(), true);

                let saver_id = self.savers_count + 1;
                self.savers_count += 1; 
                let total_saves_amount =save.save_amount.clone();
                let  total_amount_earned =  0;
    
                let new_saver = Saver{ account_id: transfer_to.clone(),saver_id,total_saves_amount,total_amount_earned};
    
                self.savers.insert(transfer_to.clone(),new_saver);
    
             }else{

                
                let saver = self.savers.get(&transfer_to).cloned().unwrap();

                let account_id = saver.account_id;
                let saver_id = saver.saver_id;
                let total_saves_amount = saver.total_saves_amount + save.save_amount.clone();
                let  total_amount_earned =  saver.total_amount_earned;

                let new_saver = Saver{ account_id: account_id.clone(),saver_id,total_saves_amount,total_amount_earned};

                self.savers.insert(account_id,new_saver);

             }

             save.is_transfer = false;
             save.account_id = transfer_to.clone();
             
             let save_id = save.token_id.clone();

             self.saves.insert(save.save_id.clone(),save.clone());

             

             let token_id_to_string = save_id.to_string();

            
             self.nft_transfer(transfer_to.clone(), token_id_to_string.clone(), None, None);

             let account_id: AccountId = requester_account.clone();
             let reward_id:u128  = self.reward_id_count +1;
             self.reward_id_count +=1;
             let redeemed: bool = false;
             let reward_type: String = "Amnesty".to_string();

             let reward = Reward { account_id:account_id.clone(), reward_id,redeemed,reward_type};

             self.rewards.insert(reward_id.clone(),reward);

             let is_listed = self.is_account_listed(account_id.clone());

             if is_listed {
                    let mut listed_for = self.get_listed_duration(account_id.clone());

                    if listed_for > save.save_period.clone(){
                        listed_for = listed_for - save.save_period.clone();
                        self.listed_for.insert(account_id.clone(),listed_for);
                    }else{
                        self.remove_from_list(account_id.clone());
                    }
             }


        }else{

            let remaining_time = save.save_end.clone() - end_date;

            withdrawing_saver.total_saves_amount -= save.save_amount.clone();

            self.savers.insert(withdrawing_saver.account_id.clone(),withdrawing_saver);

            save.is_transfer = false;
           

            let save_id = save.token_id.clone();

            let save_amount_to_transfer = save.save_amount.clone();

            let from =  save.account_id.clone();
            
            save.account_id = transfer_to.clone();

            let token_id_to_string = save_id.to_string();

            if !self.user_is_saver(&transfer_to) {

                self.is_saver.insert(transfer_to.clone(), true);

                let saver_id = self.savers_count + 1;
                self.savers_count += 1; 
                let total_saves_amount =save.save_amount.clone();
                let  total_amount_earned =  0;
    
                let new_saver = Saver{ account_id: transfer_to.clone(),saver_id,total_saves_amount,total_amount_earned};
    
                self.savers.insert(transfer_to.clone(),new_saver);
    
             }else{

                
                let saver = self.savers.get(&transfer_to).cloned().unwrap();

                let account_id = saver.account_id;
                let saver_id = saver.saver_id;
                let total_saves_amount = saver.total_saves_amount + save.save_amount.clone();
                let  total_amount_earned =  saver.total_amount_earned;

                let new_saver = Saver{ account_id: account_id.clone(),saver_id,total_saves_amount,total_amount_earned};

                self.savers.insert(account_id,new_saver);

             }

            if reward_id != 0 {

                let reward = self.rewards.get(&reward_id).cloned().unwrap();

                if reward.reward_type == "Amnesty"{

                  self.nft_transfer(transfer_to.clone(), token_id_to_string.clone(), None, None);
                      
                    self.saves.insert(save.save_id.clone(),save.clone());

                }else{

                    let penalty_value = self.calculate_percentage_transfer(&save, remaining_time.clone());
                    let new_save_amount_to_transfer = save_amount_to_transfer - penalty_value;
                    self.akiba_earnings += penalty_value;

                    save.save_amount = new_save_amount_to_transfer;

                    self.nft_transfer(transfer_to.clone(), token_id_to_string.clone(), None, None);
                    
                    self.listed.insert(from.clone(),true);

                    self.saves.insert(save.save_id.clone(),save.clone());
                }

            }else{

                let penalty_value = self.calculate_percentage_transfer(&save, remaining_time.clone());
                let new_save_amount_to_transfer = save_amount_to_transfer - penalty_value;
                self.akiba_earnings += penalty_value;

                save.save_amount = new_save_amount_to_transfer;

                self.nft_transfer(transfer_to.clone(), token_id_to_string.clone(), None, None);
                
                self.listed.insert(from.clone(),true);

                self.saves.insert(save.save_id.clone(),save.clone());

            }
           
        }

        
    }

    pub fn request_transfer(&mut self,save_id: u128) -> Save {

        let mut save = self.saves.get(&save_id).cloned().unwrap();

        let requester = env::predecessor_account_id();

        assert!(save.account_id.clone() == requester, "Requester not owner");

        save.is_transfer = true;
        
        let id = save.save_id.clone();

        self.saves.insert(id, save.clone());

        save
    }

    
    // Get the total number of savers
    pub fn get_total_savers(&self) -> usize {
        self.savers.len()
    }

    pub fn get_total_listed(&self) -> usize {
        self.listed.len()
    }


    pub fn get_total_earnings(&self) -> u128 {
        self.akiba_earnings
    }

    // Get all savers
    pub fn get_all_savers(&self) -> Vec<Saver> {

            let mut result = self.savers.values().cloned().collect::<Vec<Saver>>();
            
            // Sort the vector by job_id
            result.sort_by(|a, b| a.saver_id.cmp(&b.saver_id));
            
            result
        }

    pub fn get_listed_duration(&self, account_id: AccountId) -> u128{
        self.listed_for.get(&account_id).cloned().unwrap()
    }


    pub fn remove_from_list(&mut self, account_id: AccountId) {
        self.listed_for.remove(&account_id);
        self.listed.remove(&account_id);
    }
    
    // Get all savers


    // Get all saves for a specific account
    pub fn get_all_saves_for_account(&self, account_id: AccountId) -> Vec<Save> {
            let mut result = Vec::new();
            for save in self.saves.values() {
                if save.account_id == account_id {
                    result.push(save.clone());
                }
            }
            result
        }

    // Get all saves for a specific account
    pub fn get_all_transfer_requests_for_account(&self, account_id: AccountId) -> Vec<Save> {
        let mut result = Vec::new();
        for save in self.saves.values() {
            if save.account_id == account_id && save.is_transfer {
                result.push(save.clone());
            }
        }
        result
    }

    // Get all saves for a specific account
    pub fn get_all_rewards_for_account(&self, account_id: AccountId) -> Vec<Reward> {
                let mut result = Vec::new();
                for reward in self.rewards.values() {
                    if reward.account_id == account_id {
                        result.push(reward.clone());
                    }
                }
                result
            }

    pub fn is_account_listed(&self, account_id: AccountId) -> bool {
        match self.listed.get(&account_id) {
            Some(value) => *value == true,
            None => false,
        }

    }
    


    pub fn disburse(&mut self){
        let total_savers_disburse = self.get_total_savers() - self.get_total_listed();

            if self.akiba_earnings > 0 {
                let share = self.akiba_earnings / total_savers_disburse as u128;
                
                // Cloning the values to iterate over them without borrowing `self.savers` mutably
                let savers_clone: Vec<_> = self.savers.values().cloned().collect();
                
                for mut saver in savers_clone {
                    if !self.is_account_listed(saver.account_id.clone()) {
                        saver.total_amount_earned += share.clone();
                        let account_id = saver.account_id.clone();
                        self.savers.insert(account_id.clone(), saver);
                        self.akiba_earnings -= share.clone();
                    }
                }
        }
    }

    pub fn check_and_disburse(&mut self) -> Option<u64> {
        let current_timestamp = env::block_timestamp();
        let thirty_days_in_nanos: u64 = 30 * 24 * 60 * 60 * 1_000_000_000; // 30 days in nanoseconds
        
        if current_timestamp >= self.disburse_timestamp + thirty_days_in_nanos {
            self.disburse();
            self.disburse_timestamp = env::block_timestamp(); // Update disburse_timestamp to current time
            return Some(0);
        }else {
            let remaining_time = self.disburse_timestamp + thirty_days_in_nanos - current_timestamp;
            let remaining_days = remaining_time / (24 * 60 * 60 * 1_000_000_000); // Convert remaining nanoseconds to days
            return Some(remaining_days);
        }
    }

    #[payable]
    pub fn withdraw_earnings(&mut self,amount:u128){

        let withdraw_to = env::predecessor_account_id();

        let saver = self.savers.get(&withdraw_to).cloned().unwrap();
        

        assert!(withdraw_to.clone() == saver.account_id.clone());

        assert!(saver.total_amount_earned.clone() > amount.clone());

        Promise::new(withdraw_to.clone()).transfer(amount.clone());


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
    use near_sdk::Balance;

    use super::*;

    const MINT_STORAGE_COST: u128 = 5870000000000000000000;
    const NEAR_TO_YOCTO: u128 = 1_000_000_000_000_000_000_000_000;

    fn get_context(predecessor_account_id: AccountId) -> VMContextBuilder {
        let mut builder = VMContextBuilder::new();
        builder
            .current_account_id(accounts(0))
            .signer_account_id(predecessor_account_id.clone())
            .predecessor_account_id(predecessor_account_id);
        builder
    }

        // Auxiliar fn: create a mock context
    fn set_context(predecessor: AccountId, amount: Balance) {
            let mut builder = VMContextBuilder::new();
            builder.predecessor_account_id(predecessor);
            builder.attached_deposit(amount);
      
            testing_env!(builder.build());
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

        let save_amount_yocto = save_amount.checked_mul(NEAR_TO_YOCTO).expect("Overflow in conversion");


        testing_env!(context
            .storage_usage(env::storage_usage())
            .attached_deposit(MINT_STORAGE_COST + save_amount_yocto.clone())
            .predecessor_account_id(accounts(0))
            .build());

        let token_id = "1".to_string();
        let token = contract.set_save(save_amount.clone(), save_start.clone(), save_end.clone());

        let result = contract.get_save(1);

        let saver = contract.get_saver(account_id.clone());

        assert_eq!(saver.total_saves_amount,save_amount_yocto.clone());
        assert_eq!(saver.total_amount_earned,0);

        // Assert that the result is Some(Save)
        assert_eq!(result.save_amount, save_amount_yocto);

        assert_eq!(token.token_id, token_id);
        assert_eq!(token.owner_id.to_string(), account_id.to_string());
        assert_eq!(token.approved_account_ids.unwrap(), HashMap::new());
    }

    #[test]
    fn test_withdraw() {
        let mut context = get_context(accounts(0));
        testing_env!(context.build());
        let mut contract = Contract::new_default_meta(accounts(0).into());

        let save_amount :u128= 100;
        let save_start: u128 = 1000;
        let save_end: u128 = 1200;
        let account_id = env::predecessor_account_id();
        let user = account_id.clone();

        let save_amount_yocto = save_amount.checked_mul(NEAR_TO_YOCTO).expect("Overflow in conversion");


        testing_env!(context
            .storage_usage(env::storage_usage())
            .attached_deposit(MINT_STORAGE_COST + save_amount_yocto.clone())
            .predecessor_account_id(account_id.clone())
            .build());

        let token_id = "1".to_string();
        let token = contract.set_save(save_amount.clone(), save_start.clone(), save_end.clone());

        let result = contract.get_save(1);

        // Assert that the result is Some(Save)
        assert_eq!(result.save_amount, save_amount_yocto);

        assert_eq!(token.token_id, token_id);
        assert_eq!(token.owner_id.to_string(), account_id.to_string());
        assert_eq!(token.approved_account_ids.unwrap(), HashMap::new());

        set_context(user.clone(),1);

        contract.withdraw(1,1300,0);


        let save_result = contract.get_save(1);

        // Assert that the result is Some(Save)
        assert_eq!(save_result.is_save_active, false);



    }

    #[test]
    fn test_transfer_save() {
        
        let mut context = get_context(accounts(0));
        testing_env!(context.build());
        let mut contract = Contract::new_default_meta(accounts(0).into());

        let save_amount :u128= 100;
        let save_start: u128 = 1700945720277;
        let save_end: u128 = 1700945788925;
        let account_id = env::predecessor_account_id();
        let user = account_id.clone();

        let save_amount_yocto = save_amount.checked_mul(NEAR_TO_YOCTO).expect("Overflow in conversion");


        testing_env!(context
            .storage_usage(env::storage_usage())
            .attached_deposit(MINT_STORAGE_COST + save_amount_yocto.clone())
            .predecessor_account_id(account_id.clone())
            .build());

        let token_id = "1".to_string();
        let token = contract.set_save(save_amount.clone(), save_start.clone(), save_end.clone());

        let result = contract.get_save(1);

        // Assert that the result is Some(Save)
        assert_eq!(result.save_amount, save_amount_yocto.clone());

        assert_eq!(token.token_id, token_id);
        assert_eq!(token.owner_id.to_string(), account_id.to_string());
        assert_eq!(token.approved_account_ids.unwrap(), HashMap::new());

        set_context(user.clone(),1);

        contract.transfer_save(1,accounts(1),1700945748525,0);


        let save_result = contract.get_save(1);

        // Assert that the result is Some(Save)
        assert_eq!(save_result.account_id.clone(), accounts(1));

 

        let calc_earnings = (0.005 * save_amount_yocto as f64) as u128;
        

        let akiba_earnings = contract.get_total_earnings();

        assert_eq!(akiba_earnings,calc_earnings.clone() as u128);

        let check_dis = contract.check_and_disburse();

        assert_eq!(check_dis,Some(30));

        contract.disburse();


        let saver  = contract.get_saver(accounts(1));

        assert_eq!(saver.total_amount_earned,calc_earnings.clone() as u128);


       


    }


    #[test]
    fn test_transfer_save_after_request() {
        
        let mut context = get_context(accounts(0));
        testing_env!(context.build());
        let mut contract = Contract::new_default_meta(accounts(0).into());

        let save_amount :u128= 100;
        let save_start: u128 = 1000;
        let save_end: u128 = 1200;
        let account_id = env::predecessor_account_id();
        let user = account_id.clone();

        let save_amount_yocto = save_amount.checked_mul(NEAR_TO_YOCTO).expect("Overflow in conversion");


        testing_env!(context
            .storage_usage(env::storage_usage())
            .attached_deposit(MINT_STORAGE_COST + save_amount_yocto.clone())
            .predecessor_account_id(account_id.clone())
            .build());

        let token_id = "1".to_string();
        let token = contract.set_save(save_amount.clone(), save_start.clone(), save_end.clone());

        let result = contract.get_save(1);

        // Assert that the result is Some(Save)
        assert_eq!(result.save_amount, save_amount_yocto);

        assert_eq!(token.token_id, token_id);
        assert_eq!(token.owner_id.to_string(), account_id.to_string());
        assert_eq!(token.approved_account_ids.unwrap(), HashMap::new());

        contract.request_transfer(1);


        let result_2 = contract.get_save(1);

        assert_eq!(result_2.is_transfer, true);

        set_context(user.clone(),1);

        contract.transfer_save(1,accounts(1),1300,0);


        let save_result = contract.get_save(1);

        // Assert that the result is Some(Save)
        assert_eq!(save_result.account_id, accounts(1));

        assert_eq!(save_result.is_transfer, false);

        let savers = contract.get_total_savers();

        assert_eq!(savers, 2);

        let save_amount_1:u128= 200;
        let save_start_1: u128 = 1300;
        let save_end_1: u128 = 1600;
        let account_id_1 = env::predecessor_account_id();
        let user_1 = account_id_1.clone();

        let save_amount_yocto_1 = save_amount_1.checked_mul(NEAR_TO_YOCTO).expect("Overflow in conversion");

        testing_env!(context
            .storage_usage(env::storage_usage())
            .attached_deposit(MINT_STORAGE_COST + save_amount_yocto_1.clone())
            .predecessor_account_id(account_id.clone())
            .build());

        let token_id = "2".to_string();
        
        let token = contract.set_save(save_amount_1.clone(), save_start_1.clone(), save_end_1.clone());

        let result_3 = contract.get_save(2);

        // Assert that the result is Some(Save)
        assert_eq!(result_3.save_amount, save_amount_yocto_1);

        assert_eq!(token.token_id, token_id);
        assert_eq!(token.owner_id.to_string(), account_id.to_string());
        assert_eq!(token.approved_account_ids.unwrap(), HashMap::new());

        let saves = contract.get_all_saves_for_account(user_1.clone());

        assert_eq!(vec![result_3.clone()], saves);


        contract.request_transfer(2);

        let save_result_1 = contract.get_save(2);

        // Assert that the result is Some(Save)
       

        let save_transfered = contract.get_all_transfer_requests_for_account(user_1.clone());

        assert_eq!(vec![save_result_1.clone()], save_transfered);



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