import React,{useState,useEffect} from 'react';
import { Box, Button, TextField, Snackbar,Alert} from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../components/Header";
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { utils } from 'near-api-js';

const Save = ({ isSignedIn, contractId, wallet }) => {
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const [selectedDate, setSelectedDate] = useState(null);
  const [showAlert, setShowAlert] = useState(false);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);

  const handleFormSubmit = (values) => {
    if (isSignedIn) {
      // Check for both conditions before submitting
      if (
        values.saveAmount !== 0 &&
        values.saveAmount !== "" &&
        !selectedDate.isSame(presentDate, 'day')
      ) {
        const saveEndMilliseconds = selectedDate.valueOf(); // Get selectedDate in milliseconds
        const saveAmountInt = parseInt(values.saveAmount, 10); 
  
        const presentDayMilliseconds = Date.now(); // Get present day in milliseconds

        const yoctoNearValue = 6140000000000000000000;
        const nearValue = yoctoNearValue / Math.pow(10, 24);

        const deposit = saveAmountInt + nearValue;

       
        const depositStr = deposit.toString();
        const to_deposit = utils.format.parseNearAmount(depositStr);

        console.log("The deposit is",to_deposit);

        wallet
          .callMethod({
            method: "set_save",
            args: {
              save_amount: saveAmountInt,
              save_start: presentDayMilliseconds,
              save_end: saveEndMilliseconds,
            },
            contractId: contractId,
            deposit: to_deposit
          })
          .then(async () => {
            setShowSuccessAlert(true);
          })
          .then(setSaves)
          .finally(() => {
            setUiPleaseWait(false);
          });

      } else {
        console.log("Form is invalid");
        // Optionally, display error messages or prevent submission
      }
    } else {
      setShowAlert(true); // Show alert if not signed in
    }
  };

  const handleCloseAlert = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setShowAlert(false);
    setShowSuccessAlert(false);
  };
  const presentDate = new Date(); // Get present day

  return (
    <Box m="20px">
      <Header title="Add Save" subtitle="" />
      <Snackbar
        open={showAlert}
        autoHideDuration={6000}
        onClose={handleCloseAlert}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseAlert} severity="warning" >
          Please sign in to submit!
        </Alert>
      </Snackbar>
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
      <Formik
        onSubmit={handleFormSubmit}
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
          setFieldValue,
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
                type="number"
                label="Save Amount"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.saveAmount} // Corrected property name
                name="saveAmount"
                error={!!touched.saveAmount && !!errors.saveAmount}
                helperText={touched.saveAmount && errors.saveAmount}
                sx={{ gridColumn: "span 2" }}
              />
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DemoContainer components={['DatePicker']}>
                <DatePicker
                label="Withdrawal Date"
                value={selectedDate} // Pass selectedDate as the value
                onChange={(date) => {
                  setSelectedDate(date);
                  setFieldValue("saveEnd", date); // Update form value for saveEnd
                }}
                disablePast
                />
              </DemoContainer>
            </LocalizationProvider>
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
  );
};

const phoneRegExp =
  /^((\+[1-9]{1,4}[ -]?)|(\([0-9]{2,3}\)[ -]?)|([0-9]{2,4})[ -]?)*?[0-9]{3,4}[ -]?[0-9]{3,4}$/;

const checkoutSchema = yup.object().shape({
  saveAmount: yup.number().required("required"),
  saveEnd: yup.string().required("required"),
});
const initialValues = {
  saveAmount: 0,
  saveEnd: "",
};

export default Save;