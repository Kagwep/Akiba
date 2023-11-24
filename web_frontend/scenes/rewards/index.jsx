import React,{useState,useEffect} from 'react';
import { Box,Typography } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import { mockDataContacts } from "../../data/mockData";
import Header from "../../components/Header";
import { useTheme } from "@mui/material";
import SwipeRightAltIcon from '@mui/icons-material/SwipeRightAlt';
import { IconButton } from "@mui/material";

const Rewards = ({ isSignedIn, contractId, wallet }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const columns = [
    { field: "reward_id", headerName: "Reward ID", flex: 1 },
    {
      field: "account_id",
      headerName: "Account ID",
      flex: 1,
      cellClassName: "name-column--cell",
    },
    {
      field: "reward_type",
      headerName: "Reward Type",
      flex: 1,
      // You might want to format the date here as needed
      // For example: new Date(params.row.save_start).toLocaleDateString()
    },
  ];

  const [rewards, setRewards] = useState([]);

  useEffect(() => {
    getRewards().then(setRewards);
  }, []);

  function getRewards() {
    
    const account_id = wallet.accountId;
    return wallet.viewMethod({ method: "get_all_rewards_for_account", args: {account_id:account_id}, contractId });

  }

  console.log(rewards);

  const transfersWithId = rewards.map((reward) => {
    const formattedReward = {
      ...reward,
      id: reward.reward_id.toString(),
    };
  
    return formattedReward;
  });
  

  return (
    <Box m="20px">
      <Header
        title="Transfers"
        subtitle="transfer save"
      />
      <Box
        m="40px 0 0 0"
        height="75vh"
        sx={{
          "& .MuiDataGrid-root": {
            border: "none",
          },
          "& .MuiDataGrid-cell": {
            borderBottom: "none",
          },
          "& .no-border-bottom": {
            borderBottom: "none !important",
          },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: colors.blueAccent[700],
            borderBottom: "none",
          },
          "& .MuiDataGrid-virtualScroller": {
            backgroundColor: colors.primary[400],
          },
          "& .MuiDataGrid-footerContainer": {
            borderTop: "none",
            backgroundColor: colors.blueAccent[700],
          },
          "& .MuiCheckbox-root": {
            color: `${colors.greenAccent[200]} !important`,
          },
          "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
            color: `${colors.grey[100]} !important`,
          },
        }}
      >
        <DataGrid
          rows={transfersWithId}
          columns={columns}
          components={{ Toolbar: GridToolbar }}
        />
      </Box>
    </Box>
  );
};

export default  Rewards;
