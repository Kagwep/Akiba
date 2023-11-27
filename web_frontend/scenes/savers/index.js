import React,{useState,useEffect} from 'react';
import { Box, Typography, useTheme } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import { mockDataTeam } from "../../data/mockData";
import AdminPanelSettingsOutlinedIcon from "@mui/icons-material/AdminPanelSettingsOutlined";
import LockOpenOutlinedIcon from "@mui/icons-material/LockOpenOutlined";
import SecurityOutlinedIcon from "@mui/icons-material/SecurityOutlined";
import Header from "../../components/Header";

const Savers = ({ isSignedIn, contractId, wallet }) => {
  const [savers,setSavers] = useState([]);
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const columns = [
    { field: "account_id", headerName: "Account ID", flex: 1 },
    { field: "saver_id", headerName: "Saver ID", flex: 1 },
    {
      field: "total_saves_amount",
      headerName: "Total Saves Amount(NEAR)",
      type: "number",
      flex: 1,
    },
    {
      field: "total_amount_earned",
      headerName: "Total Amount Earned(NEAR)",
      type: "number",
      flex: 1,
    },
  ];

  useEffect(() => {
  
    getSavers().then(setSavers);
    // newConnectBalance.nearConnect().then(setAccBalance);
    // viewProfile().then((data) => (setUserProfile(data)));
  //   ;

  }
  , []);

  function getSavers() {
    
		console.log(contractId)
		return wallet.viewMethod({ method: "get_all_savers", contractId});
	
	  }


  console.log(savers)

  // Assuming savers is an array of objects fetched from your API
const saversWithId = savers.map((saver) => {

  const near = "1000000000000000000000000";

  const formattedSaver = {
    ...saver,
    id: saver.saver_id.toString(),
  };

  formattedSaver.total_saves_amount = (saver.total_saves_amount/near).toFixed(5);
  formattedSaver.total_amount_earned = (saver.total_amount_earned/near).toFixed(5);

  

  return formattedSaver;

});




  return (
    <Box m="20px">
      <Header title="Savers" subtitle="All savers" />
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
          "& .MuiDataGrid-row": {
            borderBottom: "none !important",
          },
          "& .MuiCheckbox-root": {
            color: `${colors.greenAccent[200]} !important`,
          },
        }}
      >
        <DataGrid checkboxSelection rows={saversWithId} columns={columns} />
      </Box>
    </Box>
  );
};

export default Savers;


