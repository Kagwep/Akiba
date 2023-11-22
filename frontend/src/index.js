import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import App from './App';
import { Wallet } from "./near-wallet";




const CONTRACT_ADDRESS = "akiba1.testnet";

const wallet = new Wallet({ createAccessKeyFor: CONTRACT_ADDRESS });

window.nearwallet = wallet;
window.contractId = process.env.CONTRACT_NAME;

// ReactDOM.render(
//   <Router>
//     <App />
//   </Router>,
//   document.getElementById('root')
// );
// Polyfill for Buffer in the browser

// Setup on page load
window.onload = async () => {
  const isSignedIn = await wallet.startUp();
  const container = document.getElementById("root");
  const root = createRoot(container); // createRoot(container!) if you use TypeScript
  window.walletisSignedIn = isSignedIn

  root.render(
     <Router>
      <App
        isSignedIn={isSignedIn}
        contractId={CONTRACT_ADDRESS}
        wallet={wallet}
      />
    </Router>
  );
};