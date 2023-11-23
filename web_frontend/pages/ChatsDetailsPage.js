import React from "react";


import ChatsDetailsLayout from "../components/layouts/ChatsDetailsLayout";
import ChatsDetails from "../components/sections/ChatsDetails";


export default function ChatsDetailsPage({ isSignedIn, wallet , contractId}) {
  return (
    <ChatsDetailsLayout isSignedIn={isSignedIn} wallet={wallet} contractId={contractId}>
        <ChatsDetails isSignedIn={isSignedIn} wallet={wallet} contractId={contractId} />
    </ChatsDetailsLayout>
  );
}