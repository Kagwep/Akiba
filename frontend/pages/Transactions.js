import React from "react";


import TransactionsLayout from "../components/layouts/TransactionsLayout";
import TransactionsCard from "../components/sections/TransactionsCard";


export default function Transactions({ isSignedIn, wallet ,contractId}) {
  return (
    <TransactionsLayout isSignedIn={isSignedIn} wallet={wallet}>
        <TransactionsCard isSignedIn={isSignedIn} wallet={wallet} contractId={contractId}/>
    </TransactionsLayout>
  );
}