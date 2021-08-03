import React, { useState } from 'react'
import gql from 'graphql-tag'
import { useQuery } from '@apollo/react-hooks'

const GET_DRIVER_TRIPS = gql`
  query getDriverTrips($driverID: ID!) {
    driverTrips(driver_id: $driverID) {
      name
      dayName
      date
      startsAt
    }
  }
`;

const DriverTrips = (props) => {
  const [filterStr, setFilterStr] = useState('');

  const { loading, error, data } = useQuery(GET_DRIVER_TRIPS, {
    variables: { 
      driverID: props.driverID
    }
  });

  const hasData = () => data 
    && data.driverTrips 
    && data.driverTrips.length > 0
  
  if (loading) return <div className="spinner spinner-dark"></div>;
  if (error) return <p className="alert alert-danger">Error! Something went wrong.</p>; 
     
  return (
    <div>
      {!hasData() &&
        <div className="card border-0 mb-4">
          <div className="card-body">
            <p className="text-center text-muted mb-0">
              No trips have been assigned to this driver yet.
            </p>
          </div>
        </div>
      }
      {hasData() &&
        <div className="mb-4">
          <div className="card border-0 mb-4">
            <div className="card-body">
              <div className="row justify-content-between">
                <div className="col-auto align-self-center">
                  <form>
                    <input type="text" className="form-control" 
                      placeholder="Filter by name"
                      onChange={(e) => setFilterStr(e.target.value)}
                      value={filterStr} 
                    />
                  </form>
                </div>
              </div>
            </div>
          </div> 
          <div className="row">
            {data.driverTrips.filter(trip => 
              trip.name.toLowerCase().includes(filterStr.toLowerCase())
              ||
              trip.dayName.toLowerCase().includes(filterStr.toLowerCase())
            ).map((trip, indx) => (
              <div className="col-md-4" key={indx}>
                <div className="card border-0 mb-4">
                  <div className="card-body">
                    <div className="row justify-content-between">
                      <div className="col-auto align-self-center">
                        <span className="placeholder rounded placeholder-md bg-teal text-white">
                          {trip.dayName.substring(0,3).toUpperCase()}
                        </span>
                      </div>
                      <div className="col align-self-center">
                        <h4 className="mb-1 font-weight-bold">
                          { trip.name }
                        </h4>
                        <p className="text-muted mb-0">
                          { trip.startsAt }
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      }
    </div>
  )
}

export default DriverTrips