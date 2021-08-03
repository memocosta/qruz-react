import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import gql from 'graphql-tag'
import { useQuery } from '@apollo/react-hooks'
import ListDocuments from '../Documents/ListDocuments'

const GET_VEHICLE = gql`
  query getVehicle($id: ID!) {
    vehicle(id: $id) {
      id
      year
      photo
      license_plate
      make {
        id
        name
      }
      model {
        id
        name
      }
      type {
        id
        name
      }
    }
  }
`;

const FLEETS = gql`{ fleetPerm @client }`;

const VehicleDetail = (props) => {
  const [view, setView] = useState('documents');
  const documentableType = "App\\Vehicle";

  const { data: fleetPerm } = useQuery(FLEETS)
  const { loading, error, data } = useQuery(GET_VEHICLE, {
    variables: { id: props.match.params.vehicleID}
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
              {data.vehicle.photo &&
                <div className="image-cover image-cover-lg rounded" 
                  style={{ backgroundImage: "url("+data.vehicle.photo+")"}}
                ></div>
              }
              {!data.vehicle.photo &&
                <span className="placeholder rounded placeholder-lg bg-teal text-white">
                  {data.vehicle.make.name.substring(0,2).toUpperCase()}
                </span>
              }
            </div>
            <div className="col align-self-center">
              <p className="text-muted mb-1">
                {data.vehicle.type.name}
              </p>
              <h4 className="font-weight-bold mb-1">
                { data.vehicle.make.name } { data.vehicle.model.name } { data.vehicle.year }
              </h4>
              <p className="text-muted">
                {data.vehicle.license_plate}
              </p>
              <div className="mt-4">
                <ul className="nav nav-pills" id="pills-tab" role="tablist">
                  <li className="nav-item">
                    <Link to={`/fleets`} className="nav-link">Back to All Fleets View</Link>
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
      {view === 'documents' &&
        <ListDocuments 
          documentableID={props.match.params.vehicleID}
          documentableType={documentableType}
        />
      }
    </div>
  )
}

export default VehicleDetail