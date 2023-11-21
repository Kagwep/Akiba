import React from 'react';
import { Box, Button, IconButton, Typography, useTheme } from "@mui/material";
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

const Dashboard = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return (
    <Box m="20px">
      {/* HEADER */}
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Header title="Akiba" subtitle="Crypto Savings." />
      </Box>

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
                12,361
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
                12,361
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
                12,361
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
                12,361
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
          gridColumn="span 8"
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
                Address
              </Typography>
              <Typography
                variant="h3"
                fontWeight="bold"
                color={colors.greenAccent[500]}
              >
                $59,342.32
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
                12,361
              </Typography>
              <Typography
                variant="h5"
                fontWeight="bold"
                color={colors.greenAccent[500]}
              >
                Account Balance
              </Typography>
            </Box>
            </Box>
            
            
          </Box>
          <Box height="230px" m="-20px 0 0 0">
            <BarChart isDashboard={true} />
          </Box>
          
        </Box>
        <Box
          gridColumn="span 4"
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
          {mockTransactions.map((transaction, i) => (
            <Box
              key={`${transaction.txId}-${i}`}
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
                  {transaction.txId}
                </Typography>
                <Typography color={colors.grey[100]}>
                  {transaction.user}
                </Typography>
              </Box>
              <Box color={colors.grey[100]}>{transaction.date}</Box>
              <Box
                backgroundColor={colors.greenAccent[500]}
                p="5px 10px"
                borderRadius="4px"
              >
                ${transaction.cost}
              </Box>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default Dashboard;
