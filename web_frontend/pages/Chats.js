import React from "react";


import ChatsLayout from "../components/layouts/ChatsLayout";
import MessagesCard from "../components/sections/Message";


export default function Chats({ isSignedIn, wallet , contractId}) {
  return (
    <ChatsLayout isSignedIn={isSignedIn} wallet={wallet} contractId={contractId}>
        <MessagesCard isSignedIn={isSignedIn} wallet={wallet} contractId={contractId}/>
    </ChatsLayout>
  );
}