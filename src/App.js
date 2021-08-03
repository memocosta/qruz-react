import React from 'react';
import {
  BrowserRouter,
  Route,
  Switch
} from "react-router-dom";
import ApolloClient from 'apollo-client';
import { createUploadLink } from 'apollo-upload-client'
import { ApolloProvider } from "@apollo/react-hooks";
import { InMemoryCache } from 'apollo-cache-inmemory';
import { resolvers, typeDefs } from "./resolvers";

import Header from './Components/Header'
import QruzLogin from './Components/Roles/QruzMemberLogin'
import PartnerLogin from './Components/Partners/PartnerLogin'
import PasswordRest from './Components/PasswordReset'
import Home from './Components/Home'
import Dashboard from './Components/Dashboard'
import RoleNavigator from './Components/Roles/Navigator'
import Archive from './Components/Archive'
import Communication from './Components/Communication'
import PromoCodes from './Components/PromoCodes'
import QruzCommute from './Components/QruzCommute'
import QruzOnDemand from './Components/QruzOnDemand'
import FleetNavigator from './Components/Fleets/Navigator'
import FleetDetail from './Components/Fleets/FleetDetail'
import VehicleDetail from './Components/Fleets/VehicleDetail'
import DriverDetail from './Components/Fleets/DriverDetail'
import Payments from './Components/Payments'
import Cancellation from './Components/Cancellation'
import Settings from './Components/Settings'
import PartnerDetail from './Components/Partners/PartnerDetail'
import NotFound from './Components/NotFound'
import PartnerList from './Components/Partners/PartnerList';
import PartnerTripDetail from './Components/Partners/PartnerTripDetail';
import PartnerAssignedDrivers from './Components/Partners/PartnerAssignedDrivers'
import PartnerUsers from './Components/Partners/PartnerUsers'
import PartnerTrips from './Components/Partners/PartnerTrips'
import PartnerArchives from './Components/Partners/PartnerArchives'

const token = localStorage.getItem('token');
const cache = new InMemoryCache();
const client = new ApolloClient({
  cache,
  link: createUploadLink({
    uri: "http://qruz-admin-dashboard-api.herokuapp.com/graphql",
    // uri: "http://127.0.0.1:8000/graphql",
    headers: {
      authorization: token ? `Bearer ${token}` : ""
    }
  }),
  typeDefs,
  resolvers
});
cache.writeData({
  data: {
    isLoggedIn: !!localStorage.getItem("token"),
    name: localStorage.getItem("name"),
    dashboardPerm: localStorage.getItem("dashboard") === "false" ? false : localStorage.getItem("dashboard"),
    rolesPerm: localStorage.getItem("roles") === "false" ? false : localStorage.getItem("roles"),
    archivePerm: localStorage.getItem("archive") === "false" ? false : localStorage.getItem("archive"),
    communicationPerm: localStorage.getItem("communication") === "false" ? false : localStorage.getItem("communication"),
    promocodesPerm: localStorage.getItem("promocodes") === "false" ? false : localStorage.getItem("promocodes"),
    businessPerm: localStorage.getItem("business") === "false" ? false : localStorage.getItem("business"),
    commutePerm: localStorage.getItem("commute") === "false" ? false : localStorage.getItem("commute"),
    ondemandPerm: localStorage.getItem("ondemand") === "false" ? false : localStorage.getItem("ondemand"),
    fleetPerm: localStorage.getItem("fleet") === "false" ? false : localStorage.getItem("fleet"),
    paymentPerm: localStorage.getItem("payment") === "false" ? false : localStorage.getItem("payment"),
    cancellationPerm: localStorage.getItem("cancellation") === "false" ? false : localStorage.getItem("cancellation"),
    partnerID: localStorage.getItem("partnerID")
  }
});

function App() {
  return (
    <ApolloProvider client={client}>
      <BrowserRouter>
        <Header />
        <div className="container wrapper">
          <Switch>
            <Route exact path="/qruz/login" component={QruzLogin} />
            <Route exact path="/partners/login" component={PartnerLogin} />
            <Route exact path="/" component={Home} />
            <Route exact path="/password/reset/:token" component={PasswordRest} />
            <Route exact path="/dashboard" component={Dashboard} />
            <Route exact path="/roles" component={RoleNavigator} />
            <Route exact path="/archive" component={Archive} />
            <Route exact path="/communication" component={Communication} />
            <Route exact path="/promocodes" component={PromoCodes} />
            <Route exact path="/business" component={PartnerList} />
            <Route exact path="/commute" component={QruzCommute} />
            <Route exact path="/ondemand" component={QruzOnDemand} />
            <Route exact path="/fleets" component={FleetNavigator} />
            <Route exact path="/fleets/:fleetID/view" component={FleetDetail} />
            <Route exact path="/fleets/vehicles/:vehicleID/view" component={VehicleDetail} />
            <Route exact path="/fleets/:fleetID/drivers/:driverID/view" component={DriverDetail} />
            <Route exact path="/payments" component={Payments} />
            <Route exact path="/cancellation" component={Cancellation} />
            <Route exact path="/settings" component={Settings} />
            <Route exact path="/business/partners/:partnerID/trips/:tripID/view" component={PartnerTripDetail} />
            <Route exact path="/business/partners/:partnerID/view" component={PartnerDetail} />
            <Route exact path="/business/partners/:partnerID/users" component={PartnerUsers} />
            <Route exact path="/business/partners/:partnerID/drivers" component={PartnerAssignedDrivers} />
            <Route exact path="/business/partners/:partnerID/trips" component={PartnerTrips} />
            <Route exact path="/business/partners/:partnerID/archive" component={PartnerArchives} />
            <Route component={NotFound} />
          </Switch>
        </div>
      </BrowserRouter>
    </ApolloProvider>
  );
}

export default App;