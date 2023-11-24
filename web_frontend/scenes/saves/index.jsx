import React,{useState,useEffect} from 'react';
import { Box, Typography, useTheme } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import { mockDataInvoices } from "../../data/mockData";
import Header from "../../components/Header";
import TransferWithinAStationOutlinedIcon from "@mui/icons-material/TransferWithinAStationOutlined";
import MoneyOffOutlinedIcon from "@mui/icons-material/MoneyOffOutlined";
import { IconButton } from "@mui/material";


const Saves = ({ isSignedIn, contractId, wallet }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [saves, setSaves] = useState([]);
  const columns = [
    { field: "save_id", headerName: "Save ID", flex: 1 },
    {
      field: "account_id",
      headerName: "Account ID",
      flex: 1,
      cellClassName: "name-column--cell",
    },
    {
      field: "save_amount",
      headerName: "Amount",
      flex: 1,
      renderCell: (params) => (
        <Typography color={colors.greenAccent[500]}>
          {params.row.save_amount} NEAR
        </Typography>
      ),
    },
    {
      field: "save_start",
      headerName: "Start Date",
      flex: 1,
      // You might want to format the date here as needed
      // For example: new Date(params.row.save_start).toLocaleDateString()
    },
    {
      field: "save_end",
      headerName: "End Date",
      flex: 1,
      // Similar to start date, format this date as needed
    },
    {
      field: "transfer",
      headerName: "Transfer",
      flex: 1,
      renderCell: () => (
        <IconButton>
          <TransferWithinAStationOutlinedIcon />
        </IconButton>
      ),
    },
    {
      field: "withdraw",
      headerName: "Withdraw",
      flex: 1,
      renderCell: () => (
        <IconButton>
          <MoneyOffOutlinedIcon />
        </IconButton>
      ),
    },
  ];

  useEffect(() => {
    if (isSignedIn){
    getSaves().then((savesData) => {
      // Filter out inactive saves
      const activeSaves = savesData.filter((save) => save.is_save_active );
  
      setSaves(activeSaves);
    });
  }
  }, []);

  function getSaves() {
    
    if (isSignedIn){
    const account_id = wallet.accountId;
    return wallet.viewMethod({ method: "get_all_saves_for_account", args: {account_id:account_id}, contractId });
    } else{
      return []
    }

  }

  console.log(saves);

  const savesWithId = saves.map((save) => {
    const formattedSave = {
      ...save,
      id: save.save_id.toString(),
    };
  
    // Convert milliseconds to human-readable date for start and end dates
    formattedSave.save_start = new Date(save.save_start).toLocaleString(); // Modify date format as needed
    formattedSave.save_end = new Date(save.save_end).toLocaleString(); // Modify date format as needed
  
    return formattedSave;
  });
  

  return (
    <Box m="20px">
      <Header title="Saves" subtitle="All saves" />
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
        <DataGrid checkboxSelection rows={savesWithId} columns={columns} components={{ Toolbar: GridToolbar }}/>
      </Box>
    </Box>
  );
};

export default Saves;
