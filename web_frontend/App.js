import 'regenerator-runtime/runtime';
import React from 'react';
// import './assets/global.css';
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



// export default function App({ isSignedIn, contractId, wallet }) {
//   const [valueFromBlockchain, setValueFromBlockchain] = React.useState();

//   const [uiPleaseWait, setUiPleaseWait] = React.useState(true);

//   const [jobs, setJobs] = React.useState([]);
//   // Get blockchian state once on component load
//   React.useEffect(() => {
//     getAllClientJobs().then(setJobs);
//     }
//   , []);




//   async function getAllClientJobs() {
//     try {

//       const res = await this.wallet.viewMethod({
//         method: 'get_all_client_jobs',
//         contractId,
//       });
  
//       return res; // Return the result if it's successful
  
//     } catch (error) {
//       console.error('An error occurred while fetching client jobs:', error);
//       // Handle the error gracefully, e.g., by logging it or notifying the user
//       return { error: 'Failed to fetch client jobs' }; // Return an error object
//     }
//   }
  
  

//   console.log(jobs)


//   return (
//     <>
//       <div className='container'>

//         <Routes>
//           {/* <Route path="/" element = {<Home />} /> */}
//           <Route path="/" element = {<Landing isSignedIn={isSignedIn} wallet={wallet}/>} />
//           <Route path="/freelancer" element = {<Profile isSignedIn={isSignedIn} wallet={wallet} contractId={contractId}/>} />
//           <Route path="/jobs" element = {<Jobs isSignedIn={isSignedIn} wallet={wallet} contractId={contractId}/>} />
//           <Route path="/chats" element = {<Chats isSignedIn={isSignedIn} wallet={wallet} contractId={contractId}/>} />
//           <Route path="/transactions" element = {<Transactions isSignedIn={isSignedIn} wallet={wallet} contractId={contractId}/>} />
//           <Route path="/job/:id" element = {<JobDetailsPage isSignedIn={isSignedIn} wallet={wallet} contractId={contractId}/>} />
//           <Route path="/chat/:id" element = {<ChatsDetailsPage isSignedIn={isSignedIn} wallet={wallet} contractId={contractId}/>} />
//         </Routes>

//       </div>
//       <FooterCrypto />

//     </>
//   );
// }


function App({ isSignedIn, contractId, wallet }) {
  const [theme, colorMode] = useMode();
  const [isSidebar, setIsSidebar] = useState(true);

  const [uiPleaseWait, setUiPleaseWait] = React.useState(true);

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className="app">
          <Topbar setIsSidebar={setIsSidebar} isSignedIn={isSignedIn} wallet={wallet} contractId={contractId} />
          <main className="content" style={{ display: "flex" }}>
            {isSidebar && <Sidebar isSidebar={isSidebar} isSignedIn={isSignedIn} wallet={wallet} contractId={contractId}/>}
            <Box flexGrow={1}>
              <Routes>
                <Route path="/" element={<Dashboard isSignedIn={isSignedIn} wallet={wallet} contractId={contractId} />} />
                <Route path="/team" element={<Team isSignedIn={isSignedIn} wallet={wallet} contractId={contractId} />} />
                <Route path="/contacts" element={<Contacts isSignedIn={isSignedIn} wallet={wallet} contractId={contractId} />} />
                <Route path="/invoices" element={<Invoices isSignedIn={isSignedIn} wallet={wallet} contractId={contractId} />} />
                <Route path="/form" element={<Form isSignedIn={isSignedIn} wallet={wallet} contractId={contractId} />} />
                <Route path="/calendar" element={<Calendar />} />
                <Route path="/faq" element={<FAQ />} />
                <Route path="/bar" element={<Bar />} />
                <Route path="pie" element={<Pie />} />
                <Route path="/line" element={<Line />} />
                <Route path="/geography" element={<Geography />} />
              </Routes>
            </Box>
          </main>
        </div>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}


export default App;
