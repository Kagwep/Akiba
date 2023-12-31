import React,{useState,useEffect} from 'react';
import { Box, Button, IconButton, Typography, useTheme, Modal,TextField } from "@mui/material";
import { tokens } from "../../theme";
import { mockTransactions } from "../../data/mockData";
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import EmailIcon from "@mui/icons-material/Email";
import PointOfSaleIcon from "@mui/icons-material/PointOfSale";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import TrafficIcon from "@mui/icons-material/Traffic";
import Header from "../../components/Header";
import LineChart from "../../components/LineChart";
import GeographyChart from "../../components/GeographyChart";
import BarChart from "../../components/BarChart";
import StatBox from "../../components/StatBox";
import ProgressCircle from "../../components/ProgressCircle";
import MainChart from "../../components/MainChart";
import PeopleIcon from '@mui/icons-material/People';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import SavingsIcon from '@mui/icons-material/Savings';
import PeopleOutlineIcon from '@mui/icons-material/PeopleOutline';
import WalletIcon from '@mui/icons-material/Wallet';
import * as nearAPI from "near-api-js";
import { utils } from 'near-api-js';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import { styled } from '@mui/material/styles';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};


const Dashboard = ({ isSignedIn, contractId, wallet }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [total_savers,setTotalSavers] = useState(0);
  const [savers,setSavers] = useState(0);
	const [uiPleaseWait, setUiPleaseWait] = useState(true);
  const [total_earnings,setTotalEarnings] = useState(0);
  const [total_amount_saved,setTotalAmountSaved] = useState(0);
  const [bal, setBalance] = useState("");
  const [saves, setSaves] = useState([]);
  const [saver, setSaver] = useState("");
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [amount, setAmount] = useState('');
  const [account_id, setAcoountID] = useState([]);

  const { keyStores } = nearAPI;
  const { connect } = nearAPI;
  const myKeyStore = new keyStores.BrowserLocalStorageKeyStore();

  useEffect(() => {
  
    getTotalSavers().then(setTotalSavers);
    getTotalEarnings().then(setTotalEarnings);
    getSavers().then(setSavers);
   
    


    // newConnectBalance.nearConnect().then(setAccBalance);
    // viewProfile().then((data) => (setUserProfile(data)));
  //   ;

    async function handleAccount() {
      try {
        // Check if the user is signed in
        if (isSignedIn) {
          // Perform the asynchronous action
          const nearConnection = await connect(connectionConfig);
          const account = await nearConnection.account(wallet.accountId);
          const balance = await account.getAccountBalance();
          const the_account = wallet.accountId;
          setAcoountID(the_account);
          setBalance(balance);
          getSaves().then((savesData) => {
            // Sort saves in descending order based on ID
            savesData.sort((a, b) => b.save_id - a.save_id);
        
            // Extract all saves except the latest ten
            const firstTenSaves = savesData.slice(0, 10);
        
            setSaves(firstTenSaves); // Set the remaining saves except the latest ten
        });
        getSaver().then(setSaver);
        
          // console.log("alas",balance);
          
          // const account_details = await account.getAccountDetails();
          // console.log(account_details);
          // You can add further logic here based on the result
        } else {
          console.log('User is not signed in.');
        }
      } catch (error) {
        // Handle any errors here
        console.error('Error performing async action:', error);
      }
    }
    handleAccount();
  }
  , [isSignedIn,wallet]);

  function getTotalSavers() {
		return wallet.viewMethod({ method: "get_total_savers", contractId});
	
	  }

  console.log(total_savers);

  function getTotalEarnings() {
		
		return wallet.viewMethod({ method: "get_total_earnings", contractId});
	
	  }

    console.log(total_earnings);

    function getSavers() {
      return wallet.viewMethod({ method: "get_all_savers", contractId});
    
      }

      // function getSaver() {
      //   console.log(contractId)
      //   return wallet.viewMethod({ method: "get_all_savers", contractId});
      
      //   }

      console.log(total_amount_saved);
     

      const connectionConfig = {

        networkId: "testnet",
        keyStore: myKeyStore,
        nodeUrl: "https://rpc.testnet.near.org",
        walletUrl: "https://wallet.testnet.near.org",
        helperUrl: "https://helper.testnet.near.org",
        explorerUrl: "https://explorer.testnet.near.org",
      };
    
    
      
      const near = "1000000000000000000000000";

      const total_amount = Array.isArray(savers) && savers.length > 0
        ? savers.reduce((sum, current) => sum + (current.total_saves_amount || 0), 0)
        : 0;

      console.log("object is?",total_amount);

      console.log(saves);

      function getSaves() {
    
        if (isSignedIn){
        const account_id = wallet.accountId;
        return wallet.viewMethod({ method: "get_all_saves_for_account", args: {account_id:account_id}, contractId });
        }else{
          return []
        }
      }
  
      async function getSaver() {
        try {
          if (isSignedIn) {
            const account_id = wallet.accountId;
            const result = await wallet.viewMethod({ method: "get_saver", args: { account_id: account_id }, contractId });
            return result;
          } else {
            return "";
          }
        } catch (error) {
          console.error("Error fetching saver:", error);
          return ""; // Return an empty string or handle the error accordingly
        }
      }
      



      function checkAndDisburse() {
        return wallet.callMethod({ method: "check_and_disburse", contractId });
      }

      const handleWithdraw = (amount) => {
        // Your logic to trigger the withdraw method with the specified amount
        console.log(`Withdraw method called with amount: ${amount}`);
        // Call the withdraw method with the specified amount or perform actions accordingly

        if (saver.total_amount_earned > 0){

          wallet
          .callMethod({
            method: "withdraw_earnings",
            args: {
              amount: amount,
            },
            contractId: contractId
          })
          .then(async () => {
            setShowSuccessAlert(true);
          })
          .finally(() => {
            setUiPleaseWait(false);
          });
        } 

      };

      const handleSubmit = () => {
        // Call the withdraw function with the entered amount
        handleWithdraw(amount);
        handleClose();
      };

    
      const disburse = () => {

        if (isSignedIn){

          const account_id = wallet.accountId;
          
            if (account_id == "akiba1.testnet"){
              checkAndDisburse();
            }

          }
        
      };

  return (
    <Box m="20px">
      {/* HEADER */}
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Header title="Akiba" subtitle="Crypto Savings." />
      </Box>
      
      {account_id === "akiba3.testnet" && (
        <Button variant="contained" color="primary" onClick={disburse}>
          Check Disburse
        </Button>
      )}

      {/* GRID & CHARTS */}
      <Box
        display="grid"
        gridTemplateColumns="repeat(12, 1fr)"
        gridAutoRows="140px"
        gap="20px"
      >
        {/* ROW 1 */}
        <Box
          gridColumn="span 3"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <Box>
              <PeopleIcon
                sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
              />
              <Typography
                variant="h3"
                fontWeight="600"
                color={colors.grey[100]}
              >
                {total_savers}
              </Typography>
              <Typography
                variant="h5"
                fontWeight="bold"
                color={colors.greenAccent[500]}
              >
                Total Savers
              </Typography>
          </Box>
        </Box>
        <Box
          gridColumn="span 3"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <Box>
              <SavingsIcon
                sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
              />
              <Typography
                variant="h3"
                fontWeight="600"
                color={colors.grey[100]}
              >
                <div>
                {(total_amount/near).toFixed(5)}
                </div>
              </Typography>
              <Typography
                variant="h5"
                fontWeight="bold"
                color={colors.greenAccent[500]}
              >
                Akiba Account Balance
              </Typography>
            </Box>
        </Box>
        <Box
          gridColumn="span 3"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <Box>
              <AccountBalanceWalletIcon
                sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
              />
              <Typography
                variant="h3"
                fontWeight="600"
                color={colors.grey[100]}
              >
                {(total_earnings/near).toFixed(5)}
              </Typography>
              <Typography
                variant="h5"
                fontWeight="bold"
                color={colors.greenAccent[500]}
              >
                Akiba Earnings Balance
                
              </Typography>
              
            </Box>
        </Box>
        <Box
          gridColumn="span 3"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <Box>
              <PeopleOutlineIcon
                sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
              />
              <Typography
                variant="h3"
                fontWeight="600"
                color={colors.grey[100]}
              >
                {total_savers}
              </Typography>
              <Typography
                variant="h5"
                fontWeight="bold"
                color={colors.greenAccent[500]}
              >
                Active Saves
              </Typography>
          </Box>
        </Box>

        {/* ROW 2 */}
        <Box
          gridColumn="span 6"
          gridRow="span 2"
          backgroundColor={colors.primary[400]}
        >
          <Box
            mt="25px"
            p="0 30px"
            display="flex "
            justifyContent="space-between"
            alignItems="center"
          >
            <Box>
              <Typography
                variant="h5"
                fontWeight="600"
                color={colors.grey[100]}
              >
                Account
              </Typography>
              <Typography
                variant="h3"
                fontWeight="bold"
                color={colors.greenAccent[500]}
              >
                {isSignedIn ? (
                  <>
                      {wallet.accountId}
                  </>
                  ) : (
                    <>
                      <small>not signed in.</small>
                    </>
                    
                  )}
              </Typography>
              <Box
              mt="25px"
              
              >
              <WalletIcon
                sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
              />
              <Typography
                variant="h3"
                fontWeight="600"
                color={colors.grey[100]}
              >
               {isSignedIn ? (
                  <>
                      {(bal.available/near).toFixed(5)}  NEAR
                  </>
                  ) : (
                    <>
                      <small>...</small>
                    </>
                    
                  )}
              </Typography>
              <Typography
                variant="h5"
                fontWeight="bold"
                color={colors.greenAccent[500]}
              >
                Account Balance
              </Typography>
            </Box>
            <Box
              mt="25px"
              
              >
              <WalletIcon
                sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
              />
              <Typography
                variant="h3"
                fontWeight="600"
                color={colors.grey[100]}
              >
              {isSignedIn ? (
                  <>
                      
                      <Stack direction="row" spacing={3}>
                
                      {!isNaN(saver.total_amount_earned) && !isNaN(near) ? (
                          `${(saver.total_amount_earned / near).toFixed(5)} NEAR`
                        ) : (
                          '0.0000 NEAR'
                        )}

                      <Button variant="contained" color="primary" onClick={ handleOpen} >
                                  Withdraw {/* Display the default amount or provide a value */}
                      </Button>
                      </Stack>
                  </>
                  ) : (
                    <>
                      <small>...</small>
                    </>
                    
                  )}
              </Typography>
              <Typography
                variant="h5"
                fontWeight="bold"
                color={colors.greenAccent[500]}
              >
                Your Earnings
              </Typography>
            </Box>
            </Box>
            
            
          </Box>

          
          <Box height="230px" m="-20px 0 0 0">
            <BarChart isDashboard={true} />
          </Box>
          
        </Box>
        <Box
          gridColumn="span 6"
          gridRow="span 2"
          backgroundColor={colors.primary[400]}
          overflow="auto"
        >
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            borderBottom={`4px solid ${colors.primary[500]}`}
            colors={colors.grey[100]}
            p="15px"
          >
            <Typography color={colors.grey[100]} variant="h5" fontWeight="600">
              Recent Transactions
            </Typography>
          </Box>
          {saves.map((save, i) => (
            <Box
              key={`${save.save_id}-${i}`}
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              borderBottom={`4px solid ${colors.primary[500]}`}
              p="15px"
            >
              <Box>
                <Typography
                  color={colors.greenAccent[500]}
                  variant="h5"
                  fontWeight="600"
                >
                  {/* {transaction.txId} */}
                </Typography>
                <Typography color={colors.grey[100]}>
                  {save.account_id}
                </Typography>
              </Box>
              <Box color={colors.grey[100]}>{new Date(save.save_end).toLocaleString()}</Box>
              <Box
                backgroundColor={colors.greenAccent[500]}
                p="5px 10px"
                borderRadius="4px"
              >
                {(save.save_amount/near).toFixed(5)} NEAR
              </Box>
            </Box>
          ))}
        </Box>
      </Box>
      <Modal
        open={open}
        onClose={
          ()=> {
            handleClose();
          }
        }
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Amount
            
          </Typography>
          
          <Typography>
          {isNaN(saver.total_amount_earned) || saver.total_amount_earned <= 0 ? (
          <Typography color="red"> No amount to withdraw </Typography>
        ) : (
          <div>
            <TextField
              type='number'
              label="Enter Amount"
              variant="outlined"
              fullWidth
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              sx={{ mt: 2 }}
            />
            <Button
              variant="contained"
              color="primary"
              onClick={handleSubmit}
              sx={{ mt: 2 }}
            >
              Withdraw
            </Button>
          </div>
        )}
      </Typography>

        </Box>
      </Modal>

    </Box>
  );
};

export default Dashboard;
