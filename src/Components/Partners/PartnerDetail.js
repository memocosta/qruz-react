import React, { useState } from 'react'
import gql from 'graphql-tag'
import { useQuery } from '@apollo/react-hooks'
import PartnerAssignedDrivers from './PartnerAssignedDrivers'
import PartnerNotAssignedDrivers from './PartnerNotAssignedDrivers'
import PartnerUsers from './PartnerUsers'
import PartnerTrips from './PartnerTrips'
import PartnerArchives from './PartnerArchives'
import ListDocuments from '../Documents/ListDocuments'

const GET_PARTNER = gql`
  query getPartner($id: ID!) {
    partner(id: $id) {
      name
      type
      logo
    }
  }
`;

const BUSINESS = gql`{ businessPerm @client }`;

const PartnerDetail = (props) => {
  const [view, setView] = useState('users');
  const documentableType = "App\\Partner";

  const { data: business } = useQuery(BUSINESS)

  const { loading, error, data } = useQuery(GET_PARTNER, {
    variables: { id: props.match.params.partnerID}
  });

  if (business && !business.businessPerm) return <p className='alert alert-warning fadeInUp'><strong>Bummer!</strong> You are not authorized to access this feature. If you have an issues or need to report a bug, shoot us an email at <em>support@qruz.app</em> and we'll help you out.</p>;

  if (loading) return <div className="spinner spinner-dark"></div>;
  if (error) return <p className="alert alert-danger">Error! Something went wrong.</p>;

  return (
    <div>
      <div className="card border-0 mb-4">
        <div className="card-body">
          <div className="row">
            <div className="col-auto">
              {data.partner.logo &&
                <div className="image-cover image-cover-lg rounded-circle " 
                  style={{ backgroundImage: "url("+data.partner.logo+")"}}
                ></div>
              }
              {!data.partner.logo &&
                <span className="placeholder rounded-circle placeholder-lg bg-teal text-white">
                  {data.partner.name.substring(0,2).toUpperCase()}
                </span>
              }
            </div>
            <div className="col align-self-center">
              <div className="mb-4">
                <h4 className="font-weight-bold mb-1">
                  {data.partner.name}
                </h4>
                <p className="text-muted">{ data.partner.type }</p>
              </div>
              <ul className="nav nav-pills" id="pills-tab" role="tablist">
                <li className="nav-item">
                  <span onClick={() => setView('users')} className={"nav-link clickable" + (view === "users" ? " active" : "")}>Users</span>
                </li>
                <li className="nav-item">
                  <span onClick={() => setView('assignedDrivers')} className={"nav-link clickable" + (view === "assignedDrivers" ? " active" : "")}>Assigned Drivers</span>
                </li>
                <li className="nav-item">
                  <span onClick={() => setView('notAssignedDrivers')} className={"nav-link clickable" + (view === "notAssignedDrivers" ? " active" : "")}>Not Assigned Drivers</span>
                </li>
                <li className="nav-item">
                  <span onClick={() => setView('trips')} className={"nav-link clickable" + (view === "trips" ? " active" : "")}>Trips</span>
                </li>
                <li className="nav-item">
                  <span onClick={() => setView('archives')} className={"nav-link clickable" + (view === "archives" ? " active" : "")}>Archive</span>
                </li>
                <li className="nav-item">
                  <span onClick={() => setView('documents')} className={"nav-link clickable" + (view === "documents" ? " active" : "")}>Documents</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      {view === 'users' &&
        <PartnerUsers partnerID={props.match.params.partnerID} />
      }
      {view === 'assignedDrivers' &&
        <PartnerAssignedDrivers partnerID={props.match.params.partnerID} />
      }
      {view === 'notAssignedDrivers' &&
        <PartnerNotAssignedDrivers partnerID={props.match.params.partnerID} />
      }
      {view === 'trips' &&
        <PartnerTrips partnerID={props.match.params.partnerID} />
      }
      {view === 'archives' &&
        <PartnerArchives />
      }
      {view === 'documents' &&
        <ListDocuments 
          documentableID={props.match.params.partnerID}
          documentableType={documentableType}
        />
      }
    </div>
  )
}

export default PartnerDetail