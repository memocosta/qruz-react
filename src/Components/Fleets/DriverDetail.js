import React, { useState } from 'react'
import gql from 'graphql-tag'
import { Link } from 'react-router-dom'
import { useQuery } from '@apollo/react-hooks'
import DriverAssignedVehicles from './DriverAssignedVehicles'
import DriverNotAssignedVehicles from './DriverNotAssignedVehicles'
import DriverTrips from './DriverTrips'
import ListDocuments from '../Documents/ListDocuments'

const GET_DRIVER = gql`
  query getDriver($id: ID!) {
    driver(id: $id) {
      name
      avatar
      fleet {
        name
      }
    }
  }
`;

const FLEET_PERM = gql`{ fleetPerm @client }`;

const DriverDetail = (props) => {
  const [view, setView] = useState('assignedVehicles');
  const documentableType = "App\\Driver";

  const { data: fleetPerm } = useQuery(FLEET_PERM)
  const { loading, error, data } = useQuery(GET_DRIVER, {
    variables: { id: props.match.params.driverID}
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
              {data.driver.avatar &&
                <div className="image-cover image-cover-lg rounded-circle " 
                  style={{ backgroundImage: "url("+data.driver.avatar+")"}}
                ></div>
              }
              {!data.driver.avatar &&
                <span className="placeholder rounded-circle placeholder-lg bg-teal text-white">
                  {data.driver.name.substring(0,2).toUpperCase()}
                </span>
              }
            </div>
            <div className="col align-self-center">
              <h4 className="mb-1 font-weight-bold">
                {data.driver.name}
              </h4>
              <p className="text-muted">
                {data.driver.fleet.name} Fleet
              </p>
              <div className="mt-4">
                <ul className="nav nav-pills" id="pills-tab" role="tablist">
                  <li className="nav-item">
                    <Link to={`/fleets/${props.match.params.fleetID}/view`} className="nav-link">All Drivers</Link>
                  </li>
                  <li className="nav-item">
                    <span onClick={() => setView('assignedVehicles')} className={"nav-link clickable" + (view === "assignedVehicles" ? " active" : "")}>Assigned Vehicles</span>
                  </li>
                  <li className="nav-item">
                    <span onClick={() => setView('notAssignedVehicles')} className={"nav-link clickable" + (view === "notAssignedVehicles" ? " active" : "")}>Not Assigned Vehicles</span>
                  </li>
                  <li className="nav-item">
                    <span onClick={() => setView('trips')} className={"nav-link clickable" + (view === "trips" ? " active" : "")}>Trips</span>
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
      {view === 'assignedVehicles' &&
        <DriverAssignedVehicles driverID={props.match.params.driverID} />
      }
      {view === 'notAssignedVehicles' &&
        <DriverNotAssignedVehicles driverID={props.match.params.driverID} />
      }
      {view === 'trips' &&
        <DriverTrips driverID={props.match.params.driverID} />
      }
      {view === 'documents' &&
        <ListDocuments 
          documentableID={props.match.params.driverID}
          documentableType={documentableType}
        />
      }
    </div>
  )
}

export default DriverDetail