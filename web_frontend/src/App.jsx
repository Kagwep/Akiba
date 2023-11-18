import React, { lazy } from 'react'
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom'
import AccessibleNavigationAnnouncer from './components/AccessibleNavigationAnnouncer'

const Layout = lazy(() => import('./containers/Layout'))


function App({ isSignedIn, contractId, wallet }) {
  return (
    <>
      <Router>

        <AccessibleNavigationAnnouncer />
        <Switch>
          <Route
           path="/"
           render={(props) => (
            <Layout
              {...props}
              isSignedIn={isSignedIn}
              contractId={contractId}
              wallet={wallet}
            />
          )} 
           />
        </Switch>
      </Router>
    </>
  )
}

export default App
