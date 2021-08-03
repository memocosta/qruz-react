import React, { useState } from 'react'
import { NavLink, useHistory } from 'react-router-dom'
import { useApolloClient, useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import logoSymbol from '../logo-light-symbol.png';

const IS_LOGGED_IN = gql`{ isLoggedIn @client }`;
const NAME = gql`{ name @client }`;
const DASHBOARD = gql`{ dashboardPerm @client }`;
const ROLES = gql`{ rolesPerm @client }`;
const ARCHIVE = gql`{ archivePerm @client }`;
const COMMUNICATION = gql`{ communicationPerm @client }`;
const PROMOCODES = gql`{ promocodesPerm @client }`;
const BUSINESS = gql`{ businessPerm @client }`;
const COMMUTE = gql`{ commutePerm @client }`;
const ONDEMAND = gql`{ ondemandPerm @client }`;
const FLEET = gql`{ fleetPerm @client }`;
const PAYMENT = gql`{ paymentPerm @client }`;
const CANCELLATION = gql`{ cancellationPerm @client }`;
const PARTNER_ID = gql`{ partnerID @client }`;

const Navbar = () => {
  const [show, setShow] = useState(false);
  const { data: auth } = useQuery(IS_LOGGED_IN)
  const { data: me } = useQuery(NAME)
  const { data: dashboard } = useQuery(DASHBOARD)
  const { data: roles } = useQuery(ROLES)
  const { data: archive } = useQuery(ARCHIVE)
  const { data: promocodes } = useQuery(PROMOCODES)
  const { data: communication } = useQuery(COMMUNICATION)
  const { data: business } = useQuery(BUSINESS)
  const { data: commute } = useQuery(COMMUTE)
  const { data: ondemand } = useQuery(ONDEMAND)
  const { data: fleet } = useQuery(FLEET)
  const { data: payment } = useQuery(PAYMENT)
  const { data: cancellation } = useQuery(CANCELLATION)
  const { data: partner } = useQuery(PARTNER_ID)  

  const client = useApolloClient();
  const history = useHistory();

  return (
    <div>
      {auth && !auth.isLoggedIn &&
        <nav className="navbar navbar-expand-lg navbar-dark bg-primary fixed-top bg-gradient">
          <div className="mx-auto my-3 fadeInUp">
            <img src={logoSymbol} className="app-logo-md" alt="Qruz logo" />
          </div>
        </nav>
      }
      {auth && auth.isLoggedIn && !partner.partnerID &&
        <nav className="navbar navbar-expand-lg navbar-dark bg-primary fixed-top bg-gradient">
          <img src={logoSymbol} className="app-logo-sm fadeInUp" alt="Qruz logo" />
          <NavLink exact className="navbar-brand fadeInUp mr-0" to="/" onClick={() => setShow(false)}>{me.name}</NavLink>
          <button className="navbar-toggler pr-0 fadeInUp" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation" onClick={() => setShow(!show)}>
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className={"collapse navbar-collapse fadeInUp" + (show ? " show" : "")} id="navbarNav">
            <div className="navbar-nav ml-md-auto">
              {dashboard.dashboardPerm &&
                <NavLink exact className="nav-item nav-link" to="/dashboard" onClick={() => setShow(false)}>Dashboard</NavLink>
              }
              {roles.rolesPerm && 
                <NavLink className="nav-item nav-link" to="/roles" onClick={() => setShow(false)}>Roles</NavLink>
              }
              {archive.archivePerm && 
                <NavLink className="nav-item nav-link" to="/archive" onClick={() => setShow(false)}>Archive</NavLink>
              }
              {communication.communicationPerm && 
                <NavLink className="nav-item nav-link" to="/communication" onClick={() => setShow(false)}>Communication</NavLink>
              }
              {promocodes.promocodesPerm && 
                <NavLink className="nav-item nav-link" to="/promocodes" onClick={() => setShow(false)}>Promo Codes</NavLink>
              }
              {business.businessPerm && 
                <NavLink className="nav-item nav-link" to="/business" onClick={() => setShow(false)}>Business</NavLink>
              }
              {commute.commutePerm && 
                <NavLink className="nav-item nav-link" to="/commute" onClick={() => setShow(false)}>Commute</NavLink>
              }
              {ondemand.ondemandPerm && 
                <NavLink className="nav-item nav-link" to="/ondemand" onClick={() => setShow(false)}>On-demand</NavLink>
              }
              {fleet.fleetPerm && 
                <NavLink className="nav-item nav-link" to="/fleets" onClick={() => setShow(false)}>Fleets</NavLink>
              }
              {payment.paymentPerm && 
                <NavLink className="nav-item nav-link" to="/payments" onClick={() => setShow(false)}>Payments</NavLink>
              }
              {cancellation.cancellationPerm && 
                <NavLink className="nav-item nav-link" to="/cancellation" onClick={() => setShow(false)}>Cancellation</NavLink>
              }
              <NavLink className="nav-item nav-link" to="/settings" onClick={() => setShow(false)}>Settings</NavLink>
            </div>
            <div className="navbar-nav ml-md-auto">
              <span className="nav-item nav-link clickable" 
                onClick={() => {
                  localStorage.clear()
                  client.writeData({ data: { 
                    isLoggedIn: false,
                  } })
                  setShow(false)
                  history.push('/qruz/login')
                }}
                >Logout
              </span>
            </div>
          </div>
        </nav>
      }
      {auth && auth.isLoggedIn && partner.partnerID &&
        <nav className="navbar navbar-expand-lg navbar-dark bg-primary fixed-top">
          <NavLink exact className="navbar-brand fadeInUp" to={"/business/partners/"+partner.partnerID+"/users"}>{me.name}</NavLink>
          <button className="navbar-toggler pr-0 fadeInUp" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation" onClick={() => setShow(!show)}>
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className={"collapse navbar-collapse fadeInUp" + (show ? " show" : "")} id="navbarNav">
            <div className="navbar-nav ml-md-auto">
              <NavLink className="nav-item nav-link" to={"/business/partners/"+partner.partnerID+"/users"} onClick={() => setShow(false)}>Users</NavLink>
              <NavLink className="nav-item nav-link" to={"/business/partners/"+partner.partnerID+"/drivers"} onClick={() => setShow(false)}>Drivers</NavLink>
              <NavLink className="nav-item nav-link" to={"/business/partners/"+partner.partnerID+"/trips"} onClick={() => setShow(false)}>Trips</NavLink>
              <NavLink className="nav-item nav-link" to={"/business/partners/"+partner.partnerID+"/archive"} onClick={() => setShow(false)}>Archive</NavLink>
            </div>
            <div className="navbar-nav ml-md-auto">
              <span className="nav-item nav-link clickable" onClick={() => setShow(false)}>Submit a request</span>
              <span className="nav-item nav-link clickable" 
                onClick={() => {
                  localStorage.clear()
                  client.writeData({ data: { 
                    isLoggedIn: false,
                    partnerID: null,
                  } })
                  setShow(false)
                  history.push('/partners/login')
                }}
                >Logout
              </span>
            </div>
          </div>
        </nav>
      }
    </div>
  )
}

export default Navbar