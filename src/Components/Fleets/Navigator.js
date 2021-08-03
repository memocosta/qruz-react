import React, { useState } from 'react'
import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import FleetList from './FleetList'
import VehicleList from './VehicleList'
import CarTypeList from './CarTypeList'
import CarModelList from './CarModelList'
import CarMakeList from './CarMakeList'

const FLEETS = gql`{ fleetPerm @client }`;

const Navigator = () => {
  const [view, setView] = useState('fleets');
  const { data: fleetPerm } = useQuery(FLEETS)

  if (fleetPerm && !fleetPerm.fleetPerm) return <p className='alert alert-warning fadeInUp'><strong>Bummer!</strong> You are not authorized to access this feature. If you have an issues or need to report a bug, shoot us an email at <em>support@qruz.app</em> and we'll help you out.</p>;

  return (
    <div>
      <div className="card border-0 mb-4">
        <div className="card-body">
          <ul className="nav nav-pills" id="pills-tab" role="tablist">
            <li className="nav-item">
              <span onClick={() => setView('fleets')} className={"nav-link clickable" + (view === "fleets" ? " active" : "")}>Fleets</span>
            </li>
            <li className="nav-item">
              <span onClick={() => setView('vehicles')} className={"nav-link clickable" + (view === "vehicles" ? " active" : "")}>Vehicles</span>
            </li>
            <li className="nav-item">
              <span onClick={() => setView('carTypes')} className={"nav-link clickable" + (view === "carTypes" ? " active" : "")}>Types</span>
            </li>
            <li className="nav-item">
              <span onClick={() => setView('carMakes')} className={"nav-link clickable" + (view === "carMakes" ? " active" : "")}>Makes</span>
            </li>
            <li className="nav-item">
              <span onClick={() => setView('carModels')} className={"nav-link clickable" + (view === "carModels" ? " active" : "")}>Models</span>
            </li>
          </ul>
        </div>
      </div>
      {view === 'fleets' &&
        <FleetList />
      }
      {view === 'vehicles' &&
        <VehicleList />
      }
      {view === 'carTypes' &&
        <CarTypeList />
      }
      {view === 'carModels' &&
        <CarModelList />
      }
      {view === 'carMakes' &&
        <CarMakeList />
      }
    </div>
  )
}

export default Navigator