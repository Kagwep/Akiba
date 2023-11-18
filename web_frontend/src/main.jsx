import React, { Suspense } from 'react'
import ReactDOM from 'react-dom'
import './assets/css/tailwind.css'
import App from './App'
import { SidebarProvider } from './context/SidebarContext'
import ThemedSuspense from './components/ThemedSuspense'
import { Windmill } from '@windmill/react-ui'
import {AkibaProvider} from './context/AkibaContext'
import { BrowserRouter } from "react-router-dom";

// NEAR
import { Wallet } from "./near-wallet";


const CONTRACT_ADDRESS = "akiba1.testnet";

// ReactDOM.render(
//   <AkibaProvider>
//     <SidebarProvider>
//       <Suspense fallback={<ThemedSuspense />}>
//         <Windmill usePreferences>
//           <App />
//         </Windmill>
//       </Suspense>
//     </SidebarProvider>
//   </AkibaProvider>,
//   document.getElementById('root')
// )


// When creating the wallet you can optionally ask to create an access key
// Having the key enables to call non-payable methods without interrupting the user to sign
const wallet = new Wallet({ createAccessKeyFor: CONTRACT_ADDRESS });
// Abstract the logic of interacting with the contract to simplify your flow


window.nearwallet = wallet;
window.contractId = process.env.CONTRACT_NAME;

// Setup on page load
window.onload = async () => {
  const isSignedIn = await wallet.startUp();
  const container = document.getElementById("root");
  const root = createRoot(container); // createRoot(container!) if you use TypeScript
  window.walletisSignedIn = isSignedIn

  root.render(
    
    <BrowserRouter>
    <SidebarProvider>
      <Suspense fallback={<ThemedSuspense />}>
        <Windmill usePreferences>
          <App 
          
          isSignedIn={isSignedIn}
          contractId={CONTRACT_ADDRESS}
          wallet={wallet}
          />
        </Windmill>
      </Suspense>
    </SidebarProvider>
    </BrowserRouter>
  );
};