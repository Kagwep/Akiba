import 'regenerator-runtime/runtime';
import React from 'react';
// import './assets/global.css';
import {Route,Routes} from 'react-router-dom'


import { Box } from "@mui/material";
import Savers from "./scenes/savers";
import { useState } from "react";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { ColorModeContext, useMode } from "./theme";
import { Routes, Route } from "react-router-dom";
import Topbar from "./scenes/global/Topbar";
import Dashboard from "./scenes/dashboard";
import Save from "./scenes/save";
import Sidebar from "./scenes/global/Sidebar";
import Saves from "./scenes/saves";
import Rewards from "./scenes/rewards";
import Calendar from "./scenes/calendar";
import FAQ from "./scenes/faq";
import Bar from "./scenes/bar";
import Pie from "./scenes/Pie";
import Line from "./scenes/line";
import Geography from "./scenes/geography";
import Main from "./scenes/main";
import Transfers from './scenes/transfers';




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
                <Route path="/savers" element={<Savers isSignedIn={isSignedIn} wallet={wallet} contractId={contractId} />} />
                <Route path="/save" element={<Save isSignedIn={isSignedIn} wallet={wallet} contractId={contractId} />} />
                <Route path="/transfers" element={<Transfers isSignedIn={isSignedIn} wallet={wallet} contractId={contractId} />} />
                <Route path="/saves" element={<Saves isSignedIn={isSignedIn} wallet={wallet} contractId={contractId} />} />
                <Route path="/rewards" element={<Rewards isSignedIn={isSignedIn} wallet={wallet} contractId={contractId} />} />
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
