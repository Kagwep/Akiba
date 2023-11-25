import React,{useState,useEffect} from 'react';
import { Box,Typography, Modal,Button,TextField,Snackbar,Alert } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import { mockDataContacts } from "../../data/mockData";
import Header from "../../components/Header";
import { useTheme } from "@mui/material";
import SwipeRightAltIcon from '@mui/icons-material/SwipeRightAlt';
import { IconButton } from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";

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

const Transfers = ({ isSignedIn, contractId, wallet }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [rewards, setRewards] = useState([]);

  const [saver_obj, setSaverObj] = useState("");
  const isNonMobile = useMediaQuery("(min-width:600px)");

  const [uiPleaseWait, setUiPleaseWait] = useState(true);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);

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
      field: "transfer_to",
      headerName: "Transfer To",
      flex: 1,
      renderCell: (params) => (
        <IconButton 
        onClick={() => {
          handleOpen();
          setSaverObj(params.row);
          }}>
          <SwipeRightAltIcon />
        </IconButton>
      ),
    },
  ];

  const [transfers, setTransfers] = useState([]);

  useEffect(() => {
    if (isSignedIn){
          getSaves().then((savesData) => {
            // Filter out inactive saves
            const activeTransfers = savesData.filter((save) => save.is_save_active && save.is_transfer );
        
            setTransfers(activeTransfers);
          });
      }
  }, []);

  function getSaves() {
    
    if (isSignedIn){
    const account_id = wallet.accountId;
    return wallet.viewMethod({ method: "get_all_transfer_requests_for_account", args: {account_id:account_id}, contractId });
    } else{
      return []
    }
  }

  console.log(transfers);

  const transfersWithId = transfers.map((save) => {
    const formattedSave = {
      ...save,
      id: save.save_id.toString(),
    };
  
    // Convert milliseconds to human-readable date for start and end dates
    formattedSave.save_start = new Date(save.save_start).toLocaleString(); // Modify date format as needed
    formattedSave.save_end = new Date(save.save_end).toLocaleString(); // Modify date format as needed
  
    return formattedSave;
  });
  

  function getRewards() {
    
    if (isSignedIn){
    const account_id = wallet.accountId;
    return wallet.viewMethod({ method: "get_all_rewards_for_account", args: {account_id:account_id}, contractId });
    } else{
      return []
    }

  }

  const handleTransferSaveAccept = (values) => {
    if (isSignedIn) {
      // Check for both conditions before submitting
      if (
        values.transferToAccount !== "" && saver_obj !== "" && saver_obj !== undefined
      ) {

  
        const presentDayMilliseconds = Date.now(); // Get present day in milliseconds


        const getFirstUnredeemedRewardId = (rewards) => {
          if (rewards.length > 0) {
            const unredeemedReward = rewards.find((reward) => !reward.redeemed);
            if (unredeemedReward) {
              return unredeemedReward.reward_id;
            }
          }
          return 0;
        };
    
    
        const firstUnredeemedRewardId = getFirstUnredeemedRewardId(rewards);

        console.log("here ",values.transferToAccount);

        wallet
          .callMethod({
            method: "transfer_save",
            args: {
              save_id: saver_obj.save_id,
              transfer_to: values.transferToAccount,
              end_date: presentDayMilliseconds,
              reward_id:firstUnredeemedRewardId,
            },
            contractId: contractId,
            deposit:1
          })
          .then(async () => {
            setShowSuccessAlert(true);
          })
          .then((savesData) => {
            // Filter out inactive saves
            const activeTransfers = savesData.filter((save) => save.is_save_active && save.is_transfer );
        
            setTransfers(activeTransfers);
          })
          .finally(() => {
            setUiPleaseWait(false);
            handleClose();
          });

      } else {
        console.log("Form is invalid");
        // Optionally, display error messages or prevent submission
      }
    } else {
      setShowAlert(true); // Show alert if not signed in
    }
  };

  console.log("The obj",saver_obj);

  const handleCloseAlert = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setShowSuccessAlert(false);
  };


  return (
    <Box m="20px">
      <Header
        title="Transfers"
        subtitle="transfer save"
      />
      <Snackbar
        open={showSuccessAlert}
        autoHideDuration={6000}
        onClose={handleCloseAlert}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
      >
        <Alert onClose={handleCloseAlert} severity="success">
          Save added successfully!
        </Alert>
      </Snackbar>
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
      <Modal
        open={open}
        onClose={
          ()=> {
            handleClose();
            setSaverObj("");
          }
        }
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Transfer to
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }} color="green">
            Please make sure the account Id is correct.
            <Typography color="red">  This process is not reversable</Typography>
          </Typography>
          <Formik
        onSubmit={handleTransferSaveAccept}
        initialValues={initialValues}
        validationSchema={checkoutSchema}
      >
        {({
          values,
          errors,
          touched,
          handleBlur,
          handleChange,
          handleSubmit,
        }) => (
          <form onSubmit={handleSubmit}>
            <Box
              display="grid"
              gap="30px"
              gridTemplateColumns="repeat(4, minmax(0, 1fr))"
              sx={{
                "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
              }}
            >
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Account Id"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.transferToAccount} // Corrected property name
                name="transferToAccount"
                error={!!touched.transferToAccount && !!errors.transferToAccount}
                helperText={touched.transferToAccount && errors.transferToAccount}
                sx={{ gridColumn: "span 3" }}
              />

            </Box>
            <Box display="flex" justifyContent="end" mt="20px">
              <Button type="submit" color="secondary" variant="contained">
                Submit
              </Button>
            </Box>
          </form>
        )}
      </Formik>
        </Box>
      </Modal>
    </Box>
  );
};

const checkoutSchema = yup.object().shape({
  transferToAccount: yup
    .string()
    .required("required")
    .test(
      "validAccount",
      "Invalid account format. It should end with '.testnet' or '.near' (e.g., 'user.testnet', 'user.near')",
      (value) =>
        /^(?=.*(\.testnet|\.near))(?!.*\s).*$/.test(value)
    ),
});

const initialValues = {
  transferToAccount: "",
 
};

export default Transfers;
