import React from "react";




import JobsLayout from "../components/layouts/JobsLayout";
import JobList from "../components/sections/JobsList";


export default function Jobs({ isSignedIn, wallet , contractId}) {
  return (
    <JobsLayout isSignedIn={isSignedIn} wallet={wallet}>
        <JobList isSignedIn={isSignedIn} wallet={wallet} contractId={contractId}/>
    </JobsLayout>
  );
}