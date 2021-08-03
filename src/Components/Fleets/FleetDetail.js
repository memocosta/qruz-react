import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import gql from 'graphql-tag'
import { useQuery } from '@apollo/react-hooks'
import FleetDriverList from './FleetDriverList'
import ListDocuments from '../Documents/ListDocuments'

const GET_FLEET = gql`
  query getFleet($id: ID!) {
    fleet(id: $id) {
      name
      avatar
    }
  }
`;

const FLEETS = gql`{ fleetPerm @client }`;

const FleetDetail = (props) => {
  const [driverCount, setDriverCount] = useState('Counting..');
  const [view, setView] = useState('drivers');
  const documentableType = "App\\Fleet";

  const { data: fleetPerm } = useQuery(FLEETS)
  const { loading, error, data } = useQuery(GET_FLEET, {
    variables: { id: props.match.params.fleetID}
  });

  if (fleetPerm && !fleetPerm.fleetPerm) return <p className='alert alert-warning fadeInUp'><strong>Bummer!</strong> You are not authorized to access this feature. If you have an issues or need to report a bug, shoot us an email at <em>support@qruz.app</em> and we'll help you out.</p>;

  if (loading) return <div className="spinner spinner-dark"></div>;
  if (error) return <p className="alert alert-danger">Error! Something went wrong.</p>;

  return (
    <div>
      <div className="card border-0 mb-4">
        <div className="card-body">
          <div className="row">
            <div className="col-auto align-self-center">
              {data.fleet.avatar &&
                <div className="image-cover image-cover-lg rounded-circle " 
                  style={{ backgroundImage: "url("+data.fleet.avatar+")"}}
                ></div>
              }
              {!data.fleet.avatar &&
                <span className="placeholder rounded-circle placeholder-lg bg-teal text-white">
                  {data.fleet.name.substring(0,2).toUpperCase()}
                </span>
              }
            </div>
            <div className="col align-self-center">
              <h4 className="mb-1 font-weight-bold">
                {data.fleet.name}
              </h4>
              <p className="text-muted">{driverCount ? driverCount + ' drivers associated with this fleet' : 'No drivers associated with this fleet'} </p>
              <div className="mt-4">
                <ul className="nav nav-pills" id="pills-tab" role="tablist">
                  <li className="nav-item">
                    <Link to={`/fleets`} className="nav-link">Back to All Fleets View</Link>
                  </li>
                  <li className="nav-item">
                    <span onClick={() => setView('drivers')} className={"nav-link clickable" + (view === "drivers" ? " active" : "")}>Drivers</span>
                  </li>
                  <li className="nav-item">
                    <span onClick={() => setView('documents')} className={"nav-link clickable" + (view === "documents" ? " active" : "")}>Documents</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
      {view === 'drivers' &&
        <FleetDriverList 
          fleetID={props.match.params.fleetID} 
          driverCount={setDriverCount} 
        />
      }
      {view === 'documents' &&
        <ListDocuments 
          documentableID={props.match.params.fleetID}
          documentableType={documentableType}
        />
      }
    </div>
  )
}

export default FleetDetail