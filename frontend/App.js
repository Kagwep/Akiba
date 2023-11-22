import 'regenerator-runtime/runtime';
import React from 'react';
import './assets/global.css';
import {Route,Routes} from 'react-router-dom'
import Landing from "./pages/Landing";
import FooterCrypto from "./components/sections/Footer"
import Profile from './pages/Profile';
import Jobs from "./pages/Jobs";
import Chats from "./pages/Chats";
import Transactions from "./pages/Transactions"
import JobDetailsPage from "./pages/JobDetails"
import ChatsDetailsPage from './pages/ChatsDetailsPage';

import { Box } from "@mui/material";
import Team from "./scenes/team";
import { useState } from "react";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { ColorModeContext, useMode } from "./theme";
import { Routes, Route } from "react-router-dom";
import Topbar from "./scenes/global/Topbar";
import Dashboard from "./scenes/dashboard";
import Contacts from "./scenes/contacts";
import Sidebar from "./scenes/global/Sidebar";
import Invoices from "./scenes/invoices";
import Form from "./scenes/form";
import Calendar from "./scenes/calendar";
import FAQ from "./scenes/faq";
import Bar from "./scenes/bar";
import Pie from "./scenes/Pie";
import Line from "./scenes/line";
import Geography from "./scenes/geography";
import Main from "./scenes/main";



export default function App({ isSignedIn, contractId, wallet }) {
  const [valueFromBlockchain, setValueFromBlockchain] = React.useState();

  const [uiPleaseWait, setUiPleaseWait] = React.useState(true);

  const [jobs, setJobs] = React.useState([]);
  // Get blockchian state once on component load
  React.useEffect(() => {
    getAllClientJobs().then(setJobs);
    }
  , []);




  async function getAllClientJobs() {
    try {

      const res = await this.wallet.viewMethod({
        method: 'get_all_client_jobs',
        contractId,
      });
  
      return res; // Return the result if it's successful
  
    } catch (error) {
      console.error('An error occurred while fetching client jobs:', error);
      // Handle the error gracefully, e.g., by logging it or notifying the user
      return { error: 'Failed to fetch client jobs' }; // Return an error object
    }
  }
  
  

  console.log(jobs)


  return (
    <>
      <div className='container'>

        <Routes>
          {/* <Route path="/" element = {<Home />} /> */}
          <Route path="/" element = {<Landing isSignedIn={isSignedIn} wallet={wallet}/>} />
          <Route path="/freelancer" element = {<Profile isSignedIn={isSignedIn} wallet={wallet} contractId={contractId}/>} />
          <Route path="/jobs" element = {<Jobs isSignedIn={isSignedIn} wallet={wallet} contractId={contractId}/>} />
          <Route path="/chats" element = {<Chats isSignedIn={isSignedIn} wallet={wallet} contractId={contractId}/>} />
          <Route path="/transactions" element = {<Transactions isSignedIn={isSignedIn} wallet={wallet} contractId={contractId}/>} />
          <Route path="/job/:id" element = {<JobDetailsPage isSignedIn={isSignedIn} wallet={wallet} contractId={contractId}/>} />
          <Route path="/chat/:id" element = {<ChatsDetailsPage isSignedIn={isSignedIn} wallet={wallet} contractId={contractId}/>} />
        </Routes>

      </div>
      <FooterCrypto />

    </>
  );
}