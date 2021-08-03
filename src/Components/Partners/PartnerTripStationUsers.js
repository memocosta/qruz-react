import React from 'react'
import gql from 'graphql-tag'
import { useQuery } from '@apollo/react-hooks'

const GET_PARTNER_TRIP_STATION_USERS = gql`
  query getPartnerTripStationUsers($stationID: ID!) {
    partnerTripStationUsers(station_id: $stationID) {
      id
      name
      avatar
    }
  }
`;

const PartnerTripStationUsers = (props) => {

  const { loading, error, data } = useQuery(GET_PARTNER_TRIP_STATION_USERS, {
    variables: { 
      stationID: props.stationID
    }
  });
  
  if (loading) return <div className="spinner spinner-dark"></div>;
  if (error) return <p className="alert alert-danger">Error! Something went wrong.</p>;

  return (
    <div>
      {data && data.partnerTripStationUsers && data.partnerTripStationUsers.length === 0 &&
        <p className="text-center text-muted pt-3 mb-0">
          No users have subscribed for this station yet.
        </p>
      }
      {data && data.partnerTripStationUsers && data.partnerTripStationUsers.length > 0 &&
        <div className="row">
          {data.partnerTripStationUsers.map((user) => (
            <div className="col-md-6" key={user.id}>
              <div className="card noAnimation mb-4 border-0 bg-light">
                <div className="card-body">
                  <div className="row">
                    <div className="col-auto align-self-center">
                      {user.avatar &&
                        <div className="image-cover image-cover-md rounded-circle " 
                          style={{ backgroundImage: "url("+user.avatar+")"}}
                        ></div>
                      }
                      {!user.avatar &&
                        <span className="placeholder rounded-circle placeholder-md bg-teal text-white">
                          {user.name.substring(0,2).toUpperCase()}
                        </span>
                      }
                    </div>
                    <div className="col align-self-center">
                      <h5 className="font-weight-bold mb-0">
                        { user.name }
                      </h5>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      }
    </div>
  )
}

export default PartnerTripStationUsers