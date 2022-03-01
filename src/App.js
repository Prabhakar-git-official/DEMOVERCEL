import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";

import Home from './components/HomePage';
import HomeV2 from './components/HomePageV2';
import HomePageBanking from './components/HomePageBanking';
import Swap from './components/Swap';
import Stake from './components/Stake';
import Stakebox from './components/Stakebox';
import Farm from './components/Farm';
import Vaults from './components/Vaults';
import Launchpad from './components/Launchpad';
import Pool from './components/Pool';
import Bridge from './components/Bridge';
import Analytics from './components/Analytics';
import Dashboard from './components/Dashboard/Dashboard';
import Bond from './components/Dashboard/Bond';
import SingleStake from './components/Dashboard/Stake';
import SwapTau from './components/Dashboard/SwapTau';
import Element from './components/Element';

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/banking">
          <HomePageBanking />
        </Route>
        <Route path="/element">
          <Element />
        </Route>
        <Route path="/single-stake">
          <SingleStake />
        </Route>
        <Route path="/swap-tau">
          <SwapTau />
        </Route>        
        <Route path="/bond">
          <Bond />
        </Route>
        <Route path="/dashboard">
          <Dashboard />
        </Route>
        <Route path="/analytics">
          <Analytics />
        </Route>
        <Route path="/bridge">
          <Bridge />
        </Route>
        <Route path="/pool">
          <Pool />
        </Route>
        <Route path="/launchpad">
          <Launchpad />
        </Route>
        <Route path="/vaults">
          <Vaults />
        </Route>
        <Route path="/farm">
          <Farm />
        </Route>
        <Route path="/stake">
          <Stake />
        </Route>
        <Route path="/stakebox">
          <Stakebox />
        </Route>
        <Route path="/swap">
          <Swap />
        </Route>
        <Route path="/app">
          <HomeV2 />
        </Route>
        <Route path="/">
          <Home />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
